using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reviews.Models;

public class Image : BaseModel
{
    [DataType(DataType.ImageUrl)]
    public string Link { get; set; }

    public Guid ReviewId { get; set; }
    public virtual Review Review { get; set; }
}