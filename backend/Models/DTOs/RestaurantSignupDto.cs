using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using backend.Models.Enums;

namespace backend.Models.DTOs;

public class RestaurantSignupDto
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
    [MaxLength(200)]
    public string RestaurantName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? OwnerName { get; set; }

    [MaxLength(100)]
    public string? BusinessType { get; set; }

    [MaxLength(100)]
    public string? BusinessLicense { get; set; }

    [Required]
    [MaxLength(300)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? PostalCode { get; set; }

    public IFormFile? ProfilePicture { get; set; }
    public IFormFile? LicenseDocument { get; set; }
    
    public string? MenuJson { get; set; }
}
