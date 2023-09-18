using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;
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
using SShop.Repositories.Common.Interfaces;
using SShop.Repositories.System.Addresses;
using SShop.Repositories.System.Roles;

namespace SShop.Domain.EF
{
    public class UnitOfWork : IUnitOfWork
    {
        private bool _disposed;
        private string _errorMessage = string.Empty;
        private IDbContextTransaction _objTran;
        public IAddressRepository AddressRepository { get; set; }
        public IBrandRepository BrandRepository { get; set; }
        public ICartItemRepository CartItemRepository { get; set; }
        public ICategoryRepository CategoryRepository { get; set; }
        public IDeliveryMethodRepository DeliveryMethodRepository { get; set; }
        public IDiscountRepository DiscountRepository { get; set; }
        public IOrderItemRepository OrderItemRepository { get; set; }
        public IOrderRepository OrderRepository { get; set; }
        public IOrderStateRepository OrderStateRepository { get; set; }
        public IPaymentMethodRepository PaymentMethodRepository { get; set; }
        public IProductImageRepository ProductImageRepository { get; set; }
        public IProductRepository ProductRepository { get; set; }
        public IReviewItemRepository ReviewItemRepository { get; set; }
        public IRoleRepository RoleRepository { get; set; }
        public IWishItemRepository WishItemRepository { get; set; }
        public AppDbContext Context { get; set; }

        public UnitOfWork(AppDbContext context, RoleManager<IdentityRole> roleManager)
        {
            AddressRepository = new AddressRepository(context);
            BrandRepository = new BrandRepository(context);
            CartItemRepository = new CartItemRepository(context);
            CategoryRepository = new CategoryRepository(context);
            DeliveryMethodRepository = new DeliveryMethodRepository(context);
            DiscountRepository = new DiscountRepository(context);
            OrderItemRepository = new OrderItemRepository(context);
            OrderRepository = new OrderRepository(context);
            OrderStateRepository = new OrderStateRepository(context);
            PaymentMethodRepository = new PaymentMethodRepository(context);
            ProductImageRepository = new ProductImageRepository(context);
            ProductRepository = new ProductRepository(context);
            ReviewItemRepository = new ReviewItemRepository(context);
            RoleRepository = new RoleRepository(context, roleManager);
            WishItemRepository = new WishItemRepository(context);
            Context = context;
        }

        public async Task Commit()
        {
            await _objTran.CommitAsync();
        }

        public async Task CreateTransaction()
        {
            _objTran = await Context.Database.BeginTransactionAsync();
        }

        public async Task Rollback()
        {
            await _objTran.RollbackAsync();
            await _objTran.DisposeAsync();
        }

        public async Task<int> Save()
        {
            try
            {
                return await Context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error while executing this operation");
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
                if (disposing)
                    Context.Dispose();
            _disposed = true;
        }
    }
}