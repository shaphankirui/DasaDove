import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../../../shared/Services/sales.service';
import { Sales } from '../../../../shared/interfaces/sales.interface';

@Component({
  selector: 'app-sales-reports',
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.scss'],
})
export class SalesReportsComponent implements OnInit {
  reportType: string = 'day'; // Default report type
  startDate: string = '';
  endDate: string = '';
  salesData: Sales[] = [];
  totalIncome: number = 0;
  totalCashIncome: number = 0;
  totalMpesaIncome: number = 0;
  totalBankIncome: number = 0;
  mostSoldItems: { name: string; quantitySold: number; revenue: number }[] = [];
  recentOrders: {
    id: number | undefined;
    date: Date | undefined;
    total: number;
    paymentMethod: string;
  }[] = [];

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.getSalesReport();
  }

  getSalesReport(): void {
    const today = new Date();
    let start: string = this.formatDate(today);
    let end: string = this.formatDate(today);

    if (this.reportType === 'day') {
      // Default start and end are today
    } else if (this.reportType === 'month') {
      start = this.formatDate(
        new Date(today.getFullYear(), today.getMonth(), 1)
      );
    } else if (this.reportType === 'range') {
      if (!this.startDate || !this.endDate) {
        console.error(
          'Start date and end date must be provided for range report'
        );
        return;
      }
      start = this.startDate;
      end = this.endDate;
    }

    this.salesService.getSalesByDateRange(start, end).subscribe(
      (data: any) => {
        this.salesData = data.orders;
        console.log('Data from Api', data);
        this.processSalesData(data);
        this.calculateMostSoldItems();
        this.getRecentOrders();
      },
      (error) => {
        console.error('Error fetching sales report:', error);
      }
    );
  }
  calculateMostSoldItems(): void {
    // Implement logic to calculate most sold items
    // This is a placeholder implementation
    this.mostSoldItems = [
      { name: 'Item 1', quantitySold: 50, revenue: 500 },
      { name: 'Item 2', quantitySold: 30, revenue: 300 },
      { name: 'Item 3', quantitySold: 20, revenue: 200 },
    ];
  }

  getRecentOrders(): void {
    // Implement logic to get recent orders
    // This is a placeholder implementation
    this.recentOrders = this.salesData.slice(0, 5).map((order) => ({
      id: order.id,
      date: order.createdAt,
      total: order.total,
      paymentMethod: this.getPaymentMethod(order),
    }));
  }

  getPaymentMethod(order: Sales): string {
    if (order.cashPaid > 0) return 'Cash';
    if (order.mpesaPaid > 0) return 'M-Pesa';
    if (order.bankPaid > 0) return 'Bank';
    return 'Unknown';
  }

  processSalesData(orders: any): void {
    this.salesData = orders.orders;
    this.totalIncome = orders.totalEarnings;
    this.totalCashIncome = orders.totalCashPaid;
    this.totalMpesaIncome = orders.totalMpesaPaid;
    this.totalBankIncome = orders.totalBankPaid;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
