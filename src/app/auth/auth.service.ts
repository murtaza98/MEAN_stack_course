import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const newUser: AuthData = {
      email: email,
      password: password
    };
    this.http.post('http://localhost:3000/api/user/signup', newUser)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const user: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', user)
      .subscribe(response => {
        // console.log(response);
        if (response.token) {
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);


          this.token = response.token;
          this.authStatusListener.next(true);
          this.isAuthenticated = true;
          // navigate to home page
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    // navigate to home page
    this.router.navigate(['/']);
  }
}
