import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../Environments/environments';
import { Supplier } from '../interfaces/supplier.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private apiUrl: string;
  savedOrg: string | null;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.savedOrg = this.localStorageService.getSavedOrgId();
    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg}/suppliers`;
  }
  getAllSupplier(): Observable<Supplier[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<Supplier[]>(url);
  }
  
  addSupplier(supplier: Supplier): Observable<Supplier> {
    const url = `${this.apiUrl}`;
    return this.http.post<Supplier>(url, supplier);
  }
  getSupplierbyId(id: string): Observable<Supplier> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Supplier>(url);
  }

  updateSupplier(id:string, data:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteSupplier(id:string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
