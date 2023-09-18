using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SShop.Repositories.Catalog.Brands;
using SShop.ViewModels.Catalog.Brands;
using SShop.ViewModels.Common;
using System.Threading.Tasks;

namespace SShop.BackEndAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class BrandsController : ControllerBase
    {
        private readonly IBrandService _brandService;

        public BrandsController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<IActionResult> RetrieveAll([FromQuery] BrandGetPagingRequest request)
        {
            var brands = await _brandService.GetBrands(request);
            if (brands == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get brand list"));
            return Ok(CustomAPIResponse<PagedResult<BrandViewModel>>.Success(brands, StatusCodes.Status200OK));
        }

        [HttpGet("{brandId}")]
        public async Task<IActionResult> RetrieveById(int brandId)
        {
            var brand = await _brandService.GetBrand(brandId);

            if (brand == null)
                return NotFound(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status404NotFound, "Cannot found this brand"));
            return Ok(CustomAPIResponse<BrandViewModel>.Success(brand, StatusCodes.Status200OK));
        }

        [HttpPost("add")]
        public async Task<IActionResult> Create([FromForm] BrandCreateRequest request)
        {
            var isSuccess = await _brandService.CreateBrand(request);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot create this brand"));

            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status201Created));
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromForm] BrandUpdateRequest request)
        {
            var isSuccess = await _brandService.UpdateBrand(request);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot update this brand"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }

        [HttpDelete("delete/{brandId}")]
        public async Task<IActionResult> Delete(int brandId)
        {
            var isSuccess = await _brandService.DeleteBrand(brandId);

            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot delete this brand"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }
    }
}