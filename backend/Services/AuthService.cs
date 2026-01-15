using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.Models.DTOs;
using backend.Models.UserManagement;
using backend.Models.Supporting;
using backend.Models.RestaurantMenu;
using backend.Models.Enums;
using BCrypt.Net;
using System.Text.Json;

namespace backend.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;
    private readonly IEmailService _emailService;

    public AuthService(ApplicationDbContext context, IConfiguration configuration, IWebHostEnvironment environment, IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _environment = environment;
        _emailService = emailService;
    }

    public async Task SignupTouristAsync(TouristSignupDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            throw new Exception("Email already registered");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        string? profilePicturePath = await SaveFileAsync(request.ProfilePicture, "profiles");

        // Generate 6 digit OTP
        var otp = new Random().Next(100000, 999999).ToString();

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = passwordHash,
            PhoneNumber = request.PhoneNumber,
            Role = UserRole.Tourist,
            ProfilePicture = profilePicturePath,
            CreatedAt = DateTime.UtcNow,
            IsVerified = false,
            OtpCode = otp,
            OtpExpiry = DateTime.UtcNow.AddMinutes(10)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var tourist = new Tourist { UserId = user.Id };
        _context.Tourists.Add(tourist);
        await _context.SaveChangesAsync();

        // Send OTP Email
        await _emailService.SendEmailAsync(user.Email, "Verify your account", $"Your OTP code is: <b>{otp}</b>. It expires in 10 minutes.");
    }

    public async Task<AuthResponse> VerifyOtpAsync(VerifyOtpDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null) throw new Exception("User not found");

        if (user.IsVerified) throw new Exception("User already verified");

        if (user.OtpCode != request.OtpCode) throw new Exception("Invalid OTP");

        if (user.OtpExpiry < DateTime.UtcNow) throw new Exception("OTP expired");

        // Verify User
        user.IsVerified = true;
        user.OtpCode = null;
        user.OtpExpiry = null;
        await _context.SaveChangesAsync();

        // Login the user (return token)
        int roleSpecificId = 0;
        var tourist = await _context.Tourists.FirstOrDefaultAsync(t => t.UserId == user.Id);
        roleSpecificId = tourist?.TouristId ?? 0;

        return GenerateAuthResponse(user, roleSpecificId);
    }

    public async Task InitiateDriverSignupAsync(InitiateDriverSignupDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            throw new Exception("Email already registered");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        string? profilePicturePath = null; // Profile picture handling could be here but usually file upload needs FormData

        // Generate 6 digit OTP
        var otp = new Random().Next(100000, 999999).ToString();

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = passwordHash,
            PhoneNumber = request.PhoneNumber,
            Role = UserRole.Driver,
            ProfilePicture = profilePicturePath,
            CreatedAt = DateTime.UtcNow,
            IsVerified = false,
            OtpCode = otp,
            OtpExpiry = DateTime.UtcNow.AddMinutes(10)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Send OTP Email
        await _emailService.SendEmailAsync(user.Email, "Verify your account", $"Your OTP code is: <b>{otp}</b>. It expires in 10 minutes.");
    }

    public async Task<AuthResponse> SignupDriverAsync(DriverSignupDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (user == null)
        {
            // Fallback for direct signup without initiation (if allowed) or Error
            // For now, let's create it if missing, effectively behaving like old logic but without OTP
             if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new Exception("Email already registered");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            string? profilePicPath = await SaveFileAsync(request.ProfilePicture, "profiles");

            user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = passwordHash,
                PhoneNumber = request.PhoneNumber,
                Role = UserRole.Driver,
                ProfilePicture = profilePicPath,
                CreatedAt = DateTime.UtcNow,
                IsVerified = true // Assuming direct signup skips verification or handled elsewhere? 
                                  // Ideally, we enforce Initiate->Verify->Signup flow.
                                  // Let's set it to true here as legacy fallback support
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        else
        {
            // User Exists
            if (!user.IsVerified) throw new Exception("Please verify your email first.");
            
            // Update personal data (in case it was changed during the wizard)
            user.Name = request.Name;
            user.PhoneNumber = request.PhoneNumber;

            // Update profile picture if provided
            if (request.ProfilePicture != null)
            {
                user.ProfilePicture = await SaveFileAsync(request.ProfilePicture, "profiles");
            }
            // Check if driver profile exists
             if (await _context.Drivers.AnyAsync(d => d.UserId == user.Id))
                throw new Exception("Driver profile already exists for this user.");
        }

        var driver = new Driver
        {
            UserId = user.Id,
            CNIC = request.CNIC,
            Licence = request.Licence,
            LicenceExpiryDate = request.LicenceExpiryDate,
            AccountStatus = "Pending"
        };
        _context.Drivers.Add(driver);
        await _context.SaveChangesAsync();

        // Handle Documents
        string? cnicFrontPath = await SaveFileAsync(request.CnicFront, "documents");
        string? cnicBackPath = await SaveFileAsync(request.CnicBack, "documents");
        string? licencePath = await SaveFileAsync(request.LicenceImage, "documents");

        if (cnicFrontPath != null) _context.Documents.Add(new Document { DriverId = driver.DriverId, DocumentType = "CNIC Front", DocumentUrl = cnicFrontPath, UploadedAt = DateTime.UtcNow });
        if (cnicBackPath != null) _context.Documents.Add(new Document { DriverId = driver.DriverId, DocumentType = "CNIC Back", DocumentUrl = cnicBackPath, UploadedAt = DateTime.UtcNow });
        if (licencePath != null) _context.Documents.Add(new Document { DriverId = driver.DriverId, DocumentType = "Licence", DocumentUrl = licencePath, UploadedAt = DateTime.UtcNow });

        // Update Driver entity with document paths
        driver.LicenceImage = licencePath;
        driver.CnicFront = cnicFrontPath;
        driver.CnicBack = cnicBackPath;
        
        // Handle Vehicle
        var vehicle = new Vehicle
        {
            DriverId = driver.DriverId,
            RegistrationNumber = request.VehicleRegNumber,
            VehicleType = request.VehicleType,
            Model = request.VehicleModel,
            Capacity = request.VehicleCapacity,
            Status = "Pending"
        };
        _context.Vehicles.Add(vehicle);

        await _context.SaveChangesAsync();

        return GenerateAuthResponse(user, driver.DriverId);
    }

    public async Task InitiateRestaurantSignupAsync(InitiateRestaurantSignupDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            throw new Exception("Email already registered");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        string? profilePicturePath = null;

        // Generate 6 digit OTP
        var otp = new Random().Next(100000, 999999).ToString();

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = passwordHash,
            PhoneNumber = request.PhoneNumber,
            Role = UserRole.Restaurant,
            ProfilePicture = profilePicturePath,
            CreatedAt = DateTime.UtcNow,
            IsVerified = false,
            OtpCode = otp,
            OtpExpiry = DateTime.UtcNow.AddMinutes(10)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Send OTP Email
        await _emailService.SendEmailAsync(user.Email, "Verify your account", $"Your OTP code is: <b>{otp}</b>. It expires in 10 minutes.");
    }

    public async Task<AuthResponse> SignupRestaurantAsync(RestaurantSignupDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (user == null)
        {
             // Fallback for direct signup (if enabled)
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new Exception("Email already registered");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            string? profilePicPath = await SaveFileAsync(request.ProfilePicture, "profiles");

            user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = passwordHash,
                PhoneNumber = request.PhoneNumber,
                Role = UserRole.Restaurant,
                ProfilePicture = profilePicPath,
                CreatedAt = DateTime.UtcNow,
                IsVerified = true // Assume verified if direct signup
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        else
        {
             // User Exists
            if (!user.IsVerified) throw new Exception("Please verify your email first.");
            
            // Update personal data
            user.Name = request.Name;
            user.PhoneNumber = request.PhoneNumber;

            if (request.ProfilePicture != null)
            {
                user.ProfilePicture = await SaveFileAsync(request.ProfilePicture, "profiles");
            }

             if (await _context.Restaurants.AnyAsync(r => r.UserId == user.Id))
                throw new Exception("Restaurant profile already exists for this user.");
        }

        var restaurant = new Restaurant
        {
            UserId = user.Id,
            RestaurantName = request.RestaurantName,
            OwnerName = request.OwnerName,
            BusinessType = request.BusinessType,
            BusinessLicense = "Uploaded", // Or utilize as License Number if available
            Address = request.Address,
            PostalCode = request.PostalCode
        };
        _context.Restaurants.Add(restaurant);
        await _context.SaveChangesAsync();

        if (request.LicenseDocument != null)
        {
            string? licensePath = await SaveFileAsync(request.LicenseDocument, "documents");
            if (licensePath != null)
            {
                _context.Documents.Add(new Document 
                { 
                    RestaurantId = restaurant.RestaurantId, 
                    DocumentType = "Business License", 
                    DocumentUrl = licensePath, 
                    UploadedAt = DateTime.UtcNow 
                });
                await _context.SaveChangesAsync();
                
                restaurant.BusinessLicense = licensePath; 
                await _context.SaveChangesAsync();
            }
        }

        // Handle MenuJson
        if (!string.IsNullOrEmpty(request.MenuJson))
        {
            try 
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var categories = JsonSerializer.Deserialize<List<MenuCategoryDto>>(request.MenuJson, options);

                if (categories != null)
                {
                    foreach (var category in categories)
                    {
                        var menu = new Menu 
                        {
                            RestaurantId = restaurant.RestaurantId,
                            MenuName = category.Title,
                            Category = category.Badge,
                            Description = $"{category.Title} - {category.Badge}" // Optional description
                        };
                        _context.Menus.Add(menu);
                        await _context.SaveChangesAsync();

                        if (category.Items != null)
                        {
                            foreach (var itemDto in category.Items)
                            {
                                string? imagePath = null;
                                if (!string.IsNullOrEmpty(itemDto.Image) && itemDto.Image.StartsWith("data:image"))
                                {
                                     imagePath = await SaveBase64ImageAsync(itemDto.Image, "menu_items");
                                }

                                var menuItem = new MenuItem
                                {
                                    MenuId = menu.MenuId,
                                    ItemName = itemDto.Name,
                                    Price = itemDto.Price,
                                    Description = itemDto.Description,
                                    Image = imagePath,
                                    IsAvailable = itemDto.IsAvailable
                                };
                                _context.MenuItems.Add(menuItem);
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log error but don't fail the whole registration if menu fails?
                // Or throw? Let's log to console for now or minimal handling.
                Console.WriteLine($"Error processing MenuJson: {ex.Message}");
            }
        }

        return GenerateAuthResponse(user, restaurant.RestaurantId);
    }

    private async Task<string?> SaveBase64ImageAsync(string base64String, string folderName)
    {
        try
        {
            var commaIndex = base64String.IndexOf(',');
            if (commaIndex != -1)
            {
                base64String = base64String.Substring(commaIndex + 1);
            }

            // Simple validation could be added here
            byte[] imageBytes = Convert.FromBase64String(base64String);

            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", folderName);
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + ".png"; // Assuming png or verify mime type if needed
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            await File.WriteAllBytesAsync(filePath, imageBytes);

            return $"/uploads/{folderName}/{uniqueFileName}";
        }
        catch (Exception)
        {
            return null;
        }
    }

    private async Task<string?> SaveFileAsync(IFormFile? file, string folderName)
    {
        if (file == null || file.Length == 0) return null;

        var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", folderName);
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"/uploads/{folderName}/{uniqueFileName}";
    }

    private AuthResponse GenerateAuthResponse(User user, int roleSpecificId)
    {
        var token = GenerateJwtToken(user, roleSpecificId);
        return new AuthResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                RoleSpecificId = roleSpecificId,
                ProfilePicture = user.ProfilePicture
            }
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // Find user by email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
            throw new Exception("Invalid email or password");
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new Exception("Invalid email or password");
        }

        if (user.Role == UserRole.Tourist && !user.IsVerified)
        {
            throw new Exception("Account not verified. Please verify your OTP.");
        }

        // Get role-specific ID
        int roleSpecificId = 0;
        switch (user.Role)
        {
            case UserRole.Tourist:
                var tourist = await _context.Tourists.FirstOrDefaultAsync(t => t.UserId == user.Id);
                roleSpecificId = tourist?.TouristId ?? 0;
                break;
            case UserRole.Driver:
                var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.UserId == user.Id);
                roleSpecificId = driver?.DriverId ?? 0;
                break;
            case UserRole.Restaurant:
                var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.UserId == user.Id);
                roleSpecificId = restaurant?.RestaurantId ?? 0;
                break;
        }

        // Generate JWT token
        var token = GenerateJwtToken(user, roleSpecificId);

        return new AuthResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                RoleSpecificId = roleSpecificId,
                ProfilePicture = user.ProfilePicture
            }
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        int roleSpecificId = 0;
        switch (user.Role)
        {
            case UserRole.Tourist:
                var tourist = await _context.Tourists.FirstOrDefaultAsync(t => t.UserId == user.Id);
                roleSpecificId = tourist?.TouristId ?? 0;
                break;
            case UserRole.Driver:
                var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.UserId == user.Id);
                roleSpecificId = driver?.DriverId ?? 0;
                break;
            case UserRole.Restaurant:
                var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.UserId == user.Id);
                roleSpecificId = restaurant?.RestaurantId ?? 0;
                break;
        }

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role,
            RoleSpecificId = roleSpecificId,
            ProfilePicture = user.ProfilePicture
        };
    }

    private string GenerateJwtToken(User user, int roleSpecificId)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? throw new Exception("JWT Key not configured");
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "TourismManagementSystem";
        var jwtAudience = _configuration["Jwt:Audience"] ?? "TourismManagementSystemUsers";
        var jwtExpiryHours = int.Parse(_configuration["Jwt:ExpiryInHours"] ?? "24");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("RoleSpecificId", roleSpecificId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(jwtExpiryHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
