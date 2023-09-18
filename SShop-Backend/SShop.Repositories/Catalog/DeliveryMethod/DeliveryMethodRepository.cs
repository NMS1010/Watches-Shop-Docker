using Microsoft.EntityFrameworkCore;
using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Repositories.Catalog.DeliveryMethod;
using SShop.Repositories.Common;
using SShop.ViewModels.Catalog.DeliveryMethod;
using SShop.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SShop.Repositories.Catalog.DeliveryMethod
{
    public class DeliveryMethodRepository : GenericRepository<Domain.Entities.DeliveryMethod>, IDeliveryMethodRepository
    {
        public DeliveryMethodRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PagedResult<Domain.Entities.DeliveryMethod>> GetDeliveryMethods(DeliveryMethodGetPagingRequest request)
        {
            try
            {
                var query = Context.DeliveryMethods.AsQueryable();
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    query = query
                        .Where(x => x.DeliveryMethodName.Contains(request.Keyword));
                }
                var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize).ToListAsync();

                return new PagedResult<Domain.Entities.DeliveryMethod>
                {
                    Items = data,
                    TotalItem = query.Count()
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot get deliveryMethods");
            }
        }
    }
}