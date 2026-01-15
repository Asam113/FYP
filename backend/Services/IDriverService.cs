using backend.Models.UserManagement;

namespace backend.Services;

public interface IDriverService
{
    Task<IEnumerable<object>> GetAllDriversAsync();
    Task<bool> UpdateDriverStatusAsync(int driverId, string status);
}
