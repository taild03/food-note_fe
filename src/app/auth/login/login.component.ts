import { Component, inject } from '@angular/core';
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
export class LoginComponent {
  email: string = '';
  password: string = '';

  private router = inject(Router);
  private messageService = inject(MessageService);
  checkEmailValidity(email: NgModel) {
    if (email.touched && email.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Email',
        detail: 'Please enter a valid email address.',
      });
    }
  }
  checkPasswordValidity(password: NgModel) {
    if (password.touched && password.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Password',
        detail: 'Please enter a valid password.',
      });
    }
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }
  onSubmit(formData: NgForm) {
    if (!formData.form.valid) {
      return;
    }
    const enterredEmail = formData.form.value.email;
    const enterredPassword = formData.form.value.password;
    console.log(enterredEmail, enterredPassword);
    this.router.navigate(['/home']);

  }
}
