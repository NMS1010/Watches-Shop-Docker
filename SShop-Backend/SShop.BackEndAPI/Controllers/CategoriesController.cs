﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SShop.Repositories.Catalog.Categories;
using SShop.ViewModels.Catalog.Categories;
using SShop.ViewModels.Common;
using System.Threading.Tasks;

namespace SShop.BackEndAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<IActionResult> RetrieveAll([FromQuery] CategoryGetPagingRequest request)
        {
            var categories = await _categoryService.GetCategories(request);
            if (categories == null)
                return Ok(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get categories list"));
            return Ok(CustomAPIResponse<PagedResult<CategoryViewModel>>.Success(categories, StatusCodes.Status200OK));
        }

        [HttpGet("all/parent-categories")]
        [AllowAnonymous]
        public async Task<IActionResult> RetrieveParentCategories()
        {
            var categories = await _categoryService.GetParentCategory();
            if (categories == null)
                return Ok(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get parent categories list"));
            return Ok(CustomAPIResponse<PagedResult<CategoryViewModel>>.Success(categories, StatusCodes.Status200OK));
        }

        [HttpGet("{categoryId}")]
        public async Task<IActionResult> RetrieveById(int categoryId)
        {
            var category = await _categoryService.GetCategory(categoryId);
            if (category == null)
                return Ok(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot find this caterogy"));
            return Ok(CustomAPIResponse<CategoryViewModel>.Success(category, StatusCodes.Status200OK));
        }

        [HttpPost("add")]
        public async Task<IActionResult> Create([FromForm] CategoryCreateRequest request)
        {
            if (!ModelState.IsValid)
                return Ok(ModelState);
            var isSuccess = await _categoryService.CreateCategory(request);
            if (!isSuccess)
                return Ok(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot create this caterogy"));
            //var category = await _categoryService.RetrieveById(categoryId);

            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status201Created));
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromForm] CategoryUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return Ok(ModelState);
            var isSuccess = await _categoryService.UpdateCategory(request);
            if (!isSuccess)
                return Ok(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot update this caterogy"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }

        [HttpDelete("delete/{categoryId}")]
        public async Task<IActionResult> Delete(int categoryId)
        {
            var isSuccess = await _categoryService.DeleteCategory(categoryId);
            if (!isSuccess)
                return Ok(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot delete this caterogy"));
            return Ok(CustomAPIResponse<NoContentAPIResponse>.Success(StatusCodes.Status200OK));
        }
    }
}