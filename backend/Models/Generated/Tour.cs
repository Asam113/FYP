using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Tour
{
    public int TourId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string DepartureLocation { get; set; } = null!;

    public string Destination { get; set; } = null!;

    public int DurationDays { get; set; }

    public int MaxCapacity { get; set; }

    public int CurrentBookings { get; set; }

    public decimal PricePerHead { get; set; }

    public decimal? CoupleDiscountPercentage { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int Status { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? BulkBookingMinPersons { get; set; }

    public decimal? BulkDiscountPercentage { get; set; }

    public DateTime? FinalizedAt { get; set; }

    public virtual ICollection<Accommodation> Accommodations { get; set; } = new List<Accommodation>();

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<Earning> Earnings { get; set; } = new List<Earning>();

    public virtual ICollection<Offer> Offers { get; set; } = new List<Offer>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<RestaurantAssignment> RestaurantAssignments { get; set; } = new List<RestaurantAssignment>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<ServiceRequirement> ServiceRequirements { get; set; } = new List<ServiceRequirement>();

    public virtual ICollection<TourAssignment> TourAssignments { get; set; } = new List<TourAssignment>();

    public virtual ICollection<TourImage> TourImages { get; set; } = new List<TourImage>();
}
