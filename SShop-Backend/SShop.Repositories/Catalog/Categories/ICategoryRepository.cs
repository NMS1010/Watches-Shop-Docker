using SShop.ViewModels.Catalog.Categories;
using SShop.ViewModels.Common;
using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Interfaces;
using SShop.Domain.Entities;

namespace SShop.Repositories.Catalog.Categories
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        Task<List<Category>> GetSubCategory(int categoryId);

        Task<Category> GetCategory(int categoryId);

        Task<PagedResult<Category>> GetParentCategory();

        Task<PagedResult<Category>> GetCategories(CategoryGetPagingRequest request);
    }
}