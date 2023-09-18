using SShop.Repositories.Common.Interfaces;
using SShop.ViewModels.Catalog.OrderState;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.OrderState
{
    public class OrderStateService : IOrderStateService
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderStateService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> CreateOrderState(OrderStateCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var orderState = new Domain.Entities.OrderState()
                {
                    OrderStateName = request.OrderStateName,
                };
                await _unitOfWork.OrderStateRepository.Insert(orderState);
                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();

                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();

                throw ex;
            }
        }

        public async Task<bool> DeleteOrderState(int id)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var orderState = await _unitOfWork.OrderStateRepository.GetById(id)
                    ?? throw new KeyNotFoundException("Cannot get orderstate by this id");
                _unitOfWork.OrderStateRepository.Delete(orderState);
                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();

                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();

                throw ex;
            }
        }

        private OrderStateViewModel GetOrderStateViewModel(Domain.Entities.OrderState orderState)
        {
            return new OrderStateViewModel()
            {
                OrderStateId = orderState.OrderStateId,
                OrderStateName = orderState.OrderStateName,
            };
        }

        public async Task<PagedResult<OrderStateViewModel>> GetOrderStates(OrderStateGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.OrderStateRepository.GetOrderStates(request);

                return new PagedResult<OrderStateViewModel>
                {
                    Items = data.Items.Select(x => GetOrderStateViewModel(x)).ToList(),
                    TotalItem = data.TotalItem
                };
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<OrderStateViewModel> GetOrderState(int orderStateId)
        {
            try
            {
                var orderState = await _unitOfWork.OrderStateRepository.GetById(orderStateId)
                    ?? throw new KeyNotFoundException("Cannot get orderstate by this id");
                return GetOrderStateViewModel(orderState);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateOrderState(OrderStateUpdateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var orderState = await _unitOfWork.OrderStateRepository.GetById(request.OrderStateId)
                    ?? throw new KeyNotFoundException("Cannot get orderstate by this id");
                orderState.OrderStateName = request.OrderStateName;
                _unitOfWork.OrderStateRepository.Update(orderState);
                var res = await _unitOfWork.Save();
                await _unitOfWork.Commit();

                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }
    }
}