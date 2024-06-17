import { Component } from '@angular/core';
import { environment } from '../../../../shared/Environments/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '../../../../shared/Services/auth.service';
import { LocalStorageService } from '../../../../shared/Services/local-storage.service';

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
        this.authService.login(token);
        this.toast.success('Login successful');
        this.router.navigate(['/sales']);
      },
      (error: any) => {
        console.error('Login error:', error);
        this.toast.error('Login fail');
      }
    );
  }
}
