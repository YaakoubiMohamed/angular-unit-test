import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InteractiveTestRunnerComponent, InteractiveTest } from '../../../shared/components/interactive-test-runner/interactive-test-runner.component';

// Inline service for demo purposes (same as the real CalculatorService)
class CalculatorService {
  add(a: number, b: number): number { 
    return a + b; 
  }
  
  subtract(a: number, b: number): number { 
    return a - b; 
  }
  
  multiply(a: number, b: number): number { 
    return a * b; 
  }
  
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }
}

interface TestScenario {
  id: string;
  name: string;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  a: number;
  b: number;
  expected: number | 'error';
}

@Component({
  selector: 'app-calculator-playground',
  imports: [FormsModule, InteractiveTestRunnerComponent],
  template: `
    <div class="playground">
      <div class="playground-header">
        <h3>Playground Calculator Service</h3>
        <p>Testez le service en temps réel et créez vos propres cas de test !</p>
      </div>

      <!-- Live Calculator -->
      <div class="live-section">
        <h4>Calculatrice Live</h4>
        <div class="calculator-inputs">
          <input 
            type="number" 
            [(ngModel)]="inputA" 
            placeholder="Nombre A"
            class="input-number" />
          <select [(ngModel)]="operation" class="input-select">
            <option value="add">+ Addition</option>
            <option value="subtract">- Soustraction</option>
            <option value="multiply">× Multiplication</option>
            <option value="divide">÷ Division</option>
          </select>
          <input 
            type="number" 
            [(ngModel)]="inputB" 
            placeholder="Nombre B"
            class="input-number" />
          <button class="btn-calculate" (click)="calculate()">= Calculer</button>
        </div>

        @if (result() !== null) {
          <div class="result-display" [class.error]="isError()">
            <span class="result-label">Résultat :</span>
            <span class="result-value">{{ result() }}</span>
          </div>
        }
      </div>

      <!-- Pre-built Test Scenarios -->
      <div class="scenarios-section">
        <h4>Scénarios de Test (Cliquez pour exécuter)</h4>
        <div class="scenarios-grid">
          @for (scenario of testScenarios; track scenario.id) {
            <div 
              class="scenario-card"
              [class.passed]="scenarioResults()[scenario.id] === 'passed'"
              [class.failed]="scenarioResults()[scenario.id] === 'failed'"
              (click)="runScenario(scenario)">
              <div class="scenario-name">{{ scenario.name }}</div>
              <div class="scenario-details">
                <code>{{ scenario.a }} {{ getOperatorSymbol(scenario.operation) }} {{ scenario.b }}</code>
                <span class="expected">= {{ scenario.expected }}</span>
              </div>
              @if (scenarioResults()[scenario.id]) {
                <div class="scenario-result" [class.pass]="scenarioResults()[scenario.id] === 'passed'">
                  {{ scenarioResults()[scenario.id] === 'passed' ? 'PASS' : 'FAIL' }}
                </div>
              }
            </div>
          }
        </div>
        <button class="btn-run-all-scenarios" (click)="runAllScenarios()">
          Exécuter Tous les Scénarios
        </button>
      </div>

      <!-- Write Your Own Test -->
      <div class="custom-test-section">
        <h4>Créez Votre Propre Test</h4>
        <div class="custom-test-form">
          <div class="form-row">
            <label>Nom du test :</label>
            <input type="text" [(ngModel)]="customTestName" placeholder="devrait..." />
          </div>
          <div class="form-group">
            <div class="form-row">
              <label>Nombre A :</label>
              <input type="number" [(ngModel)]="customA" />
            </div>
            <div class="form-row">
              <label>Opération :</label>
              <select [(ngModel)]="customOperation">
                <option value="add">add</option>
                <option value="subtract">subtract</option>
                <option value="multiply">multiply</option>
                <option value="divide">divide</option>
              </select>
            </div>
            <div class="form-row">
              <label>Nombre B :</label>
              <input type="number" [(ngModel)]="customB" />
            </div>
            <div class="form-row">
              <label>Attendu :</label>
              <input type="text" [(ngModel)]="customExpected" placeholder="42 ou 'error'" />
            </div>
          </div>
          <button class="btn-run-custom" (click)="runCustomTest()">Exécuter Mon Test</button>
        </div>

        @if (customTestResult()) {
          <div class="custom-result" [class.passed]="customTestResult()?.passed">
            <h5>{{ customTestResult()?.passed ? 'Test Réussi !' : 'Test Échoué' }}</h5>
            <pre>{{ customTestResult()?.details }}</pre>
          </div>
        }
      </div>

      <!-- Generated Test Code -->
      <div class="code-output">
        <h4>Code de Test Généré (Vitest)</h4>
        <pre><code>{{ generatedTestCode() }}</code></pre>
        <button class="btn-copy" (click)="copyCode()">
          {{ copied() ? 'Copié !' : 'Copier le Code' }}
        </button>
      </div>

      <!-- Interactive Test Runner with predefined tests -->
      <div class="runner-section">
        <h4>Exécuteur de Tests Interactif</h4>
        <app-interactive-test-runner
          title="Tests CalculatorService"
          [tests]="interactiveTests" />
      </div>
    </div>
  `,
  styles: [`
    .playground {
      background: var(--bg-secondary, #1a1a2e);
      border: 1px solid var(--border-color, #2d2d44);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .playground-header {
      text-align: center;
      margin-bottom: 1.5rem;
      
      h3 { 
        margin: 0 0 0.5rem; 
        font-size: 1.5rem;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      p { 
        margin: 0; 
        color: var(--text-muted, #6b7280); 
      }
    }

    .live-section, .scenarios-section, .custom-test-section, .code-output, .runner-section {
      background: var(--bg-primary, #0f0f1a);
      border: 1px solid var(--border-color, #2d2d44);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1rem;

      h4 { 
        margin: 0 0 1rem; 
        font-size: 1rem;
        color: var(--text-primary, #fff);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }

    .calculator-inputs {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .input-number, .input-select {
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--border-color, #2d2d44);
      border-radius: 8px;
      font-size: 1rem;
      background: var(--bg-secondary, #1a1a2e);
      color: var(--text-primary, #fff);
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: var(--primary-color, #6366f1);
      }
    }

    .input-number { 
      width: 120px; 
    }

    .btn-calculate, .btn-run-custom, .btn-copy, .btn-run-all-scenarios {
      padding: 0.6rem 1.25rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;

      &:hover { 
        filter: brightness(1.1); 
        transform: translateY(-1px);
      }
    }

    .btn-run-all-scenarios {
      margin-top: 1rem;
      width: 100%;
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .result-display {
      margin-top: 1rem;
      padding: 1rem 1.25rem;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 0.75rem;

      &.error { 
        background: linear-gradient(135deg, #ef4444, #dc2626); 
      }

      .result-label {
        font-weight: 500;
        opacity: 0.9;
      }

      .result-value {
        font-size: 1.75rem;
        font-weight: bold;
        font-family: 'JetBrains Mono', monospace;
      }
    }

    .scenarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.75rem;
    }

    .scenario-card {
      background: var(--bg-secondary, #1a1a2e);
      border: 2px solid var(--border-color, #2d2d44);
      border-radius: 10px;
      padding: 0.875rem 1rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover { 
        border-color: var(--primary-color, #6366f1); 
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
      }
      
      &.passed { 
        border-color: #10b981; 
        background: rgba(16, 185, 129, 0.08); 
      }
      
      &.failed { 
        border-color: #ef4444; 
        background: rgba(239, 68, 68, 0.08); 
      }

      .scenario-name { 
        font-weight: 600; 
        margin-bottom: 0.5rem;
        color: var(--text-primary, #fff);
      }
      
      .scenario-details {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        
        code { 
          background: rgba(99, 102, 241, 0.15); 
          padding: 0.2rem 0.5rem; 
          border-radius: 4px;
          color: #a78bfa;
        }
        
        .expected { 
          color: var(--text-muted, #6b7280); 
          margin-left: 0.5rem; 
        }
      }
      
      .scenario-result {
        margin-top: 0.5rem;
        font-weight: 600;
        font-size: 0.8rem;
        color: #ef4444;

        &.pass { color: #10b981; }
      }
    }

    .custom-test-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .form-group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 0.75rem;
      }

      .form-row {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;

        label { 
          font-weight: 500; 
          font-size: 0.85rem;
          color: var(--text-secondary, #a0a0b0);
        }
        
        input, select { 
          padding: 0.5rem 0.75rem; 
          border: 1px solid var(--border-color, #2d2d44); 
          border-radius: 6px;
          background: var(--bg-secondary, #1a1a2e);
          color: var(--text-primary, #fff);
          font-size: 0.9rem;

          &:focus {
            outline: none;
            border-color: var(--primary-color, #6366f1);
          }
        }
      }
    }

    .custom-result {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 10px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);

      &.passed {
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.3);
      }

      h5 { 
        margin: 0 0 0.5rem;
        color: #ef4444;
      }
      
      &.passed h5 { color: #10b981; }
      
      pre { 
        margin: 0; 
        font-size: 0.85rem; 
        white-space: pre-wrap;
        color: var(--text-secondary, #a0a0b0);
        font-family: 'JetBrains Mono', monospace;
      }
    }

    .code-output {
      pre {
        background: #0d1117;
        padding: 1rem;
        border-radius: 8px;
        overflow-x: visible;
        overflow-wrap: break-word;
        white-space: pre-wrap;
        font-size: 0.85rem;
        margin: 0 0 0.75rem;
        border: 1px solid var(--border-color, #2d2d44);
        
        code {
          color: #e6edf3;
          font-family: 'JetBrains Mono', monospace;
        }
      }
    }

    .btn-copy {
      background: var(--bg-secondary, #1a1a2e);
      border: 1px solid var(--border-color, #2d2d44);
      color: var(--text-primary, #fff);

      &:hover {
        background: var(--bg-tertiary, #16162a);
        border-color: var(--primary-color, #6366f1);
      }
    }

    .runner-section {
      margin-bottom: 0;
    }
  `]
})
export class CalculatorPlaygroundComponent {
  private calculator = new CalculatorService();

  // Live calculator
  inputA = 10;
  inputB = 5;
  operation: 'add' | 'subtract' | 'multiply' | 'divide' = 'add';
  result = signal<string | null>(null);
  isError = signal(false);
  copied = signal(false);

  // Test scenarios
  scenarioResults = signal<Record<string, 'passed' | 'failed'>>({});

  testScenarios: TestScenario[] = [
    { id: '1', name: 'Addition basique', operation: 'add', a: 2, b: 3, expected: 5 },
    { id: '2', name: 'Nombres négatifs', operation: 'add', a: -5, b: 3, expected: -2 },
    { id: '3', name: 'Multiplication par zéro', operation: 'multiply', a: 100, b: 0, expected: 0 },
    { id: '4', name: 'Division normale', operation: 'divide', a: 10, b: 2, expected: 5 },
    { id: '5', name: 'Division par zéro', operation: 'divide', a: 10, b: 0, expected: 'error' },
    { id: '6', name: 'Soustraction', operation: 'subtract', a: 10, b: 3, expected: 7 },
    { id: '7', name: 'Grands nombres', operation: 'multiply', a: 1000, b: 1000, expected: 1000000 },
    { id: '8', name: 'Décimaux', operation: 'add', a: 0.1, b: 0.2, expected: 0.3 },
  ];

  // Custom test
  customTestName = 'devrait additionner correctement';
  customA = 5;
  customB = 3;
  customOperation: 'add' | 'subtract' | 'multiply' | 'divide' = 'add';
  customExpected = '8';
  customTestResult = signal<{ passed: boolean; details: string } | null>(null);

  // Interactive tests for the runner component
  interactiveTests: InteractiveTest[] = [
    {
      name: 'add(2, 3) devrait retourner 5',
      description: 'Test d\'addition simple',
      testFn: () => {
        const actual = this.calculator.add(2, 3);
        return { expected: 5, actual, passed: actual === 5 };
      }
    },
    {
      name: 'subtract(10, 4) devrait retourner 6',
      description: 'Test de soustraction',
      testFn: () => {
        const actual = this.calculator.subtract(10, 4);
        return { expected: 6, actual, passed: actual === 6 };
      }
    },
    {
      name: 'multiply(3, 4) devrait retourner 12',
      description: 'Test de multiplication',
      testFn: () => {
        const actual = this.calculator.multiply(3, 4);
        return { expected: 12, actual, passed: actual === 12 };
      }
    },
    {
      name: '❌ add(0.1, 0.2) devrait retourner 0.3',
      description: '⚠️ ÉCHEC ATTENDU : En JavaScript, 0.1 + 0.2 = 0.30000000000000004 à cause de la représentation en virgule flottante IEEE 754. Ce test montre pourquoi il faut utiliser une tolérance (toBeCloseTo) pour comparer les nombres décimaux !',
      testFn: () => {
        const actual = this.calculator.add(0.1, 0.2);
        // This will FAIL because 0.1 + 0.2 !== 0.3 in JavaScript (floating point precision)
        return { expected: 0.3, actual, passed: actual === 0.3 };
      }
    },
    {
      name: 'divide(15, 3) devrait retourner 5',
      description: 'Test de division',
      testFn: () => {
        const actual = this.calculator.divide(15, 3);
        return { expected: 5, actual, passed: actual === 5 };
      }
    },
    {
      name: 'add(-5, -3) devrait retourner -8',
      description: 'Addition de nombres négatifs',
      testFn: () => {
        const actual = this.calculator.add(-5, -3);
        return { expected: -8, actual, passed: actual === -8 };
      }
    },
    {
      name: 'multiply(5, 0) devrait retourner 0',
      description: 'Multiplication par zéro',
      testFn: () => {
        const actual = this.calculator.multiply(5, 0);
        return { expected: 0, actual, passed: actual === 0 };
      }
    },
    {
      name: 'divide(10, 0) devrait lancer une erreur',
      description: 'Division par zéro - gestion d\'erreur',
      testFn: () => {
        try {
          this.calculator.divide(10, 0);
          return { expected: 'Error thrown', actual: 'No error', passed: false };
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return { 
            expected: 'Cannot divide by zero', 
            actual: msg, 
            passed: msg.includes('Cannot divide by zero') 
          };
        }
      }
    },
  ];

  calculate(): void {
    try {
      let res: number;
      switch (this.operation) {
        case 'add': res = this.calculator.add(this.inputA, this.inputB); break;
        case 'subtract': res = this.calculator.subtract(this.inputA, this.inputB); break;
        case 'multiply': res = this.calculator.multiply(this.inputA, this.inputB); break;
        case 'divide': res = this.calculator.divide(this.inputA, this.inputB); break;
      }
      this.result.set(String(res));
      this.isError.set(false);
    } catch (e) {
      this.result.set(e instanceof Error ? e.message : 'Error');
      this.isError.set(true);
    }
  }

  runScenario(scenario: TestScenario): void {
    try {
      let actual: number;
      switch (scenario.operation) {
        case 'add': actual = this.calculator.add(scenario.a, scenario.b); break;
        case 'subtract': actual = this.calculator.subtract(scenario.a, scenario.b); break;
        case 'multiply': actual = this.calculator.multiply(scenario.a, scenario.b); break;
        case 'divide': actual = this.calculator.divide(scenario.a, scenario.b); break;
      }

      // Handle floating point comparison
      let passed: boolean;
      if (typeof scenario.expected === 'number') {
        passed = Math.abs(actual - scenario.expected) < 0.0001;
      } else {
        passed = false; // Expected error but got result
      }
      
      this.scenarioResults.update(r => ({ ...r, [scenario.id]: passed ? 'passed' : 'failed' }));
    } catch {
      const passed = scenario.expected === 'error';
      this.scenarioResults.update(r => ({ ...r, [scenario.id]: passed ? 'passed' : 'failed' }));
    }
  }

  runAllScenarios(): void {
    this.scenarioResults.set({});
    this.testScenarios.forEach((scenario, i) => {
      setTimeout(() => this.runScenario(scenario), i * 150);
    });
  }

  runCustomTest(): void {
    try {
      let actual: number;
      switch (this.customOperation) {
        case 'add': actual = this.calculator.add(this.customA, this.customB); break;
        case 'subtract': actual = this.calculator.subtract(this.customA, this.customB); break;
        case 'multiply': actual = this.calculator.multiply(this.customA, this.customB); break;
        case 'divide': actual = this.calculator.divide(this.customA, this.customB); break;
      }

      const expectsError = this.customExpected.toLowerCase() === 'error';
      if (expectsError) {
        this.customTestResult.set({
          passed: false,
          details: `Attendu : Erreur\nObtenu : ${actual}\n\n✗ Le test attendait une erreur mais a reçu une valeur`
        });
        return;
      }

      const expected = Number(this.customExpected);
      const passed = Math.abs(actual - expected) < 0.0001;

      this.customTestResult.set({
        passed,
        details: `Attendu : ${expected}\nObtenu : ${actual}\n\n${passed ? '✓ L\'assertion a réussi !' : '✗ L\'assertion a échoué !'}`
      });
    } catch (e) {
      const expectsError = this.customExpected.toLowerCase() === 'error';
      const errorMsg = e instanceof Error ? e.message : String(e);
      
      this.customTestResult.set({
        passed: expectsError,
        details: `Attendu : ${this.customExpected}\nObtenu : Erreur - "${errorMsg}"\n\n${expectsError ? '✓ L\'erreur était attendue !' : '✗ Erreur inattendue !'}`
      });
    }
  }

  getOperatorSymbol(op: string): string {
    const symbols: Record<string, string> = { 
      add: '+', 
      subtract: '-', 
      multiply: '×', 
      divide: '÷' 
    };
    return symbols[op] ?? op;
  }

  generatedTestCode = computed(() => {
    const expectsError = this.customExpected.toLowerCase() === 'error';
    
    if (expectsError) {
      return `it('${this.customTestName}', () => {
  // Arrange
  const a = ${this.customA};
  const b = ${this.customB};

  // Act & Assert
  expect(() => service.${this.customOperation}(a, b)).toThrow();
});`;
    }

    return `it('${this.customTestName}', () => {
  // Arrange
  const a = ${this.customA};
  const b = ${this.customB};

  // Act
  const result = service.${this.customOperation}(a, b);

  // Assert
  expect(result).toBe(${this.customExpected});
});`;
  });

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.generatedTestCode());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
}
