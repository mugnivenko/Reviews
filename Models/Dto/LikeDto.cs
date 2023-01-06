
namespace Reviews.Models.Dto;

public class LikeDto
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid ReviewId { get; set; }
}