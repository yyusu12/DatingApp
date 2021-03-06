import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';

// passing the token for authorization


@Injectable({
  providedIn: 'root'
})
export class UserService {

baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }
// getting the list of users
getUsers(): Observable<User[]>{
  return this.http.get<User[]>(this.baseUrl + 'users');
}

// getting an individual user
getuser(id): Observable<User>{
  return this.http.get<User>(this.baseUrl + 'users/' + id);
}
// updating user details
updateUser(id: number, user: User)
{
  return this.http.put(this.baseUrl + 'users/' + id, user);
}

// setting main photo
updateMainPhoto(userId: number, id: number){
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
}

// delete photo

deletePhoto(userid: number, photoid: number){
  return this.http.delete(this.baseUrl + 'users/' + userid + '/photos/' + photoid);
}
}
