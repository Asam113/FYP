using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.Supporting;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using backend.Services;

namespace backend.Controllers;

[Authorize(Roles = "Restaurant")]
[ApiController]
[Route("api/[controller]")]
public class RestaurantAssignmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPaymentService _paymentService;

    public RestaurantAssignmentsController(ApplicationDbContext context, IPaymentService paymentService)
    {
        _context = context;
        _paymentService = paymentService;
    }

    // GET: api/restaurantassignments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RestaurantAssignment>>> GetAssignments()
    {
        var restaurantId = GetRestaurantId();

        var assignments = await _context.RestaurantAssignments
            .Include(a => a.Tour)
            .Include(a => a.ServiceRequirement)
            .Include(a => a.RestaurantOffer!)
                .ThenInclude(o => o.OfferMenuItems)
                    .ThenInclude(om => om.MenuItem)
            .Where(a => a.RestaurantId == restaurantId)
            .OrderByDescending(a => a.AssignedAt)
            .ToListAsync();

        return Ok(assignments);
    }

    private int GetRestaurantId()
    {
        // Should match logic in RestaurantMenuController
        var claim = User.FindFirst("RoleSpecificId");
        if (claim != null && int.TryParse(claim.Value, out int id))
        {
            return id;
        }
        throw new UnauthorizedAccessException("Restaurant ID not found in token.");
    }

    // PUT: api/restaurantassignments/{id}/serve
    [HttpPut("{id}/serve")]
    public async Task<IActionResult> MarkAsServed(int id)
    {
        var restaurantId = GetRestaurantId();

        var assignment = await _context.RestaurantAssignments
            .FirstOrDefaultAsync(a => a.AssignmentId == id && a.RestaurantId == restaurantId);

        if (assignment == null)
            return NotFound("Order not found or unauthorized.");

        assignment.IsServed = true;
        await _context.SaveChangesAsync();

        // Trigger Stripe Payout
        try
        {
            await _paymentService.ProcessRestaurantPayoutAsync(id);
        }
        catch (Exception ex)
        {
            // Log error but don't fail the request since service is already marked as served
            Console.WriteLine($"Payout failed: {ex.Message}");
        }

        return Ok(new { message = "Order marked as served successfully and payout initiated." });
    }
}
