import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Organization } from '../interfaces/orginization.inteface';
import { HotToastService } from '@ngneat/hot-toast';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `https://cpos-shop-backend.vercel.app/organizations`;
  private isLoggedInSource = new BehaviorSubject<boolean>(false);
  authStatusChanged = this.isLoggedInSource.asObservable();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private toast: HotToastService
  ) {
    this.checkLoginStatus();
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  login(token: string) {
    this.isLoggedInSource.next(true);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', token);
    }
  }

  logout() {
    this.isLoggedInSource.next(false);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
    }
  }

  getAllOrg(): Observable<Organization[]> {
    const url = `${this.apiUrl}`;
    return this.httpClient.get<Organization[]>(url);
  }

  private checkLoginStatus() {
    if (typeof localStorage !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        this.isLoggedInSource.next(true);
      }
    }
  }
}
