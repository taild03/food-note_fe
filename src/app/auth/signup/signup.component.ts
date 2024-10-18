import { Component, inject } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [PasswordModule, ButtonModule, CardModule, FormsModule, InputTextModule, RouterLink, CheckboxModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  email: string = '';
  password: string = '';

  private router = inject(Router);
  private authService = inject(AuthService);
  
  onSignup() {
    this.authService.signup(this.email, this.password).subscribe(
      (token) => {
        console.log('Signup successful:', token);
        this.router.navigate(['/login']); // Redirect to home or main screen after signup
      },
      (error) => {
        console.error('Signup failed:', error);
        alert('Signup failed');
      }
    );
  }
  onLogin() {
    this.router.navigate(['/login']);
  }
}
