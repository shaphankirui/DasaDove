import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Organization } from '../interfaces/orginization.inteface';
import { HotToastService } from '@ngneat/hot-toast';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { environment } from '../Environments/environments';
import { UserInterface } from '../interfaces/auth.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  sessionHasExpired = new BehaviorSubject<boolean>(false);
  sessionTimeout$ = new BehaviorSubject<number>(
    Number(this.localStorageService.getItem('ETA'))
  );
  user$ = new BehaviorSubject<UserInterface | null>(
    this.localStorageService.getItem('user')
  );
  private apiUrl = `${environment.apiRootUrl}auth/login`;
  private apiUrll = `${environment.apiRootUrl}auth`;
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

  login(token: string, userEmail: string) {
    this.isLoggedInSource.next(true);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', userEmail);
    }
  }
  signIn(data: any): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl, data);
  }
  userIsLoggedIn(): Observable<UserInterface | null> {
    return new Observable<UserInterface | null>((subscriber) => {
      const user = this.localStorageService.getItem('user', true);
      subscriber.next(user);
    });
  }

  // logout() {
  //   this.isLoggedInSource.next(false);
  //   if (typeof localStorage !== 'undefined') {
  //     localStorage.removeItem('isLoggedIn');
  //     localStorage.removeItem('token');
  //   }
  // }

  getAllOrg(): Observable<Organization[]> {
    const url = `${this.apiUrl}`;
    return this.httpClient.get<Organization[]>(url);
  }
  getAllUsers(): Observable<UserInterface[]> {
    const url = `${this.apiUrll}`;
    return this.httpClient.get<UserInterface[]>(url);
  }
  createUser(data: any): Observable<any> {
    const url = `${this.apiUrll}/signup`;
    return this.httpClient.post<any>(url, data);
  }

  private checkLoginStatus() {
    if (typeof localStorage !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        this.isLoggedInSource.next(true);
      }
    }
  }
  logout(all?: boolean) {
    this.user$.pipe(take(1)).subscribe({
      next: (data) => {
        Promise.resolve(() => {
          this.localStorageService.clear();
        }).then((res) => {
          if (data) {
            this.localStorageService.clear();
            window.location.reload();
          }
        });
      },
    });
  }
  setTokenExpiration() {
    const defaultExpiryTime = new Date().getTime() + 30 * 60 * 1000; // Default expiration time (5 minutes)
    this.localStorageService.setLocalItem('ETA', defaultExpiryTime);
  }
  checkWhetherSessionHasExpired() {
    const notification = 'Session has expired, Verify your account';
    const expirationTime: any = this.localStorageService.getItem('ETA');

    if (expirationTime) {
      const expirationDate = Number(expirationTime);
      const now = Number(new Date().getTime());
      const delay = expirationDate - now;

      setTimeout(() => {
        this.toast.info(notification);
        this.sessionHasExpired.next(true);
        this.logout();
      }, delay);
    } else {
      this.sessionHasExpired.next(true);
      this.logout();
    }
  }
}
