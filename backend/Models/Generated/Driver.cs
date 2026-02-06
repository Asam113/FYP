using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Driver
{
    public int DriverId { get; set; }

    public int UserId { get; set; }

    public string? Cnic { get; set; }

    public string? Licence { get; set; }

    public DateTime? LicenceExpiryDate { get; set; }

    public string AccountStatus { get; set; } = null!;

    public decimal TotalEarnings { get; set; }

    public string? CnicBack { get; set; }

    public string? CnicFront { get; set; }

    public string? LicenceImage { get; set; }

    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();

    public virtual ICollection<Earning> Earnings { get; set; } = new List<Earning>();

    public virtual ICollection<Offer> Offers { get; set; } = new List<Offer>();

    public virtual ICollection<TourAssignment> TourAssignments { get; set; } = new List<TourAssignment>();

    public virtual User User { get; set; } = null!;

    public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}
