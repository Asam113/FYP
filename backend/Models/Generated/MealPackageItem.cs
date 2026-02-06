using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class MealPackageItem
{
    public int MealPackageItemId { get; set; }

    public int MealPackageId { get; set; }

    public int MenuItemId { get; set; }

    public int Quantity { get; set; }

    public decimal PricePerUnit { get; set; }

    public decimal Subtotal { get; set; }

    public virtual MealPackage MealPackage { get; set; } = null!;

    public virtual MenuItem MenuItem { get; set; } = null!;
}
