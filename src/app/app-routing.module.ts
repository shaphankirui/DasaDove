import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationSelectionComponent } from './modules/auth/components/organization-selection/organization-selection.component';
import { RegisterComponent } from './modules/auth/components/register/register.component';
import { ShowCategoriesComponent } from './modules/categories-products/components/categories/show-categories/show-categories.component';
import { ShowProductsComponent } from './modules/categories-products/components/products/show-products/show-products.component';
import { AddInventoryComponent } from './modules/inventory/components/add-inventory/add-inventory.component';
import { AuthGuard } from './shared/Guards/auth.guard';
import { MainLayoutComponent } from './modules/layout/components/main-layout/main-layout.component';
import { AuthLayoutComponent } from './modules/layout/components/auth-layout/auth-layout.component';
import { LoginGuard } from './shared/Guards/login.guard';
import { ShowSuplliersComponent } from './modules/surpliers/components/show-suplliers/show-suplliers.component';
import { SalesComponent } from './modules/dashboard/sales/sales.component';
import { CashSalesComponent } from './modules/sales/components/cash-sales/cash-sales.component';
import { ShowCreditSalesComponent } from './modules/sales/components/credit sales/show-credit-sales/show-credit-sales.component';
import { ShowSalesComponent } from './modules/sales/components/show-sales/show-sales.component';
import { SalesReportsComponent } from './modules/reports/components/sales-reports/sales-reports.component';
import { IncomeReportsComponent } from './modules/reports/components/income-reports/income-reports.component';
import { PurchaseReportsComponent } from './modules/reports/components/purchase-reports/purchase-reports.component';
import { CreditReportsComponent } from './modules/reports/components/credit-reports/credit-reports.component';
import { VoidedSalesReportsComponent } from './modules/reports/components/voided-sales-reports/voided-sales-reports.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'products',
        component: ShowProductsComponent,
      },
      {
        path: 'categories',
        component: ShowCategoriesComponent,
      },

      {
        path: 'inventory',
        component: AddInventoryComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'inventory',
        component: AddInventoryComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'suppliers',
        component: ShowSuplliersComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'sales',
        component: CashSalesComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'invoices',
        component: ShowSalesComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'credit_sales',
        component: ShowCreditSalesComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'sale-reports',
        component: SalesReportsComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'income-reports',
        component: IncomeReportsComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'purchase-reports',
        component: PurchaseReportsComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'credit-reports',
        component: CreditReportsComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'voids-reports',
        component: VoidedSalesReportsComponent,
        // canActivate: [AuthGuard],
      },
    ],
  },

  {
    path: '',
    component: AuthLayoutComponent,
    // canActivate: [LoginGuard],
    children: [
      {
        path: 'login',
        component: OrganizationSelectionComponent,
        canDeactivate: [AuthGuard],
      },

      { path: 'register', component: RegisterComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
