using Microsoft.EntityFrameworkCore;

using Reviews.Data;
using Reviews.Models;

namespace Reviews.Services;

public class TagService
{
    ApplicationDbContext _context;
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
}