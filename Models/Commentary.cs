using NpgsqlTypes;
using System.ComponentModel.DataAnnotations;

namespace Reviews.Models;

public class Commentary : BaseModel
{
    [Required]
    public string Content { get; set; } = default!;


    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; }

    public Guid ReviewId { get; set; }
    public virtual Review Review { get; set; } = default!;

    public Guid CreatorId { get; set; }
    public virtual ApplicationUser Creator { get; set; } = default!;

    public NpgsqlTsVector SearchVector { get; set; } = default!;
}