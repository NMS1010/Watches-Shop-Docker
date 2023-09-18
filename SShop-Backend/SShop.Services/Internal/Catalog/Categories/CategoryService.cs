using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.ViewModels.Catalog.Categories;
using SShop.ViewModels.Common;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;
using SShop.Services.Internal.FileStorage;
using SShop.Repositories.Common.Interfaces;

namespace SShop.Repositories.Catalog.Categories
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorageService _fileStorageService;

        public CategoryService(IUnitOfWork unitOfWork, IFileStorageService fileStorageService)
        {
            _unitOfWork = unitOfWork;
            _fileStorageService = fileStorageService;
        }

        public async Task<bool> CreateCategory(CategoryCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var category = new Category()
                {
                    Name = request.Name,
                    Content = request.Content,
                    ParentCategoryId = request.ParentCategoryId ?? null,
                    Image = await _fileStorageService.SaveFile(request.Image),
                };

                await _unitOfWork.CategoryRepository.Insert(category);

                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<bool> DeleteCategory(int categoryId)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var category = await _unitOfWork.CategoryRepository.GetById(categoryId);

                if (category == null)
                    return false;
                _unitOfWork.CategoryRepository.Delete(category);
                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                await _fileStorageService.DeleteFile(Path.GetFileName(category.Image));
                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<CategoryViewModel> GetCategoryViewModel(Category category)
        {
            CategoryViewModel parentCate = null;
            if (category.ParentCategoryId.HasValue)
            {
                parentCate = await GetCategory(category.ParentCategoryId.Value);
            }
            return new CategoryViewModel()
            {
                CategoryId = category.CategoryId,
                Name = category.Name,
                ParentCategoryId = category.ParentCategoryId ?? null,
                ParentCategoryName = parentCate?.Name,
                Content = category.Content,
                Image = category.Image,
                SubCategories = await GetSubCategory(category.CategoryId),
                TotalProduct = category.Products.Count
            };
        }

        public async Task<PagedResult<CategoryViewModel>> GetParentCategory()
        {
            try
            {
                var data = await _unitOfWork.CategoryRepository.GetParentCategory();
                var lst = new List<CategoryViewModel>();
                foreach (var category in data.Items)
                {
                    lst.Add(await GetCategoryViewModel(category));
                }
                return new PagedResult<CategoryViewModel>
                {
                    TotalItem = data.TotalItem,
                    Items = lst
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<List<CategoryViewModel>> GetSubCategory(int categoryId)
        {
            try
            {
                var data = await _unitOfWork.CategoryRepository.GetSubCategory(categoryId);
                var lst = new List<CategoryViewModel>();
                foreach (var item in data)
                {
                    lst.Add(await GetCategoryViewModel(item));
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<PagedResult<CategoryViewModel>> GetCategories(CategoryGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.CategoryRepository.GetCategories(request);

                var lst = new List<CategoryViewModel>();
                foreach (var item in data.Items)
                {
                    lst.Add(await GetCategoryViewModel(item));
                }

                return new PagedResult<CategoryViewModel>
                {
                    TotalItem = data.TotalItem,
                    Items = lst
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<CategoryViewModel> GetCategory(int categoryId)
        {
            try
            {
                var category = await _unitOfWork.CategoryRepository.GetCategory(categoryId);
                if (category == null)
                    return null;
                return await GetCategoryViewModel(category);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateCategory(CategoryUpdateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var category = await _unitOfWork.CategoryRepository.GetCategory(request.CategoryId);
                if (category == null)
                    return false;
                category.Name = request.Name;
                category.ParentCategoryId = request.ParentCategoryId ?? null;
                category.Content = request.Content;
                if (request.Image != null)
                {
                    await _fileStorageService.DeleteFile(Path.GetFileName(category.Image));
                    category.Image = await _fileStorageService.SaveFile(request.Image);
                }
                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();

                return res > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}