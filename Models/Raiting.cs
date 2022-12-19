using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reviews.Models;

public class Raiting : BaseModel
{
    [Range(1, 5)]
    public int Value { get; set; }

    public Guid UserId { get; set; }
    public virtual ApplicationUser User { get; set; } = default!;

    public Guid PieceId { get; set; }
    public virtual Piece Piece { get; set; } = default!;

    public Guid ReviewId { get; set; }
    public virtual Review Review { get; set; } = default!;
}