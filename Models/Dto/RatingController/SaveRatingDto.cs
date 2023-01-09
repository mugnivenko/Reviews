using System.ComponentModel.DataAnnotations;

namespace Reviews.Models.Dto;

public class SaveRatingDto
{
    [Range(1, 5)]
    public int Value { get; set; }

    public Guid ReviewId { get; set; }
}