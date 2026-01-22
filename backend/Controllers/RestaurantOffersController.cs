using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.OfferSystem;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantOffersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RestaurantOffersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/restaurantoffers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RestaurantOffer>>> GetRestaurantOffers(
        [FromQuery] int? requirementId,
        [FromQuery] int? restaurantId,
        [FromQuery] string? status)
    {
        var query = _context.RestaurantOffers
            .Include(o => o.ServiceRequirement)
                .ThenInclude(r => r.Tour)
            .Include(o => o.Restaurant)
                .ThenInclude(r => r.User)
            .Include(o => o.OfferMenuItems)
                .ThenInclude(mi => mi.MenuItem)
            .AsQueryable();

        if (requirementId.HasValue)
        {
            query = query.Where(o => o.RequirementId == requirementId.Value);
        }

        if (restaurantId.HasValue)
        {
            query = query.Where(o => o.ProviderId == restaurantId.Value);
        }

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(o => o.Status.ToString() == status);
        }

        var offers = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        return Ok(offers);
    }

    // GET: api/restaurantoffers/5
    [HttpGet("{id}")]
    public async Task<ActionResult<RestaurantOffer>> GetRestaurantOffer(int id)
    {
        var offer = await _context.RestaurantOffers
            .Include(o => o.ServiceRequirement)
                .ThenInclude(r => r.Tour)
            .Include(o => o.Restaurant)
                .ThenInclude(r => r.User)
            .Include(o => o.OfferMenuItems)
                .ThenInclude(mi => mi.MenuItem)
            .FirstOrDefaultAsync(o => o.OfferId == id);

        if (offer == null)
        {
            return NotFound();
        }

        return Ok(offer);
    }

    // POST: api/restaurantoffers
    [HttpPost]
    public async Task<ActionResult<RestaurantOffer>> CreateRestaurantOffer([FromBody] CreateRestaurantOfferDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Validate that the requirement exists and is open
        var requirement = await _context.ServiceRequirements.FindAsync(dto.RequirementId);
        if (requirement == null)
        {
            return BadRequest("Service requirement not found");
        }

        if (requirement.Status != "Open")
        {
            return BadRequest("Cannot submit offers for closed requirements");
        }

        // Validate that the restaurant exists
        var restaurantExists = await _context.Restaurants.AnyAsync(r => r.RestaurantId == dto.RestaurantId);
        if (!restaurantExists)
        {
            return BadRequest("Restaurant not found");
        }

        // Check if restaurant already has a pending offer for this requirement
        var existingOffer = await _context.RestaurantOffers
            .AnyAsync(o => o.RequirementId == dto.RequirementId && 
                          o.ProviderId == dto.RestaurantId && 
                          o.Status == Models.Enums.OfferStatus.Pending);

        if (existingOffer)
        {
            return BadRequest("Restaurant already has a pending offer for this requirement");
        }

        var offer = new RestaurantOffer
        {
            RequirementId = dto.RequirementId,
            ProviderId = dto.RestaurantId,
            PricePerHead = dto.PricePerHead,
            MinimumPeople = dto.MinimumPeople,
            MaximumPeople = dto.MaximumPeople,
            MealType = dto.MealType,
            IncludesBeverages = dto.IncludesBeverages,
            Notes = dto.Notes,
            OfferType = "Restaurant",
            CreatedAt = DateTime.UtcNow,
            Status = Models.Enums.OfferStatus.Pending,
            TourId = null
        };

        _context.RestaurantOffers.Add(offer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRestaurantOffer), new { id = offer.OfferId }, offer);
    }

    // Delete: api/RestaurantOffers/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRestaurantOffer(int id)
    {
        var offer = await _context.RestaurantOffers.FindAsync(id);
        if (offer == null)
        {
            return NotFound();
        }

        // Only allow deletion if still pending
        if (offer.Status != Models.Enums.OfferStatus.Pending)
        {
            return BadRequest("Cannot delete non-pending offers");
        }

        _context.RestaurantOffers.Remove(offer);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> RestaurantOfferExists(int id)
    {
        return await _context.RestaurantOffers.AnyAsync(e => e.OfferId == id);
    }
}

public class CreateRestaurantOfferDto
{
    public int RequirementId { get; set; }
    public int RestaurantId { get; set; }
    public decimal PricePerHead { get; set; }
    public int MinimumPeople { get; set; }
    public int MaximumPeople { get; set; }
    public string? MealType { get; set; }
    public bool IncludesBeverages { get; set; }
    public string? Notes { get; set; }
}
