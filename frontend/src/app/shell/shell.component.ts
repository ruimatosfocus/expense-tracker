import { Component, OnInit } from '@angular/core';
import { AuthenticatedUserService } from '../authenticated-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  public userName: string | null = null;

  constructor(private authUserService: AuthenticatedUserService, private readonly router: Router) {}

  ngOnInit(): void {
    this.userName = this.authUserService.getUserName();
  }

  logout(): void {
    this.authUserService.clearAuthenticatedUser();
    this.router.navigate(['/login']);
  }
}
