using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reviews.Models;

public class Piece : BaseModel
{
    [Required]
    public string Name { get; set; }

    public virtual ICollection<Review> Reviews { get; set; }
    public virtual ICollection<Raiting> Raitings { get; set; }
}