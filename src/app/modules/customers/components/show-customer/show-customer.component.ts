import { Component } from '@angular/core';
import {
  AppearanceAnimation,
  DialogRemoteControl,
  DisappearanceAnimation,
} from '@ng-vibe/dialog';
import { AddCustomerComponent } from '../add-customer/add-customer.component';

@Component({
  selector: 'app-show-customer',
  templateUrl: './show-customer.component.html',
  styleUrl: './show-customer.component.scss',
})
export class ShowCustomerComponent {
  private dialog: DialogRemoteControl = new DialogRemoteControl(
    AddCustomerComponent
  );

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
