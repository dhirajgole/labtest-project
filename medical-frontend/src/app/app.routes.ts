import { Routes } from '@angular/router';
import { LabtestComponent } from './labtest/labtest.component';
import { MedicinesComponent } from './medicines/medicines.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { CbcComponent } from './labtest/cbc/cbc.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: 'labtest',
    children: [
      { path: '', component: LabtestComponent },
      { path: 'cbc', component: CbcComponent }
    ]
  },
  { path: 'medicines', component: MedicinesComponent },
  { path: 'insurance', component: InsuranceComponent },
  { path: '', component: LabtestComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'cart', component: CartComponent },
  { path: 'dashboard', component: UserDashboardComponent }
];