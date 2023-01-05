namespace Reviews.Models.Dto;

public class ReviewDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = default!;

    public string Content { get; set; } = default!;

    public DateTime CreatedAt { get; set; }

    public int Grade { get; set; }

    public Guid CreatorId { get; set; }

    public Guid GroupId { get; set; }

    public Guid PieceId { get; set; }

    public GroupDto Group { get; set; } = default!;

    public PieceDto Piece { get; set; } = default!;

    public IEnumerable<TagDto> Tags { get; set; } = default!;

    public IEnumerable<ImageDto> Images { get; set; } = default!;

}