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
import { LoaderComponent } from './shared/Data/components/loader/loader.component';
import { provideNgVibeDialog } from '@ng-vibe/dialog';
import { AuthComponent } from './shared/Data/components/auth/auth.component';
import { ModalComponent } from './shared/Data/components/modal/modal.component';
import { BtnLOderComponent } from './shared/Data/components/btn-loder/btn-loder.component';
import { CustomersModule } from './modules/customers/customers.module';
import { LpoModule } from './modules/lpo/lpo.module';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { DashboardMainComponent } from './modules/dashboard/components/dashboard-main/dashboard-main.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PieChartComponent } from './modules/dashboard/components/pie-chart/pie-chart.component';
import { CreditAuthComponent } from './shared/Data/components/credit-auth/credit-auth.component';
import { SalesModule } from './modules/sales/sales.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ModalComponent,
    DashboardMainComponent,
    PieChartComponent,
    CreditAuthComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    CategoriesProductsModule,
    LayoutModule,
    InventoryModule,
    DashboardModule,
    CustomersModule,
    LpoModule,
    QuotationsModule,
    SurpliersModule,
    SalesModule,
    ReportsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BtnLOderComponent,
    NgApexchartsModule,
  ],
  providers: [provideNgVibeDialog()],
  bootstrap: [AppComponent],
})
export class AppModule {}
