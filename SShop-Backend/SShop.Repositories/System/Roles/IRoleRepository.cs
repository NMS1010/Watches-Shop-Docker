using SShop.ViewModels.System.Roles;
using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Interfaces;
using SShop.ViewModels.Common;
using Microsoft.AspNetCore.Identity;

namespace SShop.Repositories.System.Roles
{
    public interface IRoleRepository
    {
        Task<bool> CreateRole(RoleCreateRequest request);

        Task<bool> DeleteRole(string roleId);

        Task<bool> UpdateRole(RoleUpdateRequest request);

        Task<PagedResult<IdentityRole>> GetRoles(RoleGetPagingRequest request);

        Task<IdentityRole> GetRole(string roleId);
    }
}