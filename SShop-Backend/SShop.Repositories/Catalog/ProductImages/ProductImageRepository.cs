using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.ViewModels.Catalog.ProductImages;
using SShop.ViewModels.Common;
using Microsoft.EntityFrameworkCore;
using SShop.Repositories.Common;
using SShop.Utilities.Interfaces;

namespace SShop.Repositories.Catalog.ProductImages
{
    public class ProductImageRepository : GenericRepository<ProductImage>, IProductImageRepository
    {
        public ProductImageRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<ProductImage> FindProductImageDefault(int productId, bool isDefault)
        {
            try
            {
                var productImg = await Context.ProductImages
                        .Where(c => c.IsDefault == isDefault && c.ProductId == productId)
                        .FirstOrDefaultAsync();

                return productImg;
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot get product");
            }
        }

        public async Task<PagedResult<ProductImage>> GetProductImages(ProductImageGetPagingRequest request)
        {
            try
            {
                var query = Context.ProductImages
                    .Where(c => c.ProductId == request.ProductId);

                var data = await query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync();

                return new PagedResult<ProductImage>
                {
                    TotalItem = await query.CountAsync(),
                    Items = data
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot get product image list");
            }
        }
    }
}