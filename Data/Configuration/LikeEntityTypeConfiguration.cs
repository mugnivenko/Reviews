using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Reviews.Models;

namespace Reviews.Data.Configuration;

public class LikeEntityTypeConfiguration : IEntityTypeConfiguration<Like>
{
    public void Configure(EntityTypeBuilder<Like> builder)
    {
        builder
            .HasOne(navigationExpression => navigationExpression.User)
            .WithMany(navigationExpression => navigationExpression.Likes)
            .HasForeignKey(foreignKeyExpression => foreignKeyExpression.UserId);

        builder
            .HasOne(navigationExpression => navigationExpression.Review)
            .WithMany(navigationExpression => navigationExpression.Likes)
            .HasForeignKey(foreignKeyExpression => foreignKeyExpression.ReviewId);

    }
}