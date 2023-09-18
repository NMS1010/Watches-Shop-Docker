using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Utilities.Constants.Orders;
using SShop.ViewModels.Catalog.Orders;
using SShop.ViewModels.Common;
using Microsoft.EntityFrameworkCore;
using SShop.Repositories.Catalog.OrderItems;
using SShop.ViewModels.System.Addresses;
using SShop.Repositories.System.Addresses;
using SShop.ViewModels.Catalog.Statistics;
using SShop.Repositories.System.Users;
using System.Reflection;
using Microsoft.AspNetCore.Components.Forms;
using System.Globalization;
using System.Security.Cryptography.X509Certificates;
using SShop.Utilities.Constants.Users;
using SShop.ViewModels.System.Users;
using SShop.Services.External.MailJet;
using Microsoft.AspNetCore.Identity;
using SShop.ViewModels.Catalog.OrderItems;
using SShop.Repositories.Common.Interfaces;

namespace SShop.Repositories.Catalog.Orders
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailJetServices _mailJetServices;
        private readonly UserManager<AppUser> _userManager;

        public OrderService(IUnitOfWork unitOfWork, IMailJetServices mailJetServices, UserManager<AppUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _mailJetServices = mailJetServices;
            _userManager = userManager;
        }

        public async Task<bool> CreateOrder(OrderCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var orderState = (await _unitOfWork.OrderStateRepository.GetAll())
                    .Where(x => x.OrderStateName == "Pending").FirstOrDefault() ?? throw new Exception("Error while handling action");

                var order = new Order()
                {
                    UserId = request.UserId,
                    DiscountId = request.DiscountId ?? null,
                    TotalItemPrice = request.TotalItemPrice,
                    TotalPrice = request.Shipping + request.TotalItemPrice,
                    AddressId = request.AddressId,
                    DateCreated = DateTime.Now,
                    DateDone = null,
                    OrderStateId = orderState.OrderStateId,
                    PaymentMethodId = request.PaymentMethodId,
                    DeliveryMethodId = request.DeliveryMethodId
                };

                var paymentMethod = (await _unitOfWork.PaymentMethodRepository.GetAll())
                    .Where(x => x.PaymentMethodName == "Paypal" && x.PaymentMethodId == request.PaymentMethodId)
                    .FirstOrDefault();
                if (paymentMethod != null)
                {
                    order.DatePaid = DateTime.Now;
                }

                await _unitOfWork.OrderRepository.Insert(order);
                var count = await _unitOfWork.Save();
                if (count <= 0)
                    throw new Exception("Error while handling action");
                var cartItems = await _unitOfWork.CartItemRepository.GetCartByUserId(new ViewModels.Catalog.CartItems.CartItemGetPagingRequest()
                {
                    UserId = request.UserId,
                    Status = 1
                }) ?? throw new Exception("Error while handling action");
                if (cartItems.Items.Where(x => x.Status == 1).ToList().Count <= 0)
                {
                    throw new Exception("Please select your product to order");
                }
                foreach (var cartItem in cartItems.Items)
                {
                    if (cartItem.Status == 0) continue;

                    var orderItem = new OrderItem()
                    {
                        OrderId = order.OrderId,
                        ProductId = cartItem.ProductId,
                        Order = order,
                        Product = cartItem.Product,
                        Quantity = cartItem.Quantity,
                        UnitPrice = cartItem.Product.Price,
                        TotalPrice = cartItem.Quantity * cartItem.Product.Price,
                    };
                    var product = await _unitOfWork.ProductRepository.GetById(cartItem.ProductId);
                    product.Quantity -= cartItem.Quantity;

                    _unitOfWork.ProductRepository.Update(product);
                    await _unitOfWork.OrderItemRepository.Insert(orderItem);
                    _unitOfWork.CartItemRepository.Delete(cartItem);
                }

                count = await _unitOfWork.Save();

                if (count <= 0)
                    throw new Exception("Error while handling action");
                await _unitOfWork.Commit();
                var user = await _userManager.FindByIdAsync(request.UserId);
                bool res = await _mailJetServices.SendMail(user.FirstName + " " + user.LastName, user.Email,
              "<h2>Chào " + user.FirstName + " " + user.LastName + " </h2>, <h3>FurSshop cảm ơn vì đã tin tưởng mua sản phẩm, đơn hàng sẽ nhanh chóng đến tay của bạn.<br />Bạn có thể xem chi tiết đơn hàng trong mục Đơn hàng của tôi. </h3><h4>Xin chân thành cảm ơn bạn !!! Rất vui được phục vụ.</h4>",
              "Đơn xác nhận đặt hàng");
                if (!res)
                {
                    throw new Exception("Error while handling action");
                }
                return true;
            }
            catch (Exception e)
            {
                await _unitOfWork.Rollback();
                throw e;
            }
        }

        public OrderViewModel GetOrderViewModel(Order order)
        {
            return new OrderViewModel()
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                UserFullName = order.User.FirstName + " " + order.User.LastName,
                UserPhone = order.User.PhoneNumber,
                DiscountId = order?.DiscountId,
                DiscountCode = order.Discount?.DiscountCode,
                DiscountValue = order.Discount?.DiscountValue,
                TotalItemPrice = order.TotalItemPrice,
                TotalPrice = order.TotalPrice,
                DateCreated = order.DateCreated,
                DateDone = order.DateDone,
                DatePaid = order.DatePaid,
                DeliveryMethod = new ViewModels.Catalog.DeliveryMethod.DeliveryMethodViewModel()
                {
                    DeliveryMethodId = order.DeliveryMethodId,
                    DeliveryMethodName = order.DeliveryMethod.DeliveryMethodName,
                    DeliveryMethodPrice = order.DeliveryMethod.Price,
                    Image = order.DeliveryMethod?.Image,
                },
                OrderStateId = order.OrderStateId,
                OrderStateName = order.OrderState.OrderStateName,
                PaymentMethod = new ViewModels.Catalog.PaymentMethod.PaymentMethodViewModel()
                {
                    PaymentMethodId = order.PaymentMethodId,
                    PaymentMethodName = order.PaymentMethod.PaymentMethodName,
                    Image = order.PaymentMethod.Image
                },
                TotalItem = order.OrderItems.Count,
                AddressId = order.AddressId
            };
        }

        public OrderItemViewModel GetOrderItemViewModel(OrderItem orderItem)
        {
            return new OrderItemViewModel()
            {
                OrderItemId = orderItem.OrderItemId,
                OrderId = orderItem.OrderId,
                ProductId = orderItem.ProductId,
                ProductName = orderItem.Product.Name,
                ProductImage = orderItem.Product.ProductImages
                            .Where(c => c.IsDefault == true && c.ProductId == orderItem.ProductId)
                            .FirstOrDefault()?.Path,
                Quantity = orderItem.Quantity,
                UnitPrice = orderItem.UnitPrice,
                TotalPrice = orderItem.TotalPrice,
                ProductBrand = orderItem.Product.Brand.BrandName,
                ProductCategory = orderItem.Product.Category.Name,
                ReviewItemId = orderItem.ReviewItemId ?? -1,
            };
        }

        private AddressViewModel GetAddressViewModel(Address address)
        {
            return new AddressViewModel()
            {
                SpecificAddress = address.SpecificAddress,
                DistrictCode = address.District.DistrictCode,
                DistrictId = address.District.DistrictId,
                DistrictName = address.District.DistrictName,
                ProvinceCode = address.Province.ProvinceCode,
                ProvinceId = address.Province.ProvinceId,
                ProvinceName = address.Province.ProvinceName,
                WardCode = address.Ward.WardCode,
                WardId = address.Ward.WardId,
                WardName = address.Ward.WardName,
                FirstName = address.FirstName,
                LastName = address.LastName,
                Phone = address.Phone,
                UserId = address.UserId,
                IsDefault = address.IsDefault,
                AddressId = address.AddressId,
            };
        }

        public async Task<PagedResult<OrderViewModel>> GetOrders(OrderGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.OrderRepository.GetAllOrder(request);
                var resp = new PagedResult<OrderViewModel>()
                {
                    Items = data.Items.Select(x => GetOrderViewModel(x)).ToList(),
                    TotalItem = data.TotalItem,
                };
                foreach (var d in resp.Items)
                {
                    var ois = await _unitOfWork.OrderItemRepository.GetByOrderId(d.OrderId);
                    var address = await _unitOfWork.AddressRepository.GetAddress(d.AddressId);
                    d.OrderItems = new PagedResult<OrderItemViewModel>()
                    {
                        Items = ois.Items.Select(x => GetOrderItemViewModel(x)).ToList(),
                        TotalItem = ois.TotalItem,
                    };
                    d.Address = GetAddressViewModel(address);
                }
                return resp;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<OrderViewModel> GetOrder(int orderId)
        {
            try
            {
                var order = await _unitOfWork.OrderRepository.GetOrderById(orderId);
                var res = GetOrderViewModel(order);

                var ois = await _unitOfWork.OrderItemRepository.GetByOrderId(order.OrderId);
                var address = await _unitOfWork.AddressRepository.GetAddress(order.AddressId);

                res.OrderItems = new PagedResult<OrderItemViewModel>()
                {
                    Items = ois.Items.Select(x => GetOrderItemViewModel(x)).ToList(),
                    TotalItem = ois.TotalItem,
                };
                res.Address = GetAddressViewModel(address);

                return res;
            }
            catch
            {
                throw new Exception("Failed to get order");
            }
        }

        public async Task<bool> UpdateOrder(OrderUpdateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var order = await _unitOfWork.OrderRepository.GetOrderById(request.OrderId)
                    ?? throw new KeyNotFoundException("Cannot find this order");
                var orderState = await _unitOfWork.OrderStateRepository.GetById(request.OrderStateId)
                    ?? throw new KeyNotFoundException("Cannot find this state"); ;
                if (order.OrderState.OrderStateName == ORDER_STATUS.OrderStatus[ORDER_STATUS.DELIVERED])
                    throw new Exception("This order has been deliveried");
                order.OrderStateId = request.OrderStateId;
                if (orderState.OrderStateName == ORDER_STATUS.OrderStatus[ORDER_STATUS.DELIVERED])
                {
                    var d = DateTime.Now;
                    order.DateDone = d;
                    if (order.PaymentMethod.PaymentMethodName == "COD")
                    {
                        order.DatePaid = d;
                    }
                }
                _unitOfWork.OrderRepository.Update(order);

                var res = await _unitOfWork.Save();
                if (res < 1)
                    throw new Exception("Failed to update order state");

                await _unitOfWork.Commit();
                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<StatisticViewModel> GetOverviewStatictis()
        {
            try
            {
                var resp = await _unitOfWork.OrderRepository.GetOverviewStatictis();

                return resp;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<PagedResult<OrderViewModel>> GetOrdersByUserId(OrderGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.OrderRepository.GetOrderByUserId(request);
                var resp = new PagedResult<OrderViewModel>()
                {
                    Items = data.Items.Select(x => GetOrderViewModel(x)).ToList(),
                    TotalItem = data.TotalItem,
                };
                foreach (var d in resp.Items)
                {
                    var ois = await _unitOfWork.OrderItemRepository.GetByOrderId(d.OrderId);
                    var address = await _unitOfWork.AddressRepository.GetAddress(d.AddressId);
                    d.OrderItems = new PagedResult<OrderItemViewModel>()
                    {
                        Items = ois.Items.Select(x => GetOrderItemViewModel(x)).ToList(),
                        TotalItem = ois.TotalItem,
                    };
                    d.Address = GetAddressViewModel(address);
                }
                return resp;
            }
            catch
            {
                throw new Exception("Failed to get order list");
            }
        }

        public async Task<YearlyRevenueViewModel> GetYearlyRevenue(int year)
        {
            try
            {
                var res = await _unitOfWork.OrderRepository.GetYearlyRevenue(year);

                return res;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to get statistic");
            }
        }

        public async Task<WeeklyRevenueViewModel> GetWeeklyRevenue(int year, int month, int day)
        {
            try
            {
                var resp = await _unitOfWork.OrderRepository.GetWeeklyRevenue(year, month, day);

                return resp;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to get statistic");
            }
        }
    }
}