import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Product } from '../../../../shared/interfaces/products';
import { Supplier } from '../../../../shared/interfaces/supplier.interface';
import { LpoService } from '../../../../shared/Services/lpo.service';
import { ProductService } from '../../../../shared/Services/product.service';
import { SuppliersService } from '../../../../shared/Services/suppliers.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-add-lpo',
  templateUrl: './add-lpo.component.html',
  styleUrls: ['./add-lpo.component.scss'],
})
export class AddLpoComponent implements OnInit {
  lpoForm: FormGroup;
  suppliers: Supplier[] = [];
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private lpoService: LpoService,
    private suppliersService: SuppliersService,
    private productService: ProductService,
    private toast: HotToastService
  ) {
    this.lpoForm = this.fb.group({
      supplierId: [null, Validators.required],
      items: this.fb.array([]),
      totalAmount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadSuppliers();
    this.loadProducts();
    this.addItem();
  }

  get itemsFormArray() {
    return this.lpoForm.get('items') as FormArray;
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

  addItem() {
    const itemForm = this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
    this.itemsFormArray.push(itemForm);
  }

  removeItem(index: number) {
    this.itemsFormArray.removeAt(index);
  }

  calculateTotal() {
    let total = 0;
    for (const item of this.itemsFormArray.controls) {
      const product = this.products.find(
        (p) => p.id === item.get('productId')?.value
      );
      if (product) {
        total += product.price * item.get('quantity')?.value;
      }
    }
    this.lpoForm.patchValue({ totalAmount: total });
  }

  onSubmit() {
    if (this.lpoForm.valid) {
      const lpoData = this.lpoForm.value;
      // lpoData.items = JSON.stringify(lpoData.items);
      this.lpoService.addLpo(lpoData).subscribe(
        (response) => {
          this.toast.success('LPO added successfully');
          this.lpoForm.reset();
          // Reset form or navigate to another page
        },
        (error) => this.toast.error('Error adding LPO')
      );
    }
  }
}
