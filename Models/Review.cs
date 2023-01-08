using NpgsqlTypes;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reviews.Models;

public class Review : BaseModel
{
    [Required]
    public string Name { get; set; } = default!;

    [Required]
    public string Content { get; set; } = default!;

    [DataType(DataType.DateTime)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; }

    [Range(1, 10)]
    public int Grade { get; set; }

    public Guid CreatorId { get; set; }
    public virtual ApplicationUser Creator { get; set; } = default!;

    public Guid GroupId { get; set; }
    public virtual Group Group { get; set; } = default!;

    public Guid PieceId { get; set; }
    public virtual Piece Piece { get; set; } = default!;

    public virtual ICollection<Tag> Tags { get; set; } = default!;
    public virtual ICollection<Image> Images { get; set; } = default!;
    public virtual ICollection<Commentary> Commentaries { get; set; } = default!;
    public virtual ICollection<Raiting> Raitings { get; set; } = default!;
    public virtual ICollection<Like> Likes { get; set; } = default!;

    public NpgsqlTsVector SearchVector { get; set; } = default!;
}