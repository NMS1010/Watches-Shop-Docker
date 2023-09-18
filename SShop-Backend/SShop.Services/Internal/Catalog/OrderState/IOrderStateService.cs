using SShop.Repositories.Common.Interfaces;
using SShop.ViewModels.Catalog.OrderState;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.OrderState
{
    public interface IOrderStateService
    {
        Task<bool> CreateOrderState(OrderStateCreateRequest request);

        Task<bool> UpdateOrderState(OrderStateUpdateRequest request);

        Task<bool> DeleteOrderState(int id);

        Task<OrderStateViewModel> GetOrderState(int id);

        Task<PagedResult<OrderStateViewModel>> GetOrderStates(OrderStateGetPagingRequest request);
    }
}