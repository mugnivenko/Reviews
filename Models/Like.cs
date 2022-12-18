using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reviews.Models;

public class Like : BaseModel
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; }

    public Guid ReviewId { get; set; }
    public virtual Review Review { get; set; }
}