using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models.Supporting;
using backend.Models.TourManagement;

namespace backend.Models.OfferSystem;

public class DriverOffer : Offer
{
    [Required]
    [ForeignKey("Vehicle")]
    public int VehicleId { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TransportationFare { get; set; }

    [MaxLength(500)]
    public string? RouteDetails { get; set; }

    public bool IncludesFuel { get; set; } = true;

    // Navigation Properties
    public virtual Vehicle Vehicle { get; set; } = null!;
    public virtual TourAssignment? TourAssignment { get; set; }
}
