using backend.Models.DTOs;

namespace backend.Services;

public interface IAuthService
{
    Task SignupTouristAsync(TouristSignupDto request);
    Task InitiateDriverSignupAsync(InitiateDriverSignupDto request);
    Task<AuthResponse> SignupDriverAsync(DriverSignupDto request);
    Task InitiateRestaurantSignupAsync(InitiateRestaurantSignupDto request);
    Task<AuthResponse> SignupRestaurantAsync(RestaurantSignupDto request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> VerifyOtpAsync(VerifyOtpDto request);
    Task<UserDto?> GetUserByIdAsync(int userId);
}
