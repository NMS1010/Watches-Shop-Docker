using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Interfaces;
using SShop.ViewModels.Catalog.OrderState;
using SShop.ViewModels.Catalog.PaymentMethod;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.PaymentMethod
{
    public interface IPaymentMethodRepository : IGenericRepository<Domain.Entities.PaymentMethod>
    {
        Task<PagedResult<Domain.Entities.PaymentMethod>> GetPaymentMethods(PaymentMethodGetPagingRequest request);
    }
}