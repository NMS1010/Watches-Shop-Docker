using SShop.ViewModels.Catalog.ReviewItems;
using SShop.ViewModels.Common;
using SShop.Repositories.Common.Interfaces;
using System.Threading.Tasks;

namespace SShop.Repositories.Catalog.ReviewItems
{
    public interface IReviewService
    {
        Task<bool> CreateReviewItem(ReviewItemCreateRequest request);

        Task<bool> UpdateReviewItem(ReviewItemUpdateRequest request);

        Task<bool> ChangeReviewStatus(int reviewItemId);

        Task<PagedResult<ReviewItemViewModel>> GetReviewsByUser(ReviewItemGetPagingRequest request);

        Task<PagedResult<ReviewItemViewModel>> GetReviewsByProduct(ReviewItemGetPagingRequest request);

        Task<PagedResult<ReviewItemViewModel>> GetReviewItems(ReviewItemGetPagingRequest request);

        Task<ReviewItemViewModel> GetReviewsByOrderItem(int orderItemId);

        Task<ReviewItemViewModel> GetReviewItem(int reviewItemId);
    }
}