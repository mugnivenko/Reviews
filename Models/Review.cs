using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reviews.Models;

public class Review : BaseModel
{
    [Required]
    public string Name { get; set; }

    [Required]
    public string Content { get; set; }

    [DataType(DataType.DateTime)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; }

    [Range(1, 10)]
    public int Grade { get; set; }

    public Guid CreatorId { get; set; }
    public virtual ApplicationUser Creator { get; set; }

    public Guid GroupId { get; set; }
    public virtual Group Group { get; set; }

    public Guid PieceId { get; set; }
    public virtual Piece Piece { get; set; }

    public virtual ICollection<Tag> Tags { get; set; }
    public virtual ICollection<Image> Images { get; set; }
    public virtual ICollection<Commentary> Commentaries { get; set; }
    public virtual ICollection<Raiting> Raitings { get; set; }
    public virtual ICollection<Like> Likes { get; set; }

}