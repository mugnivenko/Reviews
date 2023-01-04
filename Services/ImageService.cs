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

    public async Task<Uri> UploadImage(IFormFile file)
    {
        return await _storageService.Upload(file);
    }

    public async Task<List<Image>> SaveImagesUri(IEnumerable<string> imagesUri, Guid reviewId)
    {
        List<Image> images = new List<Image>();
        foreach (string imageUri in imagesUri)
        {
            Image image = new Image
            {
                Link = imageUri,
                ReviewId = reviewId
            };
            images.Add(image);
        }
        await _context.Images.AddRangeAsync(images);
        await _context.SaveChangesAsync();
        return images;
    }
}