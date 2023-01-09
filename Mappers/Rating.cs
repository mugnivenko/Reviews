using AutoMapper;

using Reviews.Models;
using Reviews.Models.Dto;

namespace Reviews.Mappers;

public class RatingProfile : Profile
{
    public RatingProfile()
    {
        CreateMap<Raiting, RatingDto>();
    }
}