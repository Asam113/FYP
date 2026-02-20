using backend.Data;
using backend.Models.Enums;
using backend.Models.Supporting;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;

    public PaymentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ProcessTourEarningsAsync(int tourId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Process Driver Earnings
            var driverOffers = await _context.DriverOffers
                .Where(o => o.TourId == tourId && o.Status == OfferStatus.Confirmed)
                .Include(o => o.Driver)
                .ToListAsync();

            foreach (var offer in driverOffers)
            {
                // Check if earning already exists to prevent duplicates
                var existingEarning = await _context.Earnings
                    .AnyAsync(e => e.TourId == tourId && e.DriverId == offer.Driver.DriverId);

                if (!existingEarning)
                {
                    var earning = new Earning
                    {
                        TourId = tourId,
                        DriverId = offer.Driver.DriverId,
                        Amount = offer.OfferedAmount,
                        Type = "TourPayment",
                        Status = "Pending",
                        EarnedAt = DateTime.UtcNow
                    };

                    _context.Earnings.Add(earning);
                    
                    // Update Driver Total Earnings
                    offer.Driver.TotalEarnings += offer.OfferedAmount;
                    _context.Entry(offer.Driver).State = EntityState.Modified;
                }
            }

            // 2. Process Restaurant Earnings
            // We use RestaurantAssignments because they contain the FinalPrice and are created upon confirmation
            var restaurantAssignments = await _context.RestaurantAssignments
                .Where(a => a.TourId == tourId)
                .Include(a => a.Restaurant)
                .ToListAsync();

            foreach (var assignment in restaurantAssignments)
            {
                // Check if earning already exists
                var existingEarning = await _context.Earnings
                    .AnyAsync(e => e.TourId == tourId && e.RestaurantId == assignment.RestaurantId && e.Type == "TourPayment");

                if (!existingEarning)
                {
                    var earning = new Earning
                    {
                        TourId = tourId,
                        RestaurantId = assignment.RestaurantId,
                        Amount = assignment.FinalPrice,
                        Type = "TourPayment",
                        Status = "Pending",
                        EarnedAt = DateTime.UtcNow
                    };

                    _context.Earnings.Add(earning);
                    
                    // Note: Restaurant model currently doesn't have TotalEarnings property exposed or used broadly, 
                    // skipping update to that property for now to match model definition.
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return true;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
