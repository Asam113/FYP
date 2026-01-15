using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.TourManagement;
using backend.Models.Enums;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToursController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ToursController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/tours
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tour>>> GetTours()
    {
        return await _context.Tours.ToListAsync();
    }

    // GET: api/tours/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Tour>> GetTour(int id)
    {
        var tour = await _context.Tours.FindAsync(id);

        if (tour == null)
        {
            return NotFound();
        }

        return tour;
    }

    // POST: api/tours
    [HttpPost]
    public async Task<ActionResult<Tour>> CreateTour(Tour tour)
    {
        _context.Tours.Add(tour);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTour), new { id = tour.TourId }, tour);
    }

    // Test endpoint to verify database connection
    [HttpGet("test-connection")]
    public async Task<ActionResult<object>> TestConnection()
    {
        try
        {
            var canConnect = await _context.Database.CanConnectAsync();
            if (canConnect)
            {
                return Ok(new { 
                    success = true, 
                    message = "✅ Database connection successful!",
                    databaseName = _context.Database.GetDbConnection().Database,
                    serverName = _context.Database.GetDbConnection().DataSource
                });
            }
            return StatusCode(500, new { 
                success = false, 
                message = "❌ Cannot connect to database",
                hint = "Database might not exist. Try calling POST /api/tours/create-database"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                success = false, 
                message = $"❌ Error: {ex.Message}",
                innerException = ex.InnerException?.Message,
                stackTrace = ex.StackTrace?.Split('\n').Take(5)
            });
        }
    }

    // Test endpoint to create database
    [HttpPost("create-database")]
    public async Task<ActionResult<string>> CreateDatabase()
    {
        try
        {
            await _context.Database.EnsureCreatedAsync();
            return Ok("✅ Database created successfully!");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"❌ Error: {ex.Message}");
        }
    }
}
