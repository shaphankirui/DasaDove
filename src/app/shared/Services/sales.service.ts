import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../Environments/environments';
import { RefundDto, Sales } from '../interfaces/sales.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  isAuthenticated = new BehaviorSubject<boolean>(false);

  private apiUrl: string;
  private mpesaapiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiRootUrl}orders`;
    this.mpesaapiUrl = `${environment.apiRootUrl}mpesa/stk-push`;
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

  getAllSales(): Observable<Sales[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<Sales[]>(url, { headers: this.getHeaders() });
  }
  getSalesByDateRange(startDate: string, endDate: string): Observable<any> {
    const url = `${this.apiUrl}/report/range?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  addSales(sales: Sales): Observable<Sales> {
    const url = `${this.apiUrl}`;
    return this.http.post<Sales>(url, sales, { headers: this.getHeaders() });
  }
  mpesaStkPush(data: any): Observable<Sales> {
    const url = `${this.mpesaapiUrl}`;
    return this.http.post<Sales>(url, data, { headers: this.getHeaders() });
  }

  getSalesbyId(id: number): Observable<Sales> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Sales>(url, { headers: this.getHeaders() });
  }

  updateSales(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      headers: this.getHeaders(),
    });
  }
  refundSale(refundDto: RefundDto): Observable<any> {
    const url = `${this.apiUrl}/refund`;
    return this.http.post(url, refundDto, { headers: this.getHeaders() });
  }

  deleteSales(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
