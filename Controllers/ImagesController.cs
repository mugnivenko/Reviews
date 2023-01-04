using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Reviews.Models;
using Reviews.Services;
using Reviews.Models.Dto;

namespace Reviews.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImagesController : ControllerBase
{
    private readonly ImageService _service;
    private readonly IMapper _mapper;
    private readonly ILogger _logger;

    public ImagesController(
        ImageService service,
        IMapper mapper,
        ILogger<ImagesController> logger)
    {
        _service = service;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetImage()
    {
        List<Image> images = await _service.GetImages();
        return Ok(_mapper.Map<List<ImageDto>>(images));
    }

    [HttpPost]
    public async Task<IActionResult> SaveImage(IFormFile file)
    {
        _logger.LogInformation($"File received {file.FileName}");
        Uri uri = await _service.UploadImage(file);
        _logger.LogInformation($"Uri created {uri}");
        return Ok(new { uri });
    }
}