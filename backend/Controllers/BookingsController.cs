using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.Enums;
using backend.Models.DTOs;
using backend.Models.BookingPayment;
using backend.Services;
using backend.Models.UserManagement;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly IStripeService _stripeService;
    private readonly IConfiguration _config;

    public BookingsController(ApplicationDbContext context, INotificationService notificationService, IStripeService stripeService, IConfiguration config)
    {
        _context = context;
        _notificationService = notificationService;
        _stripeService = stripeService;
        _config = config;
    }

    // POST: api/bookings/{id}/checkout
    [HttpPost("{id}/checkout")]
    public async Task<IActionResult> CreateCheckoutSession(int id)
    {
        var booking = await _context.Bookings
            .Include(b => b.Tour)
            .FirstOrDefaultAsync(b => b.BookingId == id);

        if (booking == null) return NotFound();

        var session = await _stripeService.CreateCheckoutSessionAsync(
            booking.BookingId, 
            booking.TotalAmount, 
            booking.Tour.Title);

        booking.StripeSessionId = session.Id;
        await _context.SaveChangesAsync();

        return Ok(new { sessionId = session.Id, url = session.Url });
    }

    // POST: api/bookings/webhook
    [HttpPost("webhook")]
    [IgnoreAntiforgeryToken] // For external Stripe calls
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        try
        {
            var stripeEvent = Stripe.EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _config["Stripe:WebhookSecret"]
            );

            if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                var bookingId = int.Parse(session?.ClientReferenceId ?? "0");

                var booking = await _context.Bookings.FindAsync(bookingId);
                if (booking != null)
                {
                    booking.Status = BookingStatus.Confirmed;
                    booking.PaymentIntentId = session?.PaymentIntentId;
                    await _context.SaveChangesAsync();

                    // Notify Tourist
                    var tourist = await _context.Tourists.FindAsync(booking.TouristId);
                    if (tourist != null)
                    {
                        await _notificationService.CreateNotificationAsync(
                            tourist.UserId,
                            "Payment Confirmed! ✅",
                            $"Your payment for the tour '{booking.Tour?.Title}' has been received and your booking is now confirmed.",
                            "PaymentSuccess",
                            "/tourist/my-bookings"
                        );
                    }
                }
            }

            return Ok();
        }
        catch (Stripe.StripeException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/bookings
    [HttpPost]
    public async Task<ActionResult<Booking>> CreateBooking(BookingDto bookingDto)
    {
        // 1. Validate Tour exists
        var tour = await _context.Tours.FindAsync(bookingDto.TourId);
        if (tour == null)
        {
            return BadRequest(new { message = "Tour not found" });
        }

        // 2. Validate Tourist exists
        var tourist = await _context.Tourists.FindAsync(bookingDto.TouristId);
        if (tourist == null)
        {
            return BadRequest(new { message = "Tourist profile not found. Please ensure you are logged in correctly." });
        }

        // 3. Prevent duplicate bookings
        var existingBooking = await _context.Bookings
            .AnyAsync(b => b.TourId == bookingDto.TourId && b.TouristId == bookingDto.TouristId && b.Status != BookingStatus.Cancelled);
        if (existingBooking)
        {
            return BadRequest(new { message = "You have already booked this tour." });
        }

        // 4. Validate Capacity
        if (tour.CurrentBookings + bookingDto.NumberOfPeople > tour.MaxCapacity)
        {
            return BadRequest(new { message = "Not enough seats available" });
        }

        // 4. Create Booking Entity
        var booking = new Booking
        {
            TourId = bookingDto.TourId,
            TouristId = bookingDto.TouristId,
            NumberOfPeople = bookingDto.NumberOfPeople,
            TotalAmount = bookingDto.TotalAmount,
            BookingType = bookingDto.BookingType,
            BookingDate = DateTime.UtcNow,
            Status = BookingStatus.Pending
        };

        // 5. Update Tour Bookings count
        tour.CurrentBookings += bookingDto.NumberOfPeople;
        _context.Entry(tour).State = EntityState.Modified;

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        // Send Notification to Tourist
        await _notificationService.CreateNotificationAsync(
            tourist.UserId,
            "Booking Success! 🎫",
            $"You have successfully booked the tour: {tour.Title}. Your booking is currently pending payment verification.",
            "BookingSuccess",
            $"/tourist/my-bookings"
        );

        return CreatedAtAction(nameof(GetBooking), new { id = booking.BookingId }, booking);
    }

    // GET: api/bookings/tourist/{touristId}
    [HttpGet("tourist/{touristId}")]
    public async Task<ActionResult<IEnumerable<Booking>>> GetTouristBookings(int touristId)
    {
        return await _context.Bookings
            .Include(b => b.Tour)
            .Where(b => b.TouristId == touristId)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();
    }

    // DELETE: api/bookings/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var booking = await _context.Bookings.Include(b => b.Tour).FirstOrDefaultAsync(b => b.BookingId == id);
        if (booking == null)
        {
            return NotFound();
        }

        // Update Tour Bookings count
        if (booking.Tour != null)
        {
            booking.Tour.CurrentBookings -= booking.NumberOfPeople;
            _context.Entry(booking.Tour).State = EntityState.Modified;
        }

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/bookings/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Booking>> GetBooking(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);

        if (booking == null)
        {
            return NotFound();
        }

        return booking;
    }
}
