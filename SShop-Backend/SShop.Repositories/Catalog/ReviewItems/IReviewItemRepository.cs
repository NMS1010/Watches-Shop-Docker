using SShop.ViewModels.Catalog.ReviewItems;
using SShop.ViewModels.Common;
using SShop.Repositories.Common.Interfaces;
using System.Threading.Tasks;
using SShop.Domain.Entities;
using SShop.Utilities.Interfaces;

namespace SShop.Repositories.Catalog.ReviewItems
{
    public interface IReviewItemRepository : IGenericRepository<ReviewItem>
    {
        Task<ReviewItem> GetReviewItem(int reviewItemId);

        Task<PagedResult<ReviewItem>> GetReviews(ReviewItemGetPagingRequest request);

        Task<PagedResult<ReviewItem>> GetReviewsByUser(ReviewItemGetPagingRequest request);

        Task<PagedResult<ReviewItem>> GetReviewsByProduct(ReviewItemGetPagingRequest request);

        Task<ReviewItem> GetReviewsByOrderItem(int orderItemId);
    }
}