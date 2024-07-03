import { Component } from '@angular/core';
import { ModalComponent } from '../../../../shared/Data/components/modal/modal.component';
import { Customer } from '../../../../shared/interfaces/customer.interface';
import { CustomerService } from '../../../../shared/Services/customer.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent extends ModalComponent {
  customerDetails: Customer = {
    fullName: '',
    phoneNumber: '',
    isActive: true,
  };
  constructor(private customerService: CustomerService) {
    super();
  }

  createCustomer() {
    // Ensure isActive is a boolean
    this.customerDetails.isActive = this.convertToBoolean(
      this.customerDetails.isActive
    );

    this.customerService.addCustomer(this.customerDetails).subscribe((res) => {
      this.toast.success('Customer added!!');
    });
  }

  onCloseClick() {
    this.close();
  }

  convertIsActive(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.customerDetails.isActive = target?.value === 'true';
  }

  convertToBoolean(value: any): boolean {
    return value === true || value === 'true';
  }
}
