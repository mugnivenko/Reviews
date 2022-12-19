using Microsoft.AspNetCore.Identity;

namespace Reviews.Models;

public class ApplicationUser : IdentityUser<Guid>
{
    public virtual ICollection<Review> Reviews { get; set; } = default!;
    public virtual ICollection<Raiting> Raitings { get; set; } = default!;
    public virtual ICollection<Like> Likes { get; set; } = default!;
    public virtual ICollection<Commentary> Commentaries { get; set; } = default!;
}

