using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

using Reviews.Data;
using Reviews.Models;
using Reviews.Models.Dto;
using AutoMapper;

namespace Reviews.Services;

public class ReviewService
{
    private readonly ApplicationDbContext _context;
    private readonly PieceService _pieceService;
    private readonly ImageService _imageService;
    private readonly TagService _tagService;
    private readonly IMapper _mapper;

    public ReviewService(
        ApplicationDbContext context,
        PieceService pieceService,
        ImageService imageService,
        TagService tagService,
        IMapper mapper)
    {
        _context = context;
        _pieceService = pieceService;
        _imageService = imageService;
        _tagService = tagService;
        _mapper = mapper;
    }

    public async Task<List<Review>> GetReviews(Guid? userId)
    {
        IQueryable<Review> query = _context.Reviews;
        await query.Include(review => review.Creator).LoadAsync();
        await query.Include(review => review.Group).LoadAsync();
        await query.Include(review => review.Images).LoadAsync();
        await query.Include(review => review.Tags).LoadAsync();
        await query.Include(review => review.Piece).LoadAsync();
        if (userId != Guid.Empty)
        {
            await query.Include(review => review.Likes.Where(like => like.UserId.Equals(userId))).LoadAsync();
        }
        return await query.ToListAsync();
    }

    public async Task<List<Review>> GetUserReviews(Guid userId, SortFilterReviewDto sortFilterReview)
    {
        var query = _context.Reviews
            .Where(review => review.CreatorId == userId)
            .Where(review => Enumerable
                .Range(sortFilterReview.GradeFrom, sortFilterReview.GradeTo)
                .Contains(review.Grade)
            );
        AddSort(ref query, sortFilterReview);
        AddFilter(ref query, sortFilterReview);
        await UncludeRelativeData(query);
        return await query.ToListAsync();
    }

    private void AddSort(ref IQueryable<Review> query, SortFilterReviewDto sortFilterReview)
    {
        query = sortFilterReview switch
        {
            { Name: not null } and { Name: not "" } => query.Where(review => review.Name.Contains(sortFilterReview.Name)),
            { Piece: not null } and { Piece: not "" } => query.Where(review => review.Name.Contains(sortFilterReview.Piece)),
            { GroupId: not null } => query.Where(review => review.GroupId == sortFilterReview.GroupId),
            { DateStart: not null } => query.Where(review => review.CreatedAt >= sortFilterReview.DateStart),
            { DateEnd: not null } => query.Where(review => review.CreatedAt <= sortFilterReview.DateEnd),
            _ => query
        };
    }

    private void AddFilter(ref IQueryable<Review> query, SortFilterReviewDto sortFilterReview)
    {
        query = sortFilterReview.Active switch
        {
            var active when active == "group" || active == "piece" =>
                query.OrderBy($"{sortFilterReview.Active}.Name {sortFilterReview.Direction}"),
            _ => query.OrderBy($"{sortFilterReview.Active} {sortFilterReview.Direction}"),
        };
    }

    public async Task<Review> GetReview(Guid reviewId)
    {
        IQueryable<Review> query = _context.Reviews.Where(review => review.Id == reviewId);
        await UncludeRelativeData(query);
        return await query.SingleAsync();
    }

    private async Task UncludeRelativeData(IQueryable<Review> query)
    {
        await query.Include(review => review.Group).LoadAsync();
        await query.Include(review => review.Piece).LoadAsync();
        await query.Include(review => review.Tags).LoadAsync();
        await query.Include(review => review.Images).LoadAsync();
    }

    public async Task<Review> CreateReviewWithRelativeData(CreatingReviewDto creatingReview)
    {
        Piece piece = await _pieceService.GetOrCreatePiece(creatingReview.Piece);
        Review review = await CreateReview(creatingReview, piece.Id);
        await _tagService.AddTagsToReview(creatingReview.Tags, review);
        await _imageService.SaveImagesUri(creatingReview.Files, review.Id);
        return review;
    }

    private async Task<Review> CreateReview(CreatingReviewDto creatingReview, Guid pieceId)
    {
        Review review = new Review
        {
            Name = creatingReview.Name,
            Content = creatingReview.Content,
            CreatedAt = DateTime.UtcNow,
            Grade = creatingReview.Grade,
            CreatorId = creatingReview.CreatorId,
            GroupId = creatingReview.GroupId,
            PieceId = pieceId,

        };
        await _context.Reviews.AddAsync(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<Review> UpdateReview(Guid id, EditingReviewDto editingReview)
    {

        Review review = await _context.Reviews.Where(review => review.Id == id).SingleAsync();
        _mapper.Map<EditingReviewDto, Review>(editingReview, review);
        review = editingReview switch
        {
            { Piece: not null } and { Piece: not "" } => await UpdateReviewPiece(editingReview.Piece, review),
            { Tags: not null } => await UpdateReviewTags(editingReview.Tags, review),
            { Files: not null } => await UpdateReviewFiles(editingReview.Files, review),
            _ => review,
        };
        await _context.SaveChangesAsync();
        return review;
    }

    private async Task<Review> UpdateReviewPiece(string pieceName, Review review)
    {
        Piece piece = await _pieceService.GetOrCreatePiece(pieceName);
        review.PieceId = piece.Id;
        return review;
    }

    private async Task<Review> UpdateReviewTags(IEnumerable<string> tags, Review review)
    {
        var (tagsToDelete, newTags) = await GetReviewTagsToUpdate(tags, review);
        foreach (var tag in tagsToDelete)
        {
            review.Tags.Remove(tag);
        }
        if (newTags.Count() != 0)
        {
            await _tagService.AddTagsToReview(newTags, review);
        }
        return review;
    }

    private async Task<(List<Tag>, IEnumerable<string>)> GetReviewTagsToUpdate(
        IEnumerable<string> tags, Review review)
    {
        Review reviewWithTags = await GetReviewWithTags(review.Id);
        List<Tag> existingTags = reviewWithTags
            .Tags.IntersectBy<Tag, string>(tags, (tags) => tags.Name).ToList();
        List<Tag> tagsToDelete = reviewWithTags
            .Tags.ExceptBy<Tag, string>(tags, (tags) => tags.Name).ToList();
        List<string> newTags = tags
            .Except(existingTags.Select(tag => tag.Name))
            .Except(tagsToDelete.Select(tag => tag.Name))
            .ToList();
        return (tagsToDelete, newTags);
    }

    private async Task<Review> UpdateReviewFiles(IEnumerable<string> files, Review review)
    {
        var (imageToDelete, newFiles) = await GetReviewFilesToUpdate(files, review);
        _context.Images.RemoveRange(imageToDelete);
        await _context.SaveChangesAsync();
        if (newFiles.Count() != 0)
        {
            await _imageService.SaveImagesUri(newFiles, review.Id);
        }
        return review;
    }

    private async Task<(List<Image>, IEnumerable<string>)> GetReviewFilesToUpdate(
        IEnumerable<string> files, Review review)
    {
        Review reviewWithImages = await GetReviewWithImages(review.Id);
        List<Image> existingImage = reviewWithImages
            .Images.IntersectBy<Image, string>(files, (image) => image.Link).ToList();
        List<Image> imageToDelete = reviewWithImages.Images.ExceptBy(files, (image) => image.Link).ToList();
        IEnumerable<string> newFiles = files
            .Except(existingImage.Select(image => image.Link))
            .Except(imageToDelete.Select(image => image.Link));
        return (imageToDelete, newFiles);
    }

    private async Task<Review> GetReviewWithTags(Guid reviewId)
    {
        return await _context.Reviews
            .Where(review => review.Id == reviewId)
            .Include(review => review.Tags)
            .SingleAsync();
    }

    private async Task<Review> GetReviewWithImages(Guid reviewId)
    {
        return await _context.Reviews
            .Where(review => review.Id == reviewId)
            .Include(review => review.Images)
            .SingleAsync();
    }

    public async Task DeleteReview(Guid id)
    {
        await _context.Reviews.Where(review => review.Id == id).ExecuteDeleteAsync();
    }
}