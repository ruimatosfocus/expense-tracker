import { Component, OnInit } from '@angular/core';
import { Expense, PaymentMethod } from './expenses.dto';
import { HttpClient } from '@angular/common/http';
import { CategoriesService } from '../categories/categories.service';
import { ExpenseService } from './expenses.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CancelExpenseDialogComponent } from './dialogs/cancelExpenseDialog/cancel-expense-dialog.component';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { CreateExpenseDialogComponent } from './dialogs/createExpenseDialog/create-expense-dialog.component';
import { PieDialogComponent } from './dialogs/pieDialog/pie-dialog.component';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => {
        return new NgForm([], [])
      },
    }
  ],
})
export class ExpensesComponent implements OnInit {
  public expenses: Expense[] = [];

  public isLoading: boolean = true;
  public error: string | null = null;

  public originalExpenses: { [s: string]: Expense } = {};
  public categories: { label: string; value: string }[] = [];
  public paymentMethodValues = Object.keys(PaymentMethod).map((key) => ({
    label: key,
    value: PaymentMethod[key as keyof typeof PaymentMethod],
  }))

  public isEditing = false
  public editId: string | null = null


  constructor(private readonly toastrService: ToastrService , private readonly http: HttpClient, private readonly categoriesService: CategoriesService, private expenseService: ExpenseService, private readonly dialog: MatDialog) {}

  public ngOnInit(): void {
     this.fetchExpenses();
    this.fetchCategories();
  }

  public create(){
    const dialogRef = this.dialog.open(CreateExpenseDialogComponent, {
      width: '400px',
      restoreFocus: false,
      data: {
        paymentMethods: this.paymentMethodValues,
        categories: this.categories,         
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.expenseService.createExpense(result).subscribe({
          next: () => {
            this.toastrService.success('Expense created successfully.');
            this.isEditing = false;
            this.editId = null;
            this.fetchExpenses();
          },
          error: () => {
            this.toastrService.error('Failed to create expense.');
          },
        });
      }
    });
  }

  public pie(){
    const dialogRef = this.dialog.open(PieDialogComponent, {
      height: '50%',
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(() => {
     
    });
  }

  public deleteExpense(expense: Expense): void {
      const dialogRef = this.dialog.open(CancelExpenseDialogComponent, {
        width: '250px',
        restoreFocus: false
      });
  
      dialogRef.afterClosed().subscribe((confirmed) => {
        if(confirmed){
          this.expenseService.deleteExpense(expense.id!!).subscribe({
            next: () => {
              this.expenses = this.expenses.filter((e) => e.id !== expense.id);
              this.toastrService.success('Expense deleted successfully.');
            },
            error: () => {
              this.toastrService.error('Failed to delete expense.');
            },
          });
        }
      });
  }

  public onRowEditInit(expense: Expense) {
    if(this.isEditing && this.editId !== expense.id){
      return
    }
    this.originalExpenses[expense.id as string] = { ...expense };
    this.isEditing = true
    this.editId = expense.id!!
  }

  public onRowEditSave(expense: Expense, index: number, form: NgModelGroup): void {
    if(!form.valid){
      this.toastrService.error('Error saving form');
      return
    }
    this.expenseService.updateExpense(expense).subscribe({
      next: () => {
        this.toastrService.success('Login successful');
        this.isEditing = false;
        this.editId = null;
        this.fetchExpenses();
      },
      error: () => {
        this.expenses[index] = this.originalExpenses[expense.id as string];
         delete this.originalExpenses[expense.id as string];
      },
    });
  }

public onRowEditCancel(expense: Expense, index: number) {
  this.expenses[index] = this.originalExpenses[expense.id as string];
  this.isEditing = false;
  this.editId = null;
  delete this.originalExpenses[expense.id as string];
}

private fetchExpenses(): void {
  this.isLoading = true;
  this.expenseService.getExpenses().subscribe({
    next: (data) => {
      this.expenses = data;
      this.isLoading = false;
    },
    error: () => {
      this.error = 'Failed to load expenses. Please try again later.';
      this.isLoading = false;
    },
  });
}

private fetchCategories(): void {
  this.categoriesService.getCategories().subscribe({
    next: (data) => {
      this.categories = data.map((category) => ({
        label: category.name,
        value: category.id,
      }));
    },
  });
}

}
