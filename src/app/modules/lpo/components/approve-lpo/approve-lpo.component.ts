import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { LpoService } from '../../../../shared/Services/lpo.service';
import { ProductService } from '../../../../shared/Services/product.service';
import { InventoryService } from '../../../../shared/Services/inventory.service';
import { Product } from '../../../../shared/interfaces/products';
import { LpoInterface } from '../../../../shared/interfaces/lpo.interface';

@Component({
  selector: 'app-approve-lpo',
  templateUrl: './approve-lpo.component.html',
  styleUrls: ['./approve-lpo.component.scss'],
})
export class ApproveLpoComponent implements OnInit {
  lpoForm: FormGroup;
  lpoId: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lpoService: LpoService,
    private productService: ProductService,
    private inventoryService: InventoryService
  ) {
    this.lpoForm = this.fb.group({
      supplierId: ['', Validators.required],
      items: this.fb.array([]),
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', Validators.required],
    });
  }

  ngOnInit() {
    this.lpoId = +this.route.snapshot.paramMap.get('id')!;
    this.loadLpo();
  }

  loadLpo() {
    this.lpoService.getLpoId(this.lpoId).subscribe(
      (lpo) => {
        this.lpoForm.patchValue({
          supplierId: lpo.supplierId,
          totalAmount: lpo.totalAmount,
          status: lpo.status,
        });
        this.setItems(lpo.items);
      },
      (error) => console.error('Error loading LPO:', error)
    );
  }

  setItems(items: any[]) {
    const itemForms = items.map((item) =>
      this.fb.group({
        productId: [item.productId, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        price: [0, [Validators.required, Validators.min(0)]],
      })
    );
    const itemsFormArray = this.fb.array(itemForms);
    this.lpoForm.setControl('items', itemsFormArray);
  }

  get items() {
    return this.lpoForm.get('items') as FormArray;
  }

  updateTotalAmount() {
    const total = this.items.controls.reduce((sum, item) => {
      return sum + item.get('quantity')!.value * item.get('price')!.value;
    }, 0);
    this.lpoForm.patchValue({ totalAmount: total });
  }

  approveLpo() {
    if (this.lpoForm.valid) {
      const approvedLpo = this.lpoForm.value;
      approvedLpo.status = 'approved';

      this.lpoService.updateLpo(this.lpoId, approvedLpo).subscribe(
        () => {
          this.addToInventory(approvedLpo);
          this.router.navigate(['/lpo-list']);
        },
        (error) => console.error('Error approving LPO:', error)
      );
    }
  }

  addToInventory(approvedLpo: any) {
    const items = approvedLpo.items;

    console.log('itemsss', items);
    items.forEach((item: { productId: any; quantity: any; price: any }) => {
      this.inventoryService
        .addInventory({
          product_id: item.productId.toString(),
          quantity: item.quantity,
          buying_price: item.price,
          added_by: 'shaphan',
          total: item.quantity * item.price,
          deleted: false,
        })
        .subscribe(
          () => console.log('Inventory added successfully'),
          (error) => console.error('Error adding to inventory:', error)
        );
    });
  }

  updateLpoProductsWithActuallProducts(lpo: LpoInterface) {
    const products = lpo.items;
  }
}
