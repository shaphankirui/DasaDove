import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuotationService } from '../../../../shared/Services/quotation.service';
import { SalesService } from '../../../../shared/Services/sales.service';
import { Quotation } from '../../../../shared/interfaces/quotation.interface';

@Component({
  selector: 'app-approve-quotations',
  templateUrl: './approve-quotations.component.html',
  styleUrls: ['./approve-quotations.component.scss'],
})
export class ApproveQuotationsComponent implements OnInit {
  quotation: Quotation | null = null;
  approvalForm: FormGroup;
  quotationId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private quotationService: QuotationService,
    private salesService: SalesService
  ) {
    this.approvalForm = this.fb.group({
      cashPaid: [0, [Validators.required, Validators.min(0)]],
      mpesaPaid: [0, [Validators.required, Validators.min(0)]],
      bankPaid: [0, [Validators.required, Validators.min(0)]],
      mpesaTransactionId: [''],
    });
  }

  ngOnInit() {
    this.quotationId = +this.route.snapshot.paramMap.get('id')!;
    this.loadQuotation();
  }

  loadQuotation() {
    this.quotationService.getQuotationbyId(this.quotationId).subscribe(
      (quotation: Quotation) => {
        this.quotation = quotation;
        this.quotation.items = JSON.parse(this.quotation.items as string);
      },
      (error) => console.error('Error loading quotation:', error)
    );
  }

  onSubmit() {
    if (this.approvalForm.valid) {
      const formValues = this.approvalForm.value;
      const totalAmountPaid =
        formValues.cashPaid + formValues.mpesaPaid + formValues.bankPaid;

      if (totalAmountPaid !== this.quotation!.totalAmount) {
        alert('Total amount paid must equal the quotation total amount');
        return;
      }

      const saleData = {
        items: this.quotation!.items,
        total: this.quotation!.totalAmount,
        customerId: this.quotation!.supplierId,
        cashPaid: formValues.cashPaid,
        mpesaPaid: formValues.mpesaPaid,
        bankPaid: formValues.bankPaid,
        totalAmountPaid: totalAmountPaid,
        taxAmount: totalAmountPaid * 0.16,
        printerIp: '192.168.1.2',
        isVoided: false,
        voidedBy: false,
        discountAmount: 0,
        mpesaTransactionId: formValues.mpesaTransactionId || undefined,
      };

      this.salesService.addSales(saleData).subscribe(
        (response) => {
          console.log('Sale created:', response);
          this.updateQuotationStatus();
        },
        (error) => console.error('Error creating sale:', error)
      );
    }
  }

  updateQuotationStatus() {
    this.quotationService
      .updateQuotation(this.quotationId, { status: 'approved' })
      .subscribe(
        () => {
          console.log('Quotation approved');
          this.router.navigate(['/show-quotations']);
        },
        (error) => console.error('Error approving quotation:', error)
      );
  }
}
