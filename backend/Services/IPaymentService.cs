using backend.Models.Supporting;

namespace backend.Services;

public interface IPaymentService
{
    Task<bool> ProcessTourEarningsAsync(int tourId);
}
