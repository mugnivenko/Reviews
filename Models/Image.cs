using System.ComponentModel.DataAnnotations;

namespace Reviews.Models;

public class Image : BaseModel
{
    [DataType(DataType.ImageUrl)]
    public string Link { get; set; } = default!;

    public Guid ReviewId { get; set; }
    public virtual Review Review { get; set; } = default!;
}