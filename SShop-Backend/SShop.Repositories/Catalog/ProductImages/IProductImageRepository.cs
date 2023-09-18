using SShop.ViewModels.Catalog.ProductImages;
using SShop.Repositories.Common.Interfaces;
using System.Threading.Tasks;
using SShop.ViewModels.Common;
using SShop.Utilities.Interfaces;
using SShop.Domain.Entities;

namespace SShop.Repositories.Catalog.ProductImages
{
    public interface IProductImageRepository : IGenericRepository<ProductImage>
    {
        Task<PagedResult<ProductImage>> GetProductImages(ProductImageGetPagingRequest request);

        Task<ProductImage> FindProductImageDefault(int productId, bool isDefault);
    }
}