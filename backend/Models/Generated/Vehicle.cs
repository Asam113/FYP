using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Vehicle
{
    public int VehicleId { get; set; }

    public int DriverId { get; set; }

    public string RegistrationNumber { get; set; } = null!;

    public string VehicleType { get; set; } = null!;

    public string? Model { get; set; }

    public int Capacity { get; set; }

    public string Status { get; set; } = null!;

    public virtual Driver Driver { get; set; } = null!;

    public virtual ICollection<Offer> Offers { get; set; } = new List<Offer>();

    public virtual ICollection<TourAssignment> TourAssignments { get; set; } = new List<TourAssignment>();

    public virtual ICollection<VehicleImage> VehicleImages { get; set; } = new List<VehicleImage>();
}
