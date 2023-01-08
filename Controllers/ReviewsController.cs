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

    [HttpGet]
    public async Task<IActionResult> GetReviews([FromQuery] SearchReviewsDto searchReviews)
    {
        List<Review> reviews = await _service.GetReviews(searchReviews);
        return Ok(_mapper.Map<List<FullReviewDto>>(reviews));
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
        Review review = await _service.GetReview(createdReview.Id);
        return Ok(_mapper.Map<ReviewDto>(review));
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<IActionResult> EditReview(Guid id, [FromBody] EditingReviewDto editingReview)
    {
        Review updatedReview = await _service.UpdateReview(id, editingReview);
        Review review = await _service.GetReview(updatedReview.Id);
        return Ok(_mapper.Map<ReviewDto>(review));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task DeleteReview(Guid id)
    {
        await _service.DeleteReview(id);
    }
}