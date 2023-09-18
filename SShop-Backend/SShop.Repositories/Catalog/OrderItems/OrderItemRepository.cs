using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.ViewModels.Catalog.OrderItems;
using SShop.ViewModels.Common;
using Microsoft.EntityFrameworkCore;
using SShop.Repositories.Common;

namespace SShop.Repositories.Catalog.OrderItems
{
    public class OrderItemRepository : GenericRepository<OrderItem>, IOrderItemRepository
    {
        public OrderItemRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<OrderItem> GetById(int orderItemId)
        {
            try
            {
                var orderItem = await Context.OrderItems
                    .Where(x => x.OrderItemId == orderItemId)
                    .Include(x => x.Order)
                    .ThenInclude(x => x.OrderState)
                    .Include(x => x.Product)
                    .ThenInclude(x => x.ProductImages)
                    .Include(x => x.Product)
                    .ThenInclude(x => x.Category)
                    .Include(x => x.Product)
                    .ThenInclude(x => x.Brand)
                    .FirstOrDefaultAsync()
                    ?? throw new KeyNotFoundException("Cannot get order item");
                return orderItem;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<PagedResult<OrderItem>> GetByOrderId(int orderId)
        {
            try
            {
                var query = await Context.OrderItems
                    .Where(x => x.OrderId == orderId)
                    .Include(x => x.Product)
                    .ThenInclude(x => x.ProductImages)
                    .Include(x => x.Product)
                    .ThenInclude(x => x.Category)
                    .Include(x => x.Product)
                    .ThenInclude(x => x.Brand)
                    .ToListAsync();
                var data = query.ToList();

                return new PagedResult<OrderItem>
                {
                    TotalItem = query.Count,
                    Items = data
                };
            }
            catch
            {
                throw new Exception("Cannot get this order items");
            }
        }
    }
}