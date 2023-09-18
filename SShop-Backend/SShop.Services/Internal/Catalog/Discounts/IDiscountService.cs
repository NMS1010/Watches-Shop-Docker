using SShop.ViewModels.Catalog.Discounts;
using SShop.Repositories.Common.Interfaces;
using System.Threading.Tasks;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.Discounts
{
    public interface IDiscountService
    {
        Task<bool> CreateDiscount(DiscountCreateRequest request);

        Task<bool> UpdateDiscount(DiscountUpdateRequest request);

        Task<bool> DeleteDiscount(int discountId);

        Task<DiscountViewModel> GetDiscount(int discountId);

        Task<PagedResult<DiscountViewModel>> GetDiscounts(DiscountGetPagingRequest request);

        Task<string> ApplyDiscount(string discountCode);
    }
}