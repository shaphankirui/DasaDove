import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddInventoryComponent } from './components/add-inventory/add-inventory.component';
import { TransferFromStoreComponent } from './components/transfer-from-store/transfer-from-store.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AddInventoryComponent,
    TransferFromStoreComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class InventoryModule { }
