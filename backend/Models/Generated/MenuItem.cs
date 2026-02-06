using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class MenuItem
{
    public int ItemId { get; set; }

    public int MenuId { get; set; }

    public string ItemName { get; set; } = null!;

    public decimal Price { get; set; }

    public string? Description { get; set; }

    public string? Image { get; set; }

    public bool IsAvailable { get; set; }

    public virtual ICollection<MealPackageItem> MealPackageItems { get; set; } = new List<MealPackageItem>();

    public virtual Menu Menu { get; set; } = null!;

    public virtual ICollection<OfferMenuItem> OfferMenuItems { get; set; } = new List<OfferMenuItem>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
