using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

using Reviews.Data;
using Reviews.Models;
using Reviews.Models.Dto;

namespace Reviews.Services;

public class ReviewService
{
    ApplicationDbContext _context;
    public ReviewService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Review>> GetUserReview(Guid userId, SortFilterReviewDto sortFilterReview)
    {
        var query = _context.Reviews
            .Where(review => review.CreatorId == userId)
            .Where(review => Enumerable
                .Range(sortFilterReview.GradeFrom, sortFilterReview.GradeTo)
                .Contains(review.Grade)
            );
        query = sortFilterReview switch
        {
            { Name: not null } and { Name: not "" } => query.Where(review => review.Name.Contains(sortFilterReview.Name)),
            { Piece: not null } and { Piece: not "" } => query.Where(review => review.Name.Contains(sortFilterReview.Piece)),
            { GroupId: not null } => query.Where(review => review.GroupId == sortFilterReview.GroupId),
            { DateStart: not null } => query.Where(review => review.CreatedAt >= sortFilterReview.DateStart),
            { DateEnd: not null } => query.Where(review => review.CreatedAt <= sortFilterReview.DateEnd),
            _ => query
        };
        query = sortFilterReview.Active switch
        {
            var active when active == "group" || active == "piece"
            => query.OrderBy($"{sortFilterReview.Active}.Name {sortFilterReview.Direction}"),
            _ => query.OrderBy($"{sortFilterReview.Active} {sortFilterReview.Direction}"),
        };
        return await query
            .Include(review => review.Group)
            .Include(review => review.Piece)
            .ToListAsync();
    }
}