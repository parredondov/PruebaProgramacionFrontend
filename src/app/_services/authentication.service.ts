import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


  login(username, password) {

    let body = {
      username: username,
      password: password
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      }),
      observe: "events"
    }


    // return this.http.post<Token>(`${environment.baseUrl}auth/signin`, body)
    //   .pipe(
    //     map(token => {
    //       // store user details and jwt token in local storage to keep user logged in between page refreshes
    //       //console.log('TOKEN!!',token);
    //       let user = new User();
    //       user.username = token.username;
    //       user.token = token.accessToken;
    //       user.role = token.roles[0];
    //       user.changePasswordDate = token.passwordDateChange;
    //       //user.changePasswordDate = token.
    //       localStorage.setItem('currentUser', JSON.stringify(user));
    //       this.currentUserSubject.next(user);



    //       return user;
    //     }
    //     )
    //   )
  }
  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

}
