using SShop.Domain.Entities;
using SShop.ViewModels.Catalog.ProductImages;
using SShop.ViewModels.Common;
using SShop.Services.Internal.FileStorage;
using SShop.Repositories.Catalog.ProductImages;
using SShop.Repositories.Common.Interfaces;

namespace SShop.Services.Internal.Catalog.ProductImages
{
    public class ProductImageService : IProductImageService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorageService _fileStorageService;

        public ProductImageService(IUnitOfWork unitOfWork, IFileStorageService fileStorageService)
        {
            _unitOfWork = unitOfWork;
            _fileStorageService = fileStorageService;
        }

        public async Task<bool> CreateMultipleProductImage(ProductImageCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var product = await _unitOfWork.ProductRepository.GetProduct(request.ProductId)
                    ?? throw new KeyNotFoundException("Cannot find product");

                foreach (var item in request.Images)
                {
                    await _unitOfWork.ProductImageRepository.Insert(new ProductImage()
                    {
                        ProductId = product.ProductId,
                        IsDefault = false,
                        Path = await _fileStorageService.SaveFile(item)
                    });
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

        public async Task<bool> DeleteProductImage(int productImageId)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var productImage = await _unitOfWork.ProductImageRepository.GetById(productImageId)
                    ?? throw new KeyNotFoundException("Cannot find product image");
                _unitOfWork.ProductImageRepository.Delete(productImage);
                await _fileStorageService.DeleteFile(Path.GetFileName(productImage.Path));
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

        public ProductImageViewModel GetProductImageViewModel(ProductImage productImage)
        {
            return new ProductImageViewModel()
            {
                Id = productImage.Id,
                IsDefault = productImage.IsDefault,
                Image = productImage.Path,
                ProductId = productImage.ProductId,
            };
        }

        public async Task<ProductImageViewModel> GetProductImage(int productImageId)
        {
            try
            {
                var productImage = await _unitOfWork.ProductImageRepository.GetById(productImageId)
                    ?? throw new KeyNotFoundException("Cannot find product image");
                return GetProductImageViewModel(productImage);
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<bool> UpdateProductImage(ProductImageUpdateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();

                var productImg = await _unitOfWork.ProductImageRepository.GetById(request.ProductImageId)
                    ?? throw new KeyNotFoundException("Cannot find product image");
                if (request.Image == null)
                    return false;

                var oldPath = Path.GetFileName(productImg.Path);
                productImg.Path = await _fileStorageService.SaveFile(request.Image);

                _unitOfWork.ProductImageRepository.Update(productImg);

                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                await _fileStorageService.DeleteFile(oldPath);
                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<PagedResult<ProductImageViewModel>> GetProductImages(ProductImageGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.ProductImageRepository.GetProductImages(request);

                return new PagedResult<ProductImageViewModel>
                {
                    TotalItem = data.TotalItem,
                    Items = data.Items.Select(x => GetProductImageViewModel(x)).ToList()
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> CreateSingleProductImage(ProductImageCreateSingleRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var product = await _unitOfWork.ProductRepository.GetProduct(request.ProductId)
                    ?? throw new KeyNotFoundException("Cannot find product");
                var productImg = new ProductImage()
                {
                    ProductId = product.ProductId,
                    IsDefault = false,
                    Path = await _fileStorageService.SaveFile(request.Image)
                };
                await _unitOfWork.ProductImageRepository.Insert(productImg);

                var res = await _unitOfWork.Save();
                if (res <= 0)
                    throw new Exception("Cannot create productImage");
                await _unitOfWork.Commit();

                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }
    }
}