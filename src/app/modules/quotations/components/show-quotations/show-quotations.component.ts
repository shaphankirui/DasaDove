import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../../../shared/Services/quotation.service';
import { Quotation } from '../../../../shared/interfaces/quotation.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-quotations',
  templateUrl: './show-quotations.component.html',
  styleUrls: ['./show-quotations.component.scss'],
})
export class ShowQuotationsComponent implements OnInit {
  quotations: Quotation[] = [];
  filteredQuotations: Quotation[] = [];
  filterForm: FormGroup;

  constructor(
    private quotationService: QuotationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit() {
    this.loadQuotations();
  }

  loadQuotations() {
    this.quotationService.getAllQuotation().subscribe(
      (data: Quotation[]) => {
        this.quotations = data.map((quotation) => ({
          ...quotation,
          items: JSON.parse(quotation.items as string),
        }));
        this.filteredQuotations = this.quotations;
      },
      (error) => console.error('Error loading quotations:', error)
    );
  }

  filterQuotations() {
    const startDate = new Date(this.filterForm.get('startDate')?.value);
    const endDate = new Date(this.filterForm.get('endDate')?.value);

    this.filteredQuotations = this.quotations.filter((quotation) => {
      const quotationDate = new Date(quotation.createdAt);
      return quotationDate >= startDate && quotationDate <= endDate;
    });
  }

  resetFilter() {
    this.filterForm.reset();
    this.filteredQuotations = this.quotations;
  }

  approveQuotation(id: number) {
    this.router.navigate(['/approve-quotation', id]);
  }

  updateQuotation(id: number) {
    this.router.navigate(['/update-quotation', id]);
  }
}
