using backend.Models.UserManagement;

namespace backend.Services;

public interface IDriverService
{
    Task<IEnumerable<object>> GetAllDriversAsync();
    Task<object?> GetDriverByIdAsync(int driverId);
    Task<bool> UpdateDriverStatusAsync(int driverId, string status);
}
