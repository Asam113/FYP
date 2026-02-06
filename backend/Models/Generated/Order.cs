using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Order
{
    public int OrderId { get; set; }

    public int TourId { get; set; }

    public int RestaurantAssignmentId { get; set; }

    public int? MealScheduleId { get; set; }

    public int? MealPackageId { get; set; }

    public int? BookingId { get; set; }

    public DateTime OrderDate { get; set; }

    public decimal TotalAmount { get; set; }

    public int Status { get; set; }

    public int NumberOfPeople { get; set; }

    public string? SpecialRequests { get; set; }

    public DateTime? ScheduledTime { get; set; }

    public int RequirementId { get; set; }

    public virtual Booking? Booking { get; set; }

    public virtual MealPackage? MealPackage { get; set; }

    public virtual MealSchedule? MealSchedule { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ServiceRequirement Requirement { get; set; } = null!;

    public virtual RestaurantAssignment RestaurantAssignment { get; set; } = null!;

    public virtual ICollection<RestaurantAssignment> RestaurantAssignments { get; set; } = new List<RestaurantAssignment>();

    public virtual Tour Tour { get; set; } = null!;
}
