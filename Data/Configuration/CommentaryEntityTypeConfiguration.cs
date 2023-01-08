using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Reviews.Models;

namespace Reviews.Data.Configuration;

public class CommentaryEntityTypeConfiguration : IEntityTypeConfiguration<Commentary>
{
    public void Configure(EntityTypeBuilder<Commentary> builder)
    {
        builder
            .HasOne(navigationExpression => navigationExpression.Creator)
            .WithMany(navigationExpression => navigationExpression.Commentaries)
            .HasForeignKey(foreignKeyExpression => foreignKeyExpression.CreatorId);

        builder
            .HasOne(navigationExpression => navigationExpression.Review)
            .WithMany(navigationExpression => navigationExpression.Commentaries)
            .HasForeignKey(foreignKeyExpression => foreignKeyExpression.ReviewId);

        builder
            .HasGeneratedTsVectorColumn(
                p => p.SearchVector,
                "simple",
                p => new { p.Content })
            .HasIndex(p => p.SearchVector)
            .HasMethod("GIN");
    }
}