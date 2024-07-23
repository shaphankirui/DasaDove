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
  filteredLpos: any;
  onSearch() {
    throw new Error('Method not implemented.');
  }
  lpo: LpoInterface[] = [];
  suppliers: any[] = [];
  products: any[] = [];
  startDate: any;
  endDate: any;
  searchTerm: any;
  constructor(
    private lpoService: LpoService,
    private suppliersService: SuppliersService,
    private productService: ProductService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLpo();
    this.loadProducts();
    this.loadSuppliers();
  }

  loadLpo() {
    this.lpoService.getAllLpo().subscribe(
      (lpo) => (this.lpo = lpo),
      (error) => console.error('Error loading LPO:', error)
    );
  }
  loadLpoForARange(){
    this.lpoService.getLposByDateRange(this.startDate, this.endDate).subscribe(
      (lpo) => {
        this.lpo = lpo;
      },
      (error) => console.error('Error loading LPO:', error)
    );
  }

  approveLpo(lpo: LpoInterface) {
    if (lpo.status == 'approved') {
      this.toast.error('LPO already approved');
      return;
    }
    this.router.navigate(['/approve-lpo', lpo.id]);
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

  getProductNameById(id: number): string {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product.name;
    } else {
      return 'Loading...';
    }
  }

  getSupplierNameById(id: number): string {
    const supplier = this.suppliers.find((s) => s.id === id);
    if (supplier) {
      return supplier.name;
    } else {
      return 'Loading...';
    }
  }
  printLpo(lpo: LpoInterface) {
    // Open a new window for the printable invoice
    console.log('cliced', lpo);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(this.generateInvoiceHtml(lpo));
      printWindow.document.close();
      // Wait for content to load before printing
      printWindow.onload = function () {
        printWindow.print();
      };
    } else {
      this.toast.error(
        'Unable to open print window. Please check your pop-up blocker settings.'
      );
    }
  }

  generateInvoiceHtml(lpo: LpoInterface): string {
    const companyInfo = {
      name: 'Your Company Name',
      address: '123 Business Street, City, Country',
      phone: '+1 234 567 890',
      email: 'info@yourcompany.com',
      website: 'www.yourcompany.com',
    };

    const supplierName = this.getSupplierNameById(lpo.supplierId);
    const items = lpo.items.map(
      (item: { productId: number; quantity: number; price: number }) => ({
        name: this.getProductNameById(item.productId),
        quantity: item.quantity,
        price: item.price || 0,
        total: item.quantity * item.price || 0,
      })
    );

    const total = items.reduce(
      (sum: any, item: { total: any }) => sum + item.total,
      0
    );

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LPO Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 20px;
          }
          .invoice-header h1 {
            color: #2c3e50;
            margin-bottom: 10px;
          }
          .company-info, .lpo-info {
            margin-bottom: 20px;
          }
          .lpo-info {
            display: flex;
            justify-content: space-between;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .total {
            text-align: right;
            font-weight: bold;
            font-size: 1.2em;
            margin-top: 20px;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>LPO Invoice</h1>
        </div>
        <div class="company-info">
          <h2>${companyInfo.name}</h2>
          <p>${companyInfo.address}</p>
          <p>Phone: ${companyInfo.phone}</p>
          <p>Email: ${companyInfo.email}</p>
          <p>Website: ${companyInfo.website}</p>
        </div>
        <div class="lpo-info">
          <div>
            <h3>Supplier</h3>
            <p>${supplierName}</p>
          </div>
          <div>
            <h3>LPO Details</h3>
            <p>LPO ID: ${lpo.id}</p>
            <p>Date: ${new Date(lpo.createdAt).toLocaleDateString()}</p>
            <p>Status: ${lpo.status}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item: {
                  name: any;
                  quantity: any;
                  price: number;
                  total: number;
                }) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${item.total.toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class="total">
          Total: $${total.toFixed(2)}
        </div>
      </body>
      </html>
    `;
  }
}
