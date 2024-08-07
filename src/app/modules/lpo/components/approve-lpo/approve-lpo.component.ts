import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { LpoService } from '../../../../shared/Services/lpo.service';
import { ProductService } from '../../../../shared/Services/product.service';
import { InventoryService } from '../../../../shared/Services/inventory.service';
import { Product } from '../../../../shared/interfaces/products';
import { LpoInterface } from '../../../../shared/interfaces/lpo.interface';
import { SuppliersService } from '../../../../shared/Services/suppliers.service';
import { Supplier } from '../../../../shared/interfaces/supplier.interface';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-approve-lpo',
  templateUrl: './approve-lpo.component.html',
  styleUrls: ['./approve-lpo.component.scss'],
})
export class ApproveLpoComponent implements OnInit {
  lpoForm: FormGroup;
  lpoId: number = 0;
  suppliers: Supplier[] = [];
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lpoService: LpoService,
    private productService: ProductService,
    private inventoryService: InventoryService,
    private suppliersService: SuppliersService,
    private toast: HotToastService
  ) {
    this.lpoForm = this.fb.group({
      supplierId: ['', Validators.required],
      items: this.fb.array([]),
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', Validators.required],
    });
  }

  ngOnInit() {
    this.lpoId = +this.route.snapshot.paramMap.get('id')!;
    this.loadLpo();
    this.loadProducts();
    this.loadSuppliers();
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
    const product = this.products.find((p) => p.id === id);
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

  loadLpo() {
    this.lpoService.getLpoId(this.lpoId).subscribe(
      (lpo) => {
        this.lpoForm.patchValue({
          supplierId: lpo.supplierId,
          totalAmount: lpo.totalAmount,
          status: lpo.status,
        });
        this.setItems(lpo.items);
      },
      (error) => console.error('Error loading LPO:', error)
    );
  }

  setItems(items: any[]) {
    const itemForms = items.map((item) =>
      this.fb.group({
        productId: [item.productId, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        price: [0, [Validators.required, Validators.min(0)]],
      })
    );
    const itemsFormArray = this.fb.array(itemForms);
    this.lpoForm.setControl('items', itemsFormArray);
  }

  get items() {
    return this.lpoForm.get('items') as FormArray;
  }

  updateTotalAmount() {
    const total = this.items.controls.reduce((sum, item) => {
      return sum + item.get('quantity')!.value * item.get('price')!.value;
    }, 0);
    this.lpoForm.patchValue({ totalAmount: total });
  }

  approveLpo() {
    if (this.lpoForm.valid) {
      const approvedLpo = this.lpoForm.value;
      if (approvedLpo.status === 'approved') {
        this.toast.error('LPO already approved');
        return;
      }
      approvedLpo.status = 'approved';

      this.lpoService.updateLpo(this.lpoId, approvedLpo).subscribe(
        () => {
          this.addToInventoryAndUpdateProducts(approvedLpo);
          this.router.navigate(['/lpo-list']);
        },
        (error) => console.error('Error approving LPO:', error)
      );
    }
  }

  addToInventoryAndUpdateProducts(approvedLpo: any) {
    const items = approvedLpo.items;

    items.forEach((item: { productId: any; quantity: any; price: any }) => {
      // Add to inventory
      this.inventoryService
        .addInventory({
          product_id: item.productId.toString(),
          quantity: item.quantity,
          buying_price: item.price,
          added_by: 'shaphan',
          total: item.quantity * item.price,
          deleted: false,
        })
        .subscribe(
          () => console.log('Inventory added successfully'),
          (error) => console.error('Error adding to inventory:', error)
        );

      // Update product quantity
      this.productService.getProductbyId(item.productId).subscribe(
        (product) => {
          const newQuantity = (product.quantity || 0) + item.quantity;
          console.log('existing quantity:', product.quantity);
          console.log('quantity to add quantity:', item.quantity);
          console.log('New quantity:', newQuantity);
          this.productService
            .updateProductQuantity(item.productId, newQuantity)
            .subscribe(
              () => {
                this.toast.success('LPO approved successfully');
                this.router.navigate(['/lpo']);
                console.log(
                  newQuantity,
                  'Product quantity updated successfully'
                );
              },
              (error) =>
                console.error('Error updating product quantity:', error)
            );
        },
        (error) => console.error('Error fetching product:', error)
      );
    });
  }
}
