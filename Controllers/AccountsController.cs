using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using Reviews.Models;
using Reviews.Services;
using Reviews.Models.Dto;

namespace Reviews.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly AccountService _service;
    private readonly IMapper _mapper;
    public AccountsController(AccountService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpPost("oauth2")]
    public async Task<IActionResult> OAuth2Login([FromBody] CredentialsDto credentials)
    {
        string? jwtToken = await _service.ExternalLogin(credentials);
        if (jwtToken is null)
        {
            return BadRequest();
        }
        return Ok(new { token = jwtToken });
    }

    [HttpGet("{id}")]
    public ActionResult GetUser(Guid id)
    {
        ApplicationUser user = _service.GetUser(id);
        return Ok(_mapper.Map<UserDto>(user));
    }
}
