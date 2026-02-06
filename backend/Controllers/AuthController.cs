using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // POST: api/auth/signup/tourist
    [HttpPost("signup/tourist")]
    public async Task<IActionResult> SignupTourist([FromForm] TouristSignupDto request)
    {
        try
        {
            await _authService.SignupTouristAsync(request);
            return Ok(new { message = "Registration successful. Please verify OTP sent to your email.", email = request.Email });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/auth/verify-otp
    [HttpPost("verify-otp")]
    public async Task<ActionResult<AuthResponse>> VerifyOtp([FromBody] VerifyOtpDto request)
    {
        try
        {
            var response = await _authService.VerifyOtpAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/auth/initiate-driver-signup
    [HttpPost("initiate-driver-signup")]
    public async Task<IActionResult> InitiateDriverSignup([FromBody] InitiateDriverSignupDto request)
    {
        try
        {
            await _authService.InitiateDriverSignupAsync(request);
             return Ok(new { message = "Registration initiated. Please verify OTP sent to your email.", email = request.Email });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/auth/initiate-restaurant-signup
    [HttpPost("initiate-restaurant-signup")]
    public async Task<IActionResult> InitiateRestaurantSignup([FromBody] InitiateRestaurantSignupDto request)
    {
        try
        {
            await _authService.InitiateRestaurantSignupAsync(request);
             return Ok(new { message = "Registration initiated. Please verify OTP sent to your email.", email = request.Email });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/auth/signup/driver
    [HttpPost("signup/driver")]
    [DisableRequestSizeLimit]
    [RequestFormLimits(MultipartBodyLengthLimit = int.MaxValue, ValueLengthLimit = int.MaxValue)]
    public async Task<ActionResult<AuthResponse>> SignupDriver([FromForm] DriverSignupDto request)
    {
        try
        {
            var response = await _authService.SignupDriverAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/auth/signup/restaurant
    [HttpPost("signup/restaurant")]
    [DisableRequestSizeLimit]
    [RequestFormLimits(MultipartBodyLengthLimit = int.MaxValue, ValueLengthLimit = int.MaxValue)]
    public async Task<ActionResult<AuthResponse>> SignupRestaurant([FromForm] RestaurantSignupDto request)
    {
        try
        {
            var response = await _authService.SignupRestaurantAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            var message = ex.InnerException?.Message ?? ex.Message;
            return BadRequest(new { message });
        }
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    // GET: api/auth/me
    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
