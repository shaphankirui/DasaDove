import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesProductsModule } from './modules/categories-products/categories-products.module';
import { LayoutModule } from './modules/layout/layout.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ReportsModule } from './modules/reports/reports.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './modules/layout/components/main-layout/main-layout.component';
import { SurpliersModule } from './modules/surpliers/surpliers.module';
import { AuthLayoutComponent } from './modules/layout/components/auth-layout/auth-layout.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SalesModule } from './modules/sales/sales.module';

@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    CategoriesProductsModule,
    LayoutModule,
    InventoryModule,
    DashboardModule,
    SalesModule,
    SurpliersModule,
    ReportsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
