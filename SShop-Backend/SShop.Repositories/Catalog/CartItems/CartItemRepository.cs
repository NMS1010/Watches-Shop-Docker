using Mailjet.Client.Resources;
using Microsoft.EntityFrameworkCore;
using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Repositories.Common;
using SShop.Utilities.Constants.Products;
using SShop.ViewModels.Catalog.CartItems;
using SShop.ViewModels.Common;
using System.Net.WebSockets;

namespace SShop.Repositories.Catalog.CartItems
{
    public class CartItemRepository : GenericRepository<CartItem>, ICartItemRepository
    {
        public CartItemRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PagedResult<CartItem>> GetCartByUserId(CartItemGetPagingRequest request)
        {
            try
            {
                var query = Context.CartItems
                    .Where(x => x.UserId == request.UserId)
                    .Include(x => x.User)
                    .Include(x => x.Product)
                    .ThenInclude(x => x.ProductImages);
                IQueryable<CartItem> temp = null;
                if (request.Status != -1)
                    temp = query.Where(x => x.Status == request.Status);
                var data = await (temp ?? query)
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize).ToListAsync();

                return new PagedResult<CartItem>()
                {
                    TotalItem = data.Count,
                    Items = data
                };
            }
            catch
            {
                throw new Exception("Cannot get this user's cart");
            }
        }

        public async Task<CartItem> GetCartItem(string userId, int productId)
        {
            try
            {
                var cartItem = await Context.CartItems
                    .Where(x => x.ProductId == productId && x.UserId == userId)
                    .FirstOrDefaultAsync();

                return cartItem;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<CartItem> GetCartItemById(int cartItemId)
        {
            try
            {
                var cartItem = await Context.CartItems
                    .Include(x => x.Product)
                    .ThenInclude(x => x.ProductImages)
                    .Where(c => c.CartItemId == cartItemId)
                    .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Cannot find cart item");

                return cartItem;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<List<CartItem>> GetCartItemsByProduct(int productId)
        {
            try
            {
                var cartItems = await Context.CartItems
                    .Where(x => x.ProductId == productId)
                    .ToListAsync();

                return cartItems;
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot get cartitem by productId");
            }
        }
    }
}