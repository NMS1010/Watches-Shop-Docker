using SShop.Domain.Entities;
using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Interfaces;
using SShop.ViewModels.Common;
using SShop.ViewModels.System.Addresses;

namespace SShop.Repositories.System.Addresses
{
    public interface IAddressRepository : IGenericRepository<Address>
    {
        Task<PagedResult<Address>> GetAddressByUserId(AddressGetPagingRequest request);

        Task<Address> GetAddress(int addressId);

        Task RemoveWDP(int wardId, int districtId, int provinceId);
    }
}