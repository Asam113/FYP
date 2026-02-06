using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Tourist
{
    public int TouristId { get; set; }

    public int UserId { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual User User { get; set; } = null!;
}
