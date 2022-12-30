using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Reviews.Models;
using Reviews.Services;

namespace Reviews.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{

    AccountService _service;


    public AccountController(AccountService service)
    {
        _service = service;
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

    [HttpGet("aboba")]
    [Authorize]
    public ActionResult GetAboba()
    {
        Console.WriteLine(User.Claims.FirstOrDefault(claim => claim.Type == "Id"));
        return Ok("Abobbe");
    }
}
