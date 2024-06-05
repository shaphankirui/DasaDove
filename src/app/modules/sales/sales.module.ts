import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CashSalesComponent } from './components/cash-sales/cash-sales.component';
import { ShowCreditSalesComponent } from './components/credit sales/show-credit-sales/show-credit-sales.component';
import { MakeCreditSalesComponent } from './components/credit sales/make-credit-sales/make-credit-sales.component';
import { MakeCreditSalesPayentsComponent } from './components/credit sales/make-credit-sales-payents/make-credit-sales-payents.component';
import { ShowSalesComponent } from './components/show-sales/show-sales.component';



@NgModule({
  declarations: [
    CashSalesComponent,
    ShowCreditSalesComponent,
    MakeCreditSalesComponent,
    MakeCreditSalesPayentsComponent,
    ShowSalesComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class SalesModule { }
