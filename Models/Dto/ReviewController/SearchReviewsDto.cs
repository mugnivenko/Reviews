namespace Reviews.Models.Dto;

public class SearchReviewsDto
{
    public Guid? UserId { get; set; }

    public Guid? TagId { get; set; }
}