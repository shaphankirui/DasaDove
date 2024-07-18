import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../Environments/environments';
import { Quotation } from '../interfaces/quotation.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  private apiUrl: string;
  savedOrg: string | null;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.savedOrg = this.localStorageService.getSavedOrgId();
    this.apiUrl = `${environment.apiRootUrl}quotations`;
  }

  getAllQuotation(): Observable<Quotation[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<Quotation[]>(url);
  }

  addQuotation(quotation: Quotation): Observable<Quotation> {
    const url = `${this.apiUrl}`;
    return this.http.post<Quotation>(url, quotation);
  }

  getQuotationbyId(id: number): Observable<Quotation> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Quotation>(url);
  }

  updateQuotation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteQuotation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
