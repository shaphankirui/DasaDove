import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationService } from '../../../../shared/Services/quotation.service';
import { Quotation } from '../../../../shared/interfaces/quotation.interface';

@Component({
  selector: 'app-update-quotations',
  templateUrl: './update-quotations.component.html',
  styleUrls: ['./update-quotations.component.scss'],
})
export class UpdateQuotationsComponent implements OnInit {
  updateForm: FormGroup;
  quotationId: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quotationService: QuotationService
  ) {
    this.updateForm = this.fb.group({
      supplierId: ['', Validators.required],
      items: this.fb.array([]),
      totalAmount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.quotationId = +this.route.snapshot.paramMap.get('id')!;
    this.loadQuotation();
  }

  loadQuotation() {
    this.quotationService.getQuotationbyId(this.quotationId).subscribe(
      (quotation: Quotation) => {
        const items = JSON.parse(quotation.items as string);
        this.updateForm.patchValue({
          supplierId: quotation.supplierId,
          totalAmount: quotation.totalAmount,
        });
        items.forEach((item: any) => this.addItem(item));
      },
      (error) => console.error('Error loading quotation:', error)
    );
  }

  get itemsFormArray() {
    return this.updateForm.get('items') as FormArray;
  }

  addItem(item: any = null) {
    this.itemsFormArray.push(
      this.fb.group({
        productId: [item ? item.productId : '', Validators.required],
        quantity: [
          item ? item.quantity : 1,
          [Validators.required, Validators.min(1)],
        ],
      })
    );
  }

  removeItem(index: number) {
    this.itemsFormArray.removeAt(index);
  }

  onSubmit() {
    if (this.updateForm.valid) {
      const updatedQuotation = this.updateForm.value;
      updatedQuotation.items = JSON.stringify(updatedQuotation.items);

      this.quotationService
        .updateQuotation(this.quotationId, updatedQuotation)
        .subscribe(
          () => {
            this.router.navigate(['/show-quotations']);
          },
          (error) => console.error('Error updating quotation:', error)
        );
    }
  }
}
