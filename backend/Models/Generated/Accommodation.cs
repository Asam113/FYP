using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Accommodation
{
    public int AccommodationId { get; set; }

    public int TourId { get; set; }

    public string HotelName { get; set; } = null!;

    public string? Location { get; set; }

    public string? RoomType { get; set; }

    public int NumberOfRooms { get; set; }

    public decimal CostPerNight { get; set; }

    public int NumberOfNights { get; set; }

    public decimal TotalCost { get; set; }

    public DateTime? CheckInDate { get; set; }

    public DateTime? CheckOutDate { get; set; }

    public virtual Tour Tour { get; set; } = null!;
}
