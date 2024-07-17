import { Component, HostListener } from '@angular/core';
import { Sales } from '../../../../shared/interfaces/sales.interface';
import { SalesService } from '../../../../shared/Services/sales.service';
import {
  AppearanceAnimation,
  DialogRemoteControl,
  DisappearanceAnimation,
} from '@ng-vibe/dialog';
import { RefundComponent } from '../refund/refund.component';

@Component({
  selector: 'app-show-sales',
  templateUrl: './show-sales.component.html',
  styleUrl: './show-sales.component.scss',
})
export class ShowSalesComponent {
  private dialog: DialogRemoteControl = new DialogRemoteControl(
    RefundComponent
  );
  sales: Sales[] = [];
  selectedShift: string = '';
  selectedDay: string = '';
  dropdownOpen: boolean = false;
  searchTerm: string = '';
  shifts: string[] = [
    'Morning Shift',
    'Afternoon Shift',
    'Night Shift',
    'Weekend Shift',
    'Holiday Shift',
    'Early Morning Shift',
    // Add more shifts as needed
  ];

  constructor(private salesService: SalesService) {}
  ngOnInit(): void {
    this.getSales();
  }

  filteredShifts: string[] = [...this.shifts];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectShift(shift: string) {
    this.selectedShift = shift;
    this.dropdownOpen = false;
  }

  filterShifts() {
    this.filteredShifts = this.shifts.filter((shift) =>
      shift.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.dropdownOpen = false;
    }
  }
  getSales(): void {
    const today = new Date();
    const stringDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const date = this.selectedDay || stringDate;
    this.salesService.getSalesByDateRange(date, date).subscribe((sales) => {
      this.sales = sales.orders;
      console.log('the sales gotten from the api', this.sales);
    });
  }
  parseItems(items: any): any[] {
    try {
      return JSON.parse(items);
    } catch (error) {
      console.error('Error parsing items:', error);
      return [];
    }
  }

  openDialog(optionalPayload?: any) {
    this.dialog.options = {
      width: '1000px',
      height: '100vh',
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN,
      animationOut: DisappearanceAnimation.ZOOM_OUT,
    };

    this.dialog.openDialog(optionalPayload).subscribe((resp) => {
      console.log('Response from dialog content:', resp);
    });
    // this.printReceipt(sales);
  }
}
