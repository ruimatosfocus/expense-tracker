import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { AuthGuard } from './guards/auth.guard';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  // Routes without navbar
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard], // Ensure user is authenticated
    children: [
      { path: 'expenses', component: ExpensesComponent },
      // { path: 'create', component: CreateExpenseComponent },
      // { path: 'edit/:id', component: EditExpenseComponent } // Use ':id' for editing a specific expense
    ]
  },

  // Default redirect
  { path: '', redirectTo: '/register', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
