import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../shared/Services/inventory.service';
import { ProductService } from '../../../../shared/Services/product.service';
import { SuppliersService } from '../../../../shared/Services/suppliers.service';
import { Product } from '../../../../shared/interfaces/products';
import { Supplier } from '../../../../shared/interfaces/supplier.interface';

@Component({
  selector: 'app-purchase-reports',
  templateUrl: './purchase-reports.component.html',
  styleUrls: ['./purchase-reports.component.scss'],
})
export class PurchaseReportsComponent implements OnInit {
  purchases: any[] = [];
  filteredPurchases: any[] = [];
  reportType: string = 'daily';
  selectedDate: string = '';
  startDate: string = '';
  endDate: string = '';
  suppliers: Supplier[] = [];
  products: Product[] = [];

  constructor(
    private inventoryService: InventoryService,
    private suppliersService: SuppliersService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getAllPurchases();
    this.loadSuppliers();
    this.loadProducts();
  }

  getAllPurchases() {
    this.inventoryService.getAllInventorys().subscribe(
      (data) => {
        this.purchases = data;
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  generateReport() {
    this.loadProducts();
    if (this.reportType === 'daily') {
      this.filteredPurchases = this.purchases.filter(
        (purchase) =>
          new Date(purchase.createdAt).toDateString() ===
          new Date(this.selectedDate).toDateString()
      );
      console.log('for daily reports', this.filteredPurchases);
    } else if (this.reportType === 'range') {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      this.filteredPurchases = this.purchases.filter((purchase) => {
        const date = new Date(purchase.createdAt);
        return date >= start && date <= end;
      });
      console.log('for range reports', this.filteredPurchases);
    }
  }

  getTotalAmount(): number {
    return this.filteredPurchases.reduce(
      (total, purchase) => total + purchase.total,
      0
    );
  }
  loadSuppliers() {
    this.suppliersService.getAllSupplier().subscribe(
      (suppliers) => (this.suppliers = suppliers),
      (error) => console.error('Error loading suppliers:', error)
    );
  }
  loadProducts() {
    this.productService.getAllProducts().subscribe(
      (products) => (this.products = products),
      (error) => console.error('Error loading products:', error)
    );
  }

  getProductNameById(id: number): string {
    const product = this.products.find((p) => {
      p.id === id;
      return p.id;
    });
    console.log('product goten', id);
    if (product) {
      return product.name;
    } else {
      return 'Loading...';
    }
  }

  getSupplierNameById(id: number): string {
    const supplier = this.suppliers.find((s) => s.id === id);
    if (supplier) {
      return supplier.name;
    } else {
      return 'Loading...';
    }
  }
}
