using Microsoft.EntityFrameworkCore;

using Reviews.Data;
using Reviews.Models;

namespace Reviews.Services;

public class GroupService
{
    ApplicationDbContext _context;
    public GroupService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Group>> GetGroups()
    {
        return await _context.Groups.ToListAsync();
    }
}