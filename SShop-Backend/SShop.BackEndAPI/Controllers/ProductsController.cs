using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using SShop.Repositories.Catalog.ProductImages;
using SShop.Repositories.Catalog.Products;
using SShop.ViewModels.Catalog.ProductImages;
using SShop.ViewModels.Catalog.Products;
using SShop.ViewModels.Common;

namespace SShop.BackEndAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IProductImageService _productImageService;

        public ProductsController(IProductService productService, IProductImageService productImageService)
        {
            _productService = productService;
            _productImageService = productImageService;
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<IActionResult> RetrieveAllPaging([FromQuery] ProductGetPagingRequest request)
        {
            var domainName = HttpContext.Request.GetDisplayUrl();
            var products = await _productService.GetProducts(request);
            if (products == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get product list"));
            return Ok(CustomAPIResponse<PagedResult<ProductViewModel>>.Success(products, StatusCodes.Status200OK));
        }

        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] ProductCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var isSuccess = await _productService.CreateProduct(request);
            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot create this product"));

            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status201Created));
        }

        [HttpGet("{productId}")]
        [AllowAnonymous]
        public async Task<IActionResult> RetrieveById(int productId)
        {
            var product = await _productService.GetProduct(productId);
            if (product == null)
                return NotFound(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status404NotFound, "Cannot found this product"));
            return Ok(CustomAPIResponse<ProductViewModel>.Success(product, StatusCodes.Status200OK));
        }

        [HttpPut("update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update([FromForm] ProductUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var isSuccess = await _productService.UpdateProduct(request);
            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot update this product"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }

        [HttpDelete("delete/{productId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int productId)
        {
            var isSuccess = await _productService.DeleteProduct(productId);
            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot delete this product"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }

        ////Product Images
        [HttpGet("{productId}/images/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RetrieveImageByProductId(int productId)
        {
            var productImages = await _productImageService.GetProductImages(new ProductImageGetPagingRequest() { ProductId = productId });
            if (productImages == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status404NotFound, "Cannot get images of this product "));
            return Ok(CustomAPIResponse<PagedResult<ProductImageViewModel>>.Success(productImages, StatusCodes.Status200OK));
        }

        [HttpGet("images/{productImageId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RetrieveImageById(int productImageId)
        {
            var productImage = await _productImageService.GetProductImage(productImageId);
            if (productImage == null)
                return NotFound(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status404NotFound, "Cannot found this product image"));
            return Ok(CustomAPIResponse<ProductImageViewModel>.Success(productImage, StatusCodes.Status200OK));
        }

        [HttpPost("images/add")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateImages([FromForm] ProductImageCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var isSuccess = await _productImageService.CreateMultipleProductImage(request);
            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot create images for this product"));

            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status201Created));
        }

        [HttpPost("image/add")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateSingleImage([FromForm] ProductImageCreateSingleRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var isSuccess = await _productImageService.CreateSingleProductImage(request);
            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot create sub image for this product"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status201Created));
        }

        [HttpPut("images/update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateImage([FromForm] ProductImageUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var isSuccess = await _productImageService.UpdateProductImage(request);
            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot update this product image"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }

        [HttpDelete("images/delete/{imageId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var isSuccess = await _productImageService.DeleteProductImage(imageId);
            if (!isSuccess)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot delete this product image"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }
    }
}