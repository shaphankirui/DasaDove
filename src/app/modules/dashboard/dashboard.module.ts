import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales/sales.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SalesComponent],
  imports: [CommonModule, FormsModule],
})
export class DashboardModule {}
