using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Booking
{
    public int BookingId { get; set; }

    public int TourId { get; set; }

    public int TouristId { get; set; }

    public DateTime BookingDate { get; set; }

    public int NumberOfPeople { get; set; }

    public decimal TotalAmount { get; set; }

    public int Status { get; set; }

    public DateTime? CancelledAt { get; set; }

    public string? CancellationReason { get; set; }

    public int BookingType { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual Payment? Payment { get; set; }

    public virtual ICollection<Refund> Refunds { get; set; } = new List<Refund>();

    public virtual Tour Tour { get; set; } = null!;

    public virtual Tourist Tourist { get; set; } = null!;
}
