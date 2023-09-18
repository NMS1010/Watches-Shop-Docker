using Microsoft.EntityFrameworkCore;
using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Repositories.Common;
using SShop.ViewModels.Catalog.OrderState;
using SShop.ViewModels.Common;
using SShop.ViewModels.System.Addresses;

namespace SShop.Repositories.Catalog.OrderState
{
    public class OrderStateRepository : GenericRepository<Domain.Entities.OrderState>, IOrderStateRepository
    {
        public OrderStateRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PagedResult<Domain.Entities.OrderState>> GetOrderStates(OrderStateGetPagingRequest request)
        {
            try
            {
                var query = Context.OrderStates.AsQueryable();
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    query = query
                        .Where(x => x.OrderStateName.Contains(request.Keyword));
                }
                var data = await query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize).ToListAsync();

                return new PagedResult<Domain.Entities.OrderState>
                {
                    Items = data,
                    TotalItem = query.Count()
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}