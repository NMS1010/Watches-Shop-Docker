using SShop.ViewModels.Catalog.PaymentMethod;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.PaymentMethod
{
    public interface IPaymentMethodService
    {
        Task<bool> CreatePaymentMethod(PaymentMethodCreateRequest request);

        Task<bool> UpdatePaymentMethod(PaymentMethodUpdateRequest request);

        Task<bool> DeletePaymentMethod(int id);

        Task<PaymentMethodViewModel> GetPaymentMethod(int id);

        Task<PagedResult<PaymentMethodViewModel>> GetPaymentMethods(PaymentMethodGetPagingRequest request);
    }
}