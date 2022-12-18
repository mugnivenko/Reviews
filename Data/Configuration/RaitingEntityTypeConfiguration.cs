using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Reviews.Models;

namespace Reviews.Data.Configuration;

public class RaitingEntityTypeConfiguration : IEntityTypeConfiguration<Raiting>
{
    public void Configure(EntityTypeBuilder<Raiting> builder)
    {
        builder
            .HasOne(navigationExpression => navigationExpression.User)
            .WithMany(navigationExpression => navigationExpression.Raitings)
            .HasForeignKey(foreignKeyExpression => foreignKeyExpression.UserId);

        builder
            .HasOne(navigationExpression => navigationExpression.Review)
            .WithMany(navigationExpression => navigationExpression.Raitings)
            .HasForeignKey(foreignKeyExpression => foreignKeyExpression.ReviewId);

        builder
            .HasOne(navigationExpression => navigationExpression.Piece)
            .WithMany(navigationExpression => navigationExpression.Raitings)
            .HasForeignKey(foreignKeyExpression => foreignKeyExpression.PieceId);
    }
}