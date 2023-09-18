using SShop.ViewModels.Catalog.CartItems;
using SShop.ViewModels.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SShop.Repositories.Catalog.CartItems;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SShop.BackEndAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer,Admin")]
    public class CartsController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartsController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpPost("all")]
        public async Task<IActionResult> RetrieveAll([FromForm] CartItemGetPagingRequest request)
        {
            var cartItems = await _cartService.GetCartByUserId(request);
            if (cartItems == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get cart item list"));
            return Ok(CustomAPIResponse<PagedResult<CartItemViewModel>>.Success(cartItems, StatusCodes.Status200OK));
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddProduct([FromForm] CartItemCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var res = await _cartService.AddProductToCart(request);

            return Ok(CustomAPIResponse<object>.Success(res, StatusCodes.Status201Created));
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromForm] CartItemUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var res = await _cartService.UpdateCartItem(request);
            return Ok(CustomAPIResponse<object>.Success(res, StatusCodes.Status200OK));
        }

        [HttpPut("update/all")]
        public async Task<IActionResult> UpdateAllStatus([FromForm][Required] string userId, [FromForm][Required] bool selectAll)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var res = await _cartService.UpdateAllStatus(userId, selectAll);
            return Ok(CustomAPIResponse<object>.Success(res, StatusCodes.Status200OK));
        }

        [HttpDelete("delete/{cartItemId}")]
        public async Task<IActionResult> Delete(int cartItemId)
        {
            int currentCartAmount = await _cartService.DeleteCartItem(cartItemId);
            return Ok(CustomAPIResponse<object>.Success(new { CurrentCartAmount = currentCartAmount }, StatusCodes.Status200OK));
        }

        [HttpDelete("delete/all/{userId}")]
        public async Task<IActionResult> DeleteSelectedCartItem([Required] string userId)
        {
            var res = await _cartService.DeleteSelectedCartItem(userId);
            return Ok(CustomAPIResponse<object>.Success(res, StatusCodes.Status200OK));
        }
    }
}