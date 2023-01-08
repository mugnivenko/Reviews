using System.ComponentModel.DataAnnotations;

namespace Reviews.Models;

public class Tag : BaseModel
{
    public Tag()
    {
        Reviews = new HashSet<Review>();
    }

    [Required]
    public string Name { get; set; } = default!;

    public virtual ICollection<Review> Reviews { get; set; }
}