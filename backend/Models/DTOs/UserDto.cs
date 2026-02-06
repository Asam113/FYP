using backend.Models.Enums;

namespace backend.Models.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public UserRole Role { get; set; }
    public int? RoleSpecificId { get; set; } // TouristId, DriverId, or RestaurantId
    public string? ProfilePicture { get; set; }
    public string Status { get; set; } = "Approved"; // Default to Approved
}
