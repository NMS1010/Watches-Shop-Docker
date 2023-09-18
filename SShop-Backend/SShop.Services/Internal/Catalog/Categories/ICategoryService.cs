using SShop.ViewModels.Catalog.Categories;
using SShop.ViewModels.Common;
using SShop.Repositories.Common.Interfaces;
using SShop.Domain.Entities;

namespace SShop.Repositories.Catalog.Categories
{
    public interface ICategoryService
    {
        Task<bool> CreateCategory(CategoryCreateRequest request);

        Task<bool> UpdateCategory(CategoryUpdateRequest request);

        Task<bool> DeleteCategory(int categoryId);

        Task<List<CategoryViewModel>> GetSubCategory(int categoryId);

        Task<CategoryViewModel> GetCategory(int categoryId);

        Task<PagedResult<CategoryViewModel>> GetParentCategory();

        Task<PagedResult<CategoryViewModel>> GetCategories(CategoryGetPagingRequest request);
    }
}