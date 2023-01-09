using Microsoft.EntityFrameworkCore;

using Reviews.Data;
using Reviews.Models;
using Reviews.Models.Dto;

namespace Reviews.Services;

public class RatingService
{
    private readonly ApplicationDbContext _context;
    public RatingService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Raiting?> GetRating(SearchRatingDto searchRating)
    {
        return await _context
            .Raitings
            .Where(
                rating => rating.UserId == searchRating.UserId && rating.ReviewId == searchRating.ReviewId
            )
            .SingleOrDefaultAsync();
    }

    public async Task<Raiting> SaveRating(SaveRatingDto saveRating, Guid userId)
    {
        Review review = await _context.Reviews.Where(review => review.Id == saveRating.ReviewId).SingleAsync();
        Raiting rating = new Raiting
        {
            Value = saveRating.Value,
            UserId = userId,
            ReviewId = saveRating.ReviewId,
            PieceId = review.PieceId,
        };
        await _context.Raitings.AddAsync(rating);
        await _context.SaveChangesAsync();
        return rating;
    }

    public async Task<Raiting> EditRating(Guid id, int value)
    {
        Raiting rating = await _context.Raitings.Where(rating => rating.Id == id).SingleAsync();
        rating.Value = value;
        await _context.SaveChangesAsync();
        return rating;
    }
}