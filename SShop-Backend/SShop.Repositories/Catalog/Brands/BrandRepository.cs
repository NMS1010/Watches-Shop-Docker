using Microsoft.EntityFrameworkCore;
using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Repositories.Common;
using SShop.Utilities.Interfaces;
using SShop.ViewModels.Catalog.Brands;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.Brands
{
    public class BrandRepository : GenericRepository<Brand>, IBrandRepository
    {
        public BrandRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Brand> GetBrandById(int id)
        {
            return await Context.Brands
                .Include(x => x.Products)
                .Where(x => x.BrandId == id)
                .FirstOrDefaultAsync();
        }

        public async Task<PagedResult<Brand>> GetBrands(BrandGetPagingRequest request)
        {
            var query = Context.Brands
                .Include(x => x.Products);
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = (Microsoft.EntityFrameworkCore.Query.IIncludableQueryable<Brand, HashSet<Product>>)query
                    .Where(x => x.BrandName.Contains(request.Keyword));
            }
            var data = await query
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize).ToListAsync();

            return new PagedResult<Brand> { Items = data, TotalItem = await query.CountAsync() };
        }
    }
}