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
  styleUrl: './login.component.scss'
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
        )  {
          this.savedOrg = this.localStorageService.getSavedOrgId();
          this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg}/auth/signin`;
        }

  onSubmit() {
    const url = this.apiUrl;
    const loginData = {
      email: this.email,
      password: this.password
    };
    console.log('login data',loginData)

    this.http.post(url, loginData)
      .subscribe(
        (response: any) => {
          // Handle successful login
          this.authService.login();
          this.toast.success('Login successful');
          this.router.navigate(['/categories']); 
        },
        (error: any) => {
          // Handle login error
          console.error('Login error:', error);
          this.toast.error('Login fail');

          // You can display an error message to the user
        }
      );
  }
}





