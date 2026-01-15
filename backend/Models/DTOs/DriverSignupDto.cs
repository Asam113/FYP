using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using backend.Models.Enums;

namespace backend.Models.DTOs;

public class DriverSignupDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Phone]
    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [Required]
    [MaxLength(15)]
    public string CNIC { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Licence { get; set; } = string.Empty;

    public DateTime? LicenceExpiryDate { get; set; }

    public IFormFile? ProfilePicture { get; set; }

    [Required]
    public IFormFile CnicFront { get; set; } = null!;

    [Required]
    public IFormFile CnicBack { get; set; } = null!;

    [Required]
    public IFormFile LicenceImage { get; set; } = null!;

    // Vehicle Info
    [Required]
    [MaxLength(50)]
    public string VehicleRegNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string VehicleType { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? VehicleModel { get; set; }

    [Required]
    public int VehicleCapacity { get; set; }
}
