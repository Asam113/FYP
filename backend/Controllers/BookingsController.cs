using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.BookingPayment;
using backend.Models.Enums;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BookingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/bookings
    [HttpPost]
    public async Task<ActionResult<Booking>> CreateBooking(Booking booking)
    {
        // Validate Tour exists
        var tour = await _context.Tours.FindAsync(booking.TourId);
        if (tour == null)
        {
            return BadRequest("Tour not found");
        }

        // Validate Capacity (Simple check)
        if (tour.CurrentBookings + booking.NumberOfPeople > tour.MaxCapacity)
        {
            return BadRequest("Not enough seats available");
        }

        // Update Tour Bookings count
        tour.CurrentBookings += booking.NumberOfPeople;
        _context.Entry(tour).State = EntityState.Modified;

        booking.BookingDate = DateTime.UtcNow;
        booking.Status = BookingStatus.Pending;

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBooking), new { id = booking.BookingId }, booking);
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
