
using AutoMapper;

using Reviews.Models;
using Reviews.Models.Dto;

namespace Reviews.Mappers;

public class GroupProfile : Profile
{
    public GroupProfile()
    {
        CreateMap<Group, GroupDto>();
    }
}