using SShop.ViewModels.Catalog.Products;
using SShop.Repositories.Common.Interfaces;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.Products
{
    public interface IProductService
    {
        Task<bool> CreateProduct(ProductCreateRequest request);

        Task<bool> UpdateProduct(ProductUpdateRequest request);

        Task<bool> DeleteProduct(int productId);

        Task<PagedResult<ProductViewModel>> GetProducts(ProductGetPagingRequest request);

        Task<ProductViewModel> GetProduct(int productId);
    }
}