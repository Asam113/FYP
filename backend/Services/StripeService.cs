using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using backend.Models.BookingPayment;
using backend.Models.Supporting;
using backend.Models.UserManagement;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Services;

public class StripeService : IStripeService
{
    private readonly IConfiguration _config;
    private readonly ApplicationDbContext _context;

    public StripeService(IConfiguration config, ApplicationDbContext context)
    {
        _config = config;
        _context = context;
        StripeConfiguration.ApiKey = _config["Stripe:SecretKey"];
    }

    public async Task<Session> CreateCheckoutSessionAsync(int bookingId, decimal amount, string tourTitle)
    {
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long)(amount * 100), // Stripe expects amount in cents
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = tourTitle,
                        },
                    },
                    Quantity = 1,
                },
            },
            Mode = "payment",
            SuccessUrl = $"{_config["FrontendUrl"]}/tourist/booking-success?session_id={{CHECKOUT_SESSION_ID}}&booking_id={bookingId}",
            CancelUrl = $"{_config["FrontendUrl"]}/tourist/tour-details/{(await _context.Bookings.FindAsync(bookingId))?.TourId}",
            ClientReferenceId = bookingId.ToString(),
        };

        var service = new SessionService();
        return await service.CreateAsync(options);
    }

    public async Task<string> CreateConnectedAccountAsync(string email, string businessName, string type)
    {
        var options = new AccountCreateOptions
        {
            Type = "express",
            Email = email,
            Capabilities = new AccountCapabilitiesOptions
            {
                CardPayments = new AccountCapabilitiesCardPaymentsOptions { Requested = true },
                Transfers = new AccountCapabilitiesTransfersOptions { Requested = true },
            },
            BusinessProfile = new AccountBusinessProfileOptions
            {
                Name = businessName,
                ProductDescription = $"Travel service provider on Safarnama ({type})",
            }
        };

        var service = new AccountService();
        var account = await service.CreateAsync(options);
        return account.Id;
    }

    public async Task<string> CreateOnboardingLinkAsync(string stripeAccountId, string returnUrl, string refreshUrl)
    {
        var options = new AccountLinkCreateOptions
        {
            Account = stripeAccountId,
            RefreshUrl = refreshUrl,
            ReturnUrl = returnUrl,
            Type = "account_onboarding",
        };

        var service = new AccountLinkService();
        var accountLink = await service.CreateAsync(options);
        return accountLink.Url;
    }

    public async Task<bool> TransferToConnectedAccountAsync(string destinationAccountId, decimal amount, string description)
    {
        try
        {
            var options = new TransferCreateOptions
            {
                Amount = (long)(amount * 100),
                Currency = "usd",
                Destination = destinationAccountId,
                Description = description,
            };

            var service = new TransferService();
            await service.CreateAsync(options);
            return true;
        }
        catch (Exception ex)
        {
            // Log error in production
            Console.WriteLine($"Stripe Transfer Error: {ex.Message}");
            return false;
        }
    }
}
