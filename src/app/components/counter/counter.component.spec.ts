import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ============================================
  //  SECTION 1: Component Initialization Tests
  // ============================================
  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize counter to 0', () => {
      expect(component.count()).toBe(0);
    });

    it('should display initial count in the title', () => {
      const title = fixture.debugElement.query(By.css('[data-testid="title"]'));
      expect(title.nativeElement.textContent).toContain('Counter: 0');
    });

    it('should show "Counter is at zero" status initially', () => {
      const status = fixture.debugElement.query(By.css('[data-testid="status"]'));
      expect(status.nativeElement.textContent).toContain('Counter is at zero');
    });
  });

  // ============================================
  //  SECTION 2: Button Click Tests
  // ============================================
  describe('Button Clicks', () => {
    it('should increment counter when increment button is clicked', () => {
      const incrementBtn = fixture.debugElement.query(By.css('[data-testid="increment-btn"]'));
      
      incrementBtn.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.count()).toBe(1);
      
      const title = fixture.debugElement.query(By.css('[data-testid="title"]'));
      expect(title.nativeElement.textContent).toContain('Counter: 1');
    });

    it('should increment counter multiple times', () => {
      const incrementBtn = fixture.debugElement.query(By.css('[data-testid="increment-btn"]'));
      
      // Click 5 times
      for (let i = 0; i < 5; i++) {
        incrementBtn.nativeElement.click();
      }
      fixture.detectChanges();
      
      expect(component.count()).toBe(5);
    });

    it('should decrement counter when decrement button is clicked', () => {
      // First increment to 3
      component.count.set(3);
      fixture.detectChanges();
      
      const decrementBtn = fixture.debugElement.query(By.css('[data-testid="decrement-btn"]'));
      decrementBtn.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.count()).toBe(2);
    });

    it('should reset counter to 0 when reset button is clicked', () => {
      // Set counter to 10
      component.count.set(10);
      fixture.detectChanges();
      
      const resetBtn = fixture.debugElement.query(By.css('[data-testid="reset-btn"]'));
      resetBtn.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.count()).toBe(0);
    });
  });

  // ============================================
  // 🔘 SECTION 3: Button State Tests
  // ============================================
  describe('Button States', () => {
    it('should disable decrement button when counter is 0', () => {
      const decrementBtn = fixture.debugElement.query(By.css('[data-testid="decrement-btn"]'));
      expect(decrementBtn.nativeElement.disabled).toBe(true);
    });

    it('should enable decrement button when counter is greater than 0', () => {
      component.count.set(5);
      fixture.detectChanges();
      
      const decrementBtn = fixture.debugElement.query(By.css('[data-testid="decrement-btn"]'));
      expect(decrementBtn.nativeElement.disabled).toBe(false);
    });

    it('should not decrement below 0', () => {
      // Counter is already at 0
      component.decrement();
      fixture.detectChanges();
      
      expect(component.count()).toBe(0);
    });
  });

  // ============================================
  //  SECTION 4: Status Message Tests
  // ============================================
  describe('Status Messages', () => {
    it('should show "Counter is low" when count is 1-4', () => {
      component.count.set(3);
      fixture.detectChanges();
      
      const status = fixture.debugElement.query(By.css('[data-testid="status"]'));
      expect(status.nativeElement.textContent).toContain('Counter is low');
      expect(status.nativeElement.classList).toContain('status-low');
    });

    it('should show "Counter is medium" when count is 5-9', () => {
      component.count.set(7);
      fixture.detectChanges();
      
      const status = fixture.debugElement.query(By.css('[data-testid="status"]'));
      expect(status.nativeElement.textContent).toContain('Counter is medium');
      expect(status.nativeElement.classList).toContain('status-medium');
    });

    it('should show "Counter is high!" when count is 10+', () => {
      component.count.set(15);
      fixture.detectChanges();
      
      const status = fixture.debugElement.query(By.css('[data-testid="status"]'));
      expect(status.nativeElement.textContent).toContain('Counter is high!');
      expect(status.nativeElement.classList).toContain('status-high');
    });
  });

  // ============================================
  //  SECTION 5: Input Interaction Tests
  // ============================================
  describe('Custom Amount Input', () => {
    it('should have default custom amount of 1', () => {
      expect(component.customAmount()).toBe(1);
    });

    it('should update custom amount when input changes', () => {
      const input = fixture.debugElement.query(By.css('[data-testid="amount-input"]'));
      
      // Simulate input event
      input.nativeElement.value = '5';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.customAmount()).toBe(5);
    });

    it('should add custom amount to counter when Add Amount button is clicked', () => {
      component.customAmount.set(10);
      fixture.detectChanges();
      
      const addBtn = fixture.debugElement.query(By.css('[data-testid="add-amount-btn"]'));
      addBtn.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.count()).toBe(10);
    });

    it('should add custom amount multiple times', () => {
      component.customAmount.set(5);
      fixture.detectChanges();
      
      const addBtn = fixture.debugElement.query(By.css('[data-testid="add-amount-btn"]'));
      
      addBtn.nativeElement.click();
      addBtn.nativeElement.click();
      addBtn.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.count()).toBe(15);
    });
  });

  // ============================================
  //  SECTION 6: Integration Scenario Tests
  // ============================================
  describe('User Scenarios', () => {
    it('should handle a complete user interaction flow', () => {
      const incrementBtn = fixture.debugElement.query(By.css('[data-testid="increment-btn"]'));
      const decrementBtn = fixture.debugElement.query(By.css('[data-testid="decrement-btn"]'));
      const resetBtn = fixture.debugElement.query(By.css('[data-testid="reset-btn"]'));
      
      // User clicks increment 3 times
      incrementBtn.nativeElement.click();
      incrementBtn.nativeElement.click();
      incrementBtn.nativeElement.click();
      fixture.detectChanges();
      expect(component.count()).toBe(3);
      
      // User clicks decrement once
      decrementBtn.nativeElement.click();
      fixture.detectChanges();
      expect(component.count()).toBe(2);
      
      // User resets
      resetBtn.nativeElement.click();
      fixture.detectChanges();
      expect(component.count()).toBe(0);
    });

    it('should update UI correctly after multiple operations', () => {
      // Add custom amount of 8
      component.customAmount.set(8);
      const addBtn = fixture.debugElement.query(By.css('[data-testid="add-amount-btn"]'));
      addBtn.nativeElement.click();
      fixture.detectChanges();
      
      // Check all UI elements are in sync
      const title = fixture.debugElement.query(By.css('[data-testid="title"]'));
      const status = fixture.debugElement.query(By.css('[data-testid="status"]'));
      
      expect(title.nativeElement.textContent).toContain('Counter: 8');
      expect(status.nativeElement.textContent).toContain('Counter is medium');
      expect(status.nativeElement.classList).toContain('status-medium');
    });
  });

  // ============================================
  //  SECTION 7: Signal Input Tests
  // ============================================
  describe('Signal Inputs', () => {
    it('should use custom initial value', async () => {
      // Create new component with input
      const newFixture = TestBed.createComponent(CounterComponent);
      newFixture.componentRef.setInput('initialValue', 10);
      newFixture.detectChanges();
      await newFixture.whenStable();
      
      expect(newFixture.componentInstance.count()).toBe(10);
    });

    it('should increment by custom step', () => {
      fixture.componentRef.setInput('step', 5);
      fixture.detectChanges();
      
      component.increment();
      
      expect(component.count()).toBe(5);
    });

    it('should decrement by custom step', () => {
      fixture.componentRef.setInput('step', 3);
      component.count.set(10);
      fixture.detectChanges();
      
      component.decrement();
      
      expect(component.count()).toBe(7);
    });
  });

  // ============================================
  //  SECTION 8: Output Event Tests
  // ============================================
  describe('Output Events', () => {
    it('should emit valueChanged on increment', () => {
      const spy = vi.fn();
      component.valueChanged.subscribe(spy);
      
      component.increment();
      
      expect(spy).toHaveBeenCalledWith(1);
    });

    it('should emit valueChanged on decrement', () => {
      component.count.set(5);
      const spy = vi.fn();
      component.valueChanged.subscribe(spy);
      
      component.decrement();
      
      expect(spy).toHaveBeenCalledWith(4);
    });

    it('should emit valueChanged on reset', () => {
      component.count.set(10);
      const spy = vi.fn();
      component.valueChanged.subscribe(spy);
      
      component.reset();
      
      expect(spy).toHaveBeenCalledWith(0);
    });

    it('should emit valueChanged on addCustomAmount', () => {
      component.customAmount.set(7);
      const spy = vi.fn();
      component.valueChanged.subscribe(spy);
      
      component.addCustomAmount();
      
      expect(spy).toHaveBeenCalledWith(7);
    });

    it('should emit correct sequence of values', () => {
      const emittedValues: number[] = [];
      component.valueChanged.subscribe(v => emittedValues.push(v));
      
      component.increment();  // 1
      component.increment();  // 2
      component.decrement();  // 1
      
      expect(emittedValues).toEqual([1, 2, 1]);
    });
  });
});
