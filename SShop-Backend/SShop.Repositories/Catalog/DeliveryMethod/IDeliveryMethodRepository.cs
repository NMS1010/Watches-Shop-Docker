using SShop.Domain.Entities;
using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Interfaces;
using SShop.ViewModels.Catalog.DeliveryMethod;
using SShop.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SShop.Repositories.Catalog.DeliveryMethod
{
    public interface IDeliveryMethodRepository : IGenericRepository<Domain.Entities.DeliveryMethod>
    {
        Task<PagedResult<Domain.Entities.DeliveryMethod>> GetDeliveryMethods(DeliveryMethodGetPagingRequest request);
    }
}