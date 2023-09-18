using SShop.Domain.Entities;
using SShop.Repositories.Catalog.CartItems;
using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Constants.Products;
using SShop.ViewModels.Catalog.CartItems;
using SShop.ViewModels.Common;

namespace SShop.Services.Internal.Catalog.Carts
{
    public class CartService : ICartService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CartService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<object> AddProductToCart(CartItemCreateRequest request)
        {
            try
            {
                var product = await _unitOfWork.ProductRepository.GetProduct(request.ProductId);
                var cartItem = await _unitOfWork.CartItemRepository.GetCartItem(request.UserId, request.ProductId);
                var currentCart = 0;
                var isUpdateQuantity = false;
                if (product.Status == PRODUCT_STATUS.OUT_STOCK)
                {
                    throw new Exception("Product is out of stock");
                }
                if (product.Status == PRODUCT_STATUS.SUSPENDED)
                {
                    throw new Exception("Product is suspended");
                }
                if (product.Quantity > 0)
                {
                    if (cartItem != null)
                    {
                        CartItemUpdateRequest req = new CartItemUpdateRequest()
                        {
                            CartItemId = cartItem.CartItemId,
                            Quantity = cartItem.Quantity + request.Quantity,
                            Status = request.Status,
                            UserId = request.UserId
                        };

                        var res = await UpdateCartItem(req);
                        isUpdateQuantity = true;
                    }
                    else
                    {
                        var res = await CreateCartItem(request);
                        if (!res)
                        {
                            throw new Exception("Cannot add product to your cart");
                        }
                    }
                    currentCart = (await _unitOfWork.CartItemRepository
                        .GetCartByUserId(new CartItemGetPagingRequest()
                        {
                            UserId = request.UserId
                        })).TotalItem;
                }
                else
                {
                    throw new Exception("Product quantity must be larger than 0");
                }
                return new
                {
                    CurrentCartAmount = currentCart,
                    IsUpdateQuantity = isUpdateQuantity,
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<int> CanUpdateCartItemQuantity(int cartItemId, int quantity)
        {
            try
            {
                var cartItem = await _unitOfWork.CartItemRepository.GetById(cartItemId);
                if (cartItem == null)
                    return -1;

                var product = await _unitOfWork.ProductRepository.GetProduct(cartItem.ProductId);
                if (product == null)
                    return -1;

                if (product.Quantity < quantity)
                    return product.Quantity;
                return -1;
            }
            catch
            {
                return -1;
            }
        }

        public async Task<bool> CreateCartItem(CartItemCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var cartItem = new CartItem()
                {
                    ProductId = request.ProductId,
                    UserId = request.UserId,
                    Quantity = request.Quantity,
                    DateAdded = DateTime.Now,
                    Status = request.Status,
                };

                await _unitOfWork.CartItemRepository.Insert(cartItem);

                var res = await _unitOfWork.Save();
                if (res <= 0)
                    throw new Exception("Cannot create cart item");
                await _unitOfWork.Commit();

                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<int> DeleteCartItem(int cartItemId)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var cartItem = await _unitOfWork.CartItemRepository.GetById(cartItemId)
                    ?? throw new KeyNotFoundException("Cannot find this item");

                _unitOfWork.CartItemRepository.Delete(cartItem);
                var res = await _unitOfWork.Save();
                if (res <= 0)
                    throw new Exception("Failed to delete this item");
                var currentCart = (await _unitOfWork.CartItemRepository
                        .GetCartByUserId(new CartItemGetPagingRequest()
                        {
                            UserId = cartItem.UserId
                        })).TotalItem;

                await _unitOfWork.Commit();
                return currentCart;
            }
            catch (Exception e)
            {
                await _unitOfWork.Rollback();
                throw e;
            }
        }

        public async Task<bool> DeleteCartByUserId(string userId)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var list = await _unitOfWork.CartItemRepository
                        .GetCartByUserId(new CartItemGetPagingRequest()
                        {
                            UserId = userId,
                            PageSize = 10000
                        });
                foreach (var cartItem in list.Items)
                {
                    _unitOfWork.CartItemRepository.Delete(cartItem);
                }

                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return res > 0;
            }
            catch (Exception e)
            {
                await _unitOfWork.Rollback();
                throw e;
            }
        }

        public CartItemViewModel GetCartItemViewModel(CartItem cartItem)
        {
            return new CartItemViewModel()
            {
                CartItemId = cartItem.CartItemId,
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product.Name,
                ImageProduct = cartItem.Product.ProductImages
                            .Where(c => c.ProductId == cartItem.ProductId && c.IsDefault == true)
                            .FirstOrDefault()?.Path,
                Quantity = cartItem.Quantity,
                TotalPrice = cartItem.Quantity * cartItem.Product.Price,
                UnitPrice = cartItem.Product.Price,
                DateAdded = DateTime.Now,
                Status = cartItem.Status,
                ProductStatus = PRODUCT_STATUS.ProductStatus[cartItem.Product.Status]
            };
        }

        public async Task<PagedResult<CartItemViewModel>> GetCartByUserId(CartItemGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.CartItemRepository
                        .GetCartByUserId(new CartItemGetPagingRequest()
                        {
                            UserId = request.UserId,
                            Status = request.Status,
                            PageSize = 10000
                        });

                return new PagedResult<CartItemViewModel>()
                {
                    TotalItem = data.TotalItem,
                    Items = data.Items.Select(x => GetCartItemViewModel(x)).ToList()
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<object> UpdateCartItem(CartItemUpdateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var cartItem = await _unitOfWork.CartItemRepository.GetCartItemById(request.CartItemId);

                var product = await _unitOfWork.ProductRepository.GetProduct(cartItem.ProductId);
                if (product.Quantity < request.Quantity)
                {
                    throw new Exception("Product quantity is not enough");
                }
                cartItem.Quantity = request.Quantity;

                cartItem.Status = request.Status;
                var res = await _unitOfWork.Save();
                if (res < 0)
                    throw new Exception("Cannot update cart");

                var data = await _unitOfWork.CartItemRepository.GetCartByUserId(new CartItemGetPagingRequest()
                {
                    UserId = request.UserId,
                    Status = 1,
                    PageSize = 10000
                });
                var totalPrice = data.Items.Select(x => x.Product.Price * x.Quantity)?.Sum();

                await _unitOfWork.Commit();

                return new
                {
                    TotalSelectedItem = data.TotalItem,
                    TotalPaymentPrice = totalPrice,
                    cartItem = GetCartItemViewModel(cartItem)
                };
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<bool> UpdateQuantityByProductId(int productId, int quantity)
        {
            try
            {
                var cartItems = await _unitOfWork.CartItemRepository.GetCartItemsByProduct(productId);
                await _unitOfWork.CreateTransaction();
                foreach (var item in cartItems)
                {
                    item.Quantity = quantity;
                    _unitOfWork.CartItemRepository.Update(item);
                }
                var res = await _unitOfWork.Save();
                if (res <= 0)
                    throw new Exception("Cannot update cart item quantity");
                await _unitOfWork.Commit();
                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<object> UpdateAllStatus(string userId, bool selectAll)
        {
            try
            {
                var cartItems = await _unitOfWork.CartItemRepository.GetCartByUserId(new CartItemGetPagingRequest()
                {
                    UserId = userId,
                    Status = -1
                }) ?? throw new KeyNotFoundException("Cannot find cart item");
                await _unitOfWork.CreateTransaction();
                cartItems.Items.ForEach(c =>
                {
                    c.Status = selectAll ? 1 : 0;
                    _unitOfWork.CartItemRepository.Update(c);
                });

                var res = await _unitOfWork.Save();
                if (res < 0)
                    throw new Exception("Cannot update cart");

                var totalPrice = cartItems.Items.Select(x => x.Product.Price * x.Quantity)?.Sum();
                await _unitOfWork.Commit();
                return new
                {
                    TotalSelectedItem = selectAll ? cartItems.TotalItem : 0,
                    TotalPaymentPrice = selectAll ? totalPrice : 0,
                    CartItems = cartItems.Items.Select(x => GetCartItemViewModel(x)).ToList()
                };
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<object> DeleteSelectedCartItem(string userId)
        {
            try
            {
                var cartItems = await _unitOfWork.CartItemRepository.GetCartByUserId(new CartItemGetPagingRequest()
                {
                    UserId = userId,
                    Status = 1
                }) ?? throw new KeyNotFoundException("Cannot find cart item");
                await _unitOfWork.CreateTransaction();
                foreach (var cartItem in cartItems.Items)
                {
                    if (cartItem.Status == 1)
                    {
                        _unitOfWork.CartItemRepository.Delete(cartItem);
                    }
                }

                var res = await _unitOfWork.Save();
                if (res <= 0)
                    throw new Exception("Cannot delete cart items");
                await _unitOfWork.Commit();
                cartItems = await _unitOfWork.CartItemRepository.GetCartByUserId(new CartItemGetPagingRequest()
                {
                    UserId = userId,
                }) ?? throw new KeyNotFoundException("Cannot find cart item");
                return new
                {
                    TotalSelectedItem = 0,
                    TotalPaymentPrice = 0,
                    CartItems = cartItems.Items.Select(x => GetCartItemViewModel(x)).ToList(),
                    CurrentCartAmount = cartItems.TotalItem
                };
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }
    }
}