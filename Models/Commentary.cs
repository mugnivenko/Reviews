using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reviews.Models;

public class Commentary : BaseModel
{
    [Required]
    public string Content { get; set; }

    public Guid ReviewId { get; set; }
    public virtual Review Review { get; set; }

    public Guid CreatorId { get; set; }
    public virtual ApplicationUser Creator { get; set; }
}