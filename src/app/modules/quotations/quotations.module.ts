import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddQuatationsComponent } from './components/add-quatations/add-quatations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShowQuotationsComponent } from './components/show-quotations/show-quotations.component';
import { UpdateQuotationsComponent } from './components/update-quotations/update-quotations.component';
import { ApproveQuotationsComponent } from './components/approve-quotations/approve-quotations.component';

@NgModule({
  declarations: [AddQuatationsComponent, ShowQuotationsComponent, UpdateQuotationsComponent, ApproveQuotationsComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
})
export class QuotationsModule {}
