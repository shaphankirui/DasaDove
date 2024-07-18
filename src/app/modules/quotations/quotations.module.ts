import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddQuatationsComponent } from './components/add-quatations/add-quatations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddQuatationsComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class QuotationsModule {}
