using System.ComponentModel.DataAnnotations;
using backend.Models.Enums;

namespace backend.Models.DTOs;

public class BookingDto
{
    [Required]
    public int TourId { get; set; }

    [Required]
    public int TouristId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int NumberOfPeople { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal TotalAmount { get; set; }

    [Required]
    public BookingType BookingType { get; set; }
}
