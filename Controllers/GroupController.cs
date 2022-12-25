using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Reviews.Models;
using Reviews.Services;
using Reviews.Models.Dto;

namespace Reviews.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroupsController : ControllerBase
{
    private readonly GroupService _service;
    private readonly IMapper _mapper;

    public GroupsController(
        GroupService service,
        IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetGroups()
    {
        List<Group> groups = await _service.GetGroups();
        return Ok(_mapper.Map<List<GroupDto>>(groups));
    }
}