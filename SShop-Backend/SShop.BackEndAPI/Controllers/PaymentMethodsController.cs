using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SShop.Repositories.Catalog.PaymentMethod;
using SShop.ViewModels.Catalog.PaymentMethod;
using SShop.ViewModels.Common;
using System.Data;

namespace SShop.BackEndAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class PaymentMethodsController : ControllerBase
    {
        private readonly IPaymentMethodService _paymentMethodService;

        public PaymentMethodsController(IPaymentMethodService paymentMethodService)
        {
            _paymentMethodService = paymentMethodService;
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<IActionResult> RetrieveAll([FromQuery] PaymentMethodGetPagingRequest request)
        {
            var paymentMethods = await _paymentMethodService.GetPaymentMethods(request);
            if (paymentMethods == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get payment method list"));
            return Ok(CustomAPIResponse<PagedResult<PaymentMethodViewModel>>.Success(paymentMethods, StatusCodes.Status200OK));
        }

        [HttpGet("{paymentMethodId}")]
        public async Task<IActionResult> RetrieveById(int paymentMethodId)
        {
            var paymentMethod = await _paymentMethodService.GetPaymentMethod(paymentMethodId);

            if (paymentMethod == null)
                return NotFound(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status404NotFound, "Cannot found this payment method"));
            return Ok(CustomAPIResponse<PaymentMethodViewModel>.Success(paymentMethod, StatusCodes.Status200OK));
        }

        [HttpPost("add")]
        public async Task<IActionResult> Create([FromForm] PaymentMethodCreateRequest request)
        {
            var isSuccess = await _paymentMethodService.CreatePaymentMethod(request);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot create this payment method"));

            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status201Created));
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromForm] PaymentMethodUpdateRequest request)
        {
            var isSuccess = await _paymentMethodService.UpdatePaymentMethod(request);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot update this payment method"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }

        [HttpDelete("delete/{paymentMethodId}")]
        public async Task<IActionResult> Delete(int paymentMethodId)
        {
            var isSuccess = await _paymentMethodService.DeletePaymentMethod(paymentMethodId);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot delete this payment method"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }
    }
}