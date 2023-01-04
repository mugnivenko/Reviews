using System.ComponentModel.DataAnnotations;

namespace Reviews.Models.Dto;

public class CreatingReviewDto
{
    public string Name { get; set; } = default!;

    public string Piece { get; set; } = default!;

    [Required]
    [Range(1, 10)]
    public int Grade { get; set; }

    public IEnumerable<string> Tags { get; set; } = default!;

    public string Content { get; set; } = default!;

    [Required]
    public Guid CreatorId { get; set; }

    [Required]
    public Guid GroupId { get; set; }

    public IEnumerable<string> Files { get; set; } = default!;
}