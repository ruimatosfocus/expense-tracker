import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-expense-dialog',
  templateUrl: 'cancel-expense-dialog.component.html'
})
export class CancelExpenseDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CancelExpenseDialogComponent>,
  ) {}

  public onCancel(): void {
    this.dialogRef.close(false);
  }

}
