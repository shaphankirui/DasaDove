import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuppliersService } from '../../../../shared/Services/suppliers.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-add-suplliers',
  templateUrl: './add-suplliers.component.html',
  styleUrls: ['./add-suplliers.component.scss'],
})
export class AddSuplliersComponent {
  supplierForm: FormGroup;
  @Input() modalId: string = '';
  @Input() isModalVisible: boolean = false;
  @Output() toggleModal = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private supplierService: SuppliersService,
    private toast: HotToastService
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      // Add more supplier fields here as needed
    });
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      // Setting default values for totalUnpaidSuppliers and deleted
      const supplierData = {
        ...this.supplierForm.value,
        totalUnpaidSuppliers: 0,
        deleted: false,
      };

      this.supplierService.addSupplier(supplierData).subscribe(
        (response: any) => {
          this.toast.success('Supplier added successfully');
          // Reset the form if needed
          this.supplierForm.reset();
          this.closeModal();
        },
        (error: any) => {
          this.toast.error('Error adding supplier');
          console.log('Error adding supplier:', error);

          // Handle error
        }
      );
    }
  }

  closeModal() {
    this.toggleModal.emit();
  }
}
