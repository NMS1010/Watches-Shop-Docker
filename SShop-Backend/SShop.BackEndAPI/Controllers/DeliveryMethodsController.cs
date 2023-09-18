using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SShop.Repositories.Catalog.DeliveryMethod;
using SShop.ViewModels.Catalog.DeliveryMethod;
using SShop.ViewModels.Common;

namespace SShop.BackEndAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DeliveryMethodsController : ControllerBase
    {
        private readonly IDeliveryMethodService _deliveryMethodService;

        public DeliveryMethodsController(IDeliveryMethodService deliveryMethodService)
        {
            _deliveryMethodService = deliveryMethodService;
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<IActionResult> RetrieveAll([FromQuery] DeliveryMethodGetPagingRequest request)
        {
            var deliveryMethods = await _deliveryMethodService.GetDeliveryMethods(request);
            if (deliveryMethods == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get delivery method list"));
            return Ok(CustomAPIResponse<PagedResult<DeliveryMethodViewModel>>.Success(deliveryMethods, StatusCodes.Status200OK));
        }

        [HttpGet("{deliveryMethodId}")]
        public async Task<IActionResult> RetrieveById(int deliveryMethodId)
        {
            var deliveryMethod = await _deliveryMethodService.GetDeliveryMethod(deliveryMethodId);

            if (deliveryMethod == null)
                return NotFound(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status404NotFound, "Cannot found this delivery method"));
            return Ok(CustomAPIResponse<DeliveryMethodViewModel>.Success(deliveryMethod, StatusCodes.Status200OK));
        }

        [HttpPost("add")]
        public async Task<IActionResult> Create([FromForm] DeliveryMethodCreateRequest request)
        {
            var isSuccess = await _deliveryMethodService.CreateDeliveryMethod(request);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot create this delivery method"));

            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status201Created));
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromForm] DeliveryMethodUpdateRequest request)
        {
            var isSuccess = await _deliveryMethodService.UpdateDeliveryMethod(request);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot update this delivery method"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }

        [HttpDelete("delete/{deliveryMethodId}")]
        public async Task<IActionResult> Delete(int deliveryMethodId)
        {
            var isSuccess = await _deliveryMethodService.DeleteDeliveryMethod(deliveryMethodId);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot delete this delivery method"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }
    }
}