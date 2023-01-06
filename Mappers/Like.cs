using AutoMapper;

using Reviews.Models;
using Reviews.Models.Dto;

namespace Reviews.Mappers;

public class LikeProfile : Profile
{
    public LikeProfile()
    {
        CreateMap<Like, ReviewLikeDto>();

        CreateMap<Like, LikeDto>();
    }
}