using Microsoft.EntityFrameworkCore.Migrations;

namespace SShop.Domain.Migrations
{
    public partial class UpdateReviewEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Review_Product_ProductId",
                table: "Review");

            migrationBuilder.DropForeignKey(
                name: "FK_Review_User_UserId",
                table: "Review");

            migrationBuilder.DropIndex(
                name: "IX_Review_ProductId",
                table: "Review");

            migrationBuilder.DropIndex(
                name: "IX_Review_UserId",
                table: "Review");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "Review");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Review");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "Review",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Review",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Review_ProductId",
                table: "Review",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Review_UserId",
                table: "Review",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Review_Product_ProductId",
                table: "Review",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Review_User_UserId",
                table: "Review",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
