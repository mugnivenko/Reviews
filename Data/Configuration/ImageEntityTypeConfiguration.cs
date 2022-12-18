using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Reviews.Models;

namespace Reviews.Data.Configuration;

public class ImageEntityTypeConfiguration : IEntityTypeConfiguration<Image>
{
    public void Configure(EntityTypeBuilder<Image> builder)
    {
        builder
            .HasOne(navigationExpression => navigationExpression.Review)
            .WithMany(navigationExpression => navigationExpression.Images)
            .HasForeignKey(foreignKeyExpression => foreignKeyExpression.ReviewId);
    }
}