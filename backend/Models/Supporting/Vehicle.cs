using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models.UserManagement;
using backend.Models.OfferSystem;

namespace backend.Models.Supporting;

public class Vehicle
{
    [Key]
    public int VehicleId { get; set; }

    [Required]
    [ForeignKey("Driver")]
    public int DriverId { get; set; }

    [Required]
    [MaxLength(50)]
    public string RegistrationNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string VehicleType { get; set; } = string.Empty; // "Coaster", "Hiace", "Car", etc.

    [MaxLength(50)]
    public string? Model { get; set; }

    [Required]
    public int Capacity { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "Active";

    // Navigation Properties
    public virtual Driver? Driver { get; set; }
    public virtual ICollection<DriverOffer> DriverOffers { get; set; } = new List<DriverOffer>();
}
