import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { OrganizationSelectionComponent } from './components/organization-selection/organization-selection.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
  declarations: [
    LoginComponent,
    OrganizationSelectionComponent,
    RegisterComponent,
    UserListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
  ],
})
export class AuthModule {}
