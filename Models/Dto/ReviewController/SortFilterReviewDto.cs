namespace Reviews.Models.Dto;

public class SortFilterReviewDto
{
    public string Active { get; set; } = string.Empty;
    public string? Direction { get; set; }
    public DateTime? DateEnd { get; set; }
    public DateTime? DateStart { get; set; }
    public int GradeFrom { get; set; }
    public int GradeTo { get; set; }
    public Guid? GroupId { get; set; }
    public string? Name { get; set; }
    public string? Piece { get; set; }
}