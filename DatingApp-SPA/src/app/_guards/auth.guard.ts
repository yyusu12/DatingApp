import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // add a constructor to inject authService, alertify, router
  constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router){}
  canActivate(
    ): boolean {
    if (this.authService.loggedIn()){return true; } // allows the user to proceed if he is logged in
    this.alertify.error('You shall not Pass!!');
    this.router.navigate(['/home']);
    return false;
  }
}
