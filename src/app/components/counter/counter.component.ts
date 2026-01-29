import { Component, signal, computed, input, output, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  template: `
    <div class="counter-container">
      <h2 data-testid="title">Counter: {{ count() }}</h2>
      
      <div class="buttons">
        <button 
          data-testid="decrement-btn"
          (click)="decrement()" 
          [disabled]="count() <= 0">
          - Decrease
        </button>
        
        <button 
          data-testid="increment-btn"
          (click)="increment()">
          + Increase
        </button>
        
        <button 
          data-testid="reset-btn"
          (click)="reset()">
          Reset
        </button>
      </div>
      
      <p data-testid="status" [class]="statusClass()">
        {{ statusMessage() }}
      </p>
      
      <div class="input-section">
        <input 
          data-testid="amount-input"
          type="number" 
          [value]="customAmount()"
          (input)="updateAmount($event)"
          min="1" 
          max="100"
          placeholder="Enter amount">
        <button 
          data-testid="add-amount-btn"
          (click)="addCustomAmount()">
          Add Amount
        </button>
      </div>
    </div>
  `,
  styles: [`
    .counter-container { padding: 20px; text-align: center; }
    .buttons { display: flex; gap: 10px; justify-content: center; margin: 20px 0; }
    button { padding: 10px 20px; cursor: pointer; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .status-low { color: red; }
    .status-medium { color: orange; }
    .status-high { color: green; }
    .input-section { margin-top: 20px; }
    input { padding: 8px; margin-right: 10px; width: 120px; }
  `]
})
export class CounterComponent {
  // Inputs - modern signal-based
  initialValue = input(0);
  step = input(1);
  
  // Outputs - modern signal-based
  valueChanged = output<number>();
  
  count = signal(0);
  customAmount = signal(1);
  
  constructor() {
    // Initialize count from input
    effect(() => {
      this.count.set(this.initialValue());
    });
  }

  statusMessage = computed(() => {
    const value = this.count();
    if (value === 0) return 'Counter is at zero';
    if (value < 5) return 'Counter is low';
    if (value < 10) return 'Counter is medium';
    return 'Counter is high!';
  });

  statusClass = computed(() => {
    const value = this.count();
    if (value < 5) return 'status-low';
    if (value < 10) return 'status-medium';
    return 'status-high';
  });

  increment(): void {
    this.count.update(v => v + this.step());
    this.valueChanged.emit(this.count());
  }

  decrement(): void {
    if (this.count() > 0) {
      this.count.update(v => v - this.step());
      this.valueChanged.emit(this.count());
    }
  }

  reset(): void {
    this.count.set(this.initialValue());
    this.valueChanged.emit(this.count());
  }

  updateAmount(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(value) && value > 0) {
      this.customAmount.set(value);
    }
  }

  addCustomAmount(): void {
    this.count.update(v => v + this.customAmount());
    this.valueChanged.emit(this.count());
  }
}
