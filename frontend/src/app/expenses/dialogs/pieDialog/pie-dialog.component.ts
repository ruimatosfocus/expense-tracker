import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ExpenseService } from '../../expenses.service';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-pie-dialog',
  templateUrl: 'pie-dialog.component.html',
  styleUrls: ['./pie-dialog.component.scss'],

})
export class PieDialogComponent {
  public pieChartLabels: string[] = [];
  public pieChartDatasets: ChartDataset<'pie', number[]>[] = [
    {
      data: [], 
    }
  ];
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const value = tooltipItem.raw; 
            return ` ${value}€`;
          },
        },
      },
    },
  };


  constructor(
    public dialogRef: MatDialogRef<PieDialogComponent>,
    private expenseService: ExpenseService
  ) {
    this.expenseService.getPieChartData().subscribe((data) => {
      this.pieChartLabels = data.map((item) => item.category);
      this.pieChartDatasets = [
        {
          data: data.map((item) => item.totalAmount) 
        }
      ];
    });
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

}
