import { Component } from '@angular/core';
import { ProductService } from '../../../../shared/Services/product.service';
import { Product } from '../../../../shared/interfaces/products';
import { SalesService } from '../../../../shared/Services/sales.service';
import { Sales } from '../../../../shared/interfaces/sales.interface';
import { HotToastService } from '@ngneat/hot-toast';
import {
  AppearanceAnimation,
  DialogRemoteControl,
  DisappearanceAnimation,
} from '@ng-vibe/dialog';
import { AuthComponent } from '../../../../shared/Data/components/auth/auth.component';

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
  private dialog: DialogRemoteControl = new DialogRemoteControl(AuthComponent);
  searchQuery: string = '';
  products: Product[] = [];
  productsLoading: boolean = true;
  posting: boolean = false;
  constructor(
    private productService: ProductService,
    private salesService: SalesService,
    private toast: HotToastService
  ) {}
  ngOnInit() {
    this.getAllProducts();
  }

  selectedProducts: Product[] = [];
  allProducts: Product[] = [];
  productTotals: number[] = []; // Initialize productTotals as an empty array

  paymentMethods: PaymentMethods = {
    cash: 0,
    mpesa: 0,
    bank: 0,
  };

  showPayment: boolean = false; // State to show/hide payment section

  getAllProducts(): void {
    this.productsLoading = true;
    console.log('type query', this.searchQuery);
    this.productService.getAllProducts().subscribe((products) => {
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        this.products = products.filter((product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        this.productsLoading = false;
      } else {
        this.products = products;
        this.productsLoading = false;
      }
      console.log('Filtered products', this.products);
    });
  }

  onProductClick(product: Product): void {
    if (!this.selectedProducts.some((p) => p.id === product.id)) {
      product.selectedProducts = product.selectedProducts ?? 1; // Initialize to 1 if undefined
      this.selectedProducts.push(product);
      this.productTotals.push(this.calculateSubtotal(product));
      console.log('Selected Products:', this.selectedProducts);
    }
  }

  addQuantity(product: Product): void {
    console.log('Product:', product);
    product.selectedProducts = (product.selectedProducts ?? 1) + 1; // Initialize to 1 if undefined
    console.log('Selected Products:', product.selectedProducts);
  }

  reduceQuantity(product: Product): void {
    if ((product.selectedProducts ?? 1) > 1) {
      product.selectedProducts = (product.selectedProducts ?? 1) - 1; // Initialize to 1 if undefined
      console.log('Selected Products:', product.selectedProducts);
    }
  }

  calculateSubtotal(product: Product): number {
    const discount = product.discount || 0;
    const price = product.price;
    return (price - (price * discount) / 100) * product.selectedProducts! || 0;
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
  submitOrder() {
    const itemsToSend = this.selectedProducts.map((product) => ({
      name: product.name,
      id: product.id,
      category_id: product.categoryId,
      price: product.price,
      selectedItems: product.selectedProducts || 0,
    }));
    const totalPayment =
      this.paymentMethods.cash +
      this.paymentMethods.mpesa +
      this.paymentMethods.bank;
    const sales: Sales = {
      items: itemsToSend,
      cashPaid: this.paymentMethods.cash,
      mpesaPaid: this.paymentMethods.mpesa,
      bankPaid: this.paymentMethods.bank,
      taxAmount: totalPayment * 0.16,
      discountAmount: this.paymentMethods.bank,
      total: this.calculateTotal(),
      customerId: this.paymentMethods.bank,
      printerIp: '192.168.1.6',
      isVoided: false,
      voidedBy: false,
      totalAmountPaid: totalPayment,
    };
    if (totalPayment < sales.total) {
      this.toast.error('Insufficient Payments,please make full payment');
      return;
    }
    this.salesService.addSales(sales).subscribe((res: Sales) => {
      console.log('Sales created', res);
      this.selectedProducts = [];
      this.productTotals = [];
      this.paymentMethods = {
        cash: 0,
        mpesa: 0,
        bank: 0,
      };
      this.showPayment = false;
      this.getAllProducts();
      this.toast.success('Sale submitted successfully');
    });
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

  openDialog(optionalPayload?: any) {
    this.dialog.options = {
      width: '500px',
      height: '300px',
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN,
      animationOut: DisappearanceAnimation.ZOOM_OUT,
    };
    const itemsToSend = this.selectedProducts.map((product) => ({
      name: product.name,
      id: product.id,
      category_id: product.categoryId,
      price: product.price,
      selectedItems: product.selectedProducts || 0,
    }));
    const totalPayment =
      this.paymentMethods.cash +
      this.paymentMethods.mpesa +
      this.paymentMethods.bank;
    const sales: Sales = {
      items: itemsToSend,
      cashPaid: this.paymentMethods.cash,
      mpesaPaid: this.paymentMethods.mpesa,
      bankPaid: this.paymentMethods.bank,
      taxAmount: totalPayment * 0.16,
      discountAmount: this.paymentMethods.bank,
      total: this.calculateTotal(),
      customerId: this.paymentMethods.bank,
      printerIp: '192.168.1.6',
      isVoided: false,
      voidedBy: false,
      totalAmountPaid: totalPayment,
    };
    if (totalPayment < this.calculateTotal()) {
      this.toast.error('Not enough payment');
      return;
    }
    this.dialog.openDialog(sales).subscribe((resp) => {
      console.log('Response from dialog content:', resp);
    });
  }

  closeDialog() {
    this.dialog.closeDialog();
  }
}
