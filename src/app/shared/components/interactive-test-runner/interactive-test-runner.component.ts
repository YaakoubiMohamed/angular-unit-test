import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssertionResult, formatValue } from '../../utils/browser-test-utils';

export interface InteractiveTest {
  name: string;
  description: string;
  testFn: () => { expected: unknown; actual: unknown; passed?: boolean };
}

interface TestResult {
  name: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  error?: string;
  executionTime: number;
}

@Component({
  selector: 'app-interactive-test-runner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-runner">
      <div class="runner-header">
        <h3>{{ title }}</h3>
        <div class="controls">
          <button class="btn-run-all" (click)="runAllTests()">
            Exécuter Tous
          </button>
          <button class="btn-reset" (click)="resetResults()">
            Réinitialiser
          </button>
        </div>
      </div>

      <div class="test-stats" *ngIf="hasResults()">
        <span class="stat pass">{{ passedCount() }} réussi(s)</span>
        <span class="stat fail">{{ failedCount() }} échoué(s)</span>
        <span class="stat time">{{ totalTime() }}ms</span>
      </div>

      <div class="tests-list">
        @for (test of tests; track test.name; let i = $index) {
          <div 
            class="test-item" 
            [class.passed]="results()[i]?.passed" 
            [class.failed]="results()[i]?.passed === false"
            [class.pending]="results()[i] === null">
            <div class="test-info">
              <div class="test-header-row">
                <span class="test-status">
                  @if (results()[i]?.passed === true) {
                    PASS
                  } @else if (results()[i]?.passed === false) {
                    FAIL
                  } @else {
                    -
                  }
                </span>
                <span class="test-name">{{ test.name }}</span>
              </div>
              <span class="test-desc">{{ test.description }}</span>
            </div>
            <div class="test-actions">
              <button class="btn-run" (click)="runSingleTest(i); $event.stopPropagation()">
                Run
              </button>
            </div>
            @if (results()[i]; as result) {
              <div class="test-result animate-slide-down">
                <div class="result-row">
                  <span class="label">Attendu :</span>
                  <code class="expected">{{ formatResultValue(result.expected) }}</code>
                </div>
                <div class="result-row">
                  <span class="label">Obtenu :</span>
                  <code [class.error]="!result.passed" [class.success]="result.passed">
                    {{ formatResultValue(result.actual) }}
                  </code>
                </div>
                @if (result.error) {
                  <div class="error-message">{{ result.error }}</div>
                }
                <div class="execution-time">Exécuté en {{ result.executionTime }}ms</div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .test-runner {
      background: var(--bg-secondary, #1a1a2e);
      border: 1px solid var(--border-color, #2d2d44);
      border-radius: 12px;
      overflow: hidden;
    }

    .runner-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: var(--bg-tertiary, #16162a);
      border-bottom: 1px solid var(--border-color, #2d2d44);

      h3 { 
        margin: 0; 
        font-size: 1rem;
        color: var(--text-primary, #fff);
      }
    }

    .controls {
      display: flex;
      gap: 0.5rem;
    }

    .btn-run-all, .btn-reset, .btn-run {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .btn-run-all {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      &:hover { filter: brightness(1.1); transform: translateY(-1px); }
    }

    .btn-reset {
      background: var(--bg-secondary, #1a1a2e);
      border: 1px solid var(--border-color, #2d2d44);
      color: var(--text-secondary, #a0a0b0);
      &:hover { 
        background: var(--bg-tertiary, #16162a); 
        border-color: var(--primary-color, #6366f1);
      }
    }

    .btn-run {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white;
      font-size: 0.75rem;
      padding: 0.35rem 0.75rem;
      &:hover { filter: brightness(1.1); }
    }

    .test-stats {
      display: flex;
      gap: 1.5rem;
      padding: 0.75rem 1.25rem;
      background: var(--bg-primary, #0f0f1a);
      border-bottom: 1px solid var(--border-color, #2d2d44);

      .stat {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.875rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.25rem;

        &.pass { color: #10b981; }
        &.fail { color: #ef4444; }
        &.time { color: var(--text-muted, #6b7280); }
      }
    }

    .tests-list {
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .test-item {
      background: var(--bg-primary, #0f0f1a);
      border: 2px solid var(--border-color, #2d2d44);
      border-radius: 10px;
      padding: 0.875rem 1rem;
      transition: all 0.2s;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 0.75rem;

      &:hover {
        border-color: var(--primary-color, #6366f1);
      }

      &.passed {
        border-left: 4px solid #10b981;
        background: rgba(16, 185, 129, 0.05);
      }

      &.failed {
        border-left: 4px solid #ef4444;
        background: rgba(239, 68, 68, 0.05);
      }
    }

    .test-info {
      flex: 1;
      min-width: 200px;
    }

    .test-header-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .test-status {
      font-weight: bold;
      font-size: 1rem;
    }

    .test-item.passed .test-status { color: #10b981; }
    .test-item.failed .test-status { color: #ef4444; }
    .test-item.pending .test-status { color: var(--text-muted, #6b7280); }

    .test-name { 
      font-weight: 600; 
      color: var(--text-primary, #fff);
    }
    
    .test-desc { 
      font-size: 0.8rem; 
      color: var(--text-muted, #6b7280);
      display: block;
    }

    .test-actions {
      flex-shrink: 0;
    }

    .test-result {
      width: 100%;
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px dashed var(--border-color, #2d2d44);
    }

    .result-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.35rem;

      .label {
        font-size: 0.8rem;
        color: var(--text-muted, #6b7280);
        min-width: 70px;
        font-weight: 500;
      }

      code {
        background: rgba(99, 102, 241, 0.1);
        padding: 0.25rem 0.6rem;
        border-radius: 6px;
        font-size: 0.85rem;
        font-family: 'JetBrains Mono', monospace;
        color: var(--text-primary, #fff);

        &.error { 
          color: #ef4444; 
          background: rgba(239, 68, 68, 0.1);
        }
        &.success { 
          color: #10b981; 
          background: rgba(16, 185, 129, 0.1);
        }
      }
    }

    .error-message {
      margin-top: 0.5rem;
      padding: 0.6rem 0.75rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 6px;
      color: #ef4444;
      font-size: 0.85rem;
    }

    .execution-time {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-muted, #6b7280);
    }

    .animate-slide-down {
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class InteractiveTestRunnerComponent {
  @Input() title = 'Interactive Test Runner';
  @Input() tests: InteractiveTest[] = [];
  
  results = signal<(TestResult | null)[]>([]);

  hasResults = computed(() => this.results().some(r => r !== null));
  passedCount = computed(() => this.results().filter(r => r?.passed).length);
  failedCount = computed(() => this.results().filter(r => r?.passed === false).length);
  totalTime = computed(() => 
    Math.round(this.results().reduce((sum, r) => sum + (r?.executionTime ?? 0), 0) * 100) / 100
  );

  runSingleTest(index: number): void {
    const test = this.tests[index];
    if (!test) return;
    
    const start = performance.now();

    try {
      const { expected, actual, passed } = test.testFn();
      const isPassed = passed !== undefined 
        ? passed 
        : JSON.stringify(expected) === JSON.stringify(actual);

      const newResults = [...this.results()];
      // Ensure array is long enough
      while (newResults.length <= index) {
        newResults.push(null);
      }
      
      newResults[index] = {
        name: test.name,
        passed: isPassed,
        expected,
        actual,
        executionTime: Math.round((performance.now() - start) * 100) / 100
      };
      this.results.set(newResults);
    } catch (error) {
      const newResults = [...this.results()];
      while (newResults.length <= index) {
        newResults.push(null);
      }
      
      newResults[index] = {
        name: test.name,
        passed: false,
        expected: 'No error',
        actual: 'Error thrown',
        error: error instanceof Error ? error.message : String(error),
        executionTime: Math.round((performance.now() - start) * 100) / 100
      };
      this.results.set(newResults);
    }
  }

  runAllTests(): void {
    // Reset first
    this.results.set([]);
    // Run each test with a small delay for visual effect
    this.tests.forEach((_, i) => {
      setTimeout(() => this.runSingleTest(i), i * 100);
    });
  }

  resetResults(): void {
    this.results.set([]);
  }

  formatResultValue(value: unknown): string {
    return formatValue(value);
  }
}
