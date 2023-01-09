namespace Reviews.Models.Dto;

public class SearchRatingDto
{
    public Guid UserId { get; set; }

    public Guid ReviewId { get; set; }
}