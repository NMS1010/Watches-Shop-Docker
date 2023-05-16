﻿using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace SShop.ViewModels.Catalog.ProductImages
{
    public class ProductImageCreateSingleRequest
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        public IFormFile Image { get; set; }
    }
}