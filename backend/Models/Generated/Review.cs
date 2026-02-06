using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Review
{
    public int ReviewId { get; set; }

    public int TourId { get; set; }

    public int UserId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsVerified { get; set; }

    public int HelpfulCount { get; set; }

    public int? TouristId { get; set; }

    public virtual Tour Tour { get; set; } = null!;

    public virtual Tourist? Tourist { get; set; }

    public virtual User User { get; set; } = null!;
}
