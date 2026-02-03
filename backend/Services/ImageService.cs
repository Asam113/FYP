using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace backend.Services;

public class ImageService : IImageService
{
    private readonly IWebHostEnvironment _environment;

    public ImageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string?> SaveImageAsync(IFormFile? file, string folderName)
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

    public async Task<List<string>> SaveImagesAsync(List<IFormFile> files, string folderName)
    {
        var savedPaths = new List<string>();
        if (files == null || files.Count == 0) return savedPaths;

        foreach (var file in files)
        {
            var path = await SaveImageAsync(file, folderName);
            if (path != null)
                savedPaths.Add(path);
        }

        return savedPaths;
    }

    public void DeleteImage(string imageUrl)
    {
        if (string.IsNullOrEmpty(imageUrl)) return;

        // Path is like "/uploads/profiles/filename.jpg"
        // We need to convert it to a physical path
        var relativePath = imageUrl.TrimStart('/');
        var physicalPath = Path.Combine(_environment.WebRootPath, relativePath.Replace('/', Path.DirectorySeparatorChar));

        if (File.Exists(physicalPath))
        {
            File.Delete(physicalPath);
        }
    }
}
