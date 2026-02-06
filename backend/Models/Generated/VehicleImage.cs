using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class VehicleImage
{
    public int ImageId { get; set; }

    public int VehicleId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public string? Caption { get; set; }

    public bool IsPrimary { get; set; }

    public int DisplayOrder { get; set; }

    public virtual Vehicle Vehicle { get; set; } = null!;
}
