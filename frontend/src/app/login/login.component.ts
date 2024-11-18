import { Component, OnInit } from '@angular/core';
import { loginDTO } from './login.dto';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthenticatedUserService } from '../authenticated-user.service';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private apiUrl = `${environment.apiUrl}/login`;

  public model = new loginDTO()

  public constructor(private readonly authUserService: AuthenticatedUserService, private readonly http: HttpClient, private readonly toastrService: ToastrService, private readonly router: Router) { }

  public ngOnInit(): void {
  }

  public onSubmit(form: NgForm){
    if (form.invalid) {
      return;
    }
    
    this.http.post<LoginResponse>(this.apiUrl, this.model).subscribe({
      next: (response: LoginResponse) => {
        this.toastrService.success('Login successful');
        this.authUserService.setAuthenticatedUser(response);
        this.router.navigate(['expenses']);
      },
      error: (error) => {
        console.log(error)
        this.toastrService.error('Invalid credentials. Please try again.');
      }
    });
  }

}
