import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log(
      'this the testing of the login gurd value',
      this.authService.userIsLoggedIn()
    );
    if (this.authService.userIsLoggedIn()) {
      return true; // Allow access if user is logged in
    } else {
      // If not logged in, redirect to the login page or any unauthorized page
      this.router.navigate(['/login']); // Update '/login' with your login route
      return false;
    }
  }
}
