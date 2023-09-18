using SShop.Repositories.Common.Interfaces;
using SShop.ViewModels.Catalog.DeliveryMethod;
using SShop.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SShop.Repositories.Catalog.DeliveryMethod
{
    public interface IDeliveryMethodService
    {
        Task<bool> CreateDeliveryMethod(DeliveryMethodCreateRequest request);

        Task<bool> UpdateDeliveryMethod(DeliveryMethodUpdateRequest request);

        Task<bool> DeleteDeliveryMethod(int id);

        Task<DeliveryMethodViewModel> GetDeliveryMethod(int id);

        Task<PagedResult<DeliveryMethodViewModel>> GetDeliveryMethods(DeliveryMethodGetPagingRequest request);
    }
}