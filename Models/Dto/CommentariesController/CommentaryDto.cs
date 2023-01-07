namespace Reviews.Models.Dto;

public class CommentaryDto
{
    public Guid Id { get; set; }

    public string Content { get; set; } = default!;

    public DateTime CreatedAt { get; set; }

    public CreatorDto Creator { get; set; } = default!;
}