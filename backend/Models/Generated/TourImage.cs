using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class TourImage
{
    public int ImageId { get; set; }

    public int TourId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public string? Caption { get; set; }

    public bool IsPrimary { get; set; }

    public int DisplayOrder { get; set; }

    public virtual Tour Tour { get; set; } = null!;
}
