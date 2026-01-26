import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginFormComponent } from './login-form.component';
import { FormsModule } from '@angular/forms';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Wait for ngModel bindings to initialize
    await fixture.whenStable();
  });

  // ============================================
  //  SECTION 1: Form Rendering Tests
  // ============================================
  describe('Form Rendering', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render email input', () => {
      const emailInput = fixture.debugElement.query(By.css('[data-testid="email-input"]'));
      expect(emailInput).toBeTruthy();
    });

    it('should render password input', () => {
      const passwordInput = fixture.debugElement.query(By.css('[data-testid="password-input"]'));
      expect(passwordInput).toBeTruthy();
    });

    it('should render submit button', () => {
      const submitBtn = fixture.debugElement.query(By.css('[data-testid="submit-btn"]'));
      expect(submitBtn).toBeTruthy();
      expect(submitBtn.nativeElement.textContent).toContain('Login');
    });

    it('should render remember me checkbox', () => {
      const checkbox = fixture.debugElement.query(By.css('[data-testid="remember-checkbox"]'));
      expect(checkbox).toBeTruthy();
    });
  });

  // ============================================
  //  SECTION 2: Input Binding Tests
  // ============================================
  describe('Input Bindings', () => {
    it('should update email when user types', async () => {
      const emailInput = fixture.debugElement.query(By.css('[data-testid="email-input"]'));
      
      emailInput.nativeElement.value = 'test@example.com';
      emailInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(component.email).toBe('test@example.com');
    });

    it('should update password when user types', async () => {
      const passwordInput = fixture.debugElement.query(By.css('[data-testid="password-input"]'));
      
      passwordInput.nativeElement.value = 'secretpassword';
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(component.password).toBe('secretpassword');
    });

    it('should toggle remember me checkbox', async () => {
      const checkbox = fixture.debugElement.query(By.css('[data-testid="remember-checkbox"]'));
      
      expect(component.rememberMe).toBe(false);
      
      checkbox.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(component.rememberMe).toBe(true);
    });
  });

  // ============================================
  // 📧 SECTION 3: Email Validation Tests
  // ============================================
  describe('Email Validation', () => {
    it('should show error when email is empty on blur', () => {
      const emailInput = fixture.debugElement.query(By.css('[data-testid="email-input"]'));
      
      emailInput.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      
      const errorMsg = fixture.debugElement.query(By.css('[data-testid="email-error"]'));
      expect(errorMsg.nativeElement.textContent).toContain('Email is required');
    });

    it('should show error when email is invalid', async () => {
      const emailInput = fixture.debugElement.query(By.css('[data-testid="email-input"]'));
      
      emailInput.nativeElement.value = 'invalidemail';
      emailInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      
      emailInput.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      
      const errorMsg = fixture.debugElement.query(By.css('[data-testid="email-error"]'));
      expect(errorMsg.nativeElement.textContent).toContain('valid email');
    });

    it('should clear error when email is valid', async () => {
      const emailInput = fixture.debugElement.query(By.css('[data-testid="email-input"]'));
      
      emailInput.nativeElement.value = 'test@example.com';
      emailInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      
      emailInput.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      
      const errorMsg = fixture.debugElement.query(By.css('[data-testid="email-error"]'));
      expect(errorMsg).toBeNull();
    });
  });

  // ============================================
  // 🔐 SECTION 4: Password Validation Tests
  // ============================================
  describe('Password Validation', () => {
    it('should show error when password is empty on blur', () => {
      const passwordInput = fixture.debugElement.query(By.css('[data-testid="password-input"]'));
      
      passwordInput.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      
      const errorMsg = fixture.debugElement.query(By.css('[data-testid="password-error"]'));
      expect(errorMsg.nativeElement.textContent).toContain('Password is required');
    });

    it('should show error when password is too short', async () => {
      const passwordInput = fixture.debugElement.query(By.css('[data-testid="password-input"]'));
      
      passwordInput.nativeElement.value = '123';
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      
      passwordInput.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      
      const errorMsg = fixture.debugElement.query(By.css('[data-testid="password-error"]'));
      expect(errorMsg.nativeElement.textContent).toContain('at least 6 characters');
    });

    it('should clear error when password is valid', async () => {
      const passwordInput = fixture.debugElement.query(By.css('[data-testid="password-input"]'));
      
      passwordInput.nativeElement.value = 'validpassword123';
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      
      passwordInput.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      
      const errorMsg = fixture.debugElement.query(By.css('[data-testid="password-error"]'));
      expect(errorMsg).toBeNull();
    });
  });

  // ============================================
  // 🔘 SECTION 5: Submit Button State Tests
  // ============================================
  describe('Submit Button State', () => {
    it('should disable submit button when form is invalid', () => {
      const submitBtn = fixture.debugElement.query(By.css('[data-testid="submit-btn"]'));
      expect(submitBtn.nativeElement.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', async () => {
      // Fill email
      const emailInput = fixture.debugElement.query(By.css('[data-testid="email-input"]'));
      emailInput.nativeElement.value = 'test@example.com';
      emailInput.nativeElement.dispatchEvent(new Event('input'));
      
      // Fill password
      const passwordInput = fixture.debugElement.query(By.css('[data-testid="password-input"]'));
      passwordInput.nativeElement.value = 'validpassword';
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      
      fixture.detectChanges();
      await fixture.whenStable();
      
      const submitBtn = fixture.debugElement.query(By.css('[data-testid="submit-btn"]'));
      expect(submitBtn.nativeElement.disabled).toBe(false);
    });
  });

  // ============================================
  //  SECTION 6: Form Submission Tests
  // ============================================
  describe('Form Submission', () => {
    it('should show loading state during submission', async () => {
      // Setup valid form
      component.email = 'test@example.com';
      component.password = 'validpassword';
      fixture.detectChanges();
      
      // Start submission (don't await)
      const submitPromise = component.onSubmit();
      fixture.detectChanges();
      
      // Check loading state
      expect(component.isLoading()).toBe(true);
      const submitBtn = fixture.debugElement.query(By.css('[data-testid="submit-btn"]'));
      expect(submitBtn.nativeElement.textContent).toContain('Logging in...');
      
      // Complete the async operation
      await submitPromise;
      fixture.detectChanges();
      
      expect(component.isLoading()).toBe(false);
    });

    it('should show success message after successful login', async () => {
      // Setup valid form
      component.email = 'test@example.com';
      component.password = 'validpassword';
      fixture.detectChanges();
      
      await component.onSubmit();
      fixture.detectChanges();
      
      const successMsg = fixture.debugElement.query(By.css('[data-testid="success-message"]'));
      expect(successMsg.nativeElement.textContent).toContain('Login successful');
    });

    it('should emit loginSuccess event on successful submission', async () => {
      component.email = 'test@example.com';
      component.password = 'validpassword';
      
      // Spy on the output
      let emittedValue: any = null;
      component.loginSuccess.subscribe((value) => {
        emittedValue = value;
      });
      
      await component.onSubmit();
      
      expect(emittedValue).toEqual({
        email: 'test@example.com',
        password: 'validpassword'
      });
    });

    it('should not submit when form is invalid', async () => {
      component.email = '';
      component.password = '';
      fixture.detectChanges();
      
      await component.onSubmit();
      fixture.detectChanges();
      
      expect(component.isLoading()).toBe(false);
      expect(component.successMessage()).toBe('');
    });
  });

  // ============================================
  //  SECTION 7: Vitest-Specific Features Demo
  // ============================================
  describe('Vitest-Specific Features', () => {
    it('should use vi.fn() for mocking functions', () => {
      const mockFn = vi.fn();
      mockFn('test');
      
      expect(mockFn).toHaveBeenCalledWith('test');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should use vi.spyOn() for spying on methods', () => {
      const validateEmailSpy = vi.spyOn(component, 'validateEmail');
      
      component.validateEmail();
      
      expect(validateEmailSpy).toHaveBeenCalled();
    });

    it('should mock timers with vi.useFakeTimers', async () => {
      vi.useFakeTimers();
      
      component.email = 'test@example.com';
      component.password = 'validpassword';
      
      const submitPromise = component.onSubmit();
      
      // Fast-forward time
      vi.advanceTimersByTime(1000);
      
      await submitPromise;
      
      expect(component.successMessage()).toContain('Login successful');
      
      vi.useRealTimers();
    });
  });
});
