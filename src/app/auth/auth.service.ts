import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { expressionType } from '@angular/compiler/src/output/output_ast';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean;
  private tokenTimer: any;
  private userId: string;

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

  getUserId() {
    return this.userId;
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
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', user)
      .subscribe(response => {
        // console.log(response);
        if (response.token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);

          this.token = response.token;
          this.authStatusListener.next(true);
          this.isAuthenticated = true;

          // save userId
          this.userId = response.userId;

          // save token in local storage
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate, this.userId);

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
    this.clearAuthData();
    this.userId = null;
    // navigate to home page
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (authInformation) {
      const now = new Date();
      const isInFuture = authInformation.expirationDate > now;

      if (isInFuture) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        this.setAuthTimer(expiresIn / 1000);
        this.userId = authInformation.userId;
        this.authStatusListener.next(true);
      }
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate || !userId) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
