using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Reviews.Models;
using Reviews.Services;
using Reviews.Models.Dto;

namespace Reviews.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly ReviewService _service;
    private readonly IMapper _mapper;

    public ReviewsController(
        ReviewService service,
        IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [Authorize]
    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUserReviews(Guid id, [FromQuery] SortFilterReviewDto sortFilterReview)
    {
        List<Review> reviews = await _service.GetUserReviews(id, sortFilterReview);
        return Ok(_mapper.Map<List<ReviewDto>>(reviews));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateReview([FromBody] CreatingReviewDto savingReview)
    {
        Review createdReview = await _service.CreateReviewWithRelativeData(savingReview);
        Review review = await _service.GetReviewWithGroupAndPiece(createdReview.Id);
        return Ok(_mapper.Map<ReviewDto>(review));
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<IActionResult> EditReview(Guid id, [FromBody] EditingReviewDto editingReview)
    {
        await _service.UpdateReview(id, editingReview);
        return Ok();
    }
}