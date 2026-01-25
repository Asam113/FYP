using Microsoft.AspNetCore.Mvc;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DriversController : ControllerBase
{
    private readonly IDriverService _driverService;

    public DriversController(IDriverService driverService)
    {
        _driverService = driverService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllDrivers()
    {
        var drivers = await _driverService.GetAllDriversAsync();
        return Ok(drivers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDriverById(int id)
    {
        var driver = await _driverService.GetDriverByIdAsync(id);
        if (driver == null) return NotFound(new { message = "Driver not found" });
        return Ok(driver);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateDto request)
    {
        var success = await _driverService.UpdateDriverStatusAsync(id, request.Status);
        if (!success) return NotFound(new { message = "Driver not found" });
        return Ok(new { message = $"Driver status updated to {request.Status}" });
    }

}

public class StatusUpdateDto
{
    public string Status { get; set; } = string.Empty;
}
