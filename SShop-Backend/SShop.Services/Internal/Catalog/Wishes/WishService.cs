using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Utilities.Constants.Products;
using SShop.ViewModels.Catalog.Wishtems;
using SShop.ViewModels.Common;
using Microsoft.EntityFrameworkCore;
using SShop.Repositories.Common.Interfaces;
using SShop.Repositories.Catalog.WishItems;

namespace SShop.Services.Internal.Catalog.Wishes
{
    public class WishService : IWishService
    {
        private readonly IUnitOfWork _unitOfWork;

        public WishService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<object> AddProductToWish(WishItemCreateRequest request)
        {
            try
            {
                var wishItem = await _unitOfWork.WishItemRepository.GetWishItem(request.UserId, request.ProductId);
                if (wishItem != null)
                {
                    throw new Exception("Product has already been in your wish list");
                }

                var currentWishAmount = 0;
                var res = await CreateWishItem(request);
                if (!res)
                {
                    throw new Exception("Cannot add product to your wish list");
                }
                currentWishAmount = (await _unitOfWork.WishItemRepository.GetWishByUserId(new WishItemGetPagingRequest()
                {
                    PageSize = 10000,
                    UserId = request.UserId,
                })).TotalItem;
                return new
                {
                    CurrentWishAmount = currentWishAmount
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> CreateWishItem(WishItemCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var wishItem = new WishItem()
                {
                    ProductId = request.ProductId,
                    UserId = request.UserId,
                    DateAdded = DateTime.Now,
                    Status = request.Status,
                };
                await _unitOfWork.WishItemRepository.Insert(wishItem);

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

        public async Task<int> DeleteWishItem(int wishItemId)
        {
            try
            {
                var wishItem = await _unitOfWork.WishItemRepository.GetById(wishItemId)
                    ?? throw new KeyNotFoundException("Cannot find wish item");

                await _unitOfWork.CreateTransaction();

                _unitOfWork.WishItemRepository.Delete(wishItem);
                var res = await _unitOfWork.Save();
                if (res <= 0)
                {
                    throw new Exception("Cannot delete product from your wish list");
                }

                await _unitOfWork.Commit();
                var currentWishAmount = (await _unitOfWork.WishItemRepository.GetWishByUserId(new WishItemGetPagingRequest()
                {
                    PageSize = 10000,
                    UserId = wishItem.UserId,
                })).TotalItem;
                return currentWishAmount;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<bool> DeleteAllWishItem(string userId)
        {
            try
            {
                var wishItems = await _unitOfWork.WishItemRepository.GetWishByUserId(new WishItemGetPagingRequest()
                {
                    PageSize = 10000,
                    UserId = userId,
                }) ?? throw new KeyNotFoundException("Cannot find wish item");

                await _unitOfWork.CreateTransaction();
                foreach (var wishItem in wishItems.Items)
                {
                    _unitOfWork.WishItemRepository.Delete(wishItem);
                }
                var res = await _unitOfWork.Save();
                if (res < 1)
                {
                    throw new Exception("Cannot delete all item in your wish");
                }

                await _unitOfWork.Commit();
                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public WishItemViewModel GetWishItemViewModel(WishItem wishItem)
        {
            return new WishItemViewModel()
            {
                WishItemId = wishItem.WishItemId,
                ProductId = wishItem.ProductId,
                ProductName = wishItem.Product.Name,
                ProductImage = wishItem.Product.ProductImages
                        .Where(c => c.IsDefault == true && c.ProductId == wishItem.ProductId)
                        .FirstOrDefault()?.Path,
                UserId = wishItem.UserId,
                DateAdded = wishItem.DateAdded,
                Status = wishItem.Status,
                UnitPrice = wishItem.Product.Price,
                UserName = wishItem.User.UserName,
                ProductStatus = PRODUCT_STATUS.ProductStatus[wishItem.Product.Status]
            };
        }

        public async Task<WishItemViewModel> GetWishItemById(int wishItemId)
        {
            try
            {
                var wishItem = await _unitOfWork.WishItemRepository.GetWishItemById(wishItemId);
                return GetWishItemViewModel(wishItem);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<PagedResult<WishItemViewModel>> GetWishByUserId(WishItemGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.WishItemRepository.GetWishByUserId(request);

                return new PagedResult<WishItemViewModel>
                {
                    TotalItem = data.TotalItem,
                    Items = data.Items.Select(x => GetWishItemViewModel(x)).ToList(),
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}