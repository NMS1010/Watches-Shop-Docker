using SShop.ViewModels.Catalog.ProductImages;
using SShop.Repositories.Common.Interfaces;
using System.Threading.Tasks;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.ProductImages
{
    public interface IProductImageService
    {
        Task<bool> CreateMultipleProductImage(ProductImageCreateRequest request);

        Task<bool> UpdateProductImage(ProductImageUpdateRequest request);

        Task<bool> DeleteProductImage(int id);

        Task<ProductImageViewModel> GetProductImage(int id);

        Task<PagedResult<ProductImageViewModel>> GetProductImages(ProductImageGetPagingRequest request);

        Task<bool> CreateSingleProductImage(ProductImageCreateSingleRequest request);
    }
}