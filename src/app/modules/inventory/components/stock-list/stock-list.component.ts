import { Component } from '@angular/core';
import { InventoryService } from '../../../../shared/Services/inventory.service';
import { Inventory } from '../../../../shared/interfaces/inventory.interface';
import { ProductService } from '../../../../shared/Services/product.service';
import { Product } from '../../../../shared/interfaces/products';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.scss'
})
export class StockListComponent {
  inventories: Inventory[] = [];
  products: Product[] = [];
  constructor(
    private inventoryService: InventoryService,
    private productsService: ProductService,
  ) {}
  ngOnInit(): void {
    this.getAllproducts();
  }
  getAllproducts() {
    this.productsService.getAllProducts().subscribe((data) => {
      console.log(data);
      this.products = data;
    });
  }

  // openDialog(optionalPayload?: any) {
  //   this.dialog.options = {
  //     width: '400px',
  //     height: '500px',
  //     showOverlay: true,
  //     animationIn: AppearanceAnimation.ZOOM_IN,
  //     animationOut: DisappearanceAnimation.ZOOM_OUT,
  //   };

  //   this.dialog.openDialog().subscribe((resp) => {
  //     console.log('Response from dialog content:', resp);
  //   });
  // }

  // closeDialog() {
  //   this.dialog.closeDialog();
  // }
}

