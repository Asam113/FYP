using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models.Enums;
using backend.Models.TourManagement;

namespace backend.Models.OfferSystem;

public abstract class Offer
{
    [Key]
    public int OfferId { get; set; }

    [Required]
    [ForeignKey("Tour")]
    public int TourId { get; set; }

    [Required]
    public int ProviderId { get; set; } // DriverId or RestaurantId

    [Required]
    [MaxLength(50)]
    public string OfferType { get; set; } = string.Empty; // "Driver" or "Restaurant"

    [Column(TypeName = "decimal(18,2)")]
    public decimal OfferedAmount { get; set; }

    public OfferStatus Status { get; set; } = OfferStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? RespondedAt { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    // Navigation Properties
    public virtual Tour Tour { get; set; } = null!;
}
