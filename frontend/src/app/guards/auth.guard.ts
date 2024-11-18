import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthenticatedUserService } from '../authenticated-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private readonly authenticatedUserService: AuthenticatedUserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken && !this.isTokenExpired(accessToken)) {
      return of(true);
    }
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      // Attempt to refresh the token
      return new Observable<boolean>((observer) => {
        this.authenticatedUserService.refreshToken(refreshToken).subscribe({
          next: () => {
            observer.next(true); 
            observer.complete();
          },
          error: () => {
            this.router.navigate(['/login']); 
            observer.next(false);
            observer.complete();
          },
        });
      });
    }

    this.router.navigate(['/login']);
    return of(false);
  }


  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1])); //seperates the token parts and gets the payload
    const expirationDate = payload.exp * 1000;
    return Date.now() >= expirationDate;
  }
  
}
