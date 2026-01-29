import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" data-testid="login-form">
      <h2>Login</h2>
      
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          id="email"
          data-testid="email-input"
          type="email" 
          [(ngModel)]="email"
          name="email"
          (blur)="validateEmail()"
          [class.error]="emailError()">
        @if (emailError()) {
          <span data-testid="email-error" class="error-message">
            {{ emailError() }}
          </span>
        }
      </div>
      
      <div class="form-group">
        <label for="password">Password:</label>
        <input 
          id="password"
          data-testid="password-input"
          type="password" 
          [(ngModel)]="password"
          name="password"
          (blur)="validatePassword()"
          [class.error]="passwordError()">
        @if (passwordError()) {
          <span data-testid="password-error" class="error-message">
            {{ passwordError() }}
          </span>
        }
      </div>
      
      <div class="form-group">
        <label>
          <input 
            data-testid="remember-checkbox"
            type="checkbox" 
            [(ngModel)]="rememberMe"
            name="rememberMe">
          Remember me
        </label>
      </div>
      
      <button 
        data-testid="submit-btn"
        type="submit" 
        [disabled]="!isFormValid() || isLoading()">
        {{ isLoading() ? 'Logging in...' : 'Login' }}
      </button>
      
      @if (successMessage()) {
        <div data-testid="success-message" class="success-message">
          {{ successMessage() }}
        </div>
      }
    </form>
  `,
  styles: [`
    form { max-width: 400px; margin: 0 auto; padding: 20px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input[type="email"], input[type="password"] { 
      width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; 
    }
    input.error { border-color: red; }
    .error-message { color: red; font-size: 12px; }
    .success-message { color: green; margin-top: 10px; }
    button { 
      width: 100%; padding: 12px; background: #007bff; color: white; 
      border: none; border-radius: 4px; cursor: pointer; 
    }
    button:disabled { background: #ccc; cursor: not-allowed; }
  `]
})
export class LoginFormComponent {
  email = '';
  password = '';
  rememberMe = false;

  emailError = signal<string>('');
  passwordError = signal<string>('');
  isLoading = signal(false);
  successMessage = signal<string>('');

  loginSuccess = output<LoginCredentials>();
  loginError = output<string>();

  validateEmail(): boolean {
    if (!this.email) {
      this.emailError.set('Email is required');
      return false;
    }
    if (!this.email.includes('@')) {
      this.emailError.set('Please enter a valid email');
      return false;
    }
    this.emailError.set('');
    return true;
  }

  validatePassword(): boolean {
    if (!this.password) {
      this.passwordError.set('Password is required');
      return false;
    }
    if (this.password.length < 6) {
      this.passwordError.set('Password must be at least 6 characters');
      return false;
    }
    this.passwordError.set('');
    return true;
  }

  isFormValid(): boolean {
    return this.email.includes('@') && this.password.length >= 6;
  }

  async onSubmit(): Promise<void> {
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    this.isLoading.set(true);
    this.successMessage.set('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.isLoading.set(false);
    this.successMessage.set('Login successful! Welcome back.');
    
    this.loginSuccess.emit({
      email: this.email,
      password: this.password
    });
  }
}
