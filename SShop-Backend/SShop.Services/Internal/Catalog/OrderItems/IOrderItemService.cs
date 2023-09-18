using SShop.ViewModels.Catalog.OrderItems;
using SShop.ViewModels.Common;
using SShop.Repositories.Common.Interfaces;
using System.Threading.Tasks;

namespace SShop.Repositories.Catalog.OrderItems
{
    public interface IOrderItemService : IModifyEntity<OrderItemCreateRequest, OrderItemUpdateRequest, int>,
        IRetrieveEntity<OrderItemViewModel, OrderItemGetPagingRequest, int>
    {
        Task<PagedResult<OrderItemViewModel>> RetrieveByOrderId(int orderId);
    }
}