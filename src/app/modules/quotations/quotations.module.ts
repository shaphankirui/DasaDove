import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddQuatationsComponent } from './components/add-quatations/add-quatations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AddQuatationsComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
})
export class QuotationsModule {}
