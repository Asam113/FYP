using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Earning
{
    public int EarningId { get; set; }

    public int? TourId { get; set; }

    public decimal Amount { get; set; }

    public string Type { get; set; } = null!;

    public DateTime EarnedAt { get; set; }

    public string Status { get; set; } = null!;

    public int? DriverId { get; set; }

    public int? RestaurantId { get; set; }

    public virtual Driver? Driver { get; set; }

    public virtual Restaurant? Restaurant { get; set; }

    public virtual Tour? Tour { get; set; }
}
