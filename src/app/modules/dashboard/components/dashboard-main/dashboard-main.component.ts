import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';
import { SalesService } from '../../../../shared/Services/sales.service';
import { ProductService } from '../../../../shared/Services/product.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent implements OnInit {
  totalCashIncome: number = 0;
  totalMpesaIncome: number = 0;
  totalBankIncome: number = 0;
  dataLoading: boolean = false;
  public salesChartOptions: ChartOptions;
  public inventoryChartOptions: ChartOptions;
  pieChartData: any = {
    series: [],
    labels: ['Cash', 'Mpesa', 'Bank'],
  };

  public todaySales: number | null = null;
  public thisWeekSales: number | null = null;
  public lowStockItems: number | null = null;
  public outOfStockItems: number | null = null;

  constructor(
    private salesService: SalesService,
    private productService: ProductService
  ) {
    this.salesChartOptions = {
      series: [
        {
          name: 'Sales',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
        foreColor: '#ffffff',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      title: {
        text: 'Daily Sales Trend',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
        ],
      },
    };

    this.inventoryChartOptions = {
      series: [
        {
          name: 'Stock',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#ffffff',
      },
      title: {
        text: 'Inventory Levels',
        align: 'left',
      },
      xaxis: {
        categories: [
          'Product A',
          'Product B',
          'Product C',
          'Product D',
          'Product E',
          'Product F',
          'Product G',
          'Product H',
          'Product I',
        ],
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
    };
  }

  ngOnInit() {
    this.fetchSalesSummary();
    this.fetchInventorySummary();
  }

  fetchSalesSummary() {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    this.salesService.getSalesByDateRange(today, today).subscribe((data) => {
      this.todaySales = data.totalEarnings;
      this.totalCashIncome = data.totalCashPaid;
      this.totalMpesaIncome = data.totalMpesaPaid;
      this.totalBankIncome = data.totalBankPaid;
      this.pieChartData.series = [
        this.totalCashIncome,
        this.totalMpesaIncome,
        this.totalBankIncome,
      ];
      this.pieChartData.labels = ['Cash', 'Mpesa', 'Bank'];
      this.dataLoading = true;
    });

    this.salesService.getSalesByDateRange(weekAgo, today).subscribe((data) => {
      this.thisWeekSales = data.totalEarnings;
    });
  }

  fetchInventorySummary() {
    this.productService.getAllProducts().subscribe((products) => {
      this.lowStockItems = products.filter(
        (product) => product.quantity! < 1000
      ).length;
      this.outOfStockItems = products.filter(
        (product) => product.quantity === 0
      ).length;
    });
  }
}
