import { Component } from '@angular/core';
import { environment } from '../../../../shared/Environments/environments';
import { HttpClient } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '../../../../shared/Services/auth.service';
import { LocalStorageService } from '../../../../shared/Services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  private apiUrl: string;
  savedOrg: string | null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: HotToastService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
    this.savedOrg = this.localStorageService.getSavedOrgId();
    this.apiUrl = `${environment.apiRootUrl}auth/login`;
  }

  onSubmit() {
    const url = this.apiUrl;
    const loginData = {
      email: this.email,
      password: this.password,
    };
    console.log('login data', loginData);

    this.http.post(url, loginData).subscribe(
      (response: any) => {
        const token = response.access_token; // Assuming the token is in the response
        const userEmail = response.userEmail; // Assuming the token is in the response
        this.authService.login(token, userEmail);
        localStorage.setItem('token', response.token);
        localStorage.setItem('userEmail', response.userEmail);
        this.authService.setTokenExpiration();
        this.authService.checkWhetherSessionHasExpired();
        // Convert the user object to a JSON string before storing it
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('user logged in', response.user);
        this.authService.user$.next(response.user);
        this.router.navigate(['/sales']);
        this.toast.success('Login successful');
      },
      (error: any) => {
        console.error('Login error:', error);
        this.toast.error('Login fail');
      }
    );
  }
}
