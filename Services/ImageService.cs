using Microsoft.EntityFrameworkCore;

using Reviews.Data;
using Reviews.Models;

namespace Reviews.Services;

public class ImageService
{
    private readonly ApplicationDbContext _context;
    private readonly StorageService _storageService;
    public ImageService(
        ApplicationDbContext context,
        StorageService storageService)
    {
        _context = context;
        _storageService = storageService;
    }

    public async Task<List<Image>> GetImages()
    {
        return await _context.Images.ToListAsync();
    }

    public async Task<Uri> SaveImage(IFormFile file)
    {
        return await _storageService.Upload(file);
    }
}