import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Expense } from '../../expenses.dto';

@Component({
  selector: 'app-create-expense-dialog',
  templateUrl: 'create-expense-dialog.component.html',
  styleUrls: ['./create-expense-dialog.component.scss'],
})
export class CreateExpenseDialogComponent {

  public categories: { label: string; value: string }[] = [];
  public paymentMethods: { label: string; value: string }[] = [];

  public expense = new Expense()

  constructor(
    public dialogRef: MatDialogRef<CreateExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.categories = data.categories;
    this.paymentMethods = data.paymentMethods;
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onSubmit(form: NgForm): void {
    if (!form.valid) {
      return
    }
    this.dialogRef.close(this.expense);
  }
}
