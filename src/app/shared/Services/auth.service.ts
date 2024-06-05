import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, take } from 'rxjs';
import { environment } from '../Environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Organization } from '../interfaces/orginization.inteface';
import { LoginInterface, PasswordResetInterface, PermissionInterface, SetNewPasswordInterface, SignupInterface, UserInterface, UserSessionInterface } from '../interfaces/auth.interface';
import { landingPage } from '../Data/landing-page.data';
import { HotToastService } from '@ngneat/hot-toast';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `https://cpos-shop-backend.vercel.app/organizations`;
  private isLoggedInSource = new BehaviorSubject<boolean>(false);
  authStatusChanged = this.isLoggedInSource.asObservable();
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private toast:HotToastService,

  ) { }

  

  isLoggedIn(): boolean {
    // Check authentication status here
    // For example, you could check if a token exists in local storage
    const token = localStorage.getItem('token');
    return !!token;
  }

  login() {
    // Perform login logic here
    this.isLoggedInSource.next(true);
    // Save login state in local storage if available
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
    }
  }

  logout() {
    // Perform logout logic here
    this.isLoggedInSource.next(false);
    // Remove login state from local storage if available
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
    }
  }

  getAllOrg(): Observable<Organization[]> {
    const url = `${this.apiUrl}`;
    return this.httpClient.get<Organization[]>(url);
  }

  private checkLoginStatus() {
    // Check if the user is logged in when the service is initialized
    if (typeof localStorage !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        this.isLoggedInSource.next(true);
      }
    }
  }




  

}
