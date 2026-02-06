using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class MealPackage
{
    public int MealPackageId { get; set; }

    public int RestaurantAssignmentId { get; set; }

    public int MealScheduleId { get; set; }

    public int MealType { get; set; }

    public decimal TotalPerHead { get; set; }

    public string? PackageName { get; set; }

    public virtual ICollection<MealPackageItem> MealPackageItems { get; set; } = new List<MealPackageItem>();

    public virtual MealSchedule MealSchedule { get; set; } = null!;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual RestaurantAssignment RestaurantAssignment { get; set; } = null!;
}
