import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CashSalesComponent } from './components/cash-sales/cash-sales.component';
import { ShowCreditSalesComponent } from './components/credit sales/show-credit-sales/show-credit-sales.component';
import { MakeCreditSalesComponent } from './components/credit sales/make-credit-sales/make-credit-sales.component';
import { MakeCreditSalesPayentsComponent } from './components/credit sales/make-credit-sales-payents/make-credit-sales-payents.component';
import { ShowSalesComponent } from './components/show-sales/show-sales.component';
import { LoaderComponent } from '../../shared/Data/components/loader/loader.component';
import { BtnLOderComponent } from '../../shared/Data/components/btn-loder/btn-loder.component';
import { RouterModule } from '@angular/router';
import { RefundComponent } from './components/refund/refund.component';

@NgModule({
  declarations: [
    CashSalesComponent,
    ShowCreditSalesComponent,
    MakeCreditSalesComponent,
    MakeCreditSalesPayentsComponent,
    ShowSalesComponent,
    RefundComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    BtnLOderComponent,
    RouterModule,
  ],
})
export class SalesModule {}
