using SShop.ViewModels.Catalog.Products;
using SShop.Repositories.Common.Interfaces;
using SShop.Utilities.Interfaces;
using SShop.Domain.Entities;
using SShop.ViewModels.Common;

namespace SShop.Repositories.Catalog.Products
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<PagedResult<Product>> GetProducts(ProductGetPagingRequest request);

        Task<Product> GetProduct(int id);
    }
}