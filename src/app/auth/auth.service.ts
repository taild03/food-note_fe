// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private apiUrl = 'http://localhost:3000/api'; // adjust this to your backend API URL

//   constructor(private http: HttpClient) { }

//   signup(formData: any) {
//     return this.http.post(`${this.apiUrl}/signup`, formData);
//   }

//   login(formData: any) {
//     return this.http.post(`${this.apiUrl}/login`, formData);
//   }
// }
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { jwtDecode } from 'jwt-decode';  // You'll need to install this package
import { Router } from '@angular/router';

interface DecodedToken {
  sub: number;
  email: string;
  exp?: number;  // Add the exp property as optional
  iat?: number;  // Optional: add issued at time if your token includes it
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'access_token';
  redirectUrl: string | null = null;

  constructor(
    private apollo: Apollo, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router // Add Router injection
  ) {
    // Verify token on service initialization
    this.verifyTokenOnInit();
  }

  private verifyTokenOnInit(): void {
    if (this.isAuthenticated()) {
      // Optionally verify token validity with backend
      // If token is invalid, logout user
      this.getCurrentUserId() || this.logout();
    }
  }

  signup(email: string, password: string): Observable<any> {
    const SIGNUP_MUTATION = gql`
      mutation Signup($email: String!, $password: String!) {
        signup(data: { email: $email, password: $password })
      }
    `;

    return this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { email, password },
    }).pipe(
      map((result: any) => {
        const token = result.data.signup;
        this.setToken(token);
        return token;
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    const LOGIN_MUTATION = gql`
      mutation Login($email: String!, $password: String!) {
        login(data: { email: $email, password: $password })
      }
    `;

    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    }).pipe(
      map((result: any) => {
        const token = result.data.login;
        this.setToken(token);
        return token;
      })
    );
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        return decodedToken.sub;
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout(); // Logout if token is invalid
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired (if exp claim exists)
      if (decodedToken.exp) {
        return decodedToken.exp > currentTime;
      }
      
      // If no expiration claim, consider it valid
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      this.router.navigate(['/login']);
    }
  }
}