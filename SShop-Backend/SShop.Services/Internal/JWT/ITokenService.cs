using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SShop.Services.Internal.JWT
{
    public interface ITokenService
    {
        Task<string> CreateJWT(string userId);

        ClaimsPrincipal ValidateExpiredJWT(string token);

        string CreateRefreshToken();
    }
}