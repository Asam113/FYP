using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.BookingPayment;
using backend.Models.Enums;
using backend.Models.TourManagement;
using backend.Models.UserManagement;
using backend.Models.OfferSystem;
using backend.Models.Supporting;

namespace backend.Services;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;
    private readonly IStripeService _stripeService;

    public PaymentService(ApplicationDbContext context, IStripeService stripeService)
    {
        _context = context;
        _stripeService = stripeService;
    }

    public async Task<bool> ProcessBookingPaymentAsync(int bookingId, string transactionId, decimal amount)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var booking = await _context.Bookings
                .Include(b => b.Tour)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);

            if (booking == null) return false;

            // 1. Create formal Payment record for Inbound revenue
            var payment = new Payment
            {
                BookingId = bookingId,
                Amount = amount,
                TransactionId = transactionId,
                PaymentMethod = "Stripe",
                Status = PaymentStatus.Completed,
                PaymentType = "Inbound",
                Description = $"Booking for Tour: {booking.Tour?.Title}",
                PaymentDate = DateTime.UtcNow
            };
            _context.Payments.Add(payment);

            // 2. Update Booking status
            booking.Status = BookingStatus.Confirmed;
            
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

    public async Task<bool> ProcessTourEarningsAsync(int tourId)
    {
        // This is usually triggered when a tour is completed
        // Marks all related bookings as Completed
        var bookings = await _context.Bookings.Where(b => b.TourId == tourId).ToListAsync();
        foreach (var booking in bookings)
        {
            booking.Status = BookingStatus.Completed;
        }
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ProcessRestaurantPayoutAsync(int assignmentId, string? paymentMethod)
    {
        var assignment = await _context.RestaurantAssignments
            .Include(a => a.Restaurant)
            .Include(a => a.Tour)
            .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

        if (assignment == null)
            return false;

        // Safety check for Online payouts
        if (paymentMethod == "Online" && string.IsNullOrEmpty(assignment.Restaurant?.StripeAccountId))
            return false;

        // Create Earning record
        var earning = new Earning
        {
            TourId = assignment.TourId,
            RestaurantId = assignment.RestaurantId,
            Amount = assignment.FinalPrice,
            Type = "RestaurantPayout",
            Status = paymentMethod == "Cash" ? "Paid" : "Processing",
            PaymentMethod = paymentMethod,
            EarnedAt = DateTime.UtcNow
        };
        _context.Earnings.Add(earning);
        await _context.SaveChangesAsync();

        if (paymentMethod == "Cash")
        {
            return true;
        }

        // Trigger Stripe Transfer for Online payments
        if (string.IsNullOrEmpty(assignment.Restaurant?.StripeAccountId))
        {
            return false; 
        }

        var success = await _stripeService.TransferToConnectedAccountAsync(
            assignment.Restaurant.StripeAccountId,
            assignment.FinalPrice,
            $"Payout for Tour: {assignment.Tour?.Title ?? "Unknown"} - Order Served");

        if (success)
        {
            earning.Status = "Paid";
            
            // Create formal Payment record for the Outbound payout
            var payment = new Payment
            {
                Amount = assignment.FinalPrice,
                PaymentMethod = paymentMethod ?? "Stripe",
                Status = PaymentStatus.Completed,
                PaymentType = "Outbound",
                Description = $"Payout to Restaurant: {assignment.Restaurant.RestaurantName} for Tour: {assignment.Tour?.Title}",
                PaymentDate = DateTime.UtcNow
            };
            _context.Payments.Add(payment);
            
            await _context.SaveChangesAsync();
        }

        return success;
    }

    public async Task<bool> ProcessDriverPayoutsAsync(int tourId)
    {
        var tour = await _context.Tours
            .Include(t => t.DriverOffers)
                .ThenInclude(o => o.Driver)
            .FirstOrDefaultAsync(t => t.TourId == tourId);

        if (tour == null) return false;

        bool allSuccess = true;
        foreach (var offer in tour.DriverOffers.Where(o => o.Status == OfferStatus.Confirmed))
        {
            if (string.IsNullOrEmpty(offer.Driver.StripeAccountId))
            {
                allSuccess = false;
                continue;
            }

            // Create Earning record
            var earning = new Earning
            {
                TourId = tourId,
                DriverId = offer.DriverId,
                Amount = offer.OfferedAmount,
                Type = "DriverPayout",
                Status = "Processing",
                EarnedAt = DateTime.UtcNow
            };
            _context.Earnings.Add(earning);
            await _context.SaveChangesAsync();

            // Trigger Stripe Transfer
            var success = await _stripeService.TransferToConnectedAccountAsync(
                offer.Driver.StripeAccountId!,
                offer.OfferedAmount,
                $"Payout for Tour: {tour.Title} - Tour Completed");

            if (success)
            {
                earning.Status = "Paid";
                offer.Driver.TotalEarnings += offer.OfferedAmount;

                // Create formal Payment record for the Outbound payout
                var payment = new Payment
                {
                    Amount = offer.OfferedAmount,
                    PaymentMethod = "Stripe",
                    Status = PaymentStatus.Completed,
                    PaymentType = "Outbound",
                    Description = $"Payout to Driver: {offer.Driver.User?.Name} for Tour: {tour.Title}",
                    PaymentDate = DateTime.UtcNow
                };
                _context.Payments.Add(payment);
            }
            else
            {
                allSuccess = false;
            }
        }

        await _context.SaveChangesAsync();
        return allSuccess;
    }

    public async Task<bool> ProcessSingleDriverPayoutAsync(int offerId)
    {
        var offer = await _context.DriverOffers
            .Include(o => o.Driver)
            .Include(o => o.Tour)
            .FirstOrDefaultAsync(o => o.OfferId == offerId);

        if (offer == null || string.IsNullOrEmpty(offer.Driver.StripeAccountId))
            return false;

        // Create Earning record
        var earning = new Earning
        {
            TourId = offer.TourId ?? 0,
            DriverId = offer.DriverId,
            Amount = offer.OfferedAmount,
            Type = "DriverPayout",
            Status = "Processing",
            EarnedAt = DateTime.UtcNow
        };
        _context.Earnings.Add(earning);
        await _context.SaveChangesAsync();

        // Trigger Stripe Transfer
        var success = await _stripeService.TransferToConnectedAccountAsync(
            offer.Driver.StripeAccountId!,
            offer.OfferedAmount,
            $"Payout for Tour: {offer.Tour?.Title ?? "Unknown"} - Service Completed");

        if (success)
        {
            earning.Status = "Paid";
            offer.Driver.TotalEarnings += offer.OfferedAmount;

            // Create formal Payment record for the Outbound payout
            var payment = new Payment
            {
                Amount = offer.OfferedAmount,
                PaymentMethod = "Stripe",
                Status = PaymentStatus.Completed,
                PaymentType = "Outbound",
                Description = $"Payout to Driver: {offer.Driver.User?.Name} for Tour: {offer.Tour?.Title}",
                PaymentDate = DateTime.UtcNow
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
        }

        return success;
    }
}
