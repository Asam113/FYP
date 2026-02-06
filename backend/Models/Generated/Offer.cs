using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Offer
{
    public int OfferId { get; set; }

    public int? TourId { get; set; }

    public int ProviderId { get; set; }

    public string OfferType { get; set; } = null!;

    public decimal OfferedAmount { get; set; }

    public int Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? RespondedAt { get; set; }

    public string? Notes { get; set; }

    public int? VehicleId { get; set; }

    public decimal? TransportationFare { get; set; }

    public string? RouteDetails { get; set; }

    public bool? IncludesFuel { get; set; }

    public decimal? PricePerHead { get; set; }

    public int? MinimumPeople { get; set; }

    public int? MaximumPeople { get; set; }

    public string? MealType { get; set; }

    public bool? IncludesBeverages { get; set; }

    public int? RequirementId { get; set; }

    public int? PerRoomCapacity { get; set; }

    public decimal? RentPerNight { get; set; }

    public int? StayDurationDays { get; set; }

    public decimal? TotalRent { get; set; }

    public int? TotalRooms { get; set; }

    public int? RoomCategoryId { get; set; }

    public virtual ICollection<OfferMenuItem> OfferMenuItems { get; set; } = new List<OfferMenuItem>();

    public virtual Driver Provider { get; set; } = null!;

    public virtual Restaurant ProviderNavigation { get; set; } = null!;

    public virtual ServiceRequirement? Requirement { get; set; }

    public virtual RestaurantAssignment? RestaurantAssignment { get; set; }

    public virtual RoomCategory? RoomCategory { get; set; }

    public virtual Tour? Tour { get; set; }

    public virtual TourAssignment? TourAssignment { get; set; }

    public virtual Vehicle? Vehicle { get; set; }
}
