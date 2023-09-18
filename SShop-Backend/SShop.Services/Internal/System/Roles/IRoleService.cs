using SShop.ViewModels.System.Roles;
using SShop.Repositories.Common.Interfaces;
using SShop.ViewModels.Common;

namespace SShop.Repositories.System.Roles
{
    public interface IRoleService
    {
        Task<bool> CreateRole(RoleCreateRequest request);

        Task<bool> DeleteRole(string roleId);

        Task<bool> UpdateRole(RoleUpdateRequest request);

        Task<PagedResult<RoleViewModel>> GetRoles(RoleGetPagingRequest request);

        Task<RoleViewModel> GetRole(string roleId);
    }
}