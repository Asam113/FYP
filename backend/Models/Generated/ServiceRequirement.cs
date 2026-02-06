using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class ServiceRequirement
{
    public int RequirementId { get; set; }

    public int TourId { get; set; }

    public string Type { get; set; } = null!;

    public string? Location { get; set; }

    public DateTime DateNeeded { get; set; }

    public int EstimatedPeople { get; set; }

    public decimal? EstimatedBudget { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public int? StayDurationDays { get; set; }

    public string? Time { get; set; }

    public virtual ICollection<Offer> Offers { get; set; } = new List<Offer>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<RestaurantAssignment> RestaurantAssignments { get; set; } = new List<RestaurantAssignment>();

    public virtual Tour Tour { get; set; } = null!;
}
