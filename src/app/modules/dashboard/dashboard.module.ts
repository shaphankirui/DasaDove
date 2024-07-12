import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales/sales.component';
import { FormsModule } from '@angular/forms';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';

@NgModule({
  declarations: [SalesComponent, ],
  imports: [CommonModule, FormsModule, NgApexchartsModule],
})
export class DashboardModule {}
