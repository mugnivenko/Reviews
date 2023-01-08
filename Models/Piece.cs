using NpgsqlTypes;
using System.ComponentModel.DataAnnotations;

namespace Reviews.Models;

public class Piece : BaseModel
{
    [Required]
    public string Name { get; set; } = default!;

    public virtual ICollection<Review> Reviews { get; set; } = default!;
    public virtual ICollection<Raiting> Raitings { get; set; } = default!;

    public NpgsqlTsVector SearchVector { get; set; } = default!;
}