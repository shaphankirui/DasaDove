import { Component } from '@angular/core';
import {
  AppearanceAnimation,
  DialogRemoteControl,
  DisappearanceAnimation,
} from '@ng-vibe/dialog';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { CustomerService } from '../../../../shared/Services/customer.service';
import { Customer } from '../../../../shared/interfaces/customer.interface';

@Component({
  selector: 'app-show-customer',
  templateUrl: './show-customer.component.html',
  styleUrl: './show-customer.component.scss',
})
export class ShowCustomerComponent {
  private dialog: DialogRemoteControl = new DialogRemoteControl(
    AddCustomerComponent
  );
  customers: Customer[] = [];
  constructor(private customerService: CustomerService) {}
  ngOnInit(): void {
    this.getAllCustomers();
  }
  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe((data) => {
      console.log(data);
      this.customers = data;
    });
  }

  openDialog(optionalPayload?: any) {
    this.dialog.options = {
      width: '400px',
      height: '500px',
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN,
      animationOut: DisappearanceAnimation.ZOOM_OUT,
    };

    this.dialog.openDialog().subscribe((resp) => {
      console.log('Response from dialog content:', resp);
    });
  }

  closeDialog() {
    this.dialog.closeDialog();
  }
}
