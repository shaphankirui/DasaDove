import { Component } from '@angular/core';
import {
  DialogRemoteControl,
  AppearanceAnimation,
  DisappearanceAnimation,
} from '@ng-vibe/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { CreditAuthComponent } from '../../../../../shared/Data/components/credit-auth/credit-auth.component';
import { Product } from '../../../../../shared/interfaces/products';
import { Sales } from '../../../../../shared/interfaces/sales.interface';
import { ProductService } from '../../../../../shared/Services/product.service';
import { SalesService } from '../../../../../shared/Services/sales.service';
import { Customer } from '../../../../../shared/interfaces/customer.interface';
import { CustomerService } from '../../../../../shared/Services/customer.service';
import { CreditSale } from '../../../../../shared/interfaces/cretitSale.interface';
interface PaymentMethods {
  cash: number;
  mpesa: number;
  bank: number;
}

@Component({
  selector: 'app-make-credit-sales',
  templateUrl: './make-credit-sales.component.html',
  styleUrl: './make-credit-sales.component.scss',
})
export class MakeCreditSalesComponent {
  private dialog: DialogRemoteControl = new DialogRemoteControl(
    CreditAuthComponent
  );
  searchQuery: string = '';
  products: Product[] = [];
  productsLoading: boolean = true;
  posting: boolean = false;
  customers: Customer[] = [];
  selectedCustomerId: number | null = null;
  selectedCustomer: Customer | null = null;
  constructor(
    private productService: ProductService,
    private salesService: SalesService,
    private toast: HotToastService,
    private customersService: CustomerService
  ) {}
  ngOnInit() {
    this.getAllProducts();
    this.getAllCustomers();
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

  getAllCustomers(): void {
    this.customersService.getAllCustomers().subscribe((customers) => {
      this.customers = customers;
    });
  }
  getCustomerDetails(customerId: number): void {
    this.customersService.getCustomerbyId(customerId).subscribe((customer) => {
      this.selectedCustomer = customer;
    });
  }

  onCustomerSelect(customerId: number): void {
    this.selectedCustomerId = customerId;
    this.getCustomerDetails(customerId);
  }

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
    const sales: CreditSale = {
      items: itemsToSend,
      credit_amount: this.calculateTotal(),
      customer_id: +this.selectedCustomerId!,
      customer_name: this.selectedCustomer!.fullName,
      order_date: new Date(),
      payment_date: new Date(),
      created_by: 'shaphan Kirui',
      order_id: 1,
      amount_paid: 0,
      fully_paid: 0,
      phone_number: this.selectedCustomer!.phoneNumber,
      shift_id: 1,
    };

    this.dialog.openDialog(sales).subscribe((resp) => {
      console.log('Response from dialog content:', resp);
    });
  }

  closeDialog() {
    this.dialog.closeDialog();
  }
}
