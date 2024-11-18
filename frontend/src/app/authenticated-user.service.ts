import { Injectable } from '@angular/core';
import { LoginResponse } from './login/login.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedUserService {
  private refreshTokenUrl = `${environment.apiUrl}/refresh`;

  private userId: string | null = null;
  private userName: string | null = null;

  constructor(private http: HttpClient) {
    this.initializeFromLocalStorage();
  }

  public setAuthenticatedUser(response: LoginResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    const payload = this.decodeTokenPayload(response.accessToken);
    if (payload) {
      this.userId = payload.sub || null;
      this.userName = payload.unique_name || null;
    }
  }

  public getgetUserId(): string | null {
    return this.userId;
  }

  public getUserName(): string | null {
    return this.userName;
  }

  public clearAuthenticatedUser(): void {
    this.userId = null;
    this.userName = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private decodeTokenPayload(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      return payload;
    } catch (e) {
      console.error('Failed to decode token payload:', e);
      return null;
    }
  }

  private initializeFromLocalStorage(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const payload = this.decodeTokenPayload(token);
      if (payload) {
        this.userId = payload.sub || null;
        this.userName = payload.unique_name || null;
      }
    }
  }

  public refreshToken(refreshToken: string) {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      this.refreshTokenUrl,
      { refreshToken }
    ).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      })
    );
  }
}
