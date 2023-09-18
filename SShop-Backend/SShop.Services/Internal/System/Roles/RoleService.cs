using SShop.Domain.EF;
using SShop.ViewModels.Common;
using SShop.ViewModels.System.Roles;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using SShop.Repositories.Common.Interfaces;
using SShop.Repositories.System.Roles;

namespace SShop.Services.Internal.System.Roles
{
    public class RoleService : IRoleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> CreateRole(RoleCreateRequest request)
        {
            try
            {
                return await _unitOfWork.RoleRepository.CreateRole(request);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> DeleteRole(string id)
        {
            try
            {
                return await _unitOfWork.RoleRepository.DeleteRole(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public RoleViewModel GetRoleViewModel(IdentityRole role)
        {
            return new RoleViewModel
            {
                RoleId = role.Id,
                RoleName = role.Name
            };
        }

        public async Task<PagedResult<RoleViewModel>> GetRoles(RoleGetPagingRequest request)
        {
            try
            {
                var data = await _unitOfWork.RoleRepository.GetRoles(request);

                return new PagedResult<RoleViewModel>
                {
                    TotalItem = data.TotalItem,
                    Items = data.Items.Select(x => GetRoleViewModel(x)).ToList()
                };
            }
            catch
            {
                return null;
            }
        }

        public async Task<RoleViewModel> GetRole(string id)
        {
            try
            {
                var role = await _unitOfWork.RoleRepository.GetRole(id);

                return GetRoleViewModel(role);
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> UpdateRole(RoleUpdateRequest request)
        {
            try
            {
                return await _unitOfWork.RoleRepository.UpdateRole(request);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}