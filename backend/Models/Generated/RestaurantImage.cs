using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class RestaurantImage
{
    public int ImageId { get; set; }

    public int RestaurantId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public string? Caption { get; set; }

    public bool IsPrimary { get; set; }

    public int DisplayOrder { get; set; }

    public virtual Restaurant Restaurant { get; set; } = null!;
}
