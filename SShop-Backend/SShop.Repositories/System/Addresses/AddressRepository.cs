using Mailjet.Client.Resources;
using Microsoft.EntityFrameworkCore;
using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Repositories.Common;
using SShop.ViewModels.Common;
using SShop.ViewModels.System.Addresses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace SShop.Repositories.System.Addresses
{
    public class AddressRepository : GenericRepository<Address>, IAddressRepository
    {
        public AddressRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Address> GetAddress(int addressId)
        {
            return await Context.Addresses
                .Where(x => x.AddressId == addressId)
                .Include(x => x.Province)
                .Include(x => x.District)
                .Include(x => x.Ward)
                .FirstOrDefaultAsync();
        }

        public async Task<PagedResult<Address>> GetAddressByUserId(AddressGetPagingRequest request)
        {
            try
            {
                var query = Context.Addresses
                    .Where(x => x.UserId == request.UserId)
                    .Include(x => x.Province)
                    .Include(x => x.District)
                    .Include(x => x.Ward);
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    query = (Microsoft.EntityFrameworkCore.Query.IIncludableQueryable<Address, Ward>)query
                        .Where(x => x.SpecificAddress.Contains(request.Keyword))
                        .ToList();
                }
                var data = await query
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize).ToListAsync();
                return new PagedResult<Address>() { Items = data, TotalItem = await query.CountAsync() };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task RemoveWDP(int wardId, int districtId, int provinceId)
        {
            var province = await Context.Provinces.FindAsync(provinceId);
            Context.Provinces.Remove(province);

            var district = await Context.Districts.FindAsync(districtId);
            Context.Districts.Remove(district);

            var ward = await Context.Wards.FindAsync(wardId);
            Context.Wards.Remove(ward);
        }
    }
}