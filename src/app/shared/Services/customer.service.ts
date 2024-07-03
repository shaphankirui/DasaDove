import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../Environments/environments';
import { Customer } from '../interfaces/customer.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiRootUrl}customers`;
  }

  getAllCustomers(): Observable<Customer[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<Customer[]>(url);
  }

  addCustomer(customerCustomer: Customer): Observable<Customer> {
    const url = `${this.apiUrl}`;
    return this.http.post<Customer>(url, customerCustomer);
  }

  getCustomerbyId(id: number): Observable<Customer> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Customer>(url);
  }

  updateCustomer(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
