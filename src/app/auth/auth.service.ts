import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean;

  constructor(private http: HttpClient) {}

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
    this.http.post<{token: string}>('http://localhost:3000/api/user/login', user)
      .subscribe(response => {
        // console.log(response);
        if (response.token) {
          this.token = response.token;
          this.authStatusListener.next(true);
          this.isAuthenticated = true;
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }
}
