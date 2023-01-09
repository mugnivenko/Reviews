using System.ComponentModel.DataAnnotations;

namespace Reviews.Models.Dto;

public class EditRatingDto
{
    [Range(1, 5)]
    public int Value { get; set; }
}