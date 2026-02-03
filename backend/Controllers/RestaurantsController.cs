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

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IImageService _imageService;

    public RestaurantsController(ApplicationDbContext context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
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
