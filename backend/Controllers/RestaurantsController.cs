using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.UserManagement;
using backend.Models.Supporting;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IImageService _imageService;
    private readonly IStripeService _stripeService;

    public RestaurantsController(ApplicationDbContext context, IImageService imageService, IStripeService stripeService)
    {
        _context = context;
        _imageService = imageService;
        _stripeService = stripeService;
    }

    [HttpPost("{id}/onboarding-link")]
    [Authorize]
    public async Task<IActionResult> GetOnboardingLink(int id, [FromBody] OnboardingRequestDto request)
    {
        var restaurant = await _context.Restaurants.Include(r => r.User).FirstOrDefaultAsync(r => r.RestaurantId == id);
        if (restaurant == null) return NotFound("Restaurant not found");

        try
        {
            if (string.IsNullOrEmpty(restaurant.StripeAccountId))
            {
                var accountId = await _stripeService.CreateConnectedAccountAsync(
                    restaurant.User.Email, 
                    restaurant.RestaurantName, 
                    "Restaurant");
                restaurant.StripeAccountId = accountId;
                await _context.SaveChangesAsync();
            }

            var url = await _stripeService.CreateOnboardingLinkAsync(restaurant.StripeAccountId, request.ReturnUrl, request.RefreshUrl);
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET: api/restaurants/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Restaurant>> GetRestaurant(int id)
    {
        var restaurant = await _context.Restaurants
            .Include(r => r.RestaurantImages)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.RestaurantId == id);

        if (restaurant == null)
        {
            return NotFound();
        }

        return Ok(restaurant);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Restaurant,Admin")]
    public async Task<IActionResult> UpdateRestaurant(int id, [FromBody] UpdateRestaurantProfileDto dto)
    {
        var restaurant = await _context.Restaurants.FindAsync(id);
        if (restaurant == null) return NotFound("Restaurant not found");

        // Update fields
        restaurant.RestaurantName = dto.RestaurantName;
        restaurant.BusinessType = dto.BusinessType;
        restaurant.OwnerName = dto.OwnerName;
        restaurant.Address = dto.Address;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Profile updated successfully", restaurant });
    }

    [HttpPost("{id}/images")]
    [Authorize(Roles = "Restaurant,Admin")]
    public async Task<IActionResult> UploadRestaurantImages(int id, [FromForm] List<IFormFile> images)
    {
        var restaurant = await _context.Restaurants.FindAsync(id);
        if (restaurant == null) return NotFound("Restaurant not found");

        if (images == null || images.Count == 0) return BadRequest("No images provided");

        var savedPaths = await _imageService.SaveImagesAsync(images, "restaurants");
        
        foreach (var path in savedPaths)
        {
            _context.RestaurantImages.Add(new RestaurantImage
            {
                RestaurantId = id,
                ImageUrl = path,
                IsPrimary = !_context.RestaurantImages.Any(ri => ri.RestaurantId == id)
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Images uploaded successfully", count = savedPaths.Count });
    }

    // DELETE: api/restaurants/images/{imageId}
    [HttpDelete("images/{imageId}")]
    [Authorize(Roles = "Restaurant,Admin")]
    public async Task<IActionResult> DeleteRestaurantImage(int imageId)
    {
        var image = await _context.RestaurantImages.FindAsync(imageId);
        if (image == null) return NotFound();

        _imageService.DeleteImage(image.ImageUrl);
        _context.RestaurantImages.Remove(image);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
