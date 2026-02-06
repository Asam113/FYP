using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int BookingId { get; set; }

    public decimal Amount { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public DateTime PaymentDate { get; set; }

    public string Currency { get; set; } = null!;

    public string? TransactionId { get; set; }

    public int Status { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Refund? Refund { get; set; }
}
