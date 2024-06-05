import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { CategoryService } from '../../../../../shared/Services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
  categoryForm: FormGroup;
  @Input() modalId: string = '';
  @Input() isModalVisible: boolean = false;
  @Output() toggleModal = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
     private categoryService: CategoryService,
     private toast:HotToastService
     ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      picture: ['']
    });
  }

  closeModal() {
    this.toggleModal.emit();
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      this.categoryService.addCategory(categoryData)
        .subscribe(
          (response) => {
            // Reset the form if needed
            this.categoryForm.reset();
            this.toast.success('Category added successfully');
            this.closeModal();
          },
          (error) => {
            this.toast.error('Error adding category');
            // Handle error
          }
        );
    }
  }
}
