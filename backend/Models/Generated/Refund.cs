using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Refund
{
    public int RefundId { get; set; }

    public int PaymentId { get; set; }

    public int BookingId { get; set; }

    public decimal RefundAmount { get; set; }

    public string Reason { get; set; } = null!;

    public int Status { get; set; }

    public DateTime RequestedAt { get; set; }

    public DateTime? ProcessedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Payment Payment { get; set; } = null!;
}
