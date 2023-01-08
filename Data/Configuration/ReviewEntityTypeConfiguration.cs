using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Reviews.Models;

namespace Reviews.Data.Configuration;

public class ReviewEntityTypeConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder
            .HasOne(navigationExpression => navigationExpression.Creator)
            .WithMany(navigationExpression => navigationExpression.Reviews)
            .HasForeignKey(foreignKeyExpression => foreignKeyExpression.CreatorId);

        builder
            .HasMany(navigationExpression => navigationExpression.Tags)
            .WithMany(navigationExpression => navigationExpression.Reviews);

        builder
            .HasMany(navigationExpression => navigationExpression.Raitings)
            .WithOne(navigationExpression => navigationExpression.Review);

        builder
            .HasOne(navigationExpression => navigationExpression.Piece)
            .WithMany(navigationExpression => navigationExpression.Reviews)
            .HasForeignKey(foreignKeyExpression => foreignKeyExpression.PieceId);

        builder
            .HasOne(navigationExpression => navigationExpression.Group)
            .WithMany(navigationExpression => navigationExpression.Reviews)
            .HasForeignKey(foreignKeyExpression => foreignKeyExpression.GroupId);

        builder
            .HasMany(navigationExpression => navigationExpression.Images)
            .WithOne(navigationExpression => navigationExpression.Review);

        builder
            .HasMany(navigationExpression => navigationExpression.Commentaries)
            .WithOne(navigationExpression => navigationExpression.Review);

        builder
            .HasMany(navigationExpression => navigationExpression.Likes)
            .WithOne(navigationExpression => navigationExpression.Review);

        builder
            .HasGeneratedTsVectorColumn(
                p => p.SearchVector,
                "simple",
                p => new { p.Name, p.Content })
            .HasIndex(p => p.SearchVector)
            .HasMethod("GIN");
    }
}