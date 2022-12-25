using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Reviews.Models;
using Reviews.Services;
using Reviews.Models.Dto;

namespace Reviews.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PiecesController : ControllerBase
{
    private readonly PieceService _service;
    private readonly IMapper _mapper;

    public PiecesController(
        PieceService service,
        IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetPieces()
    {
        List<Piece> pieces = await _service.GetPieces();
        return Ok(_mapper.Map<List<PieceDto>>(pieces));
    }
}