using SShop.ViewModels.Common;

namespace SShop.ViewModels.Catalog.ReviewItems
{
    public class ReviewItemGetPagingRequest : PagingRequest
    {
        public string UserId { get; set; }
        public int ProductId { get; set; }
    }
}