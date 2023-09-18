using SShop.ViewModels.Catalog.Discounts;
using SShop.Repositories.Common.Interfaces;
using System.Threading.Tasks;
using SShop.Utilities.Interfaces;
using SShop.Domain.Entities;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.Discounts
{
    public interface IDiscountRepository : IGenericRepository<Discount>
    {
        Task<Discount> GetDiscountByCode(string discountCode);

        Task<PagedResult<Discount>> GetDiscounts(DiscountGetPagingRequest request);
    }
}