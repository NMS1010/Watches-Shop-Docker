﻿using SShop.ViewModels.Common;

namespace SShop.ViewModels.Catalog.Wishtems
{
    public class WishItemGetPagingRequest : PagingRequest
    {
        public string UserId { get; set; }
    }
}