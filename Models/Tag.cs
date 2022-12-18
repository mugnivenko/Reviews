using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reviews.Models;

public class Tag : BaseModel
{
    [Required]
    public string Name { get; set; }

    public virtual ICollection<Review> Reviews { get; set; }
}