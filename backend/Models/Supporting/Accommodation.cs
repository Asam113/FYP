using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models.TourManagement;

namespace backend.Models.Supporting;

public class Accommodation
{
    [Key]
    public int AccommodationId { get; set; }

    [Required]
    [ForeignKey("Tour")]
    public int TourId { get; set; }

    [Required]
    [MaxLength(200)]
    public string HotelName { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Location { get; set; }

    [MaxLength(100)]
    public string? RoomType { get; set; }

    public int NumberOfRooms { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal CostPerNight { get; set; }

    public int NumberOfNights { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalCost { get; set; }

    public DateTime? CheckInDate { get; set; }

    public DateTime? CheckOutDate { get; set; }

    // Navigation Properties
    public virtual Tour Tour { get; set; } = null!;
}
