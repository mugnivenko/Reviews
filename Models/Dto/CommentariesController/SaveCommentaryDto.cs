namespace Reviews.Models.Dto;

public class SaveCommentaryDto
{
    public string Content { get; set; } = default!;

    public Guid ReviewId { get; set; }
}