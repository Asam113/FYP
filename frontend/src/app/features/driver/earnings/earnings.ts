
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './earnings.html',
  styleUrl: './earnings.css'
})
export class Earnings {

  stats = {
    totalEarnings: 'Rs. 45,000',
    paidAmount: 'Rs. 20,500',
    pendingPayments: 'Rs. 24,500'
  };

  // Bar Chart Configuration
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      bar: {
        borderRadius: 4,
        backgroundColor: '#3b82f6'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    datasets: [
      { data: [12000, 18000, 19000, 25000, 22000, 35000, 45000], label: 'Earnings' }
    ]
  };

  // Line Chart Configuration
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [12000, 18000, 22000, 28000, 25000, 35000, 45000],
        label: 'Earnings',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#10b981',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 185, 129, 0.8)',
        fill: 'origin',
        tension: 0.4
      }
    ],
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  public lineChartType: ChartType = 'line';


  paymentHistory = [
    {
      title: 'Nathia Gali Winter Tour',
      date: 'Dec 28, 2025',
      method: 'Bank Transfer',
      amount: 'Rs. 7,500',
      status: 'Paid',
      statusClass: 'success'
    },
    {
      title: 'Northern Areas Explorer',
      date: 'Jan 15, 2026',
      method: 'Bank Transfer',
      amount: 'Rs. 25,000',
      status: 'Pending',
      statusClass: 'warning'
    },
    {
      title: 'Murree Hill Station Tour',
      date: 'Jan 10, 2026',
      method: 'Cash',
      amount: 'Rs. 8,500',
      status: 'Paid',
      statusClass: 'success'
    },
    {
      title: 'Karachi City Tour',
      date: 'Dec 20, 2025',
      method: 'Bank Transfer',
      amount: 'Rs. 4,500',
      status: 'Paid',
      statusClass: 'success'
    }
  ];

}
