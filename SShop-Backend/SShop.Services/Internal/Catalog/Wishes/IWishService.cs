using SShop.ViewModels.Catalog.Wishtems;
using SShop.ViewModels.Common;
using SShop.Repositories.Common.Interfaces;
using System.Threading.Tasks;

namespace SShop.Repositories.Catalog.WishItems
{
    public interface IWishService
    {
        Task<bool> CreateWishItem(WishItemCreateRequest request);

        Task<int> DeleteWishItem(int wishItemId);

        Task<bool> DeleteAllWishItem(string userId);

        Task<WishItemViewModel> GetWishItemById(int wishItemId);

        Task<PagedResult<WishItemViewModel>> GetWishByUserId(WishItemGetPagingRequest request);

        Task<object> AddProductToWish(WishItemCreateRequest request);
    }
}