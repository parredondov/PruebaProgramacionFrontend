import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Token } from '../_models/token';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private tokenSubject: BehaviorSubject<Token>;
  public token: Observable<Token>;

  constructor(
    private http: HttpClient,
    private router: Router) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
      this.tokenSubject = new BehaviorSubject<Token>(JSON.parse(localStorage.getItem('token')));
      this.token = this.tokenSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get tokenValue(): Token {
    return this.tokenSubject.value;
  }


  login(username, password) {

    let body = {
      emailAddress: username,
      password: password
    }
    
    return this.http.put<Token>(`${environment.baseUrl}entrance/login`, body)
      .pipe(
        map(response => {
          let user = new User();
          user.emailAddress = username;
          
          let tk = new Token();
          tk = response;
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);

          localStorage.setItem('token', JSON.stringify(tk));
          this.tokenSubject.next(tk);


          return user;
        })
    )
  }

  signup(username, password) {

    let body = {
      emailAddress: username,
      password: password
    }
    
    return this.http.put<Token>(`${environment.baseUrl}entrance/login`, body)
      .pipe(
        map(response => {
          let user = new User();
          user.emailAddress = username;
          
          let tk = new Token();
          tk = response;
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);

          localStorage.setItem('token', JSON.stringify(tk));
          this.tokenSubject.next(tk);


          return user;
        })
    )
  }
  logout() {
    // remove user from local storage and set current user to null
    
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

}
