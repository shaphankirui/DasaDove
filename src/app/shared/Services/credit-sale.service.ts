import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../Environments/environments';
import { CreditSale } from '../interfaces/cretitSale.interface';

@Injectable({
  providedIn: 'root',
})
export class CreditSaleService {
  isAuthenticated = new BehaviorSubject<boolean>(false);

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiRootUrl}credit-sales`;
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      // Handle case where token is not available
      return new HttpHeaders();
    }
  }

  getAllCreditSale(): Observable<CreditSale[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<CreditSale[]>(url, { headers: this.getHeaders() });
  }
  getCreditSaleByDateRange(
    startDate: string,
    endDate: string
  ): Observable<any> {
    const url = `${this.apiUrl}/report/range?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  addCreditSale(creditSale: CreditSale): Observable<CreditSale> {
    const url = `${this.apiUrl}`;
    return this.http.post<CreditSale>(url, creditSale, {
      headers: this.getHeaders(),
    });
  }

  getCreditSalebyId(id: number): Observable<CreditSale> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<CreditSale>(url, { headers: this.getHeaders() });
  }

  updateCreditSale(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteCreditSale(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
