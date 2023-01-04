namespace Reviews.Models.Dto;

public class EditingReviewDto
{
    public string? Name { get; set; }

    public string? Piece { get; set; }

    public int? Grade { get; set; }

    public IEnumerable<string>? Tags { get; set; }

    public string? Content { get; set; }

    public Guid GroupId { get; set; }

    public IEnumerable<string>? Files { get; set; }
}