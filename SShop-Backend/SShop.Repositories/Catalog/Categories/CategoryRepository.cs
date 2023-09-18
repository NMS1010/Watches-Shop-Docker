using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.ViewModels.Catalog.Categories;
using SShop.ViewModels.Common;
using Microsoft.EntityFrameworkCore;
using SShop.Repositories.Common;

namespace SShop.Repositories.Catalog.Categories
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PagedResult<Category>> GetParentCategory()
        {
            try
            {
                var query = await Context.Categories
                    .Where(x => x.ParentCategoryId != null)
                    .Include(x => x.Products)
                    .ToListAsync();
                var data = query.ToList();

                return new PagedResult<Category>
                {
                    TotalItem = query.Count,
                    Items = data
                };
            }
            catch
            {
                throw new Exception("Cannot get categories");
            }
        }

        public async Task<List<Category>> GetSubCategory(int categoryId)
        {
            try
            {
                var subCategories = await Context.Categories
                    .Include(x => x.Products)
                    .ThenInclude(x => x.OrderItems)
                    .Where(x => x.ParentCategoryId == categoryId).ToListAsync();
                return subCategories;
            }
            catch
            {
                throw new Exception("Cannot get categories");
            }
        }

        public async Task<PagedResult<Category>> GetCategories(CategoryGetPagingRequest request)
        {
            try
            {
                var query = await Context.Categories
                    .Include(x => x.Products)
                    .ToListAsync();
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    query = query
                        .Where(x => x.Name.Contains(request.Keyword))
                        .ToList();
                }
                var data = query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .Select(x => x).ToList();

                return new PagedResult<Category>
                {
                    TotalItem = query.Count,
                    Items = data
                };
            }
            catch
            {
                throw new Exception("Cannot get categories");
            }
        }

        public async Task<Category> GetCategory(int categoryId)
        {
            try
            {
                var category = await Context.Categories
                    .Where(p => p.CategoryId == categoryId)
                    .Include(x => x.Products)
                    .FirstOrDefaultAsync();
                return category;
            }
            catch
            {
                throw new Exception("Cannot get category");
            }
        }
    }
}