using SShop.Domain.Entities;
using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Interfaces;
using SShop.ViewModels.Catalog.OrderState;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.OrderState
{
    public interface IOrderStateRepository : IGenericRepository<Domain.Entities.OrderState>
    {
        Task<PagedResult<Domain.Entities.OrderState>> GetOrderStates(OrderStateGetPagingRequest request);
    }
}