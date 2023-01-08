using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Reviews.Models;

namespace Reviews.Data.Configuration;

public class GroupEntityTypeConfiguration : IEntityTypeConfiguration<Group>
{
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        builder
            .HasMany(navigationExpression => navigationExpression.Reviews)
            .WithOne(navigationExpression => navigationExpression.Group);

        builder
            .HasGeneratedTsVectorColumn(
                p => p.SearchVector,
                "simple",
                p => new { p.Name })
            .HasIndex(p => p.SearchVector)
            .HasMethod("GIN");
    }
}