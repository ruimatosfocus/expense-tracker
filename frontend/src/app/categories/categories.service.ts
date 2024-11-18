import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  public getCategories(): Observable<{ id: string; name: string }[]> {
    return this.http.get<{ id: string; name: string }[]>(this.apiUrl);
  }
}
