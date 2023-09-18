using Microsoft.EntityFrameworkCore;
using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Repositories.Common.Interfaces;
using SShop.Services.Internal.FileStorage;
using SShop.ViewModels.Catalog.Brands;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.Brands
{
    public class BrandService : IBrandService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorageService _fileStorage;

        public BrandService(IUnitOfWork unitOfWork, IFileStorageService fileStorage)
        {
            _unitOfWork = unitOfWork;
            _fileStorage = fileStorage;
        }

        public async Task<bool> CreateBrand(BrandCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var brand = new Brand()
                {
                    BrandName = request.BrandName,
                    Origin = request.Origin,
                    Image = await _fileStorage.SaveFile(request.Image),
                };
                await _unitOfWork.BrandRepository.Insert(brand);
                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return res > 0;
            }
            catch
            {
                await _unitOfWork.Rollback();
                throw new Exception("Cannot create brand");
            }
        }

        public async Task<bool> DeleteBrand(int brandId)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var brand = await _unitOfWork.BrandRepository.GetById(brandId);
                if (brand == null)
                    return false;
                _unitOfWork.BrandRepository.Delete(brand);
                var count = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                await _fileStorage.DeleteFile(Path.GetFileName(brand.Image));
                return count > 0;
            }
            catch
            {
                await _unitOfWork.Rollback();
                throw new Exception("Cannot delete brand");
            }
        }

        public BrandViewModel GetBrandViewModel(Brand brand)
        {
            return new BrandViewModel()
            {
                BrandId = brand.BrandId,
                BrandName = brand.BrandName,
                Origin = brand.Origin,
                Image = brand.Image,
                TotalProduct = brand.Products.Count
            };
        }

        public async Task<PagedResult<BrandViewModel>> GetBrands(BrandGetPagingRequest request)
        {
            try
            {
                var brands = await _unitOfWork.BrandRepository.GetBrands(request);

                return new PagedResult<BrandViewModel>
                {
                    TotalItem = brands.TotalItem,
                    Items = brands.Items.Select(x => GetBrandViewModel(x)).ToList()
                };
            }
            catch
            {
                return null;
            }
        }

        public async Task<BrandViewModel> GetBrand(int brandId)
        {
            try
            {
                var brand = await _unitOfWork.BrandRepository.GetBrandById(brandId);
                if (brand == null)
                    return null;
                return GetBrandViewModel(brand);
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> UpdateBrand(BrandUpdateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var brand = await _unitOfWork.BrandRepository.GetById(request.BrandId);
                if (brand == null)
                    return false;
                brand.BrandName = request.BrandName;
                brand.Origin = request.Origin;
                if (request.Image != null)
                {
                    await _fileStorage.DeleteFile(Path.GetFileName(brand.Image));
                    brand.Image = await _fileStorage.SaveFile(request.Image);
                }
                _unitOfWork.BrandRepository.Update(brand);

                int count = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return count > 0;
            }
            catch
            {
                await _unitOfWork.Rollback();
                throw new Exception("Cannot update brand");
            }
        }
    }
}