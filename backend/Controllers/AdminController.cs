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
    private readonly INotificationService _notificationService;

    // GET: api/admin/dashboard-stats
    [HttpGet("dashboard-stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        try
        {
            var totalTours = await _context.Tours.CountAsync();
            var totalDrivers = await _context.Drivers.CountAsync();
            var totalPartners = await _context.Restaurants.CountAsync();
            
            var pendingDrivers = await _context.Drivers
                .Where(d => d.AccountStatus == "Pending" || d.AccountStatus == "New")
                .CountAsync();
                
            var pendingRestaurants = await _context.Restaurants
                .Where(r => r.ApplicationStatus == ApplicationStatus.Submitted)
                .CountAsync();

            var stats = new DashboardStatsDto
            {
                TotalTours = totalTours,
                TotalDrivers = totalDrivers,
                TotalPartners = totalPartners,
                PendingVerifications = pendingDrivers + pendingRestaurants
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    public AdminController(ApplicationDbContext context, IEmailService emailService, INotificationService notificationService)
    {
        _context = context;
        _emailService = emailService;
        _notificationService = notificationService;
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

            // Send Platform Notification
            if (restaurant.User != null)
            {
                await _notificationService.CreateNotificationAsync(
                    restaurant.UserId,
                    "Application Approved! 🥂",
                    $"Your application for '{restaurant.RestaurantName}' has been approved. Welcome to Safarnama!",
                    "AccountApproved",
                    "/restaurant/dashboard"
                );
            }

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

            // Send Platform Notification
            if (restaurant.User != null)
            {
                await _notificationService.CreateNotificationAsync(
                    restaurant.UserId,
                    "Application Update ❌",
                    $"We regret to inform you that your application for '{restaurant.RestaurantName}' has been rejected.",
                    "AccountRejected",
                    "/restaurant/dashboard"
                );
            }

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

    // --- Driver Management ---

    // GET: api/admin/drivers
    [HttpGet("drivers")]
    public async Task<ActionResult<IEnumerable<DriverDto>>> GetDrivers()
    {
        try
        {
            var drivers = await _context.Drivers
                .Include(d => d.User)
                .Select(d => new DriverDto
                {
                    DriverId = d.DriverId,
                    CNIC = d.CNIC,
                    Licence = d.Licence,
                    LicenceExpiryDate = d.LicenceExpiryDate,
                    AccountStatus = d.AccountStatus,
                    TotalEarnings = d.TotalEarnings,
                    Name = d.User != null ? d.User.Name : "Unknown",
                    Email = d.User != null ? d.User.Email : "",
                    PhoneNumber = d.User != null ? d.User.PhoneNumber : null,
                    ProfilePicture = d.User != null ? d.User.ProfilePicture : null,
                    CreatedAt = d.User != null ? d.User.CreatedAt : DateTime.MinValue,
                    LicenceImage = d.LicenceImage,
                    CnicFront = d.CnicFront,
                    CnicBack = d.CnicBack
                })
                .ToListAsync();

            return Ok(drivers);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/admin/drivers/{id}/approve
    [HttpPut("drivers/{id}/approve")]
    public async Task<ActionResult<DriverDto>> ApproveDriver(int id)
    {
        try
        {
            var driver = await _context.Drivers
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DriverId == id);

            if (driver == null)
                return NotFound(new { message = "Driver not found" });

            driver.AccountStatus = "Approved";
            await _context.SaveChangesAsync();

            // Send Platform Notification
            if (driver.User != null)
            {
                await _notificationService.CreateNotificationAsync(
                    driver.UserId,
                    "Account Approved! 🚗",
                    "Your driver account has been approved. You can now start accepting rides!",
                    "AccountApproved",
                    "/driver/dashboard"
                );
            }

            // Send Email Notification
            try
            {
                if (driver.User != null && !string.IsNullOrEmpty(driver.User.Email))
                {
                    var subject = "Driver Account Approved - Tourism Platform";
                    var body = $"Dear {driver.User.Name},<br/><br/>" +
                               $"Congratulations! Your driver account has been approved.<br/>" +
                               $"You can now log in and start earning.<br/><br/>" +
                               "Best Regards,<br/>Admin Team";
                    
                    await _emailService.SendEmailAsync(driver.User.Email, subject, body);
                }
            }
            catch (Exception emailEx)
            {
                Console.WriteLine($"Failed to send approval email: {emailEx.Message}");
            }

            // Return updated DTO
            return Ok(new DriverDto
            {
                DriverId = driver.DriverId,
                CNIC = driver.CNIC,
                Licence = driver.Licence,
                LicenceExpiryDate = driver.LicenceExpiryDate,
                AccountStatus = driver.AccountStatus,
                TotalEarnings = driver.TotalEarnings,
                Name = driver.User?.Name ?? "Unknown",
                Email = driver.User?.Email ?? "",
                PhoneNumber = driver.User?.PhoneNumber,
                ProfilePicture = driver.User?.ProfilePicture,
                CreatedAt = driver.User?.CreatedAt ?? DateTime.MinValue,
                LicenceImage = driver.LicenceImage,
                CnicFront = driver.CnicFront,
                CnicBack = driver.CnicBack
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/admin/drivers/{id}/reject
    [HttpPut("drivers/{id}/reject")]
    public async Task<ActionResult<DriverDto>> RejectDriver(int id)
    {
        try
        {
            var driver = await _context.Drivers
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DriverId == id);

            if (driver == null)
                return NotFound(new { message = "Driver not found" });

            driver.AccountStatus = "Rejected";
            await _context.SaveChangesAsync();

            // Send Platform Notification
            if (driver.User != null)
            {
                await _notificationService.CreateNotificationAsync(
                    driver.UserId,
                    "Account Rejected ❌",
                    "We regret to inform you that your driver account application has been rejected.",
                    "AccountRejected",
                    "/driver/dashboard"
                );
            }

            // Send Email Notification
            try
            {
                if (driver.User != null && !string.IsNullOrEmpty(driver.User.Email))
                {
                    var subject = "Driver Account Rejected - Tourism Platform";
                    var body = $"Dear {driver.User.Name},<br/><br/>" +
                               $"We regret to inform you that your driver application has been rejected.<br/>" +
                               $"Please contact support for more details.<br/><br/>" +
                               "Best Regards,<br/>Admin Team";
                    
                    await _emailService.SendEmailAsync(driver.User.Email, subject, body);
                }
            }
            catch (Exception emailEx)
            {
                 Console.WriteLine($"Failed to send rejection email: {emailEx.Message}");
            }

            // Return updated DTO
            return Ok(new DriverDto
            {
                DriverId = driver.DriverId,
                CNIC = driver.CNIC,
                Licence = driver.Licence,
                LicenceExpiryDate = driver.LicenceExpiryDate,
                AccountStatus = driver.AccountStatus,
                TotalEarnings = driver.TotalEarnings,
                Name = driver.User?.Name ?? "Unknown",
                Email = driver.User?.Email ?? "",
                PhoneNumber = driver.User?.PhoneNumber,
                ProfilePicture = driver.User?.ProfilePicture,
                CreatedAt = driver.User?.CreatedAt ?? DateTime.MinValue,
                LicenceImage = driver.LicenceImage,
                CnicFront = driver.CnicFront,
                CnicBack = driver.CnicBack
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
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

    // --- Maintenance Operations ---

    // POST: api/admin/maintenance/clean-data
    [HttpPost("maintenance/clean-data")]
    public async Task<IActionResult> CleanDatabaseData()
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // The order of deletion is critical to avoid foreign key violations.
            // We also need to handle circular dependencies by nulling out references first.

            // 1. Break circular dependency between RestaurantAssignments and Orders
            await _context.Database.ExecuteSqlRawAsync("UPDATE RestaurantAssignments SET OrderId = NULL");

            // 2. Clear Notifications, Logs and Ratings
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Notifications");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Reviews");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Ratings");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Documents");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Earnings");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM RoomImages");

            // 3. Clear Payments and Bookings
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Refunds");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Payments");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM OrderItems");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Orders");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Bookings");

            // 4. Clear Assignments and Schedules
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM MealSchedules");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM MealPackageItems");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM MealPackages");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM RestaurantAssignments");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM TourAssignments");

            // 5. Clear Offers
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM OfferMenuItems");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Offers");

            // 6. Clear Tour Definitions and Room Data
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM RoomCategories");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM ServiceRequirements");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM TourImages");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Accommodations");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Tours");

            // 7. Clear Menus and Vehicles
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM MenuItems");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Menus");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM VehicleImages");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Vehicles");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM RestaurantImages");

            // 8. Clear User Roles (Foreign Key'd to Users)
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Drivers");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Restaurants");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Tourists");

            // 9. Clear Users except Admins
            // Enums are stored as int by default. Tourist=0, Driver=1, Restaurant=2, Admin=3
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Users WHERE Role != 3");

            await transaction.CommitAsync();
            return Ok(new { message = "Database cleaned successfully. All data except admin accounts removed." });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new { 
                message = "Failed to clean database", 
                error = ex.Message,
                innerError = ex.InnerException?.Message 
            });
        }
    }

    // POST: api/admin/maintenance/delete-user
    [HttpPost("maintenance/delete-user")]
    public async Task<IActionResult> DeleteUserByEmail([FromBody] string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null) return NotFound(new { message = "User not found" });

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var userId = user.Id;

            // 1. If Driver, delete related data
            var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.UserId == userId);
            if (driver != null)
            {
                var driverId = driver.DriverId;
                // Delete Earnings first
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Earnings WHERE DriverId = {0}", driverId);
                // Delete DriverOffers first (references Vehicles and Drivers)
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Offers WHERE OfferId IN (SELECT OfferId FROM DriverOffers WHERE DriverId = {0})", driverId);
                
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM VehicleImages WHERE VehicleId IN (SELECT VehicleId FROM Vehicles WHERE DriverId = {0})", driverId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Vehicles WHERE DriverId = {0}", driverId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Documents WHERE DriverId = {0}", driverId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Drivers WHERE DriverId = {0}", driverId);
            }

            // 2. If Restaurant, delete related data
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.UserId == userId);
            if (restaurant != null)
            {
                var restaurantId = restaurant.RestaurantId;
                // Delete Earnings first
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Earnings WHERE RestaurantId = {0}", restaurantId);
                // Delete OfferMenuItems first
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM OfferMenuItems WHERE RestaurantOfferId IN (SELECT OfferId FROM RestaurantOffers WHERE RestaurantId = {0})", restaurantId);
                // Delete RestaurantOffers
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Offers WHERE OfferId IN (SELECT OfferId FROM RestaurantOffers WHERE RestaurantId = {0})", restaurantId);

                await _context.Database.ExecuteSqlRawAsync("DELETE FROM RestaurantImages WHERE RestaurantId = {0}", restaurantId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM RoomImages WHERE RoomCategoryId IN (SELECT RoomCategoryId FROM RoomCategories WHERE RestaurantId = {0})", restaurantId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM RoomCategories WHERE RestaurantId = {0}", restaurantId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM MenuItems WHERE MenuId IN (SELECT MenuId FROM Menus WHERE RestaurantId = {0})", restaurantId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Menus WHERE RestaurantId = {0}", restaurantId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM RestaurantAssignments WHERE RestaurantId = {0}", restaurantId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Restaurants WHERE RestaurantId = {0}", restaurantId);
            }

            // 3. Delete Notifications, Bookings, Reviews, Ratings etc.
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Notifications WHERE UserId = {0}", userId);
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Reviews WHERE UserId = {0}", userId);
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Ratings WHERE TouristId IN (SELECT TouristId FROM Tourists WHERE UserId = {0})", userId);
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Ratings WHERE DriverId IN (SELECT DriverId FROM Drivers WHERE UserId = {0})", userId);
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Ratings WHERE RestaurantId IN (SELECT RestaurantId FROM Restaurants WHERE UserId = {0})", userId);
            
            // If Tourist, delete bookings and related
            var tourist = await _context.Tourists.FirstOrDefaultAsync(t => t.UserId == userId);
            if (tourist != null)
            {
                var touristId = tourist.TouristId;
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Refunds WHERE PaymentId IN (SELECT PaymentId FROM Payments WHERE BookingId IN (SELECT BookingId FROM Bookings WHERE TouristId = {0}))", touristId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Payments WHERE BookingId IN (SELECT BookingId FROM Bookings WHERE TouristId = {0})", touristId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM OrderItems WHERE OrderId IN (SELECT OrderId FROM Orders WHERE RestaurantAssignmentId IN (SELECT RestaurantAssignmentId FROM RestaurantAssignments WHERE TourId IN (SELECT TourId FROM Bookings WHERE TouristId = {0})))", touristId);
                // This is getting complex, let's keep it to direct user linkage if possible or follow standard clean order
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Bookings WHERE TouristId = {0}", touristId);
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Tourists WHERE TouristId = {0}", touristId);
            }
            
            // 4. Finally delete user
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Users WHERE Id = {0}", userId);

            await transaction.CommitAsync();
            return Ok(new { message = $"User {email} and all related data removed successfully." });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new { message = "Deletion failed", error = ex.Message });
        }
    }

    // --- Payment Management ---

    [HttpGet("payments/stats")]
    public async Task<ActionResult<PaymentStatsDto>> GetPaymentStats()
    {
        try
        {
            var payments = await _context.Payments.ToListAsync();
            var earnings = await _context.Earnings.ToListAsync();

            var stats = new PaymentStatsDto
            {
                TotalRevenue = payments.Where(p => p.PaymentType == "Inbound" && p.Status == PaymentStatus.Completed).Sum(p => p.Amount),
                PendingPayments = payments.Where(p => p.PaymentType == "Inbound" && p.Status == PaymentStatus.Pending).Sum(p => p.Amount) 
                                 + earnings.Where(e => e.Status != "Paid").Sum(e => e.Amount),
                TotalRefunded = payments.Where(p => p.PaymentType == "Refund" || (p.PaymentType == "Inbound" && p.Status == PaymentStatus.Refunded)).Sum(p => p.Amount),
                FailedAttempts = payments.Where(p => p.Status == PaymentStatus.Failed).Sum(p => p.Amount)
            };
            return Ok(stats);
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet("payments/ledger")]
    public async Task<ActionResult<IEnumerable<PaymentLedgerDto>>> GetPaymentLedger()
    {
        try
        {
            var payments = await _context.Payments
                .Select(p => new PaymentLedgerDto
                {
                    Id = "PAY-" + p.PaymentId,
                    Type = p.PaymentType,
                    Description = p.Description ?? "Tour Booking Payment",
                    Amount = p.Amount,
                    Date = p.PaymentDate.ToString("yyyy-MM-dd HH:mm"),
                    Method = p.PaymentMethod,
                    Status = p.Status.ToString()
                })
                .ToListAsync();

            var earnings = await _context.Earnings
                .Include(e => e.Restaurant)
                .Include(e => e.Driver)
                .Select(e => new PaymentLedgerDto
                {
                    Id = "ERN-" + e.EarningId,
                    Type = "Outbound",
                    Description = (e.Restaurant != null ? "Restaurant Payout: " + e.Restaurant.RestaurantName : "Driver Payout"),
                    Amount = -e.Amount, // Negative for outbound
                    Date = e.EarnedAt.ToString("yyyy-MM-dd HH:mm"),
                    Method = e.PaymentMethod ?? "Stripe",
                    Status = e.Status
                })
                .ToListAsync();

            var combined = payments.Concat(earnings)
                .OrderByDescending(x => x.Date)
                .ToList();

            return Ok(combined);
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet("reports/summary")]
    public async Task<ActionResult<AdminReportDto>> GetAdminReports()
    {
        try
        {
            // 1. Basic Stats
            var totalTours = await _context.Tours.CountAsync();
            var totalBookings = await _context.Bookings.CountAsync();
            var totalRevenue = await _context.Payments
                .Where(p => p.PaymentType == "Inbound" && p.Status == PaymentStatus.Completed)
                .SumAsync(p => p.Amount);

            var avgTourValue = totalTours > 0 ? totalRevenue / totalTours : 0;

            var report = new AdminReportDto();

            report.Metrics = new List<SummaryMetricDto>
            {
                new() { Title = "Total Tours", Value = totalTours.ToString(), Icon = "fa-map-marker-alt", ColorClass = "cyan" },
                new() { Title = "Total Bookings", Value = totalBookings.ToString(), Icon = "fa-users", ColorClass = "blue" },
                new() { Title = "Total Revenue", Value = $"PKR {totalRevenue / 1000000:N1}M", Icon = "fa-chart-line", ColorClass = "green" },
                new() { Title = "Avg. Tour Value", Value = $"PKR {avgTourValue:N0}", Icon = "fa-file-invoice", ColorClass = "orange" }
            };

            // 2. Performance Data (Last 6 Months)
            var sixMonthsAgo = DateTime.UtcNow.AddMonths(-5);
            var monthlyData = await _context.Bookings
                .Where(b => b.BookingDate >= new DateTime(sixMonthsAgo.Year, sixMonthsAgo.Month, 1))
                .GroupBy(b => new { b.BookingDate.Year, b.BookingDate.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Customers = g.Sum(x => x.NumberOfPeople),
                    Revenue = g.Sum(x => x.TotalAmount),
                    Tours = g.Select(x => x.TourId).Distinct().Count()
                })
                .ToListAsync();

            for (int i = 0; i < 6; i++)
            {
                var date = sixMonthsAgo.AddMonths(i);
                var match = monthlyData.FirstOrDefault(m => m.Year == date.Year && m.Month == date.Month);
                report.PerformanceData.Add(new ChartPointDto
                {
                    Label = date.ToString("MMM"),
                    Customers = match?.Customers ?? 0,
                    Revenue = match?.Revenue ?? 0,
                    Tours = match?.Tours ?? 0
                });
            }

            // 3. Top Destinations
            var topDestinations = await _context.Tours
                .GroupBy(t => t.Destination)
                .OrderByDescending(g => g.Count())
                .Take(5)
                .Select(g => new DestinationStatDto
                {
                    Label = g.Key,
                    Value = g.Count(),
                    ColorClass = "teal"
                })
                .ToListAsync();
            report.TopDestinations = topDestinations;

            // 4. Driver Performance
            var driverPerf = await _context.Earnings
                .Where(e => e.DriverId != null && e.Type == "DriverPayout")
                .Include(e => e.Driver)
                    .ThenInclude(d => d.User)
                .GroupBy(e => e.Driver.User.Name)
                .Select(g => new DriverPerformanceDto
                {
                    Name = g.Key,
                    Tours = g.Select(x => x.TourId).Distinct().Count(),
                    Revenue = g.Sum(x => x.Amount),
                    Rating = 4.8 // Mock rating
                })
                .OrderByDescending(d => d.Revenue)
                .Take(5)
                .ToListAsync();
            report.DriverPerformance = driverPerf;

            return Ok(report);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
