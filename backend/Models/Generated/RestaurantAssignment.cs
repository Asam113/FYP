using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class RestaurantAssignment
{
    public int AssignmentId { get; set; }

    public int TourId { get; set; }

    public int RestaurantId { get; set; }

    public int? RestaurantOfferId { get; set; }

    public int Status { get; set; }

    public DateTime AssignedAt { get; set; }

    public DateTime? AcceptedAt { get; set; }

    public decimal PricePerHead { get; set; }

    public int ExpectedPeople { get; set; }

    public decimal FinalPrice { get; set; }

    public string? MealScheduleText { get; set; }

    public int? OrderId { get; set; }

    public int? RequirementId { get; set; }

    public virtual ICollection<MealPackage> MealPackages { get; set; } = new List<MealPackage>();

    public virtual ICollection<MealSchedule> MealSchedules { get; set; } = new List<MealSchedule>();

    public virtual Order? Order { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ServiceRequirement? Requirement { get; set; }

    public virtual Restaurant Restaurant { get; set; } = null!;

    public virtual Offer? RestaurantOffer { get; set; }

    public virtual Tour Tour { get; set; } = null!;
}
