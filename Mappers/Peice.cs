using AutoMapper;

using Reviews.Models;
using Reviews.Models.Dto;

namespace Reviews.Mappers;

public class PieceProfile : Profile
{
    public PieceProfile()
    {
        CreateMap<Piece, PieceDto>();
    }
}