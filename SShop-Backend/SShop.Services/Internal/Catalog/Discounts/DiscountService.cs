using SShop.Domain.Entities;
using SShop.Repositories.Catalog.Discounts;
using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Constants.Discounts;
using SShop.ViewModels.Catalog.Discounts;
using SShop.ViewModels.Common;

namespace SShop.Services.Internal.Catalog.Discounts
{
    public class DiscountService : IDiscountService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DiscountService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<string> ApplyDiscount(string discountCode)
        {
            try
            {
                var discount = await _unitOfWork.DiscountRepository.GetDiscountByCode(discountCode);

                if (discount == null)
                    return "error";
                if (discount.Quantity <= 0)
                    return "out";
                if (discount.StartDate > DateTime.Now || discount.EndDate < DateTime.Now)
                    return "expired";
                if (discount.Status == DISCOUNT_STATUS.IN_ACTIVE)
                    return "suspended";
                await _unitOfWork.CreateTransaction();
                discount.Quantity -= 1;
                if (discount.Quantity <= 0)
                {
                    discount.Status = DISCOUNT_STATUS.IN_ACTIVE;
                    discount.Quantity = 0;
                }
                _unitOfWork.DiscountRepository.Update(discount);
                await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return Newtonsoft.Json.JsonConvert.SerializeObject(discount);
            }
            catch
            {
                await _unitOfWork.Rollback();
                throw new Exception("Cannot apply this discount");
            }
        }

        public async Task<bool> CreateDiscount(DiscountCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var discount = new Discount()
                {
                    DiscountCode = request.DiscountCode,
                    DiscountValue = request.DiscountValue,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    Status = request.Status,
                    Quantity = request.Quantity,
                };

                await _unitOfWork.DiscountRepository.Insert(discount);

                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return res > 0;
            }
            catch
            {
                await _unitOfWork.Rollback();
                throw new Exception("Cannot create this discount");
            }
        }

        public async Task<bool> DeleteDiscount(int discountId)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var discount = await _unitOfWork.DiscountRepository.GetById(discountId)
                    ?? throw new KeyNotFoundException("Cannot find this discount");

                _unitOfWork.DiscountRepository.Delete(discount);
                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return res > 0;
            }
            catch
            {
                await _unitOfWork.Rollback();
                throw new Exception("Cannot delete this discount");
            }
        }

        public DiscountViewModel GetDiscountViewModel(Discount discount)
        {
            return new DiscountViewModel()
            {
                DiscountId = discount.DiscountId,
                DiscountCode = discount.DiscountCode,
                DiscountValue = discount.DiscountValue,
                StartDate = discount.StartDate,
                EndDate = discount.EndDate,
                Status = discount.Status,
                Quantity = discount.Quantity,
                StatusCode = DISCOUNT_STATUS.DiscountStatus[discount.Status]
            };
        }

        public async Task<PagedResult<DiscountViewModel>> GetDiscounts(DiscountGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.DiscountRepository.GetDiscounts(request);

                return new PagedResult<DiscountViewModel>
                {
                    TotalItem = data.TotalItem,
                    Items = data.Items.Select(x => GetDiscountViewModel(x)).ToList()
                };
            }
            catch
            {
                throw new Exception("Cannot get discounts list");
            }
        }

        public async Task<DiscountViewModel> GetDiscount(int discountId)
        {
            try
            {
                var discount = await _unitOfWork.DiscountRepository.GetById(discountId)
                    ?? throw new KeyNotFoundException("Cannot find this discount");
                return GetDiscountViewModel(discount);
            }
            catch
            {
                throw new Exception("Cannot get this discount");
            }
        }

        public async Task<bool> UpdateDiscount(DiscountUpdateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var discount = await _unitOfWork.DiscountRepository.GetById(request.DiscountId)
                    ?? throw new KeyNotFoundException("Cannot find this discount");
                discount.DiscountCode = request.DiscountCode;
                discount.DiscountValue = request.DiscountValue;
                discount.StartDate = request.StartDate;
                discount.EndDate = request.EndDate;
                discount.Quantity = request.Quantity;
                if (request.Status == DISCOUNT_STATUS.IN_ACTIVE || request.Status == DISCOUNT_STATUS.EXPIRED)
                {
                    discount.Quantity = 0;
                }

                if (request.Quantity == 0)
                    discount.Status = DISCOUNT_STATUS.IN_ACTIVE;
                else
                    discount.Status = request.Status;

                _unitOfWork.DiscountRepository.Update(discount);
                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return res > 0;
            }
            catch
            {
                await _unitOfWork.Rollback();
                throw new Exception("Cannot update this discount");
            }
        }
    }
}