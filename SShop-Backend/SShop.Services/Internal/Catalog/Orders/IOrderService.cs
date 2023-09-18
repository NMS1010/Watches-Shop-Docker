using SShop.ViewModels.Catalog.Orders;
using SShop.Repositories.Common.Interfaces;
using System.Threading.Tasks;
using SShop.ViewModels.Common;
using SShop.ViewModels.Catalog.Statistics;

namespace SShop.Repositories.Catalog.Orders
{
    public interface IOrderService
    {
        Task<bool> CreateOrder(OrderCreateRequest request);

        Task<bool> UpdateOrder(OrderUpdateRequest request);

        Task<StatisticViewModel> GetOverviewStatictis();

        Task<YearlyRevenueViewModel> GetYearlyRevenue(int year);

        Task<WeeklyRevenueViewModel> GetWeeklyRevenue(int year, int month, int day);

        Task<PagedResult<OrderViewModel>> GetOrdersByUserId(OrderGetPagingRequest request);

        Task<PagedResult<OrderViewModel>> GetOrders(OrderGetPagingRequest request);

        Task<OrderViewModel> GetOrder(int orderId);
    }
}