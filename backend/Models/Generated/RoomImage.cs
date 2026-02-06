using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class RoomImage
{
    public int RoomImageId { get; set; }

    public int RoomCategoryId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public bool IsPrimary { get; set; }

    public int DisplayOrder { get; set; }

    public virtual RoomCategory RoomCategory { get; set; } = null!;
}
