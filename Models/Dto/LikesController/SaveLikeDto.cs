namespace Reviews.Models.Dto;

public class SaveLikeDto
{
    public Guid UserId { get; set; }

    public Guid ReviewId { get; set; }
}