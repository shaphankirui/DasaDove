import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../../../shared/Services/category.service';
import { ProductService } from '../../../../../shared/Services/product.service';
import { Category } from '../../../../../shared/interfaces/categories';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.scss'
})
export class AddProductsComponent {
  productForm: FormGroup;
  categories: Category[] = [];
  @Input() modalId: string = '';
  @Input() isModalVisible: boolean = false;
  @Output() toggleModal = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      categoryId: ['', Validators.required],
      description: [''],
      picture: ['']
    });
  }

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoryService
      .getAllCategories()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
      });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.productService.addProduct(productData)
        .subscribe(
          (response: any) => {
            console.log('Product added successfully:', response);
            // Reset the form if needed
            this.productForm.reset();
            this.closeModal();
          },
          (error: any) => {
            console.error('Error adding product:', error);
            // Handle error
          }
        );
    }
  }

  closeModal() {
    this.toggleModal.emit();
  }

}

