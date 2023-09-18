using SShop.ViewModels.Catalog.OrderItems;
using SShop.ViewModels.Common;
using SShop.Repositories.Common.Interfaces;
using System.Threading.Tasks;
using SShop.Utilities.Interfaces;
using SShop.Domain.Entities;

namespace SShop.Repositories.Catalog.OrderItems
{
    public interface IOrderItemRepository : IGenericRepository<OrderItem>
    {
        Task<PagedResult<OrderItem>> GetByOrderId(int orderId);

        Task<OrderItem> GetById(int orderItemId);
    }
}