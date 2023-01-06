using Microsoft.EntityFrameworkCore;

using Reviews.Data;
using Reviews.Models;

namespace Reviews.Services;

public class LikesService
{
    private readonly ApplicationDbContext _context;
    public LikesService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Like> SaveLike(Guid userId, Guid reviewId)
    {
        Like like = new Like
        {
            UserId = userId,
            ReviewId = reviewId
        };
        await _context.Likes.AddAsync(like);
        await _context.SaveChangesAsync();
        return like;
    }

    public async Task DeleteLike(Guid id)
    {
        await _context.Likes.Where(like => like.Id == id).ExecuteDeleteAsync();
    }
}