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
            .ForMember(review => review.Tags, memberOptions => memberOptions.Ignore())
            .ForMember(review => review.Piece, memberOptions => memberOptions.Ignore())
            .ForAllMembers(memberOptions => memberOptions.Condition(FilterNullableValues));

        CreateMap<Review, FullReviewDto>()
            .ForMember(
                destinationMember => destinationMember.Like,
                memberOptions => memberOptions.MapFrom(
                    memberOptions => memberOptions.Likes.FirstOrDefault()
                )
            );

        CreateMap<Review, SearchReview>();
    }

    private bool FilterNullableValues(EditingReviewDto source, Review destinatiom, object sourceMember)
    {
        Type? sourceMemberType = sourceMember?.GetType();
        if (sourceMemberType == typeof(Guid)) return (Guid?)sourceMember != Guid.Empty;
        if (sourceMemberType == typeof(int)) return (int?)sourceMember != 0;
        return sourceMember != null;
    }
}