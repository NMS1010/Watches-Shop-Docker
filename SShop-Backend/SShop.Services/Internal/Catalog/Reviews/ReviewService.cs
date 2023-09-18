using SShop.Domain.Entities;
using SShop.ViewModels.Catalog.ReviewItems;
using SShop.ViewModels.Common;
using SShop.Utilities.Constants.Orders;
using SShop.Repositories.Catalog.ReviewItems;
using SShop.Repositories.Common.Interfaces;

namespace SShop.Services.Internal.Catalog.Reviews
{
    public class ReviewService : IReviewService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ReviewService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> CreateReviewItem(ReviewItemCreateRequest request)
        {
            try
            {
                var oi = await _unitOfWork.OrderItemRepository.GetById(request.OrderItemId)
                    ?? throw new KeyNotFoundException("Cannot find this order item");
                if (oi.Order.OrderState.OrderStateName != ORDER_STATUS.OrderStatus[ORDER_STATUS.DELIVERED])
                {
                    throw new AccessViolationException("Order has not been deliveried");
                }
                if (oi.ReviewItemId.HasValue)
                    throw new AccessViolationException("You has been rating for this product");
                await _unitOfWork.CreateTransaction();
                var review = new ReviewItem()
                {
                    Content = request.Content,
                    Rating = request.Rating,
                    Status = 1,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                };
                await _unitOfWork.ReviewItemRepository.Insert(review);
                var res = await _unitOfWork.Save();
                if (res <= 0)
                {
                    throw new Exception("Cannot create review");
                }
                oi.ReviewItemId = review.ReviewItemId;
                _unitOfWork.OrderItemRepository.Update(oi);
                res = await _unitOfWork.Save();
                if (res <= 0)
                {
                    throw new Exception("Cannot create review");
                }
                await _unitOfWork.Commit();
                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public ReviewItemViewModel GetReviewItemViewModel(ReviewItem review)
        {
            return new ReviewItemViewModel()
            {
                ReviewItemId = review.ReviewItemId,
                ProductName = review.OrderItem.Product.Name,
                ProductImage = review.OrderItem.Product.ProductImages
                        .Where(c => c.IsDefault == true && c.ProductId == review.OrderItem.ProductId)
                        .FirstOrDefault()?.Path,
                Content = review.Content,
                Rating = review.Rating,
                DateCreated = review.DateCreated,
                DateUpdated = review.DateUpdated,
                Status = review.Status,
                UserName = review.OrderItem.Order.User.UserName,
                UserAvatar = review.OrderItem.Order.User.Avatar,
                State = review.Status == 1 ? "Active" : "Inactive"
            };
        }

        public async Task<PagedResult<ReviewItemViewModel>> GetReviewItems(ReviewItemGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.ReviewItemRepository.GetReviews(request);

                return new PagedResult<ReviewItemViewModel>
                {
                    TotalItem = data.TotalItem,
                    Items = data.Items.Select(x => GetReviewItemViewModel(x)).ToList()
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ReviewItemViewModel> GetReviewItem(int reviewItemId)
        {
            try
            {
                var review = await _unitOfWork.ReviewItemRepository.GetReviewItem(reviewItemId);
                return GetReviewItemViewModel(review);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateReviewItem(ReviewItemUpdateRequest request)
        {
            try
            {
                var review = await _unitOfWork.ReviewItemRepository.GetReviewItem(request.ReviewItemId);

                await _unitOfWork.CreateTransaction();
                review.Content = request.Content;
                review.Rating = request.Rating;
                review.DateUpdated = DateTime.Now;
                review.Status = request.Status;
                _unitOfWork.ReviewItemRepository.Update(review);
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

        public async Task<bool> ChangeReviewStatus(int reviewItemId)
        {
            try
            {
                var reviewItem = await _unitOfWork.ReviewItemRepository.GetReviewItem(reviewItemId);
                await _unitOfWork.CreateTransaction();
                reviewItem.Status = reviewItem.Status == 1 ? 0 : 1;
                _unitOfWork.ReviewItemRepository.Update(reviewItem);
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

        public async Task<PagedResult<ReviewItemViewModel>> GetReviewsByUser(ReviewItemGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.ReviewItemRepository.GetReviewsByUser(request);

                return new PagedResult<ReviewItemViewModel>
                {
                    TotalItem = data.TotalItem,
                    Items = data.Items.Select(x => GetReviewItemViewModel(x)).ToList()
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<PagedResult<ReviewItemViewModel>> GetReviewsByProduct(ReviewItemGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.ReviewItemRepository.GetReviewsByProduct(request);

                return new PagedResult<ReviewItemViewModel>
                {
                    TotalItem = data.TotalItem,
                    Items = data.Items.Select(x => GetReviewItemViewModel(x)).ToList()
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ReviewItemViewModel> GetReviewsByOrderItem(int orderItemId)
        {
            try
            {
                var ri = await _unitOfWork.ReviewItemRepository.GetReviewsByOrderItem(orderItemId);
                return GetReviewItemViewModel(ri);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}