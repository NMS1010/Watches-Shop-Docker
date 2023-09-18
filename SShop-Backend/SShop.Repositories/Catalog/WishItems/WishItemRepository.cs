using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Utilities.Constants.Products;
using SShop.ViewModels.Catalog.Wishtems;
using SShop.ViewModels.Common;
using Microsoft.EntityFrameworkCore;
using SShop.Repositories.Common;

namespace SShop.Repositories.Catalog.WishItems
{
    public class WishItemRepository : GenericRepository<WishItem>, IWishItemRepository
    {
        public WishItemRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<WishItem> GetWishItemById(int wishItemId)
        {
            try
            {
                var wishItem = await Context.WishItems
                    .Include(x => x.User)
                    .Include(x => x.Product)
                    .ThenInclude(x => x.ProductImages)
                    .Where(x => x.WishItemId == wishItemId)
                    .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Cannot find wishitem");
                return wishItem;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<PagedResult<WishItem>> GetWishByUserId(WishItemGetPagingRequest request)
        {
            try
            {
                var query = Context.WishItems
                    .Where(x => x.UserId == request.UserId)
                    .Include(x => x.User)
                    .Include(x => x.Product)
                    .ThenInclude(x => x.ProductImages);

                var data = await query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync();

                return new PagedResult<WishItem>
                {
                    TotalItem = await query.CountAsync(),
                    Items = data
                };
            }
            catch
            {
                throw new Exception("Cannot get user's wishlist");
            }
        }

        public async Task<WishItem> GetWishItem(string userId, int productId)
        {
            try
            {
                var wishItem = await Context.WishItems
                    .Where(x => x.ProductId == productId && x.UserId == userId)
                    .FirstOrDefaultAsync();

                return wishItem;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}