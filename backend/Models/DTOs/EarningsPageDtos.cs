namespace backend.Models.DTOs;

public class UserEarningsSummaryDto
{
    public decimal TotalEarned { get; set; }
    public decimal PendingPayout { get; set; }
    public decimal WithdrawnAmount { get; set; }
    public List<UserEarningRecordDto> Transactions { get; set; } = new();
}

public class UserEarningRecordDto
{
    public int EarningId { get; set; }
    public string TourTitle { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty; // Pending, Processing, Paid
    public string Date { get; set; } = string.Empty;
    public string Method { get; set; } = string.Empty;
}
