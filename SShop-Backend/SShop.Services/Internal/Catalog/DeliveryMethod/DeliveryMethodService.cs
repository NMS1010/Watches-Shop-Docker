using Microsoft.EntityFrameworkCore;
using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Repositories.Catalog.DeliveryMethod;
using SShop.Repositories.Common.Interfaces;
using SShop.Services.Internal.FileStorage;
using SShop.ViewModels.Catalog.DeliveryMethod;
using SShop.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SShop.Repositories.Catalog.DeliveryMethod
{
    public class DeliveryMethodService : IDeliveryMethodService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorageService _fileStorage;

        public DeliveryMethodService(IUnitOfWork unitOfWork, IFileStorageService fileStorage)
        {
            _unitOfWork = unitOfWork;
            _fileStorage = fileStorage;
        }

        public async Task<bool> CreateDeliveryMethod(DeliveryMethodCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var deliveryMethod = new Domain.Entities.DeliveryMethod()
                {
                    DeliveryMethodName = request.DeliveryMethodName,
                    Price = request.DeliveryMethodPrice,
                    Image = await _fileStorage.SaveFile(request.DeliveryImage),
                };
                await _unitOfWork.DeliveryMethodRepository.Insert(deliveryMethod);
                var count = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return count > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> DeleteDeliveryMethod(int id)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var deliveryMethod = await _unitOfWork.DeliveryMethodRepository.GetById(id)
                    ?? throw new KeyNotFoundException("Cannot find this object");
                _unitOfWork.DeliveryMethodRepository.Delete(deliveryMethod);
                int count = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                await _fileStorage.DeleteFile(Path.GetFileName(deliveryMethod.Image));
                return count > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        private DeliveryMethodViewModel GetDeliveryMethodViewModel(Domain.Entities.DeliveryMethod deliveryMethod)
        {
            return new DeliveryMethodViewModel()
            {
                DeliveryMethodId = deliveryMethod.DeliveryMethodId,
                DeliveryMethodName = deliveryMethod.DeliveryMethodName,
                DeliveryMethodPrice = deliveryMethod.Price,
                Image = deliveryMethod.Image,
            };
        }

        public async Task<PagedResult<DeliveryMethodViewModel>> GetDeliveryMethods(DeliveryMethodGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.DeliveryMethodRepository.GetDeliveryMethods(request);

                return new PagedResult<DeliveryMethodViewModel>
                {
                    Items = data.Items.Select(x => GetDeliveryMethodViewModel(x)).ToList(),
                    TotalItem = data.TotalItem
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<DeliveryMethodViewModel> GetDeliveryMethod(int deliveryMethodId)
        {
            try
            {
                var deliveryMethod = await _unitOfWork.DeliveryMethodRepository.GetById(deliveryMethodId)
                    ?? throw new KeyNotFoundException("Cannot find this object");

                return GetDeliveryMethodViewModel(deliveryMethod);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateDeliveryMethod(DeliveryMethodUpdateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var deliveryMethod = await _unitOfWork.DeliveryMethodRepository.GetById(request.DeliveryMethodId)
                    ?? throw new KeyNotFoundException("Cannot find this object");
                deliveryMethod.DeliveryMethodName = request.DeliveryMethodName;
                deliveryMethod.Price = request.DeliveryMethodPrice;
                var imgRemove = deliveryMethod.Image;
                if (request.DeliveryImage != null)
                {
                    deliveryMethod.Image = await _fileStorage.SaveFile(request.DeliveryImage);
                }
                _unitOfWork.DeliveryMethodRepository.Update(deliveryMethod);
                var count = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                await _fileStorage.DeleteFile(Path.GetFileName(imgRemove));
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