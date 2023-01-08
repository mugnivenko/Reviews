using AutoMapper;
using Microsoft.AspNetCore.Mvc;

using Reviews.Models;
using Reviews.Services;
using Reviews.Models.Dto;

namespace Reviews.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly SearchService _searchService;

    private readonly IMapper _mapper;

    public SearchController(
        SearchService searchService,
        IMapper mapper)
    {
        _searchService = searchService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        List<Review> reviews = await _searchService.Search(query);
        return Ok(_mapper.Map<List<SearchReview>>(reviews));
    }
}