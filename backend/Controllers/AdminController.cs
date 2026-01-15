using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models.DTOs;
using backend.Models.Enums;
using backend.Services;


namespace backend.Controllers;

// TODO: Uncomment this before production - temporarily disabled for testing
// [Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
// Controller for Admin operations
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public AdminController(ApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    // GET: api/admin/restaurants
    [HttpGet("restaurants")]
    public async Task<ActionResult<IEnumerable<RestaurantDto>>> GetRestaurants()
    {
        try
        {
            var restaurants = await _context.Restaurants
                .Include(r => r.User)
                .Select(r => new RestaurantDto
                {
                    RestaurantId = r.RestaurantId,
                    RestaurantName = r.RestaurantName,
                    OwnerName = r.OwnerName,
                    BusinessType = r.BusinessType,
                    Rating = r.Rating,
                    ApplicationStatus = r.ApplicationStatus.ToString(),
                    BusinessLicense = r.BusinessLicense,
                    Address = r.Address,
                    PostalCode = r.PostalCode,
                    Name = r.User != null ? r.User.Name : "Unknown",
                    Email = r.User != null ? r.User.Email : "",
                    PhoneNumber = r.User != null ? r.User.PhoneNumber : null,
                    ProfilePicture = r.User != null ? r.User.ProfilePicture : null,
                    CreatedAt = r.User != null ? r.User.CreatedAt : DateTime.MinValue
                })
                .ToListAsync();

            return Ok(restaurants);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET: api/admin/restaurants/stats
    [HttpGet("restaurants/stats")]
    public async Task<ActionResult<RestaurantStatsDto>> GetRestaurantStats()
    {
        try
        {
            var now = DateTime.UtcNow;
            var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);

            var totalRestaurants = await _context.Restaurants
                .Where(r => r.BusinessType == "Restaurant" || r.BusinessType == null)
                .CountAsync();

            var totalHotels = await _context.Restaurants
                .Where(r => r.BusinessType == "Hotel")
                .CountAsync();

            var pendingVerification = await _context.Restaurants
                .Where(r => r.ApplicationStatus == ApplicationStatus.Submitted)
                .CountAsync();

            var restaurantGrowth = await _context.Restaurants
                .Where(r => (r.BusinessType == "Restaurant" || r.BusinessType == null) 
                    && r.User.CreatedAt >= firstDayOfMonth)
                .CountAsync();

            var hotelGrowth = await _context.Restaurants
                .Where(r => r.BusinessType == "Hotel" 
                    && r.User.CreatedAt >= firstDayOfMonth)
                .CountAsync();

            var stats = new RestaurantStatsDto
            {
                TotalRestaurants = totalRestaurants,
                TotalHotels = totalHotels,
                PendingVerification = pendingVerification,
                RestaurantGrowthThisMonth = restaurantGrowth,
                HotelGrowthThisMonth = hotelGrowth
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/admin/restaurants/{id}/approve
    [HttpPut("restaurants/{id}/approve")]
    public async Task<ActionResult<RestaurantDto>> ApproveRestaurant(int id)
    {
        try
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.RestaurantId == id);

            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found" });

            restaurant.ApplicationStatus = ApplicationStatus.Approved;
            await _context.SaveChangesAsync();

            // Send Email Notification
            try
            {
                if (restaurant.User != null && !string.IsNullOrEmpty(restaurant.User.Email))
                {
                    var subject = "Application Approved - Tourism Platform";
                    var body = $"Dear {restaurant.OwnerName},<br/><br/>" +
                               $"Congratulations! Your application for <b>{restaurant.RestaurantName}</b> has been approved.<br/>" +
                               $"You can now log in and manage your dashboard.<br/><br/>" +
                               "Best Regards,<br/>Admin Team";
                    
                    await _emailService.SendEmailAsync(restaurant.User.Email, subject, body);
                }
            }
            catch (Exception emailEx)
            {
                // Log email failure but don't fail the request
                Console.WriteLine($"Failed to send approval email: {emailEx.Message}");
            }

            var restaurantDto = new RestaurantDto
            {
                RestaurantId = restaurant.RestaurantId,
                RestaurantName = restaurant.RestaurantName,
                OwnerName = restaurant.OwnerName,
                BusinessType = restaurant.BusinessType,
                Rating = restaurant.Rating,
                ApplicationStatus = restaurant.ApplicationStatus.ToString(),
                BusinessLicense = restaurant.BusinessLicense,
                Address = restaurant.Address,
                PostalCode = restaurant.PostalCode,
                Name = restaurant.User?.Name ?? "Unknown",
                Email = restaurant.User?.Email ?? "",
                PhoneNumber = restaurant.User?.PhoneNumber,
                ProfilePicture = restaurant.User?.ProfilePicture,
                CreatedAt = restaurant.User?.CreatedAt ?? DateTime.MinValue
            };

            return Ok(restaurantDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/admin/restaurants/{id}/reject
    [HttpPut("restaurants/{id}/reject")]
    public async Task<ActionResult<RestaurantDto>> RejectRestaurant(int id)
    {
        try
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.RestaurantId == id);

            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found" });

            restaurant.ApplicationStatus = ApplicationStatus.Rejected;
            await _context.SaveChangesAsync();

            // Send Email Notification
            try 
            {
                if (restaurant.User != null && !string.IsNullOrEmpty(restaurant.User.Email))
                {
                    var subject = "Application Rejected - Tourism Platform";
                    var body = $"Dear {restaurant.OwnerName},<br/><br/>" +
                               $"We regret to inform you that your application for <b>{restaurant.RestaurantName}</b> has been rejected.<br/>" +
                               $"Please contact support for more details.<br/><br/>" +
                               "Best Regards,<br/>Admin Team";
                    
                    await _emailService.SendEmailAsync(restaurant.User.Email, subject, body);
                }
            }
            catch (Exception emailEx)
            {
                // Log email failure but don't fail the request
                Console.WriteLine($"Failed to send rejection email: {emailEx.Message}");
            }

            var restaurantDto = new RestaurantDto
            {
                RestaurantId = restaurant.RestaurantId,
                RestaurantName = restaurant.RestaurantName,
                OwnerName = restaurant.OwnerName,
                BusinessType = restaurant.BusinessType,
                Rating = restaurant.Rating,
                ApplicationStatus = restaurant.ApplicationStatus.ToString(),
                BusinessLicense = restaurant.BusinessLicense,
                Address = restaurant.Address,
                PostalCode = restaurant.PostalCode,
                Name = restaurant.User?.Name ?? "Unknown",
                Email = restaurant.User?.Email ?? "",
                PhoneNumber = restaurant.User?.PhoneNumber,
                ProfilePicture = restaurant.User?.ProfilePicture,
                CreatedAt = restaurant.User?.CreatedAt ?? DateTime.MinValue
            };

            return Ok(restaurantDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/admin/restaurants/reset
    [HttpPost("restaurants/reset")]
    public async Task<IActionResult> ResetAllStatuses()
    {
        try
        {
            var restaurants = await _context.Restaurants.ToListAsync();
            foreach (var r in restaurants)
            {
                r.ApplicationStatus = ApplicationStatus.Submitted;
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = "All restaurant statuses reset to Pending (Submitted)." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
