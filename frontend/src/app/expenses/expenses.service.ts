import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from './expenses.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  public getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  public updateExpense(expense: Expense): Observable<void> {
    const url = `${this.apiUrl}/${expense.id}`;
    return this.http.put<void>(url, expense);
  }

  public deleteExpense(expenseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${expenseId}`);
  }

  public createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  public getPieChartData(): Observable<{ category: string; totalAmount: number }[]> {
    return this.http.get<{ category: string; totalAmount: number }[]>(`${this.apiUrl}/pie`);
  }
}
