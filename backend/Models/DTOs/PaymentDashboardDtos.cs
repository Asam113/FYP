using backend.Models.Enums;

namespace backend.Models.DTOs;

public class PaymentStatsDto
{
    public decimal TotalRevenue { get; set; }
    public decimal PendingPayments { get; set; }
    public decimal TotalRefunded { get; set; }
    public decimal FailedAttempts { get; set; }
}

public class PaymentLedgerDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Inbound, Outbound, Refund
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Date { get; set; } = string.Empty;
    public string Method { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
