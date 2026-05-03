using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.Supporting;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EarningsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EarningsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("my-earnings")]
    public async Task<ActionResult<UserEarningsSummaryDto>> GetMyEarnings()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

        var userRole = User.FindFirstValue(ClaimTypes.Role);
        
        IQueryable<Earning> query;
        int? specificId = null;

        if (userRole == "Restaurant")
        {
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.UserId == userId);
            if (restaurant == null) return NotFound("Restaurant profile not found");
            specificId = restaurant.RestaurantId;
            query = _context.Earnings.Where(e => e.RestaurantId == specificId);
        }
        else if (userRole == "Driver")
        {
            var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.UserId == userId);
            if (driver == null) return NotFound("Driver profile not found");
            specificId = driver.DriverId;
            query = _context.Earnings.Where(e => e.DriverId == specificId);
        }
        else
        {
            return BadRequest("Earnings only available for Restaurants and Drivers");
        }

        var earnings = await query
            .Include(e => e.Tour)
            .OrderByDescending(e => e.EarnedAt)
            .ToListAsync();

        var summary = new UserEarningsSummaryDto
        {
            TotalEarned = earnings.Sum(e => e.Amount),
            PendingPayout = earnings.Where(e => e.Status == "Processing" || e.Status == "Pending").Sum(e => e.Amount),
            WithdrawnAmount = earnings.Where(e => e.Status == "Paid").Sum(e => e.Amount),
            Transactions = earnings.Select(e => new UserEarningRecordDto
            {
                EarningId = e.EarningId,
                TourTitle = e.Tour?.Title ?? "Miscellaneous",
                Amount = e.Amount,
                Status = e.Status,
                Date = e.EarnedAt.ToString("MMM dd, yyyy"),
                Method = e.PaymentMethod ?? "N/A"
            }).ToList()
        };

        return Ok(summary);
    }
}
