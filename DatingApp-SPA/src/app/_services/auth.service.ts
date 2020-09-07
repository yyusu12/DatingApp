import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
baseUrl = environment.apiUrl + 'auth/';
jwtHelper = new JwtHelperService();
decodedToken: any;
currentUser: User;
photoUrl = new BehaviorSubject<string>('../../assets/user.png');
currentPhotoUrl = this.photoUrl.asObservable();

constructor(private http: HttpClient) { }

// creating behaviorSubject function

changeMemberPhoto(photoUrl: string){
 this.photoUrl.next(photoUrl);
}

// creating a login method to send login data to our api
login(model: any)
{
  // sending ng-model data from loginform to api
  // geting the JWT (http.post returns as observable) as a response back from the server
  // storing the JWT locally for easy access
  // rxjs operators are used to do anthing with an observable
  // to use rxjs operators we need to use pipe method
   return this.http.post(this.baseUrl + 'login', model)
   .pipe(map((response: any) => {const user = response;
                                 if (user)
   {
     localStorage.setItem('token', user.token);
     localStorage.setItem('user', JSON.stringify(user.user));
     this.decodedToken = this.jwtHelper.decodeToken(user.token); // to decode token and get the payload info
     // getting the user properties from the login request
     this.currentUser = user.user;
     this.changeMemberPhoto(this.currentUser.photoUrl);
   }
  }

   ));

}
register(user: User)
{
  return this.http.post(this.baseUrl + 'register', user); 

}

// using jwtHelperService to handle token
loggedIn(){
  const token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token); // returning if token is not expired.
}

}
