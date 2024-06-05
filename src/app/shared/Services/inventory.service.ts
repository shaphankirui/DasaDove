import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../Environments/environments';
import { Inventory } from '../interfaces/inventory.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl: string;
  savedOrg: string | null;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.savedOrg = this.localStorageService.getSavedOrgId();
    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg}/inventory`;
  }
  

  getAllInventorys(): Observable<Inventory[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<Inventory[]>(url);
  }

  addInventory(inventory: any): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.post<any>(url, inventory);
  }

  getInventorybyId(id: string): Observable<Inventory> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Inventory>(url);
  }

  updateInventory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteInventory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
