
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Reviews.Models;

namespace Reviews.Data.Configuration;

public class PieceEntityTypeConfiguration : IEntityTypeConfiguration<Piece>
{
    public void Configure(EntityTypeBuilder<Piece> builder)
    {
        builder
            .HasMany(navigationExpression => navigationExpression.Reviews)
            .WithOne(navigationExpression => navigationExpression.Piece);

        builder
            .HasMany(navigationExpression => navigationExpression.Raitings)
            .WithOne(navigationExpression => navigationExpression.Piece);
    }
}