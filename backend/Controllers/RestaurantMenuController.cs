using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Data;
using backend.Models.RestaurantMenu;
using backend.Models.Enums;
using backend.Models.UserManagement;
using backend.Models.DTOs; // Assuming we might need DTOs, or we can use primitives/Models

namespace backend.Controllers;

[Authorize(Roles = "Restaurant")]
[ApiController]
[Route("api/[controller]")]
public class RestaurantMenuController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public RestaurantMenuController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    private int GetRestaurantId()
    {
        var claim = User.FindFirst("RoleSpecificId");
        if (claim != null && int.TryParse(claim.Value, out int id))
        {
            return id;
        }
        throw new UnauthorizedAccessException("Restaurant ID not found in token.");
    }

    // GET: api/RestaurantMenu
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Menu>>> GetMenus()
    {
        try
        {
            var restaurantId = GetRestaurantId();
            var menus = await _context.Menus
                .Include(m => m.MenuItems)
                .Where(m => m.RestaurantId == restaurantId)
                .ToListAsync();

            return Ok(menus);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/RestaurantMenu
    [HttpPost]
    public async Task<ActionResult<Menu>> CreateMenu([FromBody] CreateMenuDto dto)
    {
        try
        {
            var restaurantId = GetRestaurantId();
            
            var menu = new Menu
            {
                RestaurantId = restaurantId,
                MenuName = dto.MenuName,
                Category = dto.Category,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };

            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMenus), new { id = menu.MenuId }, menu);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/RestaurantMenu/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMenu(int id, [FromBody] Menu menu)
    {
        if (id != menu.MenuId) return BadRequest("Menu ID mismatch");

        try
        {
            var restaurantId = GetRestaurantId();
            var existingMenu = await _context.Menus.FirstOrDefaultAsync(m => m.MenuId == id && m.RestaurantId == restaurantId);

            if (existingMenu == null) return NotFound();

            existingMenu.MenuName = menu.MenuName;
            existingMenu.Category = menu.Category;
            existingMenu.Description = menu.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE: api/RestaurantMenu/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMenu(int id)
    {
        try
        {
            var restaurantId = GetRestaurantId();
            var menu = await _context.Menus
                .Include(m => m.MenuItems)
                .FirstOrDefaultAsync(m => m.MenuId == id && m.RestaurantId == restaurantId);

            if (menu == null) return NotFound();

            // Setup DeleteBehavior.Restrict in DbContext might prevent this if items exist?
            // Usually we want cascading delete for Menu -> Items here.
            // If restrict is on, we must delete items first.
            _context.MenuItems.RemoveRange(menu.MenuItems);
            _context.Menus.Remove(menu);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/RestaurantMenu/{menuId}/items
    [HttpPost("{menuId}/items")]
    public async Task<ActionResult<MenuItem>> AddMenuItem(int menuId, [FromForm] MenuItemDto itemDto)
    {
        try
        {
            var restaurantId = GetRestaurantId();
            var menu = await _context.Menus.FirstOrDefaultAsync(m => m.MenuId == menuId && m.RestaurantId == restaurantId);
            if (menu == null) return NotFound("Menu not found");

            string? imagePath = null;
            if (itemDto.ImageFile != null)
            {
                imagePath = await SaveFileAsync(itemDto.ImageFile, "menu_items");
            }

            var menuItem = new MenuItem
            {
                MenuId = menuId,
                ItemName = itemDto.ItemName,
                Price = itemDto.Price,
                Description = itemDto.Description,
                IsAvailable = itemDto.IsAvailable,
                Image = imagePath
            };

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            return Ok(menuItem);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/RestaurantMenu/items/{id}
    [HttpPut("items/{id}")]
    public async Task<IActionResult> UpdateMenuItem(int id, [FromForm] MenuItemDto itemDto)
    {
        try
        {
            var restaurantId = GetRestaurantId();
            // Verify ownership via Menu -> Restaurant
            var menuItem = await _context.MenuItems
                .Include(mi => mi.Menu)
                .FirstOrDefaultAsync(mi => mi.ItemId == id && mi.Menu.RestaurantId == restaurantId);

            if (menuItem == null) return NotFound();

            menuItem.ItemName = itemDto.ItemName;
            menuItem.Price = itemDto.Price;
            menuItem.Description = itemDto.Description;
            menuItem.IsAvailable = itemDto.IsAvailable;

            if (itemDto.ImageFile != null)
            {
                menuItem.Image = await SaveFileAsync(itemDto.ImageFile, "menu_items");
            }

            await _context.SaveChangesAsync();
            return Ok(menuItem);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE: api/RestaurantMenu/items/{id}
    [HttpDelete("items/{id}")]
    public async Task<IActionResult> DeleteMenuItem(int id)
    {
        try
        {
            var restaurantId = GetRestaurantId();
            var menuItem = await _context.MenuItems
                .Include(mi => mi.Menu)
                .FirstOrDefaultAsync(mi => mi.ItemId == id && mi.Menu.RestaurantId == restaurantId);

            if (menuItem == null) return NotFound();

            _context.MenuItems.Remove(menuItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/RestaurantMenu/submit-application
    [HttpPost("submit-application")]
    public async Task<IActionResult> SubmitApplication()
    {
        try
        {
            var restaurantId = GetRestaurantId();
            var restaurant = await _context.Restaurants.FindAsync(restaurantId);

            if (restaurant == null) return NotFound();

            // Optional: Add validation here (e.g., must have license uploaded, etc.)
            // Assuming simplified flow where submitting just changes status.

            restaurant.ApplicationStatus = ApplicationStatus.Submitted;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Application submitted successfully", status = restaurant.ApplicationStatus.ToString() });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
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
}

public class CreateMenuDto
{
    public string MenuName { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Description { get; set; }
}

public class MenuItemDto
{
    public string ItemName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public bool IsAvailable { get; set; } = true;
    public IFormFile? ImageFile { get; set; }
}
