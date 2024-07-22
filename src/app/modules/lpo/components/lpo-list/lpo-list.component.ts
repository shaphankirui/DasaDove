import { Component } from '@angular/core';
import { LpoInterface } from '../../../../shared/interfaces/lpo.interface';
import { LpoService } from '../../../../shared/Services/lpo.service';
import { ProductService } from '../../../../shared/Services/product.service';
import { SuppliersService } from '../../../../shared/Services/suppliers.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-lpo-list',
  templateUrl: './lpo-list.component.html',
  styleUrl: './lpo-list.component.scss',
})
export class LpoListComponent {
  lpo: LpoInterface[] = [];
  suppliers: any[] = [];
  products: any[] = [];
  constructor(
    private lpoService: LpoService,
    private suppliersService: SuppliersService,
    private productService: ProductService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLpo();
  }

  loadLpo() {
    this.lpoService.getAllLpo().subscribe(
      (lpo) => (this.lpo = lpo),
      (error) => console.error('Error loading LPO:', error)
    );
  }
  loadSuppliers() {
    this.suppliersService.getAllSupplier().subscribe(
      (suppliers) => (this.suppliers = suppliers),
      (error) => console.error('Error loading suppliers:', error)
    );
  }
  loadProducts() {
    this.productService.getAllProducts().subscribe(
      (products) => (this.products = products),
      (error) => console.error('Error loading products:', error)
    );
  }
  approveLpo(lpo: LpoInterface) {
    if (lpo.status == 'approved') {
      this.toast.error('LPO already approved');
      return;
    }
    this.router.navigate(['/approve-lpo', lpo.id]);
  }
}
