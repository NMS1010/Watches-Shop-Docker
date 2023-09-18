using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.ViewModels.Catalog.ReviewItems;
using SShop.ViewModels.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using SShop.Utilities.Constants.Orders;
using SShop.Repositories.Common;

namespace SShop.Repositories.Catalog.ReviewItems
{
    public class ReviewItemRepository : GenericRepository<ReviewItem>, IReviewItemRepository
    {
        public ReviewItemRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PagedResult<ReviewItem>> GetReviews(ReviewItemGetPagingRequest request)
        {
            try
            {
                var query = Context.ReviewItems
                    .Include(x => x.OrderItem)
                    .ThenInclude(x => x.Order)
                    .ThenInclude(x => x.User)
                    .Include(x => x.OrderItem)
                    .ThenInclude(x => x.Product)
                    .ThenInclude(x => x.ProductImages);

                IQueryable<ReviewItem> temp = null;
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    temp = query
                        .Where(x => x.Content.Contains(request.Keyword));
                }
                var data = await (temp ?? query)
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize).ToListAsync();

                return new PagedResult<ReviewItem>
                {
                    TotalItem = await query.CountAsync(),
                    Items = data
                };
            }
            catch
            {
                throw new Exception("Cannot get review list");
            }
        }

        public async Task<ReviewItem> GetReviewItem(int reviewItemId)
        {
            try
            {
                var review = await Context.ReviewItems
                    .Where(x => x.ReviewItemId == reviewItemId)
                    .Include(x => x.OrderItem)
                    .ThenInclude(x => x.Order)
                    .ThenInclude(x => x.User)
                    .Include(x => x.OrderItem)
                    .ThenInclude(x => x.Product)
                    .ThenInclude(x => x.ProductImages)
                    .FirstOrDefaultAsync()
                    ?? throw new KeyNotFoundException("Cannot get reviewitem");
                return review;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<PagedResult<ReviewItem>> GetReviewsByUser(ReviewItemGetPagingRequest request)
        {
            try
            {
                var query = Context.ReviewItems
                    .Include(x => x.OrderItem)
                    .ThenInclude(x => x.Order)
                    .ThenInclude(x => x.User)
                    .Include(x => x.OrderItem)
                    .ThenInclude(x => x.Product)
                    .ThenInclude(x => x.ProductImages)
                    .Where(x => x.OrderItem.Order.UserId == request.UserId);
                var data = await query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize).ToListAsync();

                return new PagedResult<ReviewItem>
                {
                    TotalItem = await query.CountAsync(),
                    Items = data
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot get user's reviews");
            }
        }

        public async Task<PagedResult<ReviewItem>> GetReviewsByProduct(ReviewItemGetPagingRequest request)
        {
            try
            {
                var query = Context.ReviewItems
                    .Include(x => x.OrderItem)
                    .ThenInclude(x => x.Order)
                    .ThenInclude(x => x.User)
                    .Include(x => x.OrderItem)
                    .ThenInclude(x => x.Product)
                    .ThenInclude(x => x.ProductImages)
                    .Where(x => x.OrderItem.ProductId == request.ProductId);
                var data = await query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize).ToListAsync();

                return new PagedResult<ReviewItem>
                {
                    TotalItem = await query.CountAsync(),
                    Items = data
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot get product's reviews");
            }
        }

        public async Task<ReviewItem> GetReviewsByOrderItem(int orderItemId)
        {
            try
            {
                var ri = await Context.ReviewItems
                    .Include(x => x.OrderItem)
                    .ThenInclude(x => x.Order)
                    .ThenInclude(x => x.User)
                    .Include(x => x.OrderItem)
                    .ThenInclude(x => x.Product)
                    .ThenInclude(x => x.ProductImages)
                    .Where(x => x.OrderItem.OrderItemId == orderItemId)
                    .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Cannot find review for this order item");
                return ri;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}