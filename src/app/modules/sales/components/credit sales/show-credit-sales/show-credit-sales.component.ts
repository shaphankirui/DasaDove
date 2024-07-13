import { Component, HostListener } from '@angular/core';
import { Sales } from '../../../../../shared/interfaces/sales.interface';
import { SalesService } from '../../../../../shared/Services/sales.service';
import { CreditSale } from '../../../../../shared/interfaces/cretitSale.interface';
import { CreditSaleService } from '../../../../../shared/Services/credit-sale.service';

@Component({
  selector: 'app-show-credit-sales',
  templateUrl: './show-credit-sales.component.html',
  styleUrl: './show-credit-sales.component.scss',
})
export class ShowCreditSalesComponent {
  sales: CreditSale[] = [];
  selectedShift: string = '';
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

  constructor(private salesService: CreditSaleService) {}
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
    this.salesService.getAllCreditSale().subscribe((sales: any) => {
      this.sales = sales.creditSales;
      console.log('the sales gotten from the api', sales);
    });
  }
}
