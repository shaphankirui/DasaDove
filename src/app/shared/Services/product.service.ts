import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/categories';
import { Product } from '../interfaces/products';
import { environment } from '../Environments/environments';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl: string;
  savedOrg: string | null;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.savedOrg = this.localStorageService.getSavedOrgId();
    this.apiUrl = `${environment.apiRootUrl}products`;
  }
  getAllProducts(): Observable<Product[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<Product[]>(url);
  }

  addProduct(product: Product): Observable<Product> {
    const url = `${this.apiUrl}`;
    return this.http.post<Product>(url, product);
  }
  getProductbyId(id: number): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Product>(url);
  }
  searchProductByBarcode(barcode: string): Observable<Product> {
    const url = `${this.apiUrl}/search/barcode?barcode=${barcode}`;
    return this.http.get<Product>(url);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  updateProductQuantity(id: number, quantity: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/quantity`, { quantity });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
