using Microsoft.EntityFrameworkCore;

using Reviews.Data;
using Reviews.Models;
using Reviews.Models.Dto;

namespace Reviews.Services;

public class TagService
{
    private readonly ApplicationDbContext _context;
    public TagService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Tag>> GetTags(string? search)
    {
        IQueryable<Tag> query = _context.Tags;
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where((tag) => tag.Name.ToLower().Contains(search.ToLower()));
        }
        return await query.ToListAsync();
    }

    public async Task<List<Tag>> AddTagsToReview(IEnumerable<string> tagsNames, Review review)
    {
        List<Tag> tags = await GetOrCreateTags(tagsNames);
        foreach (var tag in tags)
        {
            tag.Reviews.Add(review);
        }
        await _context.SaveChangesAsync();
        return tags;
    }

    private async Task<List<Tag>> GetOrCreateTags(IEnumerable<string> tagsNames)
    {
        List<Tag> existingTags = await GetTagsByNames(tagsNames);
        List<string> notExistingTags = tagsNames.Except(existingTags.Select(tag => tag.Name)).ToList();
        List<Tag> createdTags = await CreateTags(notExistingTags);
        createdTags.AddRange(existingTags);
        return createdTags;
    }

    private async Task<List<Tag>> GetTagsByNames(IEnumerable<string> names)
    {
        return await _context.Tags.Where(tag => names.Contains(tag.Name)).ToListAsync();
    }

    private async Task<List<Tag>> CreateTags(IEnumerable<string> names)
    {
        List<Tag> tags = new List<Tag>();
        foreach (string name in names)
        {
            Tag tag = new Tag { Name = name };
            tags.Add(tag);
        }
        await _context.Tags.AddRangeAsync(tags);
        await _context.SaveChangesAsync();
        return tags;
    }

    public async Task DeleteTags(IEnumerable<Guid> tagsIds)
    {
        await _context.Tags.Where((tag) => tagsIds.Contains(tag.Id)).ExecuteDeleteAsync();
    }
}