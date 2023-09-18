using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SShop.Repositories.Catalog.OrderState;
using SShop.ViewModels.Catalog.OrderState;
using SShop.ViewModels.Common;

namespace SShop.BackEndAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class OrderStatesController : ControllerBase
    {
        private readonly IOrderStateService _orderStateService;

        public OrderStatesController(IOrderStateService orderStateService)
        {
            _orderStateService = orderStateService;
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<IActionResult> RetrieveAll([FromQuery] OrderStateGetPagingRequest request)
        {
            var orderStatees = await _orderStateService.GetOrderStates(request);
            if (orderStatees == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get orderState list"));
            return Ok(CustomAPIResponse<PagedResult<OrderStateViewModel>>.Success(orderStatees, StatusCodes.Status200OK));
        }

        [HttpGet("{orderStateId}")]
        public async Task<IActionResult> RetrieveById(int orderStateId)
        {
            var orderState = await _orderStateService.GetOrderState(orderStateId);

            if (orderState == null)
                return NotFound(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status404NotFound, "Cannot found this orderState"));
            return Ok(CustomAPIResponse<OrderStateViewModel>.Success(orderState, StatusCodes.Status200OK));
        }

        [HttpPost("add")]
        public async Task<IActionResult> Create([FromForm] OrderStateCreateRequest request)
        {
            var isSuccess = await _orderStateService.CreateOrderState(request);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot create this orderState"));

            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status201Created));
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromForm] OrderStateUpdateRequest request)
        {
            var isSuccess = await _orderStateService.UpdateOrderState(request);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot update this orderState"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }

        [HttpDelete("delete/{orderStateId}")]
        public async Task<IActionResult> Delete(int orderStateId)
        {
            var isSuccess = await _orderStateService.DeleteOrderState(orderStateId);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot delete this orderState"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }
    }
}