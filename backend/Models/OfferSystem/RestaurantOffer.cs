using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models.MealManagement;
using backend.Models.Supporting;
using backend.Models.Enums;

namespace backend.Models.OfferSystem;

public class RestaurantOffer : Offer
{
    [Column(TypeName = "decimal(18,2)")]
    public decimal PricePerHead { get; set; }

    public int MinimumPeople { get; set; } = 1;

    public int MaximumPeople { get; set; } = 100;

    [MaxLength(100)]
    public string? MealType { get; set; } // "Breakfast", "Lunch & Dinner", etc.

    public bool IncludesBeverages { get; set; } = false;

    // Navigation Properties
    public virtual ICollection<OfferMenuItem> OfferMenuItems { get; set; } = new List<OfferMenuItem>();
    public virtual RestaurantAssignment? RestaurantAssignment { get; set; }
}
