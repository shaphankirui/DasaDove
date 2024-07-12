import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
} from 'ng-apexcharts';
import { SalesService } from '../../../../shared/Services/sales.service';
import { ProductService } from '../../../../shared/Services/product.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
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
          data: [],
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
        categories: [],
      },
    } as ChartOptions;

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
    } as ChartOptions;
  }

  ngOnInit() {
    this.fetchSalesSummary();
    this.fetchInventorySummary();
  }

  fetchSalesSummary() {
    const today = new Date();
    const dates: string[] = [];
    const salesData: number[] = [];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const fetchSalesForDate = (date: string) => {
      return new Promise<number>((resolve) => {
        this.salesService.getSalesByDateRange(date, date).subscribe((data) => {
          resolve(data.totalEarnings || 0);
        });
      });
    };

    const fetchAllSalesData = async () => {
      for (const date of dates) {
        const sales = await fetchSalesForDate(date);
        salesData.push(sales);
      }

      this.salesChartOptions.series[0].data = salesData;
      this.salesChartOptions.xaxis.categories = dates;
      this.thisWeekSales = salesData.reduce((a, b) => a + b, 0);
      this.dataLoading = true;
    };

    fetchAllSalesData();

    this.salesService
      .getSalesByDateRange(
        today.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
      )
      .subscribe((data) => {
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
