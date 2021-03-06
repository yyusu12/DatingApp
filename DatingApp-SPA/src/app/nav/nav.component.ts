import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;
 // injecting the authService into the Component to use it
  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login(){

   this.authService.login(this.model).subscribe(next => {this.alertify.success('logged in successfully'); },
   error => {this.alertify.error(error); }, () => {this.router.navigate(['/members']); });
  }

  loggedIn(){

    return this.authService.loggedIn();  // short hand if statement checking to see if user is loggedin by checking if token exists
  }

  // empty the token to logout
  logOut(){

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.currentUser = null;
    this.authService.decodedToken = null;
    this.alertify.warning('logged out');
    this.router.navigate(['/home']);
  }

}
