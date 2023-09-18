using SShop.ViewModels.Catalog.Brands;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.Brands
{
    public interface IBrandService
    {
        Task<bool> CreateBrand(BrandCreateRequest request);

        Task<bool> UpdateBrand(BrandUpdateRequest request);

        Task<bool> DeleteBrand(int id);

        Task<PagedResult<BrandViewModel>> GetBrands(BrandGetPagingRequest request);

        Task<BrandViewModel> GetBrand(int id);
    }
}