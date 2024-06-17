import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { OrganizationSelectionComponent } from './components/organization-selection/organization-selection.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LoginComponent,
    OrganizationSelectionComponent,
    RegisterComponent,
  ],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
})
export class AuthModule {}
