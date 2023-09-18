using SShop.ViewModels.Catalog.Orders;
using SShop.Repositories.Common.Interfaces;
using System.Threading.Tasks;
using SShop.ViewModels.Common;
using SShop.ViewModels.Catalog.Statistics;
using SShop.Utilities.Interfaces;
using SShop.Domain.Entities;

namespace SShop.Repositories.Catalog.Orders
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        Task<StatisticViewModel> GetOverviewStatictis();

        Task<YearlyRevenueViewModel> GetYearlyRevenue(int year);

        Task<WeeklyRevenueViewModel> GetWeeklyRevenue(int year, int month, int day);

        Task<PagedResult<Order>> GetOrderByUserId(OrderGetPagingRequest request);

        Task<PagedResult<Order>> GetAllOrder(OrderGetPagingRequest request);

        Task<Order> GetOrderById(int id);
    }
}