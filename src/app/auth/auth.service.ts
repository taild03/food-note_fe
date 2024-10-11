import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api'; // adjust this to your backend API URL

  constructor(private http: HttpClient) { }

  signup(formData: any) {
    return this.http.post(`${this.apiUrl}/signup`, formData);
  }

  login(formData: any) {
    return this.http.post(`${this.apiUrl}/login`, formData);
  }
}