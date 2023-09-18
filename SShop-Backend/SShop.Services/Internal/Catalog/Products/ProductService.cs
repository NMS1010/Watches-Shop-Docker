using SShop.Domain.Entities;
using SShop.Utilities.Constants.Products;
using SShop.ViewModels.Catalog.ProductImages;
using SShop.ViewModels.Catalog.Products;
using SShop.ViewModels.Catalog.ReviewItems;
using SShop.ViewModels.Common;
using SShop.Services.Internal.FileStorage;
using SShop.Repositories.Catalog.Products;
using SShop.Repositories.Common.Interfaces;

namespace SShop.Services.Internal.Catalog.Products
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorageService _fileStorageService;

        public ProductService(IUnitOfWork unitOfWork, IFileStorageService fileStorageService)
        {
            _unitOfWork = unitOfWork;
            _fileStorageService = fileStorageService;
        }

        public async Task<bool> CreateProduct(ProductCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var product = new Product()
                {
                    Name = request.Name,
                    Description = request.Description,
                    Price = request.Price,
                    Quantity = request.Quantity,
                    DateCreated = DateTime.Now,
                    Origin = request.Origin,
                    Status = request.Status,
                    CategoryId = request.CategoryId,
                    BrandId = request.BrandId
                };
                if (request.Quantity == 0)
                {
                    product.Status = PRODUCT_STATUS.OUT_STOCK;
                }

                if (product.Status == PRODUCT_STATUS.OUT_STOCK)
                {
                    product.Quantity = 0;
                }
                await _unitOfWork.ProductRepository.Insert(product);
                var count = await _unitOfWork.Save();
                if (count <= 0)
                    throw new Exception("Cannot create product");
                if (request.Image != null)
                {
                    await _unitOfWork.ProductImageRepository.Insert(new ProductImage()
                    {
                        IsDefault = true,
                        ProductId = product.ProductId,
                        Path = await _fileStorageService.SaveFile(request.Image)
                    });
                }
                if (request.SubImages != null)
                {
                    foreach (var item in request.SubImages)
                    {
                        await _unitOfWork.ProductImageRepository.Insert(new ProductImage()
                        {
                            IsDefault = false,
                            ProductId = product.ProductId,
                            Path = await _fileStorageService.SaveFile(item)
                        });
                    }
                }
                var res = await _unitOfWork.Save();

                await _unitOfWork.Commit();

                if (res < 0) throw new Exception("Cannot create product");
                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<bool> DeleteProduct(int productId)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var product = await _unitOfWork.ProductRepository.GetProduct(productId)
                    ?? throw new KeyNotFoundException("Cannot found this product");
                product.Status = PRODUCT_STATUS.SUSPENDED;
                product.Quantity = 0;
                _unitOfWork.ProductRepository.Update(product);

                var res = await _unitOfWork.Save();

                await _unitOfWork.Commit();

                if (res < 0) throw new Exception("Cannot update product state");
                return res > 0;
            }
            catch (Exception e)
            {
                await _unitOfWork.Rollback();
                throw e;
            }
        }

        private static string GenerateProductStatusClass(int status)
        {
            string s = "";
            switch (status)
            {
                case PRODUCT_STATUS.IN_STOCK:
                    s = "badge badge-success";
                    break;

                case PRODUCT_STATUS.OUT_STOCK:
                    s = "badge badge-warning";
                    break;

                case PRODUCT_STATUS.SUSPENDED:
                    s = "badge badge-danger";
                    break;

                default:
                    s = "";
                    break;
            }
            return s;
        }

        private ProductViewModel GetProductViewModel(Product product)
        {
            return new ProductViewModel()
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                DateCreated = product.DateCreated,
                Status = product.Status,
                Origin = product.Origin,
                CategoryName = product.Category.Name,
                BrandName = product.Brand.BrandName,
                ImagePath = product.ProductImages
                            .Where(c => c.IsDefault == true && c.ProductId == product.ProductId)
                            .FirstOrDefault()
                            ?.Path,
                BrandId = product.BrandId,
                CategoryId = product.CategoryId,
                StatusCode = PRODUCT_STATUS.ProductStatus[product.Status],
                TotalPurchased = product.OrderItems.Sum(g => g.Quantity),
                StatusClass = GenerateProductStatusClass(product.Status),
                ProductReview = new PagedResult<ReviewItemViewModel>()
                {
                    TotalItem = product.OrderItems.Where(x => x?.ReviewItem?.Status == 1).Count(),
                    Items = product.OrderItems.Where(x => x?.ReviewItem?.Status == 1).Select(oi => new ReviewItemViewModel()
                    {
                        Content = oi.ReviewItem.Content,
                        DateCreated = oi.ReviewItem.DateCreated,
                        DateUpdated = oi.ReviewItem.DateUpdated,
                        ProductImage = product.ProductImages
                                .Where(c => c.IsDefault == true && c.ProductId == product.ProductId)
                                .FirstOrDefault()
                                ?.Path,
                        ProductName = product.Name,
                        Rating = oi.ReviewItem.Rating,
                        ReviewItemId = oi.ReviewItem.ReviewItemId,
                        Status = oi.ReviewItem.Status,
                        UserAvatar = oi.Order.User.Avatar,
                        UserName = oi.Order.User.UserName
                    }).ToList()
                },
                AverageRating = product?.OrderItems.Where(r => r?.ReviewItem?.Status == 1).Count() > 0 ? (int)product?.OrderItems.Where(r => r?.ReviewItem?.Status == 1).Average(x => x.ReviewItem.Rating) : 0
            };
        }

        public async Task<PagedResult<ProductViewModel>> GetProducts(ProductGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.ProductRepository.GetProducts(request);
                var res = new PagedResult<ProductViewModel>
                {
                    TotalItem = data.TotalItem,
                    Items = data.Items.Select(x => GetProductViewModel(x)).ToList(),
                };
                foreach (var product in res.Items)
                {
                    var productImgs = await _unitOfWork.ProductImageRepository.GetProductImages(new ProductImageGetPagingRequest() { ProductId = product.ProductId });
                    product.SubImages = new PagedResult<ProductImageViewModel>()
                    {
                        TotalItem = productImgs.TotalItem,
                        Items = productImgs.Items.Select(productImage => new ProductImageViewModel()
                        {
                            Id = productImage.Id,
                            IsDefault = productImage.IsDefault,
                            Image = productImage.Path,
                            ProductId = productImage.ProductId,
                        }).ToList(),
                    };
                }

                return res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ProductViewModel> GetProduct(int productId)
        {
            try
            {
                var product = await _unitOfWork.ProductRepository.GetProduct(productId)
                    ?? throw new KeyNotFoundException("Cannot found this product");
                var res = GetProductViewModel(product);
                var productImgs = await _unitOfWork.ProductImageRepository.GetProductImages(new ProductImageGetPagingRequest() { ProductId = product.ProductId });
                res.SubImages = new PagedResult<ProductImageViewModel>()
                {
                    TotalItem = productImgs.TotalItem,
                    Items = productImgs.Items.Select(productImage => new ProductImageViewModel()
                    {
                        Id = productImage.Id,
                        IsDefault = productImage.IsDefault,
                        Image = productImage.Path,
                        ProductId = productImage.ProductId,
                    }).ToList(),
                };
                return res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateProduct(ProductUpdateRequest request)
        {
            try
            {
                var product = await _unitOfWork.ProductRepository.GetProduct(request.ProductId)
                    ?? throw new KeyNotFoundException("Cannot found this product");
                await _unitOfWork.CreateTransaction();
                product.Name = request.Name;
                product.Description = request.Description;
                product.Price = request.Price;
                product.Quantity = request.Quantity;
                product.Status = request.Status;
                product.Origin = request.Origin;
                product.BrandId = request.BrandId;
                product.CategoryId = request.CategoryId;
                if (request.Quantity == 0)
                {
                    product.Status = PRODUCT_STATUS.OUT_STOCK;
                }
                if (product.Status == PRODUCT_STATUS.OUT_STOCK)
                {
                    product.Quantity = 0;
                }
                var path = "";
                if (request.Image != null)
                {
                    var productImg = await _unitOfWork.ProductImageRepository.FindProductImageDefault(product.ProductId, true);
                    if (productImg != null)
                        path = Path.GetFileName(productImg.Path);
                    productImg.IsDefault = true;
                    productImg.Path = await _fileStorageService.SaveFile(request.Image);

                    _unitOfWork.ProductImageRepository.Update(productImg);
                }
                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();

                if (!string.IsNullOrEmpty(path))
                {
                    await _fileStorageService.DeleteFile(path);
                }
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