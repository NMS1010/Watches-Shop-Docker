using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Utilities.Constants.Discounts;
using SShop.ViewModels.Catalog.Discounts;
using SShop.ViewModels.Common;
using Microsoft.EntityFrameworkCore;
using SShop.Repositories.Common;

namespace SShop.Repositories.Catalog.Discounts
{
    public class DiscountRepository : GenericRepository<Discount>, IDiscountRepository
    {
        private readonly AppDbContext _context;

        public DiscountRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Discount> GetDiscountByCode(string discountCode)
        {
            try
            {
                var discount = await _context.Discounts
                .Where(p => p.DiscountCode == discountCode)
                .FirstOrDefaultAsync();

                return discount;
            }
            catch
            {
                throw new Exception("Cannot find discount by code");
            }
        }

        public async Task<PagedResult<Discount>> GetDiscounts(DiscountGetPagingRequest request)
        {
            try
            {
                var query = await _context.Discounts
                .ToListAsync();
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    query = query
                        .Where(x => x.DiscountCode.Contains(request.Keyword))
                        .ToList();
                }
                var data = query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                return new PagedResult<Discount>
                {
                    TotalItem = query.Count,
                    Items = data
                };
            }
            catch
            {
                throw new Exception("Cannot get discount list");
            }
        }
    }
}