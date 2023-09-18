using SShop.Domain.Entities;
using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Interfaces;
using SShop.ViewModels.Common;
using SShop.ViewModels.System.Addresses;

namespace SShop.Repositories.System.Addresses
{
    public interface IAddressService
    {
        Task<bool> CreateAddress(AddressCreateRequest request);

        Task<bool> UpdateAddress(AddressUpdateRequest request);

        Task<bool> DeleteAddress(int id);

        Task<PagedResult<AddressViewModel>> GetAddresses(AddressGetPagingRequest request);

        Task<AddressViewModel> GetAddress(int id);

        Task<PagedResult<AddressViewModel>> GetAddressByUserId(AddressGetPagingRequest request);
    }
}