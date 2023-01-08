using Microsoft.EntityFrameworkCore.Migrations;
using NpgsqlTypes;

#nullable disable

namespace Reviews.Data.Migrations
{
    /// <inheritdoc />
    public partial class FullTextSearch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<NpgsqlTsVector>(
                name: "SearchVector",
                table: "Reviews",
                type: "tsvector",
                nullable: false)
                .Annotation("Npgsql:TsVectorConfig", "simple")
                .Annotation("Npgsql:TsVectorProperties", new[] { "Name", "Content" });

            migrationBuilder.AddColumn<NpgsqlTsVector>(
                name: "SearchVector",
                table: "Pieces",
                type: "tsvector",
                nullable: false)
                .Annotation("Npgsql:TsVectorConfig", "simple")
                .Annotation("Npgsql:TsVectorProperties", new[] { "Name" });

            migrationBuilder.AddColumn<NpgsqlTsVector>(
                name: "SearchVector",
                table: "Groups",
                type: "tsvector",
                nullable: false)
                .Annotation("Npgsql:TsVectorConfig", "simple")
                .Annotation("Npgsql:TsVectorProperties", new[] { "Name" });

            migrationBuilder.AddColumn<NpgsqlTsVector>(
                name: "SearchVector",
                table: "Commentaries",
                type: "tsvector",
                nullable: false)
                .Annotation("Npgsql:TsVectorConfig", "simple")
                .Annotation("Npgsql:TsVectorProperties", new[] { "Content" });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_SearchVector",
                table: "Reviews",
                column: "SearchVector")
                .Annotation("Npgsql:IndexMethod", "GIN");

            migrationBuilder.CreateIndex(
                name: "IX_Pieces_SearchVector",
                table: "Pieces",
                column: "SearchVector")
                .Annotation("Npgsql:IndexMethod", "GIN");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_SearchVector",
                table: "Groups",
                column: "SearchVector")
                .Annotation("Npgsql:IndexMethod", "GIN");

            migrationBuilder.CreateIndex(
                name: "IX_Commentaries_SearchVector",
                table: "Commentaries",
                column: "SearchVector")
                .Annotation("Npgsql:IndexMethod", "GIN");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reviews_SearchVector",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Pieces_SearchVector",
                table: "Pieces");

            migrationBuilder.DropIndex(
                name: "IX_Groups_SearchVector",
                table: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_Commentaries_SearchVector",
                table: "Commentaries");

            migrationBuilder.DropColumn(
                name: "SearchVector",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "SearchVector",
                table: "Pieces");

            migrationBuilder.DropColumn(
                name: "SearchVector",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "SearchVector",
                table: "Commentaries");
        }
    }
}
