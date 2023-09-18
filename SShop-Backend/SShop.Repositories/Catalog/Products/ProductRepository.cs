using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Repositories.Catalog.ProductImages;
using SShop.Utilities.Constants.Products;
using SShop.Utilities.Constants.Sort;
using SShop.ViewModels.Catalog.ProductImages;
using SShop.ViewModels.Catalog.Products;
using SShop.ViewModels.Catalog.ReviewItems;
using SShop.ViewModels.Common;
using Microsoft.EntityFrameworkCore;
using SShop.Repositories.Common;

namespace SShop.Repositories.Catalog.Products
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PagedResult<Product>> GetProducts(ProductGetPagingRequest request)
        {
            try
            {
                var query = Context.Products
                    .Include(c => c.ProductImages)
                    .Include(c => c.Brand)
                    .Include(c => c.Category)
                    .Include(c => c.OrderItems)
                    .ThenInclude(c => c.Order)
                    .ThenInclude(c => c.User)
                    .Include(c => c.OrderItems)
                    .ThenInclude(c => c.ReviewItem)
                    .Where(x => true);

                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    query = query.Where(x => x.Name.ToLower().Contains(request.Keyword.ToLower()));
                }
                if (request.CategoryIds?.ToList()?.Count > 0)
                {
                    query = query.Where(x => request.CategoryIds.Contains(x.CategoryId));
                }
                if (request.BrandIds?.ToList()?.Count > 0)
                {
                    query = query.Where(x => request.BrandIds.Contains(x.BrandId));
                }
                if (request.MaxPrice != decimal.MaxValue)
                {
                    query = query.Where(x => x.Price >= request.MinPrice && x.Price <= request.MaxPrice);
                }

                if (request.SortBy == SORT_BY.BY_NAME_ZA)
                {
                    query = query.OrderByDescending(x => x.Name);
                }
                else if (request.SortBy == SORT_BY.BY_PRICE_AZ)
                {
                    query = query.OrderBy(x => x.Price);
                }
                else if (request.SortBy == SORT_BY.BY_PRICE_ZA)
                {
                    query = query.OrderByDescending(x => x.Price);
                }
                else
                {
                    query = query.OrderBy(x => x.Name);
                }

                var data = query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize).ToList();

                return new PagedResult<Product>
                {
                    TotalItem = await query.CountAsync(),
                    Items = data
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot get product list");
            }
        }

        public async Task<Product> GetProduct(int productId)
        {
            try
            {
                var product = await Context.Products
                    .Where(p => p.ProductId == productId)
                    .Include(c => c.ProductImages)
                    .Include(c => c.Brand)
                    .Include(c => c.Category)
                    .Include(c => c.OrderItems)
                    .ThenInclude(c => c.ReviewItem)
                    .Include(c => c.OrderItems)
                    .ThenInclude(c => c.Order)
                    .ThenInclude(c => c.User)
                    .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Cannot find this product");
                return product;
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot get product");
            }
        }
    }
}