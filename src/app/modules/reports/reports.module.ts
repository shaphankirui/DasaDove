import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesReportsComponent } from './components/sales-reports/sales-reports.component';
import { IncomeReportsComponent } from './components/income-reports/income-reports.component';
import { CreditReportsComponent } from './components/credit-reports/credit-reports.component';
import { PurchaseReportsComponent } from './components/purchase-reports/purchase-reports.component';
import { VoidedSalesReportsComponent } from './components/voided-sales-reports/voided-sales-reports.component';



@NgModule({
  declarations: [
    SalesReportsComponent,
    IncomeReportsComponent,
    CreditReportsComponent,
    PurchaseReportsComponent,
    VoidedSalesReportsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ReportsModule { }
