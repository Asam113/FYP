using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.OfferSystem;
using backend.Models.Supporting;
using backend.Models.RestaurantMenu;
using backend.Models.MealManagement;

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

        // Validate based on requirement type
        if (requirement.Type == "Meal")
        {
            if (!dto.PricePerHead.HasValue || !dto.MinimumPeople.HasValue || !dto.MaximumPeople.HasValue)
            {
                return BadRequest("Meal offers require PricePerHead, MinimumPeople, and MaximumPeople");
            }
        }
        else if (requirement.Type == "Accommodation")
        {
            if (!dto.RentPerNight.HasValue || !dto.PerRoomCapacity.HasValue || !dto.TotalRooms.HasValue || !dto.TotalRent.HasValue)
            {
                return BadRequest("Accommodation offers require RentPerNight, PerRoomCapacity, TotalRooms, and TotalRent");
            }
        }

        var offer = new RestaurantOffer
        {
            RequirementId = dto.RequirementId,
            ProviderId = dto.RestaurantId,
            
            // Meal fields
            PricePerHead = dto.PricePerHead ?? 0,
            MinimumPeople = dto.MinimumPeople ?? 0,
            MaximumPeople = dto.MaximumPeople ?? 0,
            MealType = dto.MealType,
            IncludesBeverages = dto.IncludesBeverages,
            
            // Accommodation fields
            RentPerNight = dto.RentPerNight,
            PerRoomCapacity = dto.PerRoomCapacity,
            TotalRooms = dto.TotalRooms,
            TotalRent = dto.TotalRent,
            StayDurationDays = dto.StayDurationDays,
            
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

    [HttpPut("{id}/reject")]
    public async Task<IActionResult> RejectRestaurantOffer(int id)
    {
        var offer = await _context.RestaurantOffers
            .Include(o => o.ServiceRequirement)
            .FirstOrDefaultAsync(o => o.OfferId == id); // Need to check if it was accepted
            
        if (offer == null) return NotFound();

        // If offer was previously accepted, we need to clean up the Order and Assignment
        if (offer.Status == Models.Enums.OfferStatus.Accepted || offer.Status == Models.Enums.OfferStatus.Confirmed)
        {
            var assignment = await _context.RestaurantAssignments
                .Include(a => a.Order)
                .ThenInclude(o => o.OrderItems)
                .FirstOrDefaultAsync(a => a.RestaurantOfferId == id);

            if (assignment != null)
            {
                // Delete Order (and items via cascade or manual if restrict)
                if (assignment.Order != null)
                {
                    _context.OrderItems.RemoveRange(assignment.Order.OrderItems);
                    _context.Orders.Remove(assignment.Order);
                }

                // Delete OfferMenuItems associated with this offer?
                // Yes, if we are rejecting, we should clear the selection.
                var offerMenuItems = await _context.OfferMenuItems.Where(om => om.RestaurantOfferId == id).ToListAsync();
                _context.OfferMenuItems.RemoveRange(offerMenuItems);

                _context.RestaurantAssignments.Remove(assignment);
            }
            
            // Should requirements status be reverted to Open?
            if (offer.ServiceRequirement != null)
            {
                offer.ServiceRequirement.Status = "Open";
            }
        }

        offer.Status = Models.Enums.OfferStatus.Rejected;
        offer.RespondedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Offer rejected" });
    }

    [HttpPost("{id}/accept")]
    public async Task<IActionResult> AcceptRestaurantOffer(int id, [FromBody] AcceptRestaurantOfferDto dto)
    {
        var offer = await _context.RestaurantOffers
            .Include(o => o.ServiceRequirement)
            .FirstOrDefaultAsync(o => o.OfferId == id);

        if (offer == null) return NotFound();

        // 1. Update Offer Status
        offer.Status = Models.Enums.OfferStatus.Accepted;
        offer.RespondedAt = DateTime.UtcNow;

        // 2. Create Assignment
        var assignment = new RestaurantAssignment
        {
            TourId = offer.ServiceRequirement.TourId,
            RestaurantId = offer.ProviderId,
            RestaurantOfferId = offer.OfferId,
            RequirementId = offer.RequirementId,
            Status = Models.Enums.AssignmentStatus.Assigned,
            AssignedAt = DateTime.UtcNow,
            PricePerHead = offer.PricePerHead,
            ExpectedPeople = offer.ServiceRequirement.EstimatedPeople,
            FinalPrice = offer.PricePerHead * offer.ServiceRequirement.EstimatedPeople,
            MealScheduleText = $"{offer.MealType} at {offer.ServiceRequirement.Location}"
        };

        _context.RestaurantAssignments.Add(assignment);
        await _context.SaveChangesAsync();

        // 3. Create Order (Linked to Assignment)
        var order = new Order
        {
            RestaurantAssignmentId = assignment.AssignmentId,
            TourId = assignment.TourId,
            RequirementId = (int)assignment.RequirementId,
            NumberOfPeople = assignment.ExpectedPeople,
            OrderDate = DateTime.UtcNow,
            TotalAmount = assignment.FinalPrice,
            Status = Models.Enums.OrderStatus.Confirmed
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Update Assignment with OrderId
        assignment.OrderId = order.OrderId;

        // 4. Create OrderItems & OfferMenuItems
        if (dto.SelectedMenuItems != null && dto.SelectedMenuItems.Any())
        {
            var itemIds = dto.SelectedMenuItems.Select(i => i.ItemId).ToList();
            var dbMenuItems = await _context.MenuItems.Where(m => itemIds.Contains(m.ItemId)).ToListAsync();

            Models.Enums.MealType mealType;
            if (!Enum.TryParse(offer.MealType, true, out mealType))
            {
                mealType = Models.Enums.MealType.Lunch; // Default fallback
            }

            foreach (var itemDto in dto.SelectedMenuItems)
            {
                var dbItem = dbMenuItems.FirstOrDefault(m => m.ItemId == itemDto.ItemId);
                if (dbItem != null)
                {
                    // Add to OrderItems
                    _context.OrderItems.Add(new OrderItem
                    {
                        OrderId = order.OrderId,
                        MenuItemId = dbItem.ItemId,
                        Quantity = itemDto.Quantity,
                        PricePerUnit = dbItem.Price,
                        Subtotal = dbItem.Price * itemDto.Quantity
                    });

                    // Add to OfferMenuItems
                    _context.OfferMenuItems.Add(new OfferMenuItem
                    {
                        RestaurantOfferId = offer.OfferId,
                        MenuItemId = dbItem.ItemId,
                        MealType = mealType,
                        Quantity = itemDto.Quantity,
                        PriceAtOffer = dbItem.Price,
                        Subtotal = dbItem.Price * itemDto.Quantity
                    });
                }
            }
            await _context.SaveChangesAsync();
        }
        
        return Ok(new { message = "Offer accepted and order created", assignmentId = assignment.AssignmentId });
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
    
    // Meal offer fields (nullable for accommodation offers)
    public decimal? PricePerHead { get; set; }
    public int? MinimumPeople { get; set; }
    public int? MaximumPeople { get; set; }
    public string? MealType { get; set; }
    public bool IncludesBeverages { get; set; }
    
    // Accommodation offer fields (nullable for meal offers)
    public decimal? RentPerNight { get; set; }
    public int? PerRoomCapacity { get; set; }
    public int? TotalRooms { get; set; }
    public decimal? TotalRent { get; set; }
    public int? StayDurationDays { get; set; }
    
    public string? Notes { get; set; }
}

public class AcceptRestaurantOfferDto
{
    public List<SelectedMenuItemDto> SelectedMenuItems { get; set; } = new();
}

public class SelectedMenuItemDto
{
    public int ItemId { get; set; }
    public int Quantity { get; set; }
}
