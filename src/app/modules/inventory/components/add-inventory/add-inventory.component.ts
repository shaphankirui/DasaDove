import { Component } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable, forkJoin } from 'rxjs';
import { CategoryService } from '../../../../shared/Services/category.service';
import { ProductService } from '../../../../shared/Services/product.service';
import { Category } from '../../../../shared/interfaces/categories';
import { Product } from '../../../../shared/interfaces/products';
import { InventoryService } from '../../../../shared/Services/inventory.service';
import { Inventory } from '../../../../shared/interfaces/inventory.interface';
import { Supplier } from '../../../../shared/interfaces/supplier.interface';
import { SuppliersService } from '../../../../shared/Services/suppliers.service';
interface PurchaseData {
  product_id: string;
  quantity: number | undefined;
  buying_price: number | undefined;
  total: number;
  added_by: string;
  deleted: boolean;
}

// ...

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss',
})
export class AddInventoryComponent {
  products: Product[] = [];
  categories: Category[] = [];
  selectedProducts: Product[] = [];
  filteredCategories: Category[] = [];
  suppliers: Supplier[] = [];
  modalId: string = '';
  isModalVisible: boolean = false;
  shifts: any[] = []; // Array to hold all shifts
  selectedShiftId: number | null = null; // Track the selected shift ID
  currentShift: any; // Update the type based on your Shift interface or model
  query: string = ''; // For search query
  buying_price: any;
  supplierName: string = 'shaphan Kirui';
  currentUser: string = 'shaphan Kirui';
  orgOptions: any = {
    store_products: true,
  };
  isPaymentModalVisible: boolean = false;
  isPaid: boolean = false;
  paymentMode: string = 'Mpesa';
  paymentAmount: number = 0;

  openPaymentModal() {
    this.isPaymentModalVisible = true;
  }

  closePaymentModal() {
    this.isPaymentModalVisible = false;
  }

  payAll() {
    // Logic to handle payment for all selected products
    console.log('Payment Mode:', this.paymentMode);
    console.log('Payment Amount:', this.paymentAmount);
    // Additional logic...
    this.closePaymentModal();
  }

  completePurchase() {
    // Logic to complete purchase after payment
    console.log('Purchase Completed');
    // Additional logic...
  }

  constructor(
    private categoryService: CategoryService,
    private toast: HotToastService,
    private productService: ProductService,
    private inventoryService: InventoryService,
    private suppliersService: SuppliersService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllSupplier();
  }

  getAllProducts(searchQuery?: string): void {
    this.productService.getAllProducts().subscribe((products) => {
      if (searchQuery && searchQuery.trim() !== '') {
        this.products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.categoryId.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        this.products = products;
      }
      console.log('Filtered products', this.products);
    });
  }
  getAllSupplier(searchQuery?: string) {
    this.suppliersService.getAllSupplier().subscribe(
      (data: Supplier[]) => {
        if (searchQuery && searchQuery.trim() !== '') {
          this.suppliers = data.filter(
            (supplier) =>
              supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              supplier.phone.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          this.suppliers = data;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  onInputChange(): void {
    console.log('Query changed', this.query);
    this.getAllProducts(this.query);
  }

  onProductClick(product: Product): void {
    if (!this.selectedProducts.some((p) => p.id === product.id)) {
      this.selectedProducts.push(product);
      this.query = '';
      console.log('Selected Products:', this.selectedProducts);
    }
  }

  removeSelectedProduct(index: number): void {
    if (index >= 0 && index < this.selectedProducts.length) {
      this.selectedProducts.splice(index, 1);
    } else {
      console.error('Invalid index for removing selected product');
    }
  }

  addPurchase(): void {
    // Validate selected products
    if (this.selectedProducts.length === 0) {
      this.toast.error('Please select at least one product.');
      return;
    }

    // Validate if supplier is selected
    if (!this.supplierName) {
      this.toast.error('Please select a supplier.');
      return;
    }

    // Validate each selected product
    for (const product of this.selectedProducts) {
      if (!product.buying_price || !product.quantityToAdd) {
        this.toast.error(
          'Please fill in all fields for the selected products.'
        );
        return;
      }
    }

    // Create an array to store observables
    const observables: Observable<Inventory>[] = [];

    // Create an observable for each product purchase
    for (const product of this.selectedProducts) {
      const purchaseData: PurchaseData = {
        product_id: product.id,
        quantity: product.quantityToAdd,
        buying_price: product.buying_price,
        total: product.quantityToAdd! * product.buying_price!,
        added_by: this.currentUser,
        deleted: false,
      };
      observables.push(this.inventoryService.addInventory(purchaseData));
    }

    // Combine all observables and wait for all of them to complete
    forkJoin(observables).subscribe(
      (responses) => {
        console.log('All purchases added:', responses);
        this.toast.success('Purchases added successfully');
        this.addProductsAddedQuantityToStore();
      },
      (error) => {
        console.error('Error adding purchases:', error);
        this.toast.error(
          'Error adding purchases check for Internet Connection'
        );
      }
    );
  }

  addProductsAddedQuantityToStore(): void {
    if (this.orgOptions.store_products) {
      this.selectedProducts.forEach((product) => {
        const purchaseData = {
          quantity: product.quantity! + product.quantityToAdd!,
          name: product.name,
          categoryId: product.categoryId,
          price: product.price,
          description: product.description,
        };
        console.log('quantity to update', purchaseData);
        this.productService.updateProduct(product.id, purchaseData).subscribe(
          (response) => {
            // console.log('quantity   added:', response);
            // this.toast.success('quantity  added successfully');
            this.clearFilters();
          },
          (error) => {
            console.error('Error adding purchase:', error);
          }
        );
      });
    } else {
      this.selectedProducts.forEach((product) => {
        const purchaseData = {
          quantity: product.quantity! + product.quantityToAdd!,
          name: product.name,
          categoryId: product.categoryId,
          price: product.price,
          description: product.description,
        };
        console.log('quantity to update', purchaseData);
        this.productService.updateProduct(product.id, purchaseData).subscribe(
          (response) => {
            // console.log('quantity   added:', response);
            // this.toast.success('quantity  added successfully');
            this.clearFilters();
          },
          (error) => {
            console.error('Error adding purchase:', error);
          }
        );
      });
    }
  }
  clearFilters(): void {
    this.query = '';
    this.selectedProducts = [];
    this.getAllProducts();
  }
}
