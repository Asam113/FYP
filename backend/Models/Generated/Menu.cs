using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Menu
{
    public int MenuId { get; set; }

    public int RestaurantId { get; set; }

    public string MenuName { get; set; } = null!;

    public string? Description { get; set; }

    public string? Category { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();

    public virtual Restaurant Restaurant { get; set; } = null!;
}
