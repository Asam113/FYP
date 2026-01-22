using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.Supporting;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[Authorize(Roles = "Restaurant")]
[ApiController]
[Route("api/[controller]")]
public class RestaurantAssignmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RestaurantAssignmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/restaurantassignments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RestaurantAssignment>>> GetAssignments()
    {
        var restaurantId = GetRestaurantId();

        var assignments = await _context.RestaurantAssignments
            .Include(a => a.Tour)
            .Include(a => a.ServiceRequirement)
            .Include(a => a.RestaurantOffer)
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
}
