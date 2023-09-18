using SShop.Domain.EF;
using SShop.Domain.Entities;
using SShop.Utilities.Constants.Orders;
using SShop.ViewModels.Catalog.Orders;
using SShop.ViewModels.Common;
using Microsoft.EntityFrameworkCore;
using SShop.ViewModels.Catalog.Statistics;
using System.Reflection;
using SShop.Utilities.Constants.Users;
using SShop.ViewModels.System.Users;
using SShop.Repositories.Common;

namespace SShop.Repositories.Catalog.Orders
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PagedResult<Order>> GetAllOrder(OrderGetPagingRequest request)
        {
            try
            {
                var query = Context.Orders
                    .Include(x => x.Discount)
                    .Include(x => x.OrderItems)
                    .Include(x => x.User)
                    .Include(x => x.Discount)
                    .Include(x => x.Address)
                    .Include(x => x.PaymentMethod)
                    .Include(x => x.OrderState)
                    .Include(x => x.DeliveryMethod);

                IQueryable<Order> temp = null;
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    temp = query
                        .Where(x => x.Address.SpecificAddress.Contains(request.Keyword));
                }
                var data = await (temp ?? query)
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize).ToListAsync();

                return new PagedResult<Order>
                {
                    TotalItem = await query.CountAsync(),
                    Items = data
                };
            }
            catch
            {
                throw new Exception("Failed to get order list");
            }
        }

        public async Task<Order> GetOrderById(int orderId)
        {
            try
            {
                var order = await Context.Orders
                    .Where(x => x.OrderId == orderId)
                    .Include(x => x.Discount)
                    .Include(x => x.OrderItems)
                    .Include(x => x.User)
                    .Include(x => x.Discount)
                    .Include(x => x.Address)
                    .Include(x => x.PaymentMethod)
                    .Include(x => x.OrderState)
                    .Include(x => x.DeliveryMethod)
                    .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Cannot find this order");

                return order;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private UserViewModel GetUserViewModel(AppUser user)
        {
            return new UserViewModel()
            {
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                UserName = user.UserName,
                Dob = user.DateOfBirth.ToString("yyyy-MM-dd"),
                Gender = user.Gender,
                Avatar = user.Avatar,
                DateCreated = user.DateCreated.ToString(),
                DateUpdated = user.DateUpdated.ToString(),
                Status = user.Status,
                TotalCartItem = user.CartItems.Count,
                TotalWishItem = user.WishItems.Count,
                TotalOrders = user.Orders.Count,
                TotalBought = user.Orders.Sum(o => o.OrderItems.Sum(oi => oi.Quantity)),
                TotalCost = user.Orders.Sum(o => o.TotalPrice),
                StatusCode = USER_STATUS.UserStatus[user.Status],
            };
        }

        public async Task<StatisticViewModel> GetOverviewStatictis()
        {
            var orders = await Context.Orders.Include(x => x.OrderState).ToListAsync();
            var products = await Context.Products.ToListAsync();
            var users = await Context.Users
                .Include(x => x.Orders)
                .ThenInclude(x => x.OrderItems)
                .Include(x => x.CartItems)
                .Include(x => x.WishItems)
                .ToListAsync();
            var totalProduct = products.Select(x => x.Quantity).Sum();
            var topTen = users.OrderByDescending(x => x.Orders.Select(o => o.TotalPrice).Sum()).Take(10);
            StatisticViewModel statistic = new()
            {
                TotalPending = orders.Where(x => x.OrderState.OrderStateName == ORDER_STATUS.OrderStatus[ORDER_STATUS.PENDING]).Count(),
                TotalCanceled = orders.Where(x => x.OrderState.OrderStateName == ORDER_STATUS.OrderStatus[ORDER_STATUS.CANCELED]).Count(),
                TotalReady = orders.Where(x => x.OrderState.OrderStateName == ORDER_STATUS.OrderStatus[ORDER_STATUS.READY_TO_SHIP]).Count(),
                TotalCompleted = orders.Where(x => x.OrderState.OrderStateName == ORDER_STATUS.OrderStatus[ORDER_STATUS.DELIVERED]).Count(),
                TotalDelivering = orders.Where(x => x.OrderState.OrderStateName == ORDER_STATUS.OrderStatus[ORDER_STATUS.ON_THE_WAY]).Count(),
                TotalOrders = orders.Count,
                TotalRevenue = orders.Select(x => x.TotalPrice).Sum(),
                TotalProduct = totalProduct,
                TotalUsers = users.Count,
                TopTenUser = topTen.Select(x => GetUserViewModel(x)).ToList()
            };

            return statistic;
        }

        public async Task<PagedResult<Order>> GetOrderByUserId(OrderGetPagingRequest request)
        {
            try
            {
                var query = Context.Orders
                    .Include(x => x.Discount)
                    .Include(x => x.OrderItems)
                    .Include(x => x.User)
                    .Include(x => x.Discount)
                    .Include(x => x.Address)
                    .Include(x => x.PaymentMethod)
                    .Include(x => x.OrderState)
                    .Include(x => x.DeliveryMethod)
                    .Where(x => x.UserId == request.UserId);

                IQueryable<Order> temp = null;
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    temp = query
                        .Where(x => x.Address.SpecificAddress.Contains(request.Keyword));
                }
                if (request.OrderStateId != 0)
                {
                    temp = query
                        .Where(x => x.OrderStateId == request.OrderStateId);
                }
                var data = await (temp ?? query)
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize).ToListAsync();
                return new PagedResult<Order>
                {
                    TotalItem = await (temp ?? query).CountAsync(),
                    Items = data
                };
            }
            catch
            {
                throw new Exception("Failed to get order list");
            }
        }

        private decimal GetMonthlyRevenue(List<Order> orderInYear, int month)
        {
            return orderInYear
                .Where(x => x.DatePaid.HasValue
                    && x.DatePaid.Value.Month == month)
                .Select(x => x.TotalPrice)
                .Sum();
        }

        public async Task<YearlyRevenueViewModel> GetYearlyRevenue(int year)
        {
            try
            {
                var orderInYear = await Context.Orders
                    .Where(x => x.DatePaid.HasValue && x.DatePaid.Value.Year == year)
                    .ToListAsync();
                YearlyRevenueViewModel yearlyRevenue = new();
                //{
                //    JanTotal = GetMonthlyRevenue(orderInYear, 1),
                //    FebTotal = GetMonthlyRevenue(orderInYear, 2),
                //    MarTotal = GetMonthlyRevenue(orderInYear, 3),
                //    AprTotal = GetMonthlyRevenue(orderInYear, 4),
                //    MayTotal = GetMonthlyRevenue(orderInYear, 5),
                //    JunTotal = GetMonthlyRevenue(orderInYear, 6),
                //    JulTotal = GetMonthlyRevenue(orderInYear, 7),
                //    AugTotal = GetMonthlyRevenue(orderInYear, 8),
                //    SepTotal = GetMonthlyRevenue(orderInYear, 9),
                //    OctTotal = GetMonthlyRevenue(orderInYear, 10),
                //    NovTotal = GetMonthlyRevenue(orderInYear, 11),
                //    DecTotal = GetMonthlyRevenue(orderInYear, 12)
                //};
                int count = 1;
                foreach (PropertyInfo propertyInfo in yearlyRevenue.GetType().GetProperties())
                {
                    propertyInfo.SetValue(yearlyRevenue, GetMonthlyRevenue(orderInYear, count));
                    count++;
                }
                return yearlyRevenue;
            }
            catch
            {
                throw new Exception("Failed to get statistic");
            }
        }

        private static DateTime StartOfWeek(DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            return dt.AddDays(-1 * diff).Date;
        }

        private decimal GetDayOfWeekRevenue(List<Order> orderInWeek, DayOfWeek dayOfWeek)
        {
            return orderInWeek
                .Where(x => x.DatePaid.HasValue
                    && x.DatePaid.Value.DayOfWeek == dayOfWeek)
                .Select(x => x.TotalPrice)
                .Sum();
        }

        public async Task<WeeklyRevenueViewModel> GetWeeklyRevenue(int year, int month, int day)
        {
            DateTime dt = new DateTime(year, month, day);
            DateTime startDateWeek = StartOfWeek(dt, DayOfWeek.Monday);
            try
            {
                var orderInWeek = await Context.Orders
                    .Where(x => x.DatePaid.HasValue
                            && x.DatePaid.Value >= startDateWeek && x.DatePaid < startDateWeek.AddDays(7))
                    .ToListAsync();
                WeeklyRevenueViewModel weeklyRevenue = new WeeklyRevenueViewModel()
                {
                    MonTotal = GetDayOfWeekRevenue(orderInWeek, DayOfWeek.Monday),
                    TueTotal = GetDayOfWeekRevenue(orderInWeek, DayOfWeek.Tuesday),
                    WedTotal = GetDayOfWeekRevenue(orderInWeek, DayOfWeek.Wednesday),
                    ThurTotal = GetDayOfWeekRevenue(orderInWeek, DayOfWeek.Thursday),
                    FriTotal = GetDayOfWeekRevenue(orderInWeek, DayOfWeek.Friday),
                    SatTotal = GetDayOfWeekRevenue(orderInWeek, DayOfWeek.Saturday),
                    SunTotal = GetDayOfWeekRevenue(orderInWeek, DayOfWeek.Sunday)
                };
                return weeklyRevenue;
            }
            catch
            {
                throw new Exception("Failed to get statistic");
            }
        }
    }
}