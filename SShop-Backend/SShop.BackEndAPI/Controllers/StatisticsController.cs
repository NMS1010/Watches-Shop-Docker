using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SShop.Repositories.Catalog.Orders;
using SShop.ViewModels.Catalog.Orders;
using SShop.ViewModels.Catalog.Statistics;
using SShop.ViewModels.Common;

namespace SShop.BackEndAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class StatisticsController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public StatisticsController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> RetrieveStatictis()
        {
            var statictis = await _orderService.GetOverviewStatictis();

            if (statictis == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get orders statictis overview"));
            return Ok(CustomAPIResponse<StatisticViewModel>.Success(statictis, StatusCodes.Status200OK));
        }

        [HttpGet("revenue/{year}")]
        public async Task<IActionResult> RetrieveYearlyRevenue(int year)
        {
            var statictis = await _orderService.GetYearlyRevenue(year);

            if (statictis == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get orders statictis overview"));
            return Ok(CustomAPIResponse<YearlyRevenueViewModel>.Success(statictis, StatusCodes.Status200OK));
        }

        [HttpGet("revenue/{year}/{month}/{day}")]
        public async Task<IActionResult> RetrieveWeeklyRevenue(int year, int month, int day)
        {
            var statictis = await _orderService.GetWeeklyRevenue(year, month, day);

            if (statictis == null)
                return BadRequest(CustomAPIResponse<NoContentAPIResponse>.Fail(StatusCodes.Status400BadRequest, "Cannot get orders statictis overview"));
            return Ok(CustomAPIResponse<WeeklyRevenueViewModel>.Success(statictis, StatusCodes.Status200OK));
        }
    }
}