using System;
using System.Collections.Generic;

namespace backend.Models.Generated;

public partial class Document
{
    public int DocumentId { get; set; }

    public string DocumentType { get; set; } = null!;

    public string DocumentUrl { get; set; } = null!;

    public DateTime UploadedAt { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public string VerificationStatus { get; set; } = null!;

    public int? DriverId { get; set; }

    public int? RestaurantId { get; set; }

    public virtual Driver? Driver { get; set; }

    public virtual Restaurant? Restaurant { get; set; }
}
