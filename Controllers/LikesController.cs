using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Reviews.Models;
using Reviews.Services;
using Reviews.Models.Dto;

namespace Reviews.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LikesController : ControllerBase
{
    private readonly LikesService _service;
    private readonly IMapper _mapper;

    public LikesController(
        LikesService service,
        IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [Authorize]
    [HttpPost("reviews")]
    public async Task<IActionResult> SaveLike([FromBody] SaveLikeDto saveLike)
    {
        Like like = await _service.SaveLike(saveLike.UserId, saveLike.ReviewId);
        return Ok(_mapper.Map<LikeDto>(like));
    }

    [Authorize]
    [HttpDelete("{id}/reviews")]
    public async Task<IActionResult> DeleteLike(Guid id)
    {
        await _service.DeleteLike(id);
        return Ok();
    }
}