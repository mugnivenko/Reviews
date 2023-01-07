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
public class CommentariesController : ControllerBase
{

    private readonly CommentaryService _service;

    private readonly IMapper _mapper;


    public CommentariesController(
        CommentaryService service,
        IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }


    [HttpGet("reviews/{id}")]
    public async Task<IActionResult> GetReviewCommentaries(Guid id)
    {
        List<Commentary> commentaries = await _service.GetReviewCommentaries(id);
        return Ok(_mapper.Map<List<CommentaryDto>>(commentaries));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> SaveCommentary([FromBody] SaveCommentaryDto saveCommentary)
    {
        Guid userId = GetUserClaimId();
        Guid commentaryId = await _service.SaveCommentary(saveCommentary, userId);
        Commentary commentary = await _service.GetReviewCommentary(saveCommentary.ReviewId, commentaryId);
        CommentaryDto commentaryDto = _mapper.Map<CommentaryDto>(commentary);
        await _service.NotifyCommentaryCreated(saveCommentary.ReviewId, commentaryDto);
        return Ok(_mapper.Map<CommentaryDto>(commentaryDto));
    }

    private Guid GetUserClaimId()
    {
        Claim? userIdClaim = User.Claims.Single(claim => claim.Type == "id");
        return Guid.Parse(userIdClaim.Value);
    }
}
