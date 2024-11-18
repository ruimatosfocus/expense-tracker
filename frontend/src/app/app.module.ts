import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ErrorStateMatcher } from '@angular/material/core';
import { LoginComponent } from './login/login.component';
import { MatchValidator } from './utils/match.validator';
import { RegisterComponent } from './register/register.component';
import { ErrorsOnSubmitStateMatcher } from './utils/errors-on-submit';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ExpensesComponent } from './expenses/expenses.component';
import { ToastrModule } from 'ngx-toastr';
import { ShellComponent } from './shell/shell.component';
import { TableModule } from 'primeng/table'; 
import { ButtonModule } from 'primeng/button'; 
import { TooltipModule } from 'primeng/tooltip';
import { AuthInterceptor } from './auth.interceptor';
import { DropdownModule } from 'primeng/dropdown';
import { MatDialogModule } from '@angular/material/dialog';
import { CancelExpenseDialogComponent } from './expenses/dialogs/cancelExpenseDialog/cancel-expense-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { CreateExpenseDialogComponent } from './expenses/dialogs/createExpenseDialog/create-expense-dialog.component';
import { PieDialogComponent } from './expenses/dialogs/pieDialog/pie-dialog.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    MatchValidator,
    LoginComponent,
    ExpensesComponent,
    ShellComponent,
    CancelExpenseDialogComponent,
    CreateExpenseDialogComponent,
    PieDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true, 
    }),
    TableModule,
    ButtonModule,
    TooltipModule,
    DropdownModule,
    MatDialogModule,
    MatSelectModule,
    NgChartsModule,
  ],
  exports: [
    MatchValidator,
  ],
  providers: [    { provide: ErrorStateMatcher, useClass: ErrorsOnSubmitStateMatcher },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
