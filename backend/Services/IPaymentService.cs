using backend.Models.Supporting;

namespace backend.Services;

public interface IPaymentService
{
    Task<bool> ProcessBookingPaymentAsync(int bookingId, string transactionId, decimal amount);
    Task<bool> ProcessTourEarningsAsync(int tourId);
    Task<bool> ProcessRestaurantPayoutAsync(int assignmentId, string? paymentMethod);
    Task<bool> ProcessDriverPayoutsAsync(int tourId);
    Task<bool> ProcessSingleDriverPayoutAsync(int offerId);
}
