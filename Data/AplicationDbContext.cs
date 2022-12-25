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

    public DbSet<Review> Reviews { get; set; } = default!;
    public DbSet<Commentary> Commentaries { get; set; } = default!;
    public DbSet<Group> Groups { get; set; } = default!;
    public DbSet<Image> Images { get; set; } = default!;
    public DbSet<Like> Likes { get; set; } = default!;
    public DbSet<Piece> Pieces { get; set; } = default!;
    public DbSet<Raiting> Raitings { get; set; } = default!;
    public DbSet<Tag> Tags { get; set; } = default!;

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

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    => optionsBuilder.LogTo(Console.WriteLine);
}
