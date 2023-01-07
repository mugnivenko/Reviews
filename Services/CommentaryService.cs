using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

using Reviews.Hubs;
using Reviews.Data;
using Reviews.Models;
using Reviews.Models.Dto;

namespace Reviews.Services;

public class CommentaryService
{
    private readonly ApplicationDbContext _context;

    private readonly IHubContext<CommentariesHub> _hubcontext;

    public CommentaryService(
        ApplicationDbContext context,
        IHubContext<CommentariesHub> hubcontext)
    {
        _context = context;
        _hubcontext = hubcontext;
    }

    public async Task<List<Commentary>> GetReviewCommentaries(Guid reviewId)
    {
        IQueryable<Commentary> query = _context.Commentaries
            .Where(commentary => commentary.ReviewId == reviewId)
            .OrderBy(commentary => commentary.CreatedAt);
        await query.Include(commentary => commentary.Creator).LoadAsync();
        return await query.ToListAsync();
    }

    public async Task<Commentary> GetReviewCommentary(Guid reviewId, Guid commentaryId)
    {
        IQueryable<Commentary> query = _context.Commentaries
            .Where(commentary => commentary.ReviewId == reviewId)
            .Where(commentary => commentary.Id == commentaryId);
        await query.Include(commentary => commentary.Creator).LoadAsync();
        return await query.SingleAsync();
    }

    public async Task<Guid> SaveCommentary(SaveCommentaryDto saveCommentary, Guid creatorId)
    {
        Commentary commentary = new Commentary
        {
            Content = saveCommentary.Content,
            ReviewId = saveCommentary.ReviewId,
            CreatorId = creatorId,
            CreatedAt = DateTime.UtcNow,
        };
        await _context.Commentaries.AddAsync(commentary);
        await _context.SaveChangesAsync();
        return commentary.Id;
    }

    public async Task NotifyCommentaryCreated(Guid reviewId, CommentaryDto commentary)
    {
        await _hubcontext.Clients.Group(reviewId.ToString()).SendAsync("ReceiveCommentary", commentary);
    }
}