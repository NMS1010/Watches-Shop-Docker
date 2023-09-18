using SShop.Repositories.Common.Interfaces;
using SShop.Services.Internal.FileStorage;
using SShop.ViewModels.Catalog.PaymentMethod;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.PaymentMethod
{
    public class PaymentMethodService : IPaymentMethodService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorageService _fileStorage;

        public PaymentMethodService(IUnitOfWork unitOfWork, IFileStorageService fileStorage)
        {
            _unitOfWork = unitOfWork;
            _fileStorage = fileStorage;
        }

        public async Task<bool> CreatePaymentMethod(PaymentMethodCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var paymentMethod = new Domain.Entities.PaymentMethod()
                {
                    PaymentMethodName = request.PaymentMethodName,
                    Image = await _fileStorage.SaveFile(request.PaymentImage),
                };
                await _unitOfWork.PaymentMethodRepository.Insert(paymentMethod);
                var count = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return count > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<bool> DeletePaymentMethod(int id)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var paymentMethod = await _unitOfWork.PaymentMethodRepository.GetById(id)
                    ?? throw new KeyNotFoundException("Cannot find this object");

                _unitOfWork.PaymentMethodRepository.Delete(paymentMethod);
                var count = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                await _fileStorage.DeleteFile(Path.GetFileName(paymentMethod.Image));
                return count > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        private PaymentMethodViewModel GetPaymentMethodViewModel(Domain.Entities.PaymentMethod paymentMethod)
        {
            return new PaymentMethodViewModel()
            {
                PaymentMethodId = paymentMethod.PaymentMethodId,
                PaymentMethodName = paymentMethod.PaymentMethodName,
                Image = paymentMethod.Image,
            };
        }

        public async Task<PagedResult<PaymentMethodViewModel>> GetPaymentMethods(PaymentMethodGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.PaymentMethodRepository.GetPaymentMethods(request);

                return new PagedResult<PaymentMethodViewModel>
                {
                    Items = data.Items.Select(x => GetPaymentMethodViewModel(x)).ToList(),
                    TotalItem = data.TotalItem
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<PaymentMethodViewModel> GetPaymentMethod(int paymentMethodId)
        {
            try
            {
                var paymentMethod = await _unitOfWork.PaymentMethodRepository.GetById(paymentMethodId)
                    ?? throw new KeyNotFoundException("Cannot find this object");
                return GetPaymentMethodViewModel(paymentMethod);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdatePaymentMethod(PaymentMethodUpdateRequest request)
        {
            try
            {
                var paymentMethod = await _unitOfWork.PaymentMethodRepository.GetById(request.PaymentMethodId)
                    ?? throw new KeyNotFoundException("Cannot find this object");
                paymentMethod.PaymentMethodName = request.PaymentMethodName;
                if (request.PaymentImage != null)
                {
                    await _fileStorage.DeleteFile(Path.GetFileName(paymentMethod.Image));
                    paymentMethod.Image = await _fileStorage.SaveFile(request.PaymentImage);
                }
                _unitOfWork.PaymentMethodRepository.Update(paymentMethod);
                var count = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return count > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }
    }
}