using SShop.ViewModels.Catalog.Wishtems;
using SShop.ViewModels.Common;
using SShop.Repositories.Common.Interfaces;
using SShop.Domain.Entities;
using SShop.Utilities.Interfaces;

namespace SShop.Repositories.Catalog.WishItems
{
    public interface IWishItemRepository : IGenericRepository<WishItem>
    {
        Task<PagedResult<WishItem>> GetWishByUserId(WishItemGetPagingRequest request);

        Task<WishItem> GetWishItemById(int wishItemId);

        Task<WishItem> GetWishItem(string userId, int productId);
    }
}