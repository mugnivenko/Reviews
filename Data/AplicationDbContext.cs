using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

using Reviews.Models;
using Reviews.Data.Configuration;

namespace Reviews.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Review> Reviews { get; set; }
    public DbSet<Commentary> Commentaries { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Piece> Pieces { get; set; }
    public DbSet<Raiting> Raitings { get; set; }
    public DbSet<Tag> Tags { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        new ReviewEntityTypeConfiguration().Configure(builder.Entity<Review>());
        new ApplicationUserEntityTypeConfiguration().Configure(builder.Entity<ApplicationUser>());
        new CommentaryEntityTypeConfiguration().Configure(builder.Entity<Commentary>());
        new GroupEntityTypeConfiguration().Configure(builder.Entity<Group>());
        new ImageEntityTypeConfiguration().Configure(builder.Entity<Image>());
        new LikeEntityTypeConfiguration().Configure(builder.Entity<Like>());
        new PieceEntityTypeConfiguration().Configure(builder.Entity<Piece>());
        new RaitingEntityTypeConfiguration().Configure(builder.Entity<Raiting>());
        new TagEntityTypeConfiguration().Configure(builder.Entity<Tag>());

        base.OnModelCreating(builder);
    }
}
