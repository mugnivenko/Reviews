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

    public async Task<Piece> GetOrCreatePiece(string name)
    {
        Piece? piece = await GetPiece(name);
        if (piece is not null) return piece;
        return await CreatePiece(name);
    }

    private Task<Piece?> GetPiece(string name) =>
        _context.Pieces.Where(piece => piece.Name == name).SingleOrDefaultAsync();

    private async Task<Piece> CreatePiece(string name)
    {
        Piece piece = new Piece
        {
            Name = name
        };
        _context.Pieces.Add(piece);
        await _context.SaveChangesAsync();
        return piece;
    }
}