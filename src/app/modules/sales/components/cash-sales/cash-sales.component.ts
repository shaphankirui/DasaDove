import { Component } from '@angular/core';
import { ProductService } from '../../../../shared/Services/product.service';
import { Product } from '../../../../shared/interfaces/products';

interface PaymentMethods {
  cash: number;
  mpesa: number;
  bank: number;
}

@Component({
  selector: 'app-cash-sales',
  templateUrl: './cash-sales.component.html',
  styleUrls: ['./cash-sales.component.scss'], // Fixed styleUrl typo
})
export class CashSalesComponent {
  products: Product[] = [];
  constructor(private productService: ProductService) {}
  ngOnInit() {
    this.getAllProducts();
  }

  selectedProducts: Product[] = [];
  productTotals: number[] = []; // Initialize productTotals as an empty array

  paymentMethods: PaymentMethods = {
    cash: 0,
    mpesa: 0,
    bank: 0,
  };

  showPayment: boolean = false; // State to show/hide payment section

  getAllProducts(searchQuery?: string): void {
    this.productService.getAllProducts().subscribe((products) => {
      if (searchQuery && searchQuery.trim() !== '') {
        this.products = products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        this.products = products;
      }
      console.log('Filtered products', this.products);
    });
  }

  onProductClick(product: Product): void {
    if (!this.selectedProducts.some((p) => p.id === product.id)) {
      this.selectedProducts.push(product);
      this.productTotals.push(this.calculateSubtotal(product));
      console.log('Selected Products:', this.selectedProducts);
    }
  }

  calculateSubtotal(product: Product): number {
    const discount = product.discount || 0;
    const price = product.price;
    return (price - (price * discount) / 100) * product.quantity!;
  }

  calculateSubtotalTotal(): number {
    return this.selectedProducts.reduce(
      (acc, product) => acc + this.calculateSubtotal(product),
      0
    );
  }

  calculateDiscountTotal(): number {
    return this.selectedProducts.reduce(
      (acc, product) =>
        acc +
        ((product.price * (product.discount || 0)) / 100) * product.quantity!,
      0
    );
  }

  calculateTax(): number {
    return this.calculateSubtotalTotal() * 0.16;
  }

  calculateTotal(): number {
    return this.calculateSubtotalTotal() + this.calculateTax();
  }

  removeSelectedProduct(index: number): void {
    if (index >= 0 && index < this.selectedProducts.length) {
      this.selectedProducts.splice(index, 1);
      this.productTotals.splice(index, 1);
    } else {
      console.error('Invalid index for removing selected product');
    }
  }

  submitPayment(): void {
    const totalPayment =
      this.paymentMethods.cash +
      this.paymentMethods.mpesa +
      this.paymentMethods.bank;
    const total = this.calculateTotal();
    if (totalPayment >= total) {
      alert('Payment Successful!');
    } else {
      alert('Insufficient Payment');
    }
  }
}
