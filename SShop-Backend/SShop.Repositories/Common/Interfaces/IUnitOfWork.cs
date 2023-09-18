using SShop.Domain.EF;
using SShop.Repositories.Catalog.Brands;
using SShop.Repositories.Catalog.CartItems;
using SShop.Repositories.Catalog.Categories;
using SShop.Repositories.Catalog.DeliveryMethod;
using SShop.Repositories.Catalog.Discounts;
using SShop.Repositories.Catalog.OrderItems;
using SShop.Repositories.Catalog.Orders;
using SShop.Repositories.Catalog.OrderState;
using SShop.Repositories.Catalog.PaymentMethod;
using SShop.Repositories.Catalog.ProductImages;
using SShop.Repositories.Catalog.Products;
using SShop.Repositories.Catalog.ReviewItems;
using SShop.Repositories.Catalog.WishItems;
using SShop.Repositories.System.Addresses;
using SShop.Repositories.System.Roles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SShop.Repositories.Common.Interfaces
{
    public interface IUnitOfWork
    {
        IAddressRepository AddressRepository { get; set; }
        IBrandRepository BrandRepository { get; set; }
        ICartItemRepository CartItemRepository { get; set; }
        ICategoryRepository CategoryRepository { get; set; }
        IDeliveryMethodRepository DeliveryMethodRepository { get; set; }
        IDiscountRepository DiscountRepository { get; set; }
        IOrderItemRepository OrderItemRepository { get; set; }
        IOrderRepository OrderRepository { get; set; }
        IOrderStateRepository OrderStateRepository { get; set; }
        IPaymentMethodRepository PaymentMethodRepository { get; set; }
        IProductImageRepository ProductImageRepository { get; set; }
        IProductRepository ProductRepository { get; set; }
        IReviewItemRepository ReviewItemRepository { get; set; }
        IRoleRepository RoleRepository { get; set; }
        IWishItemRepository WishItemRepository { get; set; }
        AppDbContext Context { get; set; }

        Task CreateTransaction();

        Task Commit();

        Task Rollback();

        Task<int> Save();
    }
}