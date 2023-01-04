using AutoMapper;

using Reviews.Models;
using Reviews.Models.Dto;

namespace Reviews.Mappers;

public class ReviewProfile : Profile
{
    public ReviewProfile()
    {
        CreateMap<Review, ReviewDto>();

        CreateMap<EditingReviewDto, Review>()
            .ForMember(Ignore => Ignore.Tags, memberOptions => memberOptions.Ignore())
            .ForMember(Ignore => Ignore.Piece, memberOptions => memberOptions.Ignore())
            .ForAllMembers(memberOptions => memberOptions.Condition(FilterNullableValues));
    }

    private bool FilterNullableValues(EditingReviewDto source, Review destinatiom, object sourceMember)
    {
        Type? sourceMemberType = sourceMember?.GetType();
        if (sourceMemberType == typeof(Guid)) return (Guid?)sourceMember != Guid.Empty;
        if (sourceMemberType == typeof(int)) return (int?)sourceMember != 0;
        return sourceMember != null;
    }
}