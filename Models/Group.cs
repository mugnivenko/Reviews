using NpgsqlTypes;
using System.ComponentModel.DataAnnotations;

namespace Reviews.Models;

public class Group : BaseModel
{
    [Required]
    public string Name { get; set; } = default!;

    public virtual ICollection<Review> Reviews { get; set; } = default!;

    public NpgsqlTsVector SearchVector { get; set; } = default!;
}