using SShop.Domain.EF;
using SShop.ViewModels.Common;
using SShop.ViewModels.System.Roles;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace SShop.Repositories.System.Roles
{
    public class RoleRepository : IRoleRepository
    {
        private readonly AppDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleRepository(AppDbContext context, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _roleManager = roleManager;
        }

        public async Task<bool> CreateRole(RoleCreateRequest request)
        {
            try
            {
                var role = new IdentityRole()
                {
                    Name = request.RoleName
                };
                var res = await _roleManager.CreateAsync(role);
                return res.Succeeded;
            }
            catch
            {
                throw new Exception("Cannot create role");
            }
        }

        public async Task<bool> DeleteRole(string id)
        {
            try
            {
                var role = await _context.Roles.FindAsync(id);
                var res = await _roleManager.DeleteAsync(role);
                return res.Succeeded;
            }
            catch
            {
                throw new Exception("Cannot delete role");
            }
        }

        public async Task<PagedResult<IdentityRole>> GetRoles(RoleGetPagingRequest request)
        {
            try
            {
                var query = await _context.Roles
                .ToListAsync();
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    query = query
                        .Where(x => x.Name.Contains(request.Keyword))
                        .ToList();
                }
                var data = query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize).ToList();

                return new PagedResult<IdentityRole>
                {
                    TotalItem = query.Count,
                    Items = data
                };
            }
            catch
            {
                throw new Exception("Cannot get roles list");
            }
        }

        public async Task<IdentityRole> GetRole(string id)
        {
            try
            {
                var role = await _context.Roles.FindAsync(id);

                return role;
            }
            catch
            {
                throw new Exception("Cannot get role");
            }
        }

        public async Task<bool> UpdateRole(RoleUpdateRequest request)
        {
            try
            {
                var role = await _context.Roles.FindAsync(request.RoleId);
                role.Name = request.RoleName;
                var res = await _roleManager.UpdateAsync(role);

                return res.Succeeded;
            }
            catch
            {
                throw new Exception("Cannot update role");
            }
        }
    }
}