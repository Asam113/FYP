using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.UserManagement;

namespace backend.Services;

public class DriverService : IDriverService
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public DriverService(ApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }
    public async Task<IEnumerable<object>> GetAllDriversAsync()
    {
        return await _context.Drivers
            .Include(d => d.User)
            .Include(d => d.Vehicles)
            .Select(d => new
            {
                d.DriverId,
                d.UserId,
                Name = d.User.Name,
                Contact = d.User.PhoneNumber,
                Email = d.User.Email, // Needed for email notification
                CNIC = d.CNIC,
                License = d.Licence,
                Vehicle = d.Vehicles.FirstOrDefault() != null 
                    ? $"{d.Vehicles.FirstOrDefault()!.Model} ({d.Vehicles.FirstOrDefault()!.RegistrationNumber})" 
                    : "No Vehicle",
                d.AccountStatus,
                Rating = 0.0, // Placeholder, calculate if you have ratings
                TotalTrips = d.TourAssignments.Count(t => t.Status == AssignmentStatus.Completed),
                Avatar = d.User.ProfilePicture ?? "https://ui-avatars.com/api/?name=" + d.User.Name,
                Documents = new 
                {
                    CnicFront = d.CnicFront,
                    CnicBack = d.CnicBack,
                    License = d.LicenceImage
                }
            })
            .ToListAsync();
    }

    public async Task<object?> GetDriverByIdAsync(int driverId)
    {
        return await _context.Drivers
            .Include(d => d.User)
            .Include(d => d.Vehicles)
            .Where(d => d.DriverId == driverId)
            .Select(d => new
            {
                d.DriverId,
                d.UserId,
                Name = d.User.Name,
                Contact = d.User.PhoneNumber,
                Email = d.User.Email,
                CNIC = d.CNIC,
                License = d.Licence,
                d.AccountStatus,
                Rating = 0.0,
                TotalTrips = d.TourAssignments.Count(t => t.Status == AssignmentStatus.Completed),
                Avatar = d.User.ProfilePicture ?? "https://ui-avatars.com/api/?name=" + d.User.Name,
                Documents = new
                {
                    CnicFront = d.CnicFront,
                    CnicBack = d.CnicBack,
                    License = d.LicenceImage
                },
                Vehicles = d.Vehicles.Select(v => new
                {
                    v.VehicleId,
                    v.RegistrationNumber,
                    v.VehicleType,
                    v.Model,
                    v.Capacity,
                    v.Status
                })
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateDriverStatusAsync(int driverId, string status)
    {
        var driver = await _context.Drivers.Include(d => d.User).FirstOrDefaultAsync(d => d.DriverId == driverId);
        if (driver == null) return false;

        driver.AccountStatus = status;
        await _context.SaveChangesAsync();

        // Send Email Notification
        if (driver.User != null)
        {
            string subject = $"Driver Account {status}";
            string message = $"Dear {driver.User.Name},<br><br>Your driver application has been <b>{status}</b>.";
            
            if (status == "Verified")
            {
                message += "<br>You can now log in and start accepting tours.";
            }
            else if (status == "Rejected")
            {
                message += "<br>Please contact support for more information.";
            }

            try 
            {
                await _emailService.SendEmailAsync(driver.User.Email, subject, message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }
        }

        return true;
    }
}
