using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using SShop.Repositories.Catalog.Orders;
using SShop.ViewModels.Catalog.Orders;
using SShop.ViewModels.Catalog.Statistics;
using SShop.ViewModels.Common;
using System.ComponentModel.DataAnnotations;

namespace SShop.BackEndAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RetrieveAll([FromQuery] OrderGetPagingRequest request)
        {
            var orders = await _orderService.GetOrders(request);

            if (orders == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get order list"));
            return Ok(CustomAPIResponse<PagedResult<OrderViewModel>>.Success(orders, StatusCodes.Status200OK));
        }

        [HttpGet("user-order")]
        [Authorize(Roles = "Admin, Customer")]
        public async Task<IActionResult> RetrieveByUserId([FromQuery] OrderGetPagingRequest request)
        {
            var orders = await _orderService.GetOrdersByUserId(request);

            if (orders == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get order list"));
            return Ok(CustomAPIResponse<PagedResult<OrderViewModel>>.Success(orders, StatusCodes.Status200OK));
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> RetrieveById(int orderId)
        {
            var order = await _orderService.GetOrder(orderId);

            if (order == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status404NotFound, "Cannot found this order"));
            return Ok(CustomAPIResponse<OrderViewModel>.Success(order, StatusCodes.Status200OK));
        }

        [HttpPost("add")]
        [Authorize(Roles = "Admin, Customer")]
        public async Task<IActionResult> Create([FromForm] OrderCreateRequest request)
        {
            var isSuccess = await _orderService.CreateOrder(request);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot create this order"));

            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status201Created));
        }

        [HttpPut("update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update([FromForm] OrderUpdateRequest request)
        {
            var isSuccess = await _orderService.UpdateOrder(request);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot update this order"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }
    }
}