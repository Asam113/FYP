using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models.Enums;

namespace backend.Models.BookingPayment;

public class Payment
{
    [Key]
    public int PaymentId { get; set; }

    [ForeignKey("Booking")]
    public int? BookingId { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = string.Empty; 

    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

    [MaxLength(10)]
    public string Currency { get; set; } = "PKR";

    [MaxLength(100)]
    public string? TransactionId { get; set; }

    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    [MaxLength(20)]
    public string PaymentType { get; set; } = "Inbound"; 

    [MaxLength(500)]
    public string? Description { get; set; }

    public virtual Booking? Booking { get; set; }
    public virtual Refund? Refund { get; set; }
}
