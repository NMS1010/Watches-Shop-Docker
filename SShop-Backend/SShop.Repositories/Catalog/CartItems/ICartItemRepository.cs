using SShop.Domain.Entities;
using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Interfaces;
using SShop.ViewModels.Catalog.CartItems;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.CartItems
{
    public interface ICartItemRepository : IGenericRepository<CartItem>
    {
        Task<PagedResult<CartItem>> GetCartByUserId(CartItemGetPagingRequest request);

        Task<CartItem> GetCartItem(string userId, int productId);

        Task<CartItem> GetCartItemById(int cartItemId);

        Task<List<CartItem>> GetCartItemsByProduct(int productId);
    }
}