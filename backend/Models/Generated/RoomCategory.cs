using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class RoomCategory
{
    public int RoomCategoryId { get; set; }

    public int RestaurantId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Description { get; set; }

    public decimal PricePerNight { get; set; }

    public int MaxGuests { get; set; }

    public int TotalRooms { get; set; }

    public int AvailableRooms { get; set; }

    public string? Amenities { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Offer> Offers { get; set; } = new List<Offer>();

    public virtual Restaurant Restaurant { get; set; } = null!;

    public virtual ICollection<RoomImage> RoomImages { get; set; } = new List<RoomImage>();
}
