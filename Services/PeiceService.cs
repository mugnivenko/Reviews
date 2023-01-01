using Microsoft.EntityFrameworkCore;

using Reviews.Data;
using Reviews.Models;

namespace Reviews.Services;

public class PieceService
{
    private readonly ApplicationDbContext _context;
    public PieceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Piece>> GetPieces()
    {
        return await _context.Pieces.ToListAsync();
    }
}