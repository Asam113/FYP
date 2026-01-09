import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  // Charts Configuration
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 60, 45, 80],
        label: 'Tours',
        fill: true,
        tension: 0.5,
        borderColor: '#4dbd74',
        backgroundColor: 'rgba(77, 189, 116, 0.2)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        label: 'Revenue',
        backgroundColor: '#20c997'
      }
    ]
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  // Recent Tours Data
  recentTours = [
    { id: 'T001', destination: 'Northern Areas Package', client: 'John Smith', status: 'Active', statusClass: 'bg-success-subtle text-success', amount: '$2,400' },
    { id: 'T002', destination: 'Lahore Heritage Tour', client: 'Sarah Khan', status: 'Completed', statusClass: 'bg-primary-subtle text-primary', amount: '$1,200' },
    { id: 'T003', destination: 'Karachi Coastal Drive', client: 'Ahmed Ali', status: 'Active', statusClass: 'bg-success-subtle text-success', amount: '$800' },
    { id: 'T004', destination: 'Murree Hills Retreat', client: 'Emma Wilson', status: 'Pending', statusClass: 'bg-warning-subtle text-warning', amount: '$1,500' }
  ];

}
