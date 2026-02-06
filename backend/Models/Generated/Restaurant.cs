using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Restaurant
{
    public int RestaurantId { get; set; }

    public int UserId { get; set; }

    public string RestaurantName { get; set; } = null!;

    public string? BusinessType { get; set; }

    public decimal Rating { get; set; }

    public string? BusinessLicense { get; set; }

    public string? PostalCode { get; set; }

    public string? OwnerName { get; set; }

    public string Address { get; set; } = null!;

    public int ApplicationStatus { get; set; }

    public bool ProvidesMeal { get; set; }

    public bool ProvidesRoom { get; set; }

    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();

    public virtual ICollection<Earning> Earnings { get; set; } = new List<Earning>();

    public virtual ICollection<Menu> Menus { get; set; } = new List<Menu>();

    public virtual ICollection<Offer> Offers { get; set; } = new List<Offer>();

    public virtual ICollection<RestaurantAssignment> RestaurantAssignments { get; set; } = new List<RestaurantAssignment>();

    public virtual ICollection<RestaurantImage> RestaurantImages { get; set; } = new List<RestaurantImage>();

    public virtual ICollection<RoomCategory> RoomCategories { get; set; } = new List<RoomCategory>();

    public virtual User User { get; set; } = null!;
}
