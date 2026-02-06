using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class TourAssignment
{
    public int AssignmentId { get; set; }

    public int TourId { get; set; }

    public int DriverId { get; set; }

    public int VehicleId { get; set; }

    public int? DriverOfferId { get; set; }

    public int Status { get; set; }

    public DateTime AssignedAt { get; set; }

    public DateTime? AcceptedAt { get; set; }

    public decimal FinalPrice { get; set; }

    public string? Notes { get; set; }

    public virtual Driver Driver { get; set; } = null!;

    public virtual Offer? DriverOffer { get; set; }

    public virtual Tour Tour { get; set; } = null!;

    public virtual Vehicle Vehicle { get; set; } = null!;
}
