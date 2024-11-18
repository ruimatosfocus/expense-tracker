import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterDTO } from './register.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private apiUrl = `${environment.apiUrl}/register`;

  public emailExistsError: string = '';
  public model = new RegisterDTO()

  constructor(private readonly http: HttpClient, private readonly router: Router, private toastrService: ToastrService
  ) {}

  public onEmailChange(control: any): void {
    if (control?.errors?.['emailExists']) {
      control.setErrors(null);
    }
  }

  public onSubmit(form: NgForm): void {
    if (form.invalid) {
      return
    }
  
    // Send the data to the backend
    this.http.post(this.apiUrl, this.model).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (res) => {
        console.log(res)
        if (res?.error?.error === 'EmailAlreadyExists') {
          const emailControl = form.controls['email'];
          emailControl?.setErrors({ emailExists: true });        
        } else {
          this.toastrService.error('An error occured. Please try again.')
        }
      }
    });
  }
}
