using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models.Generated;

namespace backend.Data;

public partial class TourismDbContext : DbContext
{
    public TourismDbContext(DbContextOptions<TourismDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Accommodation> Accommodations { get; set; }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<Document> Documents { get; set; }

    public virtual DbSet<Driver> Drivers { get; set; }

    public virtual DbSet<Earning> Earnings { get; set; }

    public virtual DbSet<MealPackage> MealPackages { get; set; }

    public virtual DbSet<MealPackageItem> MealPackageItems { get; set; }

    public virtual DbSet<MealSchedule> MealSchedules { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<MenuItem> MenuItems { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Offer> Offers { get; set; }

    public virtual DbSet<OfferMenuItem> OfferMenuItems { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Refund> Refunds { get; set; }

    public virtual DbSet<Restaurant> Restaurants { get; set; }

    public virtual DbSet<RestaurantAssignment> RestaurantAssignments { get; set; }

    public virtual DbSet<RestaurantImage> RestaurantImages { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<RoomCategory> RoomCategories { get; set; }

    public virtual DbSet<RoomImage> RoomImages { get; set; }

    public virtual DbSet<ServiceRequirement> ServiceRequirements { get; set; }

    public virtual DbSet<Tour> Tours { get; set; }

    public virtual DbSet<TourAssignment> TourAssignments { get; set; }

    public virtual DbSet<TourImage> TourImages { get; set; }

    public virtual DbSet<Tourist> Tourists { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vehicle> Vehicles { get; set; }

    public virtual DbSet<VehicleImage> VehicleImages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Accommodation>(entity =>
        {
            entity.HasIndex(e => e.TourId, "IX_Accommodations_TourId");

            entity.Property(e => e.CostPerNight).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.HotelName).HasMaxLength(200);
            entity.Property(e => e.Location).HasMaxLength(200);
            entity.Property(e => e.RoomType).HasMaxLength(100);
            entity.Property(e => e.TotalCost).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Tour).WithMany(p => p.Accommodations)
                .HasForeignKey(d => d.TourId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasIndex(e => e.BookingDate, "IX_Bookings_BookingDate");

            entity.HasIndex(e => e.TourId, "IX_Bookings_TourId");

            entity.HasIndex(e => e.TouristId, "IX_Bookings_TouristId");

            entity.Property(e => e.CancellationReason).HasMaxLength(500);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Tour).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.TourId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Tourist).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.TouristId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasIndex(e => e.DriverId, "IX_Documents_DriverId");

            entity.HasIndex(e => e.RestaurantId, "IX_Documents_RestaurantId");

            entity.Property(e => e.DocumentType).HasMaxLength(50);
            entity.Property(e => e.DocumentUrl).HasMaxLength(500);
            entity.Property(e => e.VerificationStatus).HasMaxLength(20);

            entity.HasOne(d => d.Driver).WithMany(p => p.Documents).HasForeignKey(d => d.DriverId);

            entity.HasOne(d => d.Restaurant).WithMany(p => p.Documents).HasForeignKey(d => d.RestaurantId);
        });

        modelBuilder.Entity<Driver>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_Drivers_UserId");

            entity.Property(e => e.AccountStatus).HasMaxLength(20);
            entity.Property(e => e.Cnic)
                .HasMaxLength(15)
                .HasColumnName("CNIC");
            entity.Property(e => e.CnicBack).HasMaxLength(200);
            entity.Property(e => e.CnicFront).HasMaxLength(200);
            entity.Property(e => e.Licence).HasMaxLength(50);
            entity.Property(e => e.LicenceImage).HasMaxLength(200);
            entity.Property(e => e.TotalEarnings).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.User).WithMany(p => p.Drivers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Earning>(entity =>
        {
            entity.HasIndex(e => e.DriverId, "IX_Earnings_DriverId");

            entity.HasIndex(e => e.RestaurantId, "IX_Earnings_RestaurantId");

            entity.HasIndex(e => e.TourId, "IX_Earnings_TourId");

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.Type).HasMaxLength(50);

            entity.HasOne(d => d.Driver).WithMany(p => p.Earnings).HasForeignKey(d => d.DriverId);

            entity.HasOne(d => d.Restaurant).WithMany(p => p.Earnings).HasForeignKey(d => d.RestaurantId);

            entity.HasOne(d => d.Tour).WithMany(p => p.Earnings).HasForeignKey(d => d.TourId);
        });

        modelBuilder.Entity<MealPackage>(entity =>
        {
            entity.HasIndex(e => e.MealScheduleId, "IX_MealPackages_MealScheduleId").IsUnique();

            entity.HasIndex(e => e.RestaurantAssignmentId, "IX_MealPackages_RestaurantAssignmentId");

            entity.Property(e => e.PackageName).HasMaxLength(200);
            entity.Property(e => e.TotalPerHead).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MealSchedule).WithOne(p => p.MealPackage)
                .HasForeignKey<MealPackage>(d => d.MealScheduleId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.RestaurantAssignment).WithMany(p => p.MealPackages)
                .HasForeignKey(d => d.RestaurantAssignmentId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<MealPackageItem>(entity =>
        {
            entity.HasIndex(e => e.MealPackageId, "IX_MealPackageItems_MealPackageId");

            entity.HasIndex(e => e.MenuItemId, "IX_MealPackageItems_MenuItemId");

            entity.Property(e => e.PricePerUnit).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Subtotal).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MealPackage).WithMany(p => p.MealPackageItems)
                .HasForeignKey(d => d.MealPackageId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.MenuItem).WithMany(p => p.MealPackageItems)
                .HasForeignKey(d => d.MenuItemId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<MealSchedule>(entity =>
        {
            entity.HasIndex(e => e.RestaurantAssignmentId, "IX_MealSchedules_RestaurantAssignmentId");

            entity.Property(e => e.Location).HasMaxLength(200);
            entity.Property(e => e.SpecialInstructions).HasMaxLength(500);

            entity.HasOne(d => d.RestaurantAssignment).WithMany(p => p.MealSchedules)
                .HasForeignKey(d => d.RestaurantAssignmentId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Menu>(entity =>
        {
            entity.HasIndex(e => e.RestaurantId, "IX_Menus_RestaurantId");

            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.MenuName).HasMaxLength(200);

            entity.HasOne(d => d.Restaurant).WithMany(p => p.Menus)
                .HasForeignKey(d => d.RestaurantId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<MenuItem>(entity =>
        {
            entity.HasKey(e => e.ItemId);

            entity.HasIndex(e => e.MenuId, "IX_MenuItems_MenuId");

            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Image).HasMaxLength(500);
            entity.Property(e => e.ItemName).HasMaxLength(200);
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Menu).WithMany(p => p.MenuItems)
                .HasForeignKey(d => d.MenuId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_Notifications_UserId");

            entity.Property(e => e.ActionUrl).HasMaxLength(500);
            entity.Property(e => e.Message).HasMaxLength(1000);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.Type).HasMaxLength(50);

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Offer>(entity =>
        {
            entity.HasIndex(e => e.ProviderId, "IX_Offers_ProviderId");

            entity.HasIndex(e => e.RequirementId, "IX_Offers_RequirementId");

            entity.HasIndex(e => e.RoomCategoryId, "IX_Offers_RoomCategoryId");

            entity.HasIndex(e => e.TourId, "IX_Offers_TourId");

            entity.HasIndex(e => e.VehicleId, "IX_Offers_VehicleId");

            entity.Property(e => e.MealType).HasMaxLength(100);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.OfferType).HasMaxLength(50);
            entity.Property(e => e.OfferedAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PricePerHead).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.RentPerNight).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.RouteDetails).HasMaxLength(500);
            entity.Property(e => e.TotalRent).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TransportationFare).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Provider).WithMany(p => p.Offers)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.ProviderNavigation).WithMany(p => p.Offers)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Requirement).WithMany(p => p.Offers).HasForeignKey(d => d.RequirementId);

            entity.HasOne(d => d.RoomCategory).WithMany(p => p.Offers).HasForeignKey(d => d.RoomCategoryId);

            entity.HasOne(d => d.Tour).WithMany(p => p.Offers).HasForeignKey(d => d.TourId);

            entity.HasOne(d => d.Vehicle).WithMany(p => p.Offers).HasForeignKey(d => d.VehicleId);
        });

        modelBuilder.Entity<OfferMenuItem>(entity =>
        {
            entity.HasIndex(e => e.MenuItemId, "IX_OfferMenuItems_MenuItemId");

            entity.HasIndex(e => e.RestaurantOfferId, "IX_OfferMenuItems_RestaurantOfferId");

            entity.Property(e => e.PriceAtOffer).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Subtotal).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MenuItem).WithMany(p => p.OfferMenuItems)
                .HasForeignKey(d => d.MenuItemId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.RestaurantOffer).WithMany(p => p.OfferMenuItems)
                .HasForeignKey(d => d.RestaurantOfferId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasIndex(e => e.BookingId, "IX_Orders_BookingId");

            entity.HasIndex(e => e.MealPackageId, "IX_Orders_MealPackageId");

            entity.HasIndex(e => e.MealScheduleId, "IX_Orders_MealScheduleId");

            entity.HasIndex(e => e.OrderDate, "IX_Orders_OrderDate");

            entity.HasIndex(e => e.RequirementId, "IX_Orders_RequirementId");

            entity.HasIndex(e => e.RestaurantAssignmentId, "IX_Orders_RestaurantAssignmentId");

            entity.HasIndex(e => e.TourId, "IX_Orders_TourId");

            entity.Property(e => e.SpecialRequests).HasMaxLength(500);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Booking).WithMany(p => p.Orders).HasForeignKey(d => d.BookingId);

            entity.HasOne(d => d.MealPackage).WithMany(p => p.Orders).HasForeignKey(d => d.MealPackageId);

            entity.HasOne(d => d.MealSchedule).WithMany(p => p.Orders).HasForeignKey(d => d.MealScheduleId);

            entity.HasOne(d => d.Requirement).WithMany(p => p.Orders)
                .HasForeignKey(d => d.RequirementId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.RestaurantAssignment).WithMany(p => p.Orders)
                .HasForeignKey(d => d.RestaurantAssignmentId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Tour).WithMany(p => p.Orders)
                .HasForeignKey(d => d.TourId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasIndex(e => e.MenuItemId, "IX_OrderItems_MenuItemId");

            entity.HasIndex(e => e.OrderId, "IX_OrderItems_OrderId");

            entity.Property(e => e.PricePerUnit).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Subtotal).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MenuItem).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.MenuItemId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasIndex(e => e.BookingId, "IX_Payments_BookingId").IsUnique();

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.Property(e => e.TransactionId).HasMaxLength(100);

            entity.HasOne(d => d.Booking).WithOne(p => p.Payment)
                .HasForeignKey<Payment>(d => d.BookingId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Refund>(entity =>
        {
            entity.HasIndex(e => e.BookingId, "IX_Refunds_BookingId");

            entity.HasIndex(e => e.PaymentId, "IX_Refunds_PaymentId").IsUnique();

            entity.Property(e => e.Reason).HasMaxLength(500);
            entity.Property(e => e.RefundAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Booking).WithMany(p => p.Refunds)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Payment).WithOne(p => p.Refund)
                .HasForeignKey<Refund>(d => d.PaymentId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Restaurant>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_Restaurants_UserId");

            entity.Property(e => e.Address)
                .HasMaxLength(300)
                .HasDefaultValue("");
            entity.Property(e => e.BusinessLicense).HasMaxLength(100);
            entity.Property(e => e.BusinessType).HasMaxLength(100);
            entity.Property(e => e.OwnerName).HasMaxLength(100);
            entity.Property(e => e.PostalCode).HasMaxLength(20);
            entity.Property(e => e.Rating).HasColumnType("decimal(3, 2)");
            entity.Property(e => e.RestaurantName).HasMaxLength(200);

            entity.HasOne(d => d.User).WithMany(p => p.Restaurants)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<RestaurantAssignment>(entity =>
        {
            entity.HasKey(e => e.AssignmentId);

            entity.HasIndex(e => e.OrderId, "IX_RestaurantAssignments_OrderId");

            entity.HasIndex(e => e.RequirementId, "IX_RestaurantAssignments_RequirementId");

            entity.HasIndex(e => e.RestaurantId, "IX_RestaurantAssignments_RestaurantId");

            entity.HasIndex(e => e.RestaurantOfferId, "IX_RestaurantAssignments_RestaurantOfferId")
                .IsUnique()
                .HasFilter("([RestaurantOfferId] IS NOT NULL)");

            entity.HasIndex(e => e.TourId, "IX_RestaurantAssignments_TourId");

            entity.Property(e => e.FinalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MealScheduleText).HasMaxLength(500);
            entity.Property(e => e.PricePerHead).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Order).WithMany(p => p.RestaurantAssignments).HasForeignKey(d => d.OrderId);

            entity.HasOne(d => d.Requirement).WithMany(p => p.RestaurantAssignments).HasForeignKey(d => d.RequirementId);

            entity.HasOne(d => d.Restaurant).WithMany(p => p.RestaurantAssignments)
                .HasForeignKey(d => d.RestaurantId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.RestaurantOffer).WithOne(p => p.RestaurantAssignment).HasForeignKey<RestaurantAssignment>(d => d.RestaurantOfferId);

            entity.HasOne(d => d.Tour).WithMany(p => p.RestaurantAssignments)
                .HasForeignKey(d => d.TourId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<RestaurantImage>(entity =>
        {
            entity.HasKey(e => e.ImageId);

            entity.HasIndex(e => e.RestaurantId, "IX_RestaurantImages_RestaurantId");

            entity.Property(e => e.Caption).HasMaxLength(200);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);

            entity.HasOne(d => d.Restaurant).WithMany(p => p.RestaurantImages)
                .HasForeignKey(d => d.RestaurantId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasIndex(e => e.TourId, "IX_Reviews_TourId");

            entity.HasIndex(e => e.TouristId, "IX_Reviews_TouristId");

            entity.HasIndex(e => e.UserId, "IX_Reviews_UserId");

            entity.Property(e => e.Comment).HasMaxLength(1000);

            entity.HasOne(d => d.Tour).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.TourId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Tourist).WithMany(p => p.Reviews).HasForeignKey(d => d.TouristId);

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<RoomCategory>(entity =>
        {
            entity.HasIndex(e => e.RestaurantId, "IX_RoomCategories_RestaurantId");

            entity.Property(e => e.Amenities).HasMaxLength(1000);
            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.PricePerNight).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Restaurant).WithMany(p => p.RoomCategories)
                .HasForeignKey(d => d.RestaurantId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<RoomImage>(entity =>
        {
            entity.HasIndex(e => e.RoomCategoryId, "IX_RoomImages_RoomCategoryId");

            entity.Property(e => e.ImageUrl).HasMaxLength(500);

            entity.HasOne(d => d.RoomCategory).WithMany(p => p.RoomImages)
                .HasForeignKey(d => d.RoomCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<ServiceRequirement>(entity =>
        {
            entity.HasKey(e => e.RequirementId);

            entity.HasIndex(e => e.TourId, "IX_ServiceRequirements_TourId");

            entity.Property(e => e.EstimatedBudget).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Location).HasMaxLength(200);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Time).HasMaxLength(10);
            entity.Property(e => e.Type).HasMaxLength(50);

            entity.HasOne(d => d.Tour).WithMany(p => p.ServiceRequirements)
                .HasForeignKey(d => d.TourId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Tour>(entity =>
        {
            entity.HasIndex(e => e.StartDate, "IX_Tours_StartDate");

            entity.Property(e => e.BulkDiscountPercentage).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CoupleDiscountPercentage).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.DepartureLocation).HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Destination).HasMaxLength(200);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            entity.Property(e => e.PricePerHead).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Title).HasMaxLength(200);
        });

        modelBuilder.Entity<TourAssignment>(entity =>
        {
            entity.HasKey(e => e.AssignmentId);

            entity.HasIndex(e => e.DriverId, "IX_TourAssignments_DriverId");

            entity.HasIndex(e => e.DriverOfferId, "IX_TourAssignments_DriverOfferId")
                .IsUnique()
                .HasFilter("([DriverOfferId] IS NOT NULL)");

            entity.HasIndex(e => e.TourId, "IX_TourAssignments_TourId");

            entity.HasIndex(e => e.VehicleId, "IX_TourAssignments_VehicleId");

            entity.Property(e => e.FinalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Notes).HasMaxLength(500);

            entity.HasOne(d => d.Driver).WithMany(p => p.TourAssignments)
                .HasForeignKey(d => d.DriverId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.DriverOffer).WithOne(p => p.TourAssignment).HasForeignKey<TourAssignment>(d => d.DriverOfferId);

            entity.HasOne(d => d.Tour).WithMany(p => p.TourAssignments)
                .HasForeignKey(d => d.TourId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Vehicle).WithMany(p => p.TourAssignments)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<TourImage>(entity =>
        {
            entity.HasKey(e => e.ImageId);

            entity.HasIndex(e => e.TourId, "IX_TourImages_TourId");

            entity.Property(e => e.Caption).HasMaxLength(200);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);

            entity.HasOne(d => d.Tour).WithMany(p => p.TourImages)
                .HasForeignKey(d => d.TourId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Tourist>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_Tourists_UserId");

            entity.HasOne(d => d.User).WithMany(p => p.Tourists)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email, "IX_Users_Email").IsUnique();

            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.ProfilePicture).HasMaxLength(500);
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasIndex(e => e.DriverId, "IX_Vehicles_DriverId");

            entity.Property(e => e.Model).HasMaxLength(50);
            entity.Property(e => e.RegistrationNumber).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.VehicleType).HasMaxLength(50);

            entity.HasOne(d => d.Driver).WithMany(p => p.Vehicles)
                .HasForeignKey(d => d.DriverId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<VehicleImage>(entity =>
        {
            entity.HasKey(e => e.ImageId);

            entity.HasIndex(e => e.VehicleId, "IX_VehicleImages_VehicleId");

            entity.Property(e => e.Caption).HasMaxLength(200);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);

            entity.HasOne(d => d.Vehicle).WithMany(p => p.VehicleImages)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
