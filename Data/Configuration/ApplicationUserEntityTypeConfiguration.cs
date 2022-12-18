using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Reviews.Models;

namespace Reviews.Data.Configuration;

public class ApplicationUserEntityTypeConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder
            .HasMany(navigationExpression => navigationExpression.Reviews)
            .WithOne(navigationExpression => navigationExpression.Creator);

        builder
            .HasMany(navigationExpression => navigationExpression.Commentaries)
            .WithOne(navigationExpression => navigationExpression.Creator);

        builder
            .HasMany(navigationExpression => navigationExpression.Likes)
            .WithOne(navigationExpression => navigationExpression.User);

        builder
            .HasMany(navigationExpression => navigationExpression.Raitings)
            .WithOne(navigationExpression => navigationExpression.User);
    }
}