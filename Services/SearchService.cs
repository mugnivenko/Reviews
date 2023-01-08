using Reviews.Data;
using Reviews.Models;
using Microsoft.EntityFrameworkCore;

namespace Reviews.Services;

public class SearchService
{
    private readonly ApplicationDbContext _context;
    public SearchService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Review>> Search(string query)
    {
        List<Review> reviews = await SearchByReviews(query);
        List<Review> reviewsByCommentaries = await SearchByCommentaries(query);
        List<Review> reviewsByGroups = await SearchByGroups(query);
        List<Review> reviewsByPiece = await SearchByPiece(query);
        reviews.AddRange(reviewsByCommentaries);
        reviews.AddRange(reviewsByGroups);
        reviews.AddRange(reviewsByPiece);
        return reviews.DistinctBy(review => review.Id).ToList();
    }

    private async Task<List<Review>> SearchByReviews(string query)
    {
        return await _context
            .Reviews
            .Where(
                review => review.SearchVector.Matches(
                    EF.Functions.WebSearchToTsQuery("simple", query)
                )
            ).ToListAsync();
    }

    private async Task<List<Review>> SearchByCommentaries(string query)
    {
        List<Commentary> commentaries = await _context.Commentaries
            .Where(
                commentary => commentary.SearchVector.Matches(
                    EF.Functions.WebSearchToTsQuery("simple", query)
                )
            )
            .Include(commentary => commentary.Review)
            .ToListAsync();
        return commentaries.Select(commentary => commentary.Review).ToList();
    }

    private async Task<List<Review>> SearchByGroups(string query)
    {
        List<Group> groups = await _context.Groups
           .Where(
               group => group.SearchVector.Matches(
                   EF.Functions.WebSearchToTsQuery("simple", query)
                )
           )
           .Include(group => group.Reviews)
           .ToListAsync();
        return groups.SelectMany(group => group.Reviews).ToList();
    }

    private async Task<List<Review>> SearchByPiece(string query)
    {
        List<Piece> pieces = await _context.Pieces
           .Where(
               piece => piece.SearchVector.Matches(
                   EF.Functions.WebSearchToTsQuery("simple", query)
                )
           )
           .Include(piece => piece.Reviews)
           .ToListAsync();
        return pieces.SelectMany(piece => piece.Reviews).ToList();
    }
}