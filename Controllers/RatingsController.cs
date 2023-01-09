using AutoMapper;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using Reviews.Models;
using Reviews.Services;
using Reviews.Models.Dto;

namespace Reviews.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RatingsController : ControllerBase
{
    private readonly RatingService _service;
    private readonly IMapper _mapper;

    public RatingsController(
        RatingService service,
        IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetRating([FromQuery] SearchRatingDto searchRating)
    {
        Raiting? rating = await _service.GetRating(searchRating);
        return Ok(_mapper.Map<RatingDto>(rating));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> SaveRating([FromBody] SaveRatingDto saveRating)
    {
        Raiting rating = await _service.SaveRating(saveRating, GetUserClaimId());
        return Ok(_mapper.Map<RatingDto>(rating));
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<IActionResult> EditRating(Guid id, [FromBody] EditRatingDto editRating)
    {
        Raiting? rating = await _service.EditRating(id, editRating.Value);
        return Ok(_mapper.Map<RatingDto>(rating));
    }

    private Guid GetUserClaimId()
    {
        Claim? userIdClaim = User.Claims.Single(claim => claim.Type == "id");
        return Guid.Parse(userIdClaim.Value);
    }
}