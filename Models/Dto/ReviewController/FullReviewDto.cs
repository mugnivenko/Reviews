namespace Reviews.Models.Dto;

public class FullReviewDto : ReviewDto
{
    public CreatorDto Creator { get; set; } = default!;

    public ReviewLikeDto Like { get; set; } = default!;
}