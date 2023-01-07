using AutoMapper;

using Reviews.Models;
using Reviews.Models.Dto;

namespace Reviews.Mappers;

public class CommentaryProfile : Profile
{
    public CommentaryProfile()
    {
        CreateMap<Commentary, CommentaryDto>();
    }
}