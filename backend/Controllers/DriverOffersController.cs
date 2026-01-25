using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.OfferSystem;
using backend.Models.Enums;
using backend.Models.TourManagement;
using backend.Models.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/offers/driver")]
public class DriverOffersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DriverOffersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // DTO for creating driver offer
    public class CreateDriverOfferDto
    {
        public int TourId { get; set; }
        public int VehicleId { get; set; }
        public decimal QuotedPrice { get; set; }
        public string? AdditionalNotes { get; set; }
    }

    // POST: api/offers/driver
    [HttpPost]
    public async Task<ActionResult<DriverOffer>> CreateDriverOffer(CreateDriverOfferDto dto)
    {
        // Validate tour exists and is open
        var tour = await _context.Tours.FindAsync(dto.TourId);
        if (tour == null)
        {
            return NotFound("Tour not found");
        }

        if (tour.Status == TourStatus.Finalized || tour.Status == TourStatus.Cancelled)
        {
            return BadRequest("Tour is no longer accepting offers");
        }

        // Validate vehicle exists
        var vehicle = await _context.Vehicles
            .Include(v => v.Driver)
            .FirstOrDefaultAsync(v => v.VehicleId == dto.VehicleId);

        if (vehicle == null)
        {
            return NotFound("Vehicle not found");
        }

        // Check for duplicate offer (same driver, same tour)
        var existingOffer = await _context.DriverOffers
            .AnyAsync(o => o.TourId == dto.TourId && o.VehicleId == dto.VehicleId);

        if (existingOffer)
        {
            return BadRequest("You have already submitted an offer for this tour with this vehicle");
        }

        // Create offer
        var offer = new DriverOffer
        {
            TourId = dto.TourId,
            ProviderId = vehicle.DriverId, // Set from vehicle's driver
            VehicleId = dto.VehicleId,
            TransportationFare = dto.QuotedPrice, 
            OfferedAmount = dto.QuotedPrice, // Set base class property
            RouteDetails = dto.AdditionalNotes,
            OfferType = "Driver", // Required by base class
            Status = OfferStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.DriverOffers.Add(offer);
        await _context.SaveChangesAsync();

        // Reload with navigation properties
        var createdOffer = await _context.DriverOffers
            .Include(o => o.Tour)
            .Include(o => o.Vehicle)
                .ThenInclude(v => v.Driver)
            .FirstOrDefaultAsync(o => o.OfferId == offer.OfferId);

        return CreatedAtAction(nameof(GetDriverOffer), new { id = offer.OfferId }, createdOffer);
    }

    // GET: api/offers/driver/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<DriverOffer>> GetDriverOffer(int id)
    {
        var offer = await _context.DriverOffers
            .Include(o => o.Tour)
            .Include(o => o.Vehicle)
                .ThenInclude(v => v.Driver)
            .FirstOrDefaultAsync(o => o.OfferId == id);

        if (offer == null)
        {
            return NotFound();
        }

        return offer;
    }

    // GET: api/offers/driver?driverId={id}
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DriverOffer>>> GetDriverOffers([FromQuery] int? driverId)
    {
        var query = _context.DriverOffers
            .Include(o => o.Tour)
            .Include(o => o.Vehicle)
                .ThenInclude(v => v.Driver)
            .AsQueryable();

        if (driverId.HasValue)
        {
            query = query.Where(o => o.Vehicle.DriverId == driverId.Value);
        }

        var offers = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        return Ok(offers);
    }
    [HttpPut("{id}/accept")]
    public async Task<IActionResult> AcceptDriverOffer(int id)
    {
        var offer = await _context.DriverOffers.FindAsync(id);
        if (offer == null) return NotFound();

        offer.Status = OfferStatus.Accepted;
        offer.RespondedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Driver offer accepted" });
    }

    [HttpPut("{id}/reject")]
    public async Task<IActionResult> RejectDriverOffer(int id)
    {
        var offer = await _context.DriverOffers.FindAsync(id);
        if (offer == null) return NotFound();

        offer.Status = OfferStatus.Rejected;
        offer.RespondedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Driver offer rejected" });
    }

    // GET: api/offers/driver/booked-tours/{driverId}
    [HttpGet("booked-tours/{driverId}")]
    public async Task<ActionResult<BookedToursResultDto>> GetBookedTours(int driverId)
    {
        var driverOffers = await _context.DriverOffers
            .Include(o => o.Tour)
                .ThenInclude(t => t.ServiceRequirements)
            .Include(o => o.Vehicle)
            .Where(o => o.ProviderId == driverId && 
                       (o.Status == OfferStatus.Accepted || o.Status == OfferStatus.Confirmed))
            .ToListAsync();

        var result = new BookedToursResultDto();

        foreach (var offer in driverOffers)
        {
            var tour = offer.Tour;
            var isConfirmed = tour.Status == TourStatus.Finalized && tour.CurrentBookings >= tour.MaxCapacity;

            var dto = new BookedTourDto
            {
                Id = tour.TourId,
                Title = tour.Title,
                Status = isConfirmed ? "Confirmed" : "Pending Completion",
                Route = $"{tour.DepartureLocation} → {tour.Destination}",
                Date = tour.StartDate.ToString("MMM dd, yyyy"),
                Duration = $"{(tour.EndDate - tour.StartDate).Days + 1} Days",
                Participants = tour.CurrentBookings,
                Price = $"PKR {offer.TransportationFare:N0}",
                RequirementsStatus = isConfirmed 
                    ? "All requirements completed • Tour finalized" 
                    : GetPendingStatus(tour, offer),
                RequirementsStatusClass = isConfirmed ? "success" : "warning"
            };

            if (isConfirmed)
                result.ConfirmedTours.Add(dto);
            else
                result.PendingTours.Add(dto);
        }

        return Ok(result);
    }

    private string GetPendingStatus(Tour tour, DriverOffer offer)
    {
        if (tour.Status != TourStatus.Finalized)
        {
            var unfulfilled = tour.ServiceRequirements.Count(r => r.Status != "Fulfilled" && r.Status != "Resolved");
            if (unfulfilled > 0)
                return $"Driver accepted • {unfulfilled} more requirement(s) pending";
            return "Driver accepted • Awaiting tour finalization";
        }
        
        return $"Tour finalized • Booking in progress ({tour.CurrentBookings}/{tour.MaxCapacity})";
    }
}
