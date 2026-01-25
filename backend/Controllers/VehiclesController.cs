using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.Supporting;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VehiclesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("driver/{driverId}")]
    public async Task<ActionResult<IEnumerable<Vehicle>>> GetDriverVehicles(int driverId)
    {
        var vehicles = await _context.Vehicles
            .Where(v => v.DriverId == driverId && v.Status != "Inactive")
            .ToListAsync();

        return Ok(vehicles);
    }

    // GET: api/vehicles/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Vehicle>> GetVehicle(int id)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);

        if (vehicle == null)
        {
            return NotFound();
        }

        return vehicle;
    }

    [HttpPost]
    public async Task<ActionResult<Vehicle>> CreateVehicle(Vehicle vehicle)
    {
        // Basic validation
        if (vehicle.DriverId <= 0) return BadRequest("Invalid DriverId");
        
        // Clear navigation properties to avoid issues
        vehicle.Driver = null!;
        vehicle.DriverOffers = new List<backend.Models.OfferSystem.DriverOffer>();
        vehicle.Status = "Pending"; // New vehicles are pending by default

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.VehicleId }, vehicle);
    }

    // PUT: api/vehicles/5/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateVehicleStatus(int id, [FromBody] StatusUpdateDto request)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null) return NotFound();

        vehicle.Status = request.Status;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Vehicle status updated to {request.Status}" });
    }

    // DELETE: api/vehicles/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null)
        {
            return NotFound();
        }

        // Check if there are active offers? 
        // For now, simple deletion (or maybe deactivate instead)
        vehicle.Status = "Inactive"; 
        // Or actually delete:
        // _context.Vehicles.Remove(vehicle);
        
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
