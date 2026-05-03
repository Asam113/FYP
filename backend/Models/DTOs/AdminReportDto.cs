using System.Collections.Generic;

namespace backend.Models.DTOs
{
    public class AdminReportDto
    {
        public List<SummaryMetricDto> Metrics { get; set; } = new();
        public List<ChartPointDto> PerformanceData { get; set; } = new();
        public List<DestinationStatDto> TopDestinations { get; set; } = new();
        public List<DriverPerformanceDto> DriverPerformance { get; set; } = new();
    }

    public class SummaryMetricDto
    {
        public string Title { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string ColorClass { get; set; } = string.Empty;
    }

    public class ChartPointDto
    {
        public string Label { get; set; } = string.Empty;
        public int Customers { get; set; }
        public decimal Revenue { get; set; }
        public int Tours { get; set; }
    }

    public class DestinationStatDto
    {
        public string Label { get; set; } = string.Empty;
        public int Value { get; set; }
        public string ColorClass { get; set; } = string.Empty;
    }

    public class DriverPerformanceDto
    {
        public string Name { get; set; } = string.Empty;
        public int Tours { get; set; }
        public double Rating { get; set; }
        public decimal Revenue { get; set; }
    }
}
