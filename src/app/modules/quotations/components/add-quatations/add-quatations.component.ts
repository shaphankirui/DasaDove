import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Product } from '../../../../shared/interfaces/products';
import { Supplier } from '../../../../shared/interfaces/supplier.interface';
import { ProductService } from '../../../../shared/Services/product.service';
import { QuotationService } from '../../../../shared/Services/quotation.service';
import { SuppliersService } from '../../../../shared/Services/suppliers.service';

@Component({
  selector: 'app-add-quatations',
  templateUrl: './add-quatations.component.html',
  styleUrl: './add-quatations.component.scss'
})
export class AddQuatationsComponent {
  quotationForm: FormGroup;
  suppliers: Supplier[] = [];
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private quotationService: QuotationService,
    private suppliersService: SuppliersService,
    private productService: ProductService
  ) {
    this.quotationForm = this.fb.group({
      referenceNumber: ['', Validators.required],
      supplierId: [null, Validators.required],
      items: this.fb.array([]),
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSuppliers();
    this.loadProducts();
    this.addItem();
  }

  get itemsFormArray() {
    return this.quotationForm.get('items') as FormArray;
  }

  loadSuppliers() {
    this.suppliersService.getAllSupplier().subscribe(
      suppliers => this.suppliers = suppliers,
      error => console.error('Error loading suppliers:', error)
    );
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(
      products => this.products = products,
      error => console.error('Error loading products:', error)
    );
  }

  addItem() {
    const itemForm = this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.itemsFormArray.push(itemForm);
  }

  removeItem(index: number) {
    this.itemsFormArray.removeAt(index);
  }

  onSubmit() {
    if (this.quotationForm.valid) {
      const quotationData = this.quotationForm.value;
      quotationData.items = JSON.stringify(quotationData.items);
      this.quotationService.addQuotation(quotationData).subscribe(
        response => {
          console.log('Quotation added successfully:', response);
          // Reset form or navigate to another page
        },
        error => console.error('Error adding quotation:', error)
      );
    }
  }
}