import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
baseUrl = 'http://localhost:5000/api/auth/';
constructor(private http: HttpClient) { }
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
   }
  }

   ));

}
register(model: any)
{
  return this.http.post(this.baseUrl + 'register', model);

}

}
