using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.Supporting;
using backend.Models.OfferSystem;
using backend.Models.TourManagement;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class PayoutsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPaymentService _paymentService;
    private readonly INotificationService _notificationService;

    public PayoutsController(ApplicationDbContext context, IPaymentService paymentService, INotificationService notificationService)
    {
        _context = context;
        _paymentService = paymentService;
        _notificationService = notificationService;
    }

    // --- Restaurant Payouts ---

    [HttpPost("restaurant/{assignmentId}/initiate")]
    public async Task<IActionResult> InitiateRestaurantPayout(int assignmentId, [FromQuery] bool manual = false)
    {
        var assignment = await _context.RestaurantAssignments
            .Include(a => a.Restaurant)
            .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

        if (assignment == null) return NotFound("Assignment not found");

        if (manual)
        {
            // Bypass Stripe, just create a "Manual" earning record
            var earning = new Earning
            {
                TourId = assignment.TourId,
                RestaurantId = assignment.RestaurantId,
                Amount = assignment.FinalPrice,
                Type = "RestaurantPayout",
                Status = "Processing",
                PaymentMethod = "Manual Online",
                EarnedAt = DateTime.UtcNow
            };
            _context.Earnings.Add(earning);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Manual payout initiated. Please confirm completion after manual transfer." });
        }
        
        if (string.IsNullOrEmpty(assignment.Restaurant?.StripeAccountId))
            return BadRequest("This restaurant has not set up their Stripe account yet. Please ask them to complete onboarding.");

        var result = await _paymentService.ProcessRestaurantPayoutAsync(assignmentId, "Online");
        
        if (!result) return BadRequest("Stripe Transfer failed. Please check your platform's Stripe balance.");

        return Ok(new { message = "Payout initiated successfully. Please confirm completion." });
    }

    [HttpPost("restaurant/{assignmentId}/confirm")]
    public async Task<IActionResult> ConfirmRestaurantPayout(int assignmentId)
    {
        var assignment = await _context.RestaurantAssignments
            .Include(a => a.Restaurant)
            .Include(a => a.Tour)
            .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);
            
        if (assignment == null) return NotFound("Assignment not found");

        assignment.IsPaid = true;
        assignment.PaidAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Update Earning status to Paid
        var earning = await _context.Earnings.FirstOrDefaultAsync(e => 
            e.RestaurantId == assignment.RestaurantId && 
            e.TourId == assignment.TourId && 
            e.Status == "Processing");
        
        if (earning != null)
        {
            earning.Status = "Paid";
            await _context.SaveChangesAsync();
        }

        // Notify Restaurant
        await _notificationService.CreateNotificationAsync(
            assignment.Restaurant.UserId,
            "Payout Received! 💰",
            $"Your payout of {assignment.FinalPrice:N0} PKR for the tour '{assignment.Tour.Title}' has been completed.",
            "PayoutReceived",
            "/restaurant/earnings"
        );

        return Ok(new { message = "Payout marked as completed." });
    }

    [HttpPost("restaurant/{assignmentId}/cash-pay")]
    public async Task<IActionResult> RestaurantCashPay(int assignmentId)
    {
        var assignment = await _context.RestaurantAssignments
            .Include(a => a.Restaurant)
            .Include(a => a.Tour)
            .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);
            
        if (assignment == null) return NotFound("Assignment not found");

        assignment.IsPaid = true;
        assignment.PaidAt = DateTime.UtcNow;
        assignment.PaymentMethod = "Cash";
        
        // Record as Paid Earning
        var earning = new Earning
        {
            TourId = assignment.TourId,
            RestaurantId = assignment.RestaurantId,
            Amount = assignment.FinalPrice,
            Type = "RestaurantPayout",
            Status = "Paid",
            PaymentMethod = "Cash",
            EarnedAt = DateTime.UtcNow
        };
        _context.Earnings.Add(earning);
        await _context.SaveChangesAsync();

        // Notify Restaurant
        await _notificationService.CreateNotificationAsync(
            assignment.Restaurant.UserId,
            "Payment Received (Cash) 💵",
            $"You have received a cash payment of {assignment.FinalPrice:N0} PKR for the tour '{assignment.Tour.Title}'.",
            "PayoutReceived",
            "/restaurant/earnings"
        );

        return Ok(new { message = "Cash payout recorded successfully." });
    }

    // --- Accommodation Payouts ---

    [HttpPost("accommodation/{accommodationId}/initiate")]
    public async Task<IActionResult> InitiateAccommodationPayout(int accommodationId)
    {
        var accommodation = await _context.Accommodations.FindAsync(accommodationId);
        if (accommodation == null) return NotFound("Accommodation not found");

        accommodation.PaymentMethod = "Online";
        
        return Ok(new { message = "Accommodation payout initiated." });
    }

    [HttpPost("accommodation/{accommodationId}/confirm")]
    public async Task<IActionResult> ConfirmAccommodationPayout(int accommodationId)
    {
        var accommodation = await _context.Accommodations
            .Include(a => a.Tour)
            .FirstOrDefaultAsync(a => a.AccommodationId == accommodationId);
            
        if (accommodation == null) return NotFound("Accommodation not found");

        accommodation.IsPaid = true;
        accommodation.PaidAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Accommodation payout marked as completed." });
    }

    [HttpPost("accommodation/{accommodationId}/serve")]
    public async Task<IActionResult> MarkAccommodationAsServed(int accommodationId)
    {
        var accommodation = await _context.Accommodations.FindAsync(accommodationId);
        if (accommodation == null) return NotFound("Accommodation not found");

        if (accommodation.PaymentMethod == "Online" && !accommodation.IsPaid)
        {
            return BadRequest("Payout must be completed before marking as served.");
        }

        accommodation.IsServed = true;
        accommodation.ServedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Accommodation marked as served." });
    }

    // --- Driver Payouts ---

    [HttpGet("drivers/{tourId}")]
    public async Task<ActionResult> GetDriversForPayout(int tourId)
    {
        var driverOffers = await _context.DriverOffers
            .Where(o => o.TourId == tourId && o.Status == backend.Models.Enums.OfferStatus.Confirmed)
            .Include(o => o.Driver)
                .ThenInclude(d => d.User)
            .Include(o => o.Vehicle)
            .Select(o => new {
                o.OfferId,
                o.TransportationFare,
                o.IsPaid,
                o.PaidAt,
                DriverName = o.Driver.User.Name,
                DriverPhone = o.Driver.User.PhoneNumber,
                VehicleModel = o.Vehicle.Model,
                VehicleCapacity = o.Vehicle.Capacity
            })
            .ToListAsync();

        return Ok(driverOffers);
    }

    [HttpPost("driver/{offerId}/pay")]
    public async Task<IActionResult> PayDriver(int offerId)
    {
        var result = await _paymentService.ProcessSingleDriverPayoutAsync(offerId);
        
        if (!result) return BadRequest("Failed to initiate payout. Check Stripe connection.");

        return Ok(new { message = "Driver payout initiated successfully. Please confirm completion." });
    }

    [HttpPost("driver/{offerId}/confirm")]
    public async Task<IActionResult> ConfirmDriverPayout(int offerId)
    {
        var offer = await _context.DriverOffers
            .Include(o => o.Driver)
            .Include(o => o.Tour)
            .FirstOrDefaultAsync(o => o.OfferId == offerId);
            
        if (offer == null) return NotFound("Driver offer not found");

        offer.IsPaid = true;
        offer.PaidAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Notify Driver
        await _notificationService.CreateNotificationAsync(
            offer.Driver.UserId,
            "Payout Received! 💸",
            $"Your payout of {offer.TransportationFare:N0} PKR for the tour '{offer.Tour?.Title}' has been completed.",
            "PayoutReceived",
            "/driver/earnings"
        );

        return Ok(new { message = "Driver payout marked as completed." });
    }

    [HttpPost("driver/{offerId}/cash-pay")]
    public async Task<IActionResult> DriverCashPay(int offerId)
    {
        var offer = await _context.DriverOffers
            .Include(o => o.Driver)
            .Include(o => o.Tour)
            .FirstOrDefaultAsync(o => o.OfferId == offerId);
            
        if (offer == null) return NotFound("Driver offer not found");

        offer.IsPaid = true;
        offer.PaidAt = DateTime.UtcNow;
        
        // Record as Paid Earning
        var earning = new Earning
        {
            TourId = offer.TourId,
            DriverId = offer.DriverId,
            Amount = offer.TransportationFare,
            Type = "DriverPayout",
            Status = "Paid",
            PaymentMethod = "Cash",
            EarnedAt = DateTime.UtcNow
        };
        _context.Earnings.Add(earning);
        await _context.SaveChangesAsync();

        // Notify Driver
        await _notificationService.CreateNotificationAsync(
            offer.Driver.UserId,
            "Payment Received (Cash) 💵",
            $"You have received a cash payment of {offer.TransportationFare:N0} PKR for the tour '{offer.Tour?.Title}'.",
            "PayoutReceived",
            "/driver/earnings"
        );

        return Ok(new { message = "Cash payout recorded successfully." });
    }
}
