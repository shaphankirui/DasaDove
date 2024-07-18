import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLpoComponent } from './components/add-lpo/add-lpo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddLpoComponent
  ],
  imports: [
    CommonModule,ReactiveFormsModule,FormsModule
  ]
})
export class LpoModule { }
