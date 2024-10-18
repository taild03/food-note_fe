import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    FormsModule,
    PasswordModule,
    InputTextModule,
    RouterLink,
    FloatLabelModule,
    CheckboxModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  ngOnInit() {
    // Redirect to home if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  checkEmailValidity(email: NgModel) {
    if (email.touched && email.invalid) {
      if (email.errors?.['required']) {
        this.showError('Email Required', 'Please enter your email address.');
      } else if (email.errors?.['email']) {
        this.showError('Invalid Email', 'Please enter a valid email address.');
      }
    }
  }

  checkPasswordValidity(password: NgModel) {
    if (password.touched && password.invalid) {
      if (password.errors?.['required']) {
        this.showError('Password Required', 'Please enter your password.');
      } else if (password.errors?.['minlength']) {
        this.showError('Invalid Password', 'Password must be at least 6 characters long.');
      }
    }
  }

  private showError(summary: string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 3000 // Message will disappear after 3 seconds
    });
  }

  private showSuccess(summary: string, detail: string) {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 3000
    });
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }

  onSubmit(formData: NgForm) {
    if (!formData.form.valid) {
      this.showError('Invalid Form', 'Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const { email, password } = formData.form.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccess('Success', 'Login successful!');
        const redirectUrl = this.authService.redirectUrl || '/home';
        this.authService.redirectUrl = null;
        this.router.navigate([redirectUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed', error);
        
        // Handle different error cases
        if (error.graphQLErrors?.length > 0) {
          const graphQLError = error.graphQLErrors[0];
          if (graphQLError.extensions?.code === 'INVALID_CREDENTIALS') {
            this.showError('Login Failed', 'Invalid email or password.');
          } else {
            this.showError('Login Failed', 'An error occurred during login.');
          }
        } else {
          this.showError('Login Failed', 'Unable to connect to the server. Please try again later.');
        }
      }
    });
  }
}
