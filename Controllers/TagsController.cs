using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Reviews.Models;
using Reviews.Services;
using Reviews.Models.Dto;

namespace Reviews.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly TagService _service;
    private readonly IMapper _mapper;

    public TagsController(
        TagService service,
        IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetTags([FromQuery] string? search)
    {
        List<Tag> tags = await _service.GetTags(search);
        return Ok(_mapper.Map<List<TagDto>>(tags));
    }
}