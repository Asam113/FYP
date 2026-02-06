using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class MealSchedule
{
    public int MealScheduleId { get; set; }

    public int RestaurantAssignmentId { get; set; }

    public int DayNumber { get; set; }

    public int MealType { get; set; }

    public TimeOnly ScheduledTime { get; set; }

    public string? Location { get; set; }

    public bool IsIncluded { get; set; }

    public string? SpecialInstructions { get; set; }

    public virtual MealPackage? MealPackage { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual RestaurantAssignment RestaurantAssignment { get; set; } = null!;
}
