import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/categories';
import { HttpClient } from '@angular/common/http';
import { environment } from '../Environments/environments';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl: string;
  savedOrg: string | null;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.savedOrg = this.localStorageService.getSavedOrgId();
    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg}/categories`;
  }
  

  getAllCategories(): Observable<Category[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<Category[]>(url);
  }

  addCategory(category: Category): Observable<Category> {
    const url = `${this.apiUrl}`;
    return this.http.post<Category>(url, category);
  }

  getCategorybyId(id: string): Observable<Category> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Category>(url);
  }

  updateCategory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
