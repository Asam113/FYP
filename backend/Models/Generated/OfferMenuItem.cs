using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class OfferMenuItem
{
    public int OfferMenuItemId { get; set; }

    public int RestaurantOfferId { get; set; }

    public int MenuItemId { get; set; }

    public int MealType { get; set; }

    public int Quantity { get; set; }

    public decimal PriceAtOffer { get; set; }

    public decimal Subtotal { get; set; }

    public virtual MenuItem MenuItem { get; set; } = null!;

    public virtual Offer RestaurantOffer { get; set; } = null!;
}
