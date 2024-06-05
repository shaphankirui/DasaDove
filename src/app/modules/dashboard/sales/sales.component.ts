import { Component } from '@angular/core';
export interface Product {
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {searchQuery: string = '';
filteredProducts: Product[] = [];
selectedProduct: Product | null = null;
quantity: number = 1;
discount: number = 0;
paymentMode: string = 'cash';
saleCompleted: boolean = false;
subtotal: number = 0;
tax: number = 0;
total: number = 0;

products: Product[] = [
  { name: 'Phone', quantity: 20, price: 20000 },
  { name: 'Laptop', quantity: 3, price: 40000 },
  { name: 'Bike', quantity: 4, price: 12000 }
];

searchProducts() {
  this.filteredProducts = this.products.filter(product =>
    product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
  );
}

selectProduct(product: Product) {
  this.selectedProduct = product;
  this.quantity = 1;
  this.discount = 0;
  this.paymentMode = 'cash';
  this.saleCompleted = false;
}

completeSale() {
  if (this.selectedProduct) {
    const discountAmount = (this.discount / 100) * this.selectedProduct.price * this.quantity;
    this.subtotal = this.selectedProduct.price * this.quantity - discountAmount;
    this.tax = 0.16 * this.subtotal;
    this.total = this.subtotal + this.tax;
    this.saleCompleted = true;
  }
}
}