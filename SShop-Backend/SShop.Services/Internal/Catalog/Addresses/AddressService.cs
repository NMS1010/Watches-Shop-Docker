using Mailjet.Client.Resources;
using Microsoft.EntityFrameworkCore;
using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Repositories.Common.Interfaces;
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
    public class AddressService : IAddressService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AddressService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        private AddressViewModel GetAddressViewModel(Address address)
        {
            return new AddressViewModel()
            {
                SpecificAddress = address.SpecificAddress,
                DistrictCode = address.District.DistrictCode,
                DistrictId = address.District.DistrictId,
                DistrictName = address.District.DistrictName,
                ProvinceCode = address.Province.ProvinceCode,
                ProvinceId = address.Province.ProvinceId,
                ProvinceName = address.Province.ProvinceName,
                WardCode = address.Ward.WardCode,
                WardId = address.Ward.WardId,
                WardName = address.Ward.WardName,
                FirstName = address.FirstName,
                LastName = address.LastName,
                Phone = address.Phone,
                UserId = address.UserId,
                IsDefault = address.IsDefault,
                AddressId = address.AddressId,
            };
        }

        public async Task<PagedResult<AddressViewModel>> GetAddressByUserId(AddressGetPagingRequest request)
        {
            try
            {
                var res = await _unitOfWork.AddressRepository.GetAddressByUserId(request);

                return new PagedResult<AddressViewModel>
                {
                    Items = res.Items.Select(x => GetAddressViewModel(x)).ToList(),
                    TotalItem = res.TotalItem
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<PagedResult<AddressViewModel>> GetAddresses(AddressGetPagingRequest request)
        {
            try
            {
                var res = await _unitOfWork.AddressRepository.GetAddressByUserId(request);

                return new PagedResult<AddressViewModel>
                {
                    Items = res.Items.Select(x => GetAddressViewModel(x)).ToList(),
                    TotalItem = res.TotalItem
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<AddressViewModel> GetAddress(int addressId)
        {
            try
            {
                var address = await _unitOfWork.AddressRepository.GetAddress(addressId)
                    ?? throw new KeyNotFoundException("Cannot find this address");
                return GetAddressViewModel(address);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> CreateAddress(AddressCreateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var dt = (await _unitOfWork.AddressRepository.GetAll())
                    .Where(x => x.UserId == request.UserId && x.IsDefault == true)
                    .FirstOrDefault();
                if (dt != null && request.IsDefault == true)
                {
                    throw new Exception("One user must have one default address");
                }
                var address = new Address()
                {
                    SpecificAddress = request.SpecificAddress,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Phone = request.Phone,
                    Province = new Province()
                    {
                        ProvinceCode = request.ProvinceCode,
                        ProvinceName = request.ProvinceName,
                    },
                    District = new District()
                    {
                        DistrictCode = request.DistrictCode,
                        DistrictName = request.DistrictName,
                    },
                    Ward = new Ward()
                    {
                        WardCode = request.WardCode,
                        WardName = request.WardName,
                    },
                    UserId = request.UserId,
                    IsDefault = request.IsDefault,
                };
                await _unitOfWork.AddressRepository.Insert(address);
                var count = await _unitOfWork.Save();

                await _unitOfWork.Commit();
                return count > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<bool> UpdateAddress(AddressUpdateRequest request)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var address = await _unitOfWork.AddressRepository.GetAddress(request.AddressId)
                    ?? throw new KeyNotFoundException("Cannot find this address");

                address.Province = new Province()
                {
                    ProvinceCode = request.ProvinceCode,
                    ProvinceName = request.ProvinceName,
                };
                address.District = new District()
                {
                    DistrictCode = request.DistrictCode,
                    DistrictName = request.DistrictName,
                };
                address.Ward = new Ward()
                {
                    WardCode = request.WardCode,
                    WardName = request.WardName,
                };
                address.FirstName = request.FirstName;
                address.LastName = request.LastName;
                address.SpecificAddress = request.SpecificAddress;
                address.Phone = request.Phone;
                if (request.IsDefault)
                {
                    var dt = (await _unitOfWork.AddressRepository.GetAll())
                    .Where(x => x.UserId == request.UserId && x.IsDefault == true)
                    .FirstOrDefault();
                    if (dt != null)
                    {
                        dt.IsDefault = false;
                        _unitOfWork.AddressRepository.Update(dt);
                    }
                }
                else if (address.IsDefault && !request.IsDefault)
                {
                    var dt = (await _unitOfWork.AddressRepository.GetAll())
                    .Where(x => x.UserId == request.UserId && x.IsDefault == true).ToList();
                    if (dt.Count == 1)
                    {
                        throw new Exception("Account must have a default address");
                    }
                }
                address.IsDefault = request.IsDefault;
                _unitOfWork.AddressRepository.Update(address);

                await _unitOfWork.AddressRepository.RemoveWDP(request.WardId, request.DistrictId, request.ProvinceId);

                int res = await _unitOfWork.Save();
                await _unitOfWork.Commit();
                return res > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }

        public async Task<bool> DeleteAddress(int id)
        {
            try
            {
                await _unitOfWork.CreateTransaction();
                var address = await _unitOfWork.AddressRepository.GetById(id)
                    ?? throw new KeyNotFoundException("Cannot find this address");
                if (address.IsDefault)
                {
                    throw new Exception("Cannot remove default address");
                }
                _unitOfWork.AddressRepository.Delete(address);
                var count = await _unitOfWork.Save();
                await _unitOfWork.Commit();

                return count > 0;
            }
            catch (Exception ex)
            {
                await _unitOfWork.Rollback();
                throw ex;
            }
        }
    }
}