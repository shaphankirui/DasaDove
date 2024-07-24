import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Product } from '../../../../shared/interfaces/products';
import { Customer } from '../../../../shared/interfaces/customer.interface';
import { ProductService } from '../../../../shared/Services/product.service';
import { QuotationService } from '../../../../shared/Services/quotation.service';
import { CustomerService } from '../../../../shared/Services/customer.service';

@Component({
  selector: 'app-add-quatations',
  templateUrl: './add-quatations.component.html',
  styleUrls: ['./add-quatations.component.scss'],
})
export class AddQuatationsComponent implements OnInit {
  quotationForm: FormGroup;
  customers: Customer[] = [];
  products: Product[] = [];
  productSearch: string = '';
  customerSearch: string = '';

  constructor(
    private fb: FormBuilder,
    private quotationService: QuotationService,
    private productService: ProductService,
    private customerService: CustomerService
  ) {
    this.quotationForm = this.fb.group({
      supplierId: [null, Validators.required],
      items: this.fb.array([]),
      totalAmount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadCustomers();
    this.loadProducts();
    this.addItem();
  }

  get itemsFormArray() {
    return this.quotationForm.get('items') as FormArray;
  }

  loadCustomers(query?: string) {
    this.customerService.getAllCustomers().subscribe(
      (data: Customer[]) => {
        if (query) {
          this.customers = data.filter((customer) =>
            customer.fullName.toLowerCase().includes(query.toLowerCase())
          );
        } else {
          this.customers = data;
        }
      },
      (error) => console.error('Error loading customers:', error)
    );
  }

  loadProducts(query?: string) {
    this.productService.getAllProducts().subscribe(
      (data: Product[]) => {
        if (query) {
          this.products = data.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
          );
        } else {
          this.products = data;
        }
      },
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
    this.updateTotal();
  }

  updateTotal() {
    let total = 0;
    for (let item of this.itemsFormArray.controls) {
      const productId = item.get('productId')?.value;
      const quantity = item.get('quantity')?.value;
      const product = this.products.find((p) => p.id === productId);
      if (product && quantity) {
        total += product.price * quantity;
      }
    }
    this.quotationForm.patchValue({ totalAmount: total });
  }

  onSubmit() {
    if (this.quotationForm.valid) {
      const quotationData = this.quotationForm.value;
      const itemsArray = this.itemsFormArray.value;
      quotationData.items = JSON.stringify(itemsArray);

      this.quotationService.addQuotation(quotationData).subscribe(
        (response) => {
          console.log('Quotation added successfully:', response);
          this.quotationForm.reset();
          // Reset form or navigate to another page
        },
        (error) => console.error('Error adding quotation:', error)
      );
    }
  }
}
