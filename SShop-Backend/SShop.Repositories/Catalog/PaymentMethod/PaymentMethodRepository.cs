using Microsoft.EntityFrameworkCore;
using SShop.Domain.EF;
using SShop.Repositories.Common;
using SShop.ViewModels.Catalog.PaymentMethod;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.PaymentMethod
{
    public class PaymentMethodRepository : GenericRepository<Domain.Entities.PaymentMethod>, IPaymentMethodRepository
    {
        public PaymentMethodRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PagedResult<Domain.Entities.PaymentMethod>> GetPaymentMethods(PaymentMethodGetPagingRequest request)
        {
            try
            {
                var query = Context.PaymentMethods.AsQueryable();
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    query = query
                        .Where(x => x.PaymentMethodName.Contains(request.Keyword));
                }
                var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize).ToListAsync();

                return new PagedResult<Domain.Entities.PaymentMethod>
                {
                    Items = data,
                    TotalItem = await query.CountAsync()
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot get payment method list");
            }
        }
    }
}