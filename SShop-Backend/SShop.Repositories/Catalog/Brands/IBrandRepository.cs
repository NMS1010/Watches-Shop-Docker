using Microsoft.AspNetCore.Mvc.RazorPages;
using SShop.Domain.Entities;
using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Interfaces;
using SShop.ViewModels.Catalog.Brands;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.Brands
{
    public interface IBrandRepository : IGenericRepository<Brand>
    {
        Task<Brand> GetBrandById(int id);

        Task<PagedResult<Brand>> GetBrands(BrandGetPagingRequest request);
    }
}