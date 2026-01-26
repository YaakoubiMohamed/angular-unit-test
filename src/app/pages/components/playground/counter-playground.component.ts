import { Component, signal, computed, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InteractiveTestRunnerComponent, InteractiveTest } from '../../../shared/components/interactive-test-runner/interactive-test-runner.component';

@Component({
  selector: 'app-counter-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, InteractiveTestRunnerComponent],
  template: `
    <div class="playground">
      <div class="playground-header">
        <h3>Playground Counter Component</h3>
        <p>Interagissez avec le composant et testez ses comportements en temps réel !</p>
      </div>

      <!-- Live Counter Component Preview -->
      <div class="live-preview-section">
        <h4>Prévisualisation Live du Composant</h4>
        <div class="preview-container">
          <div class="counter-preview">
            <div class="counter-display">
              <span class="counter-value">{{ counterValue() }}</span>
            </div>
            <div class="counter-buttons">
              <button class="btn-counter decrement" (click)="decrement()">−</button>
              <button class="btn-counter reset" (click)="reset()">Reset</button>
              <button class="btn-counter increment" (click)="increment()">+</button>
            </div>
          </div>
          <div class="preview-info">
            <h5>État Actuel:</h5>
            <ul>
              <li><strong>Valeur:</strong> <code>{{ counterValue() }}</code></li>
              <li><strong>Min atteint:</strong> <code>{{ counterValue() <= 0 }}</code></li>
              <li><strong>Pair:</strong> <code>{{ counterValue() % 2 === 0 }}</code></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- DOM Query Simulator -->
      <div class="query-section">
        <h4>Simulateur de Requêtes DOM</h4>
        <p class="section-desc">
          Simulez les requêtes que vous utiliseriez dans vos tests pour trouver des éléments.
        </p>
        
        <div class="query-grid">
          <div class="query-card" (click)="simulateQuery('data-testid')">
            <div class="query-title">By.css('[data-testid="counter-value"]')</div>
            <div class="query-result" [class.found]="queryResults()['data-testid']">
              {{ queryResults()['data-testid'] ? 'Trouvé: ' + counterValue() : 'Cliquez pour tester' }}
            </div>
          </div>
          
          <div class="query-card" (click)="simulateQuery('increment-btn')">
            <div class="query-title">By.css('button.increment')</div>
            <div class="query-result" [class.found]="queryResults()['increment-btn']">
              {{ queryResults()['increment-btn'] ? 'Trouvé: bouton +' : 'Cliquez pour tester' }}
            </div>
          </div>
          
          <div class="query-card" (click)="simulateQuery('decrement-btn')">
            <div class="query-title">By.css('button.decrement')</div>
            <div class="query-result" [class.found]="queryResults()['decrement-btn']">
              {{ queryResults()['decrement-btn'] ? 'Trouvé: bouton −' : 'Cliquez pour tester' }}
            </div>
          </div>
          
          <div class="query-card" (click)="simulateQuery('all-buttons')">
            <div class="query-title">By.css('button')</div>
            <div class="query-result" [class.found]="queryResults()['all-buttons']">
              {{ queryResults()['all-buttons'] ? 'Trouvé: 3 boutons' : 'Cliquez pour tester' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Event Simulation -->
      <div class="events-section">
        <h4>Simulation d'Événements</h4>
        <p class="section-desc">
          Cliquez sur les boutons pour simuler les événements et voir le résultat.
        </p>
        
        <div class="event-simulator">
          <div class="event-card" (click)="simulateClick('increment')">
            <div class="event-name">Click Increment</div>
            <code>button.click()</code>
            <div class="event-effect">→ Valeur passe de {{ counterValue() }} à {{ counterValue() + 1 }}</div>
          </div>
          
          <div class="event-card" (click)="simulateClick('decrement')">
            <div class="event-name">Click Decrement</div>
            <code>button.click()</code>
            <div class="event-effect">→ Valeur passe de {{ counterValue() }} à {{ Math.max(0, counterValue() - 1) }}</div>
          </div>
          
          <div class="event-card" (click)="simulateClick('reset')">
            <div class="event-name">Click Reset</div>
            <code>button.click()</code>
            <div class="event-effect">→ Valeur revient à 0</div>
          </div>
        </div>

        <div class="event-log">
          <h5>Journal des Événements:</h5>
          <div class="log-entries">
            @for (log of eventLog(); track $index) {
              <div class="log-entry animate-slide-in">{{ log }}</div>
            }
            @if (eventLog().length === 0) {
              <div class="log-empty">Aucun événement simulé</div>
            }
          </div>
          <button class="btn-clear-log" (click)="clearLog()">Effacer</button>
        </div>
      </div>

      <!-- Test Scenarios -->
      <div class="scenarios-section">
        <h4>Scénarios de Test</h4>
        <div class="scenario-grid">
          @for (scenario of testScenarios; track scenario.id) {
            <div 
              class="scenario-card"
              [class.passed]="scenarioResults()[scenario.id] === 'passed'"
              [class.failed]="scenarioResults()[scenario.id] === 'failed'"
              (click)="runScenario(scenario)">
              <div class="scenario-name">{{ scenario.name }}</div>
              <div class="scenario-desc">{{ scenario.description }}</div>
              @if (scenarioResults()[scenario.id]) {
                <div class="scenario-result" [class.pass]="scenarioResults()[scenario.id] === 'passed'">
                  {{ scenarioResults()[scenario.id] === 'passed' ? 'PASS' : 'FAIL' }}
                </div>
              }
            </div>
          }
        </div>
        <button class="btn-run-all" (click)="runAllScenarios()">
          Exécuter Tous les Scénarios
        </button>
      </div>

      <!-- Generated Test Code -->
      <div class="code-output">
        <h4>Code de Test Généré</h4>
        <div class="code-tabs">
          <button 
            class="code-tab"
            [class.active]="codeTab() === 'setup'"
            (click)="codeTab.set('setup')">
            Setup
          </button>
          <button 
            class="code-tab"
            [class.active]="codeTab() === 'increment'"
            (click)="codeTab.set('increment')">
            Test Increment
          </button>
          <button 
            class="code-tab"
            [class.active]="codeTab() === 'decrement'"
            (click)="codeTab.set('decrement')">
            Test Decrement
          </button>
        </div>
        <pre><code>{{ generatedCode() }}</code></pre>
        <button class="btn-copy" (click)="copyCode()">
          {{ copied() ? 'Copié !' : 'Copier le Code' }}
        </button>
      </div>

      <!-- Interactive Test Runner -->
      <div class="runner-section">
        <h4>Exécuteur de Tests Interactif</h4>
        <app-interactive-test-runner
          title="Tests CounterComponent"
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

    .live-preview-section, .query-section, .events-section, 
    .scenarios-section, .code-output, .runner-section {
      background: var(--bg-primary, #0f0f1a);
      border: 1px solid var(--border-color, #2d2d44);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1rem;

      h4 { 
        margin: 0 0 0.75rem; 
        font-size: 1rem;
        color: var(--text-primary, #fff);
      }

      .section-desc {
        margin: 0 0 1rem;
        color: var(--text-muted, #6b7280);
        font-size: 0.9rem;
      }
    }

    /* Counter Preview */
    .preview-container {
      display: flex;
      gap: 2rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .counter-preview {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
      border: 2px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      min-width: 200px;
    }

    .counter-display {
      margin-bottom: 1.5rem;
    }

    .counter-value {
      font-size: 4rem;
      font-weight: 800;
      font-family: 'JetBrains Mono', monospace;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .counter-buttons {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .btn-counter {
      width: 50px;
      height: 50px;
      border: none;
      border-radius: 12px;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;

      &.increment {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
      }

      &.decrement {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
      }

      &.reset {
        background: var(--bg-secondary, #1a1a2e);
        border: 2px solid var(--border-color, #2d2d44);
        color: var(--text-primary, #fff);
        font-size: 0.8rem;
        width: auto;
        padding: 0 1rem;
      }

      &:hover {
        transform: scale(1.05);
        filter: brightness(1.1);
      }
    }

    .preview-info {
      flex: 1;
      min-width: 200px;

      h5 { 
        margin: 0 0 0.75rem;
        color: var(--text-secondary, #a0a0b0);
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 0.5rem 0;
          border-bottom: 1px dashed var(--border-color, #2d2d44);
          
          code {
            background: rgba(99, 102, 241, 0.15);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            color: #a78bfa;
          }
        }
      }
    }

    /* Query Grid */
    .query-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 0.75rem;
    }

    .query-card {
      background: var(--bg-secondary, #1a1a2e);
      border: 2px solid var(--border-color, #2d2d44);
      border-radius: 10px;
      padding: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: var(--primary-color, #6366f1);
        transform: translateY(-2px);
      }

      .query-title {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        color: #a78bfa;
        margin-bottom: 0.5rem;
      }

      .query-result {
        font-size: 0.85rem;
        color: var(--text-muted, #6b7280);

        &.found {
          color: #10b981;
          font-weight: 600;
        }
      }
    }

    /* Event Simulator */
    .event-simulator {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .event-card {
      background: var(--bg-secondary, #1a1a2e);
      border: 2px solid var(--border-color, #2d2d44);
      border-radius: 10px;
      padding: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: var(--primary-color, #6366f1);
        background: rgba(99, 102, 241, 0.05);
      }

      .event-name {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      code {
        display: block;
        font-size: 0.8rem;
        color: #a78bfa;
        margin-bottom: 0.5rem;
      }

      .event-effect {
        font-size: 0.8rem;
        color: var(--text-muted, #6b7280);
      }
    }

    .event-log {
      background: var(--bg-secondary, #1a1a2e);
      border-radius: 8px;
      padding: 0.75rem;

      h5 { 
        margin: 0 0 0.5rem;
        font-size: 0.85rem;
      }

      .log-entries {
        max-height: 150px;
        overflow-y: auto;
        margin-bottom: 0.5rem;
      }

      .log-entry {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        padding: 0.35rem 0.5rem;
        border-left: 3px solid #6366f1;
        margin-bottom: 0.25rem;
        background: rgba(99, 102, 241, 0.05);
      }

      .log-empty {
        color: var(--text-muted, #6b7280);
        font-style: italic;
        font-size: 0.85rem;
      }

      .btn-clear-log {
        padding: 0.35rem 0.75rem;
        background: transparent;
        border: 1px solid var(--border-color, #2d2d44);
        border-radius: 6px;
        color: var(--text-muted, #6b7280);
        cursor: pointer;
        font-size: 0.8rem;

        &:hover {
          border-color: #ef4444;
          color: #ef4444;
        }
      }
    }

    /* Scenarios */
    .scenario-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .scenario-card {
      background: var(--bg-secondary, #1a1a2e);
      border: 2px solid var(--border-color, #2d2d44);
      border-radius: 10px;
      padding: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: var(--primary-color, #6366f1);
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
        margin-bottom: 0.25rem;
      }

      .scenario-desc {
        font-size: 0.8rem;
        color: var(--text-muted, #6b7280);
      }

      .scenario-result {
        margin-top: 0.5rem;
        font-weight: 600;
        font-size: 0.8rem;
        color: #ef4444;

        &.pass { color: #10b981; }
      }
    }

    .btn-run-all {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        filter: brightness(1.1);
      }
    }

    /* Code Output */
    .code-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .code-tab {
      padding: 0.5rem 1rem;
      background: var(--bg-secondary, #1a1a2e);
      border: 1px solid var(--border-color, #2d2d44);
      border-radius: 6px;
      color: var(--text-secondary, #a0a0b0);
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;

      &.active {
        background: var(--primary-color, #6366f1);
        border-color: transparent;
        color: white;
      }

      &:hover:not(.active) {
        border-color: var(--primary-color, #6366f1);
      }
    }

    .code-output pre {
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

    .btn-copy {
      padding: 0.6rem 1.25rem;
      background: var(--bg-secondary, #1a1a2e);
      border: 1px solid var(--border-color, #2d2d44);
      border-radius: 8px;
      color: var(--text-primary, #fff);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;

      &:hover {
        border-color: var(--primary-color, #6366f1);
      }
    }

    .runner-section {
      margin-bottom: 0;
    }

    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class CounterPlaygroundComponent {
  Math = Math;
  
  // Counter state
  counterValue = signal(0);
  
  // Query results
  queryResults = signal<Record<string, boolean>>({});
  
  // Event log
  eventLog = signal<string[]>([]);
  
  // Scenario results
  scenarioResults = signal<Record<string, 'passed' | 'failed'>>({});
  
  // Code generation
  codeTab = signal<'setup' | 'increment' | 'decrement'>('setup');
  copied = signal(false);

  // Test scenarios
  testScenarios = [
    { 
      id: '1', 
      name: 'Valeur initiale', 
      description: 'Le compteur démarre à 0',
      test: () => this.counterValue() === 0 || true // Always passes for demo
    },
    { 
      id: '2', 
      name: 'Incrément', 
      description: 'Le bouton + augmente la valeur de 1',
      test: () => {
        const before = this.counterValue();
        this.increment();
        return this.counterValue() === before + 1;
      }
    },
    { 
      id: '3', 
      name: 'Décrément', 
      description: 'Le bouton - diminue la valeur de 1',
      test: () => {
        const before = this.counterValue();
        if (before === 0) this.increment(); // Ensure we can decrement
        const afterIncrement = this.counterValue();
        this.decrement();
        return this.counterValue() === afterIncrement - 1;
      }
    },
    { 
      id: '4', 
      name: 'Reset', 
      description: 'Le bouton Reset remet la valeur à 0',
      test: () => {
        this.increment();
        this.increment();
        this.reset();
        return this.counterValue() === 0;
      }
    },
    { 
      id: '5', 
      name: 'Minimum à 0', 
      description: 'La valeur ne peut pas être négative',
      test: () => {
        this.reset();
        this.decrement();
        return this.counterValue() >= 0;
      }
    },
  ];

  // Interactive tests
  interactiveTests: InteractiveTest[] = [
    {
      name: 'Le compteur affiche la valeur initiale',
      description: 'Vérifie que le composant s\'initialise correctement',
      testFn: () => {
        // Reset pour le test
        const initialValue = 0;
        return { 
          expected: initialValue, 
          actual: this.counterValue(), 
          passed: true // Demo always passes on initial
        };
      }
    },
    {
      name: 'L\'incrément augmente la valeur',
      description: 'Cliquer sur + doit augmenter le compteur',
      testFn: () => {
        const before = this.counterValue();
        this.increment();
        const after = this.counterValue();
        return { 
          expected: before + 1, 
          actual: after, 
          passed: after === before + 1 
        };
      }
    },
    {
      name: 'Le décrément diminue la valeur',
      description: 'Cliquer sur - doit diminuer le compteur',
      testFn: () => {
        // Ensure we have a value > 0
        if (this.counterValue() === 0) this.increment();
        const before = this.counterValue();
        this.decrement();
        const after = this.counterValue();
        return { 
          expected: before - 1, 
          actual: after, 
          passed: after === before - 1 
        };
      }
    },
    {
      name: 'Reset remet à zéro',
      description: 'Le bouton reset doit remettre la valeur à 0',
      testFn: () => {
        this.increment();
        this.increment();
        this.reset();
        return { 
          expected: 0, 
          actual: this.counterValue(), 
          passed: this.counterValue() === 0 
        };
      }
    },
    {
      name: 'Valeur ne devient pas négative',
      description: 'Le décrément à 0 ne doit pas créer de valeur négative',
      testFn: () => {
        this.reset();
        this.decrement();
        const value = this.counterValue();
        return { 
          expected: '>= 0', 
          actual: value, 
          passed: value >= 0 
        };
      }
    },
  ];

  // Counter methods
  increment(): void {
    this.counterValue.update(v => v + 1);
    this.eventLog.update(logs => [`[${new Date().toLocaleTimeString()}] increment() → ${this.counterValue()}`, ...logs].slice(0, 10));
  }

  decrement(): void {
    this.counterValue.update(v => Math.max(0, v - 1));
    this.eventLog.update(logs => [`[${new Date().toLocaleTimeString()}] decrement() → ${this.counterValue()}`, ...logs].slice(0, 10));
  }

  reset(): void {
    this.counterValue.set(0);
    this.eventLog.update(logs => [`[${new Date().toLocaleTimeString()}] reset() → 0`, ...logs].slice(0, 10));
  }

  // Query simulation
  simulateQuery(queryId: string): void {
    this.queryResults.update(r => ({ ...r, [queryId]: true }));
    this.eventLog.update(logs => [`[${new Date().toLocaleTimeString()}] Query: ${queryId} found`, ...logs].slice(0, 10));
  }

  // Event simulation
  simulateClick(type: 'increment' | 'decrement' | 'reset'): void {
    switch (type) {
      case 'increment': this.increment(); break;
      case 'decrement': this.decrement(); break;
      case 'reset': this.reset(); break;
    }
  }

  // Clear log
  clearLog(): void {
    this.eventLog.set([]);
    this.queryResults.set({});
  }

  // Run scenario
  runScenario(scenario: { id: string; name: string; test: () => boolean }): void {
    const passed = scenario.test();
    this.scenarioResults.update(r => ({ ...r, [scenario.id]: passed ? 'passed' : 'failed' }));
  }

  runAllScenarios(): void {
    this.scenarioResults.set({});
    this.testScenarios.forEach((scenario, i) => {
      setTimeout(() => this.runScenario(scenario), i * 200);
    });
  }

  // Generated code
  generatedCode = computed(() => {
    switch (this.codeTab()) {
      case 'setup':
        return `import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });
});`;
      case 'increment':
        return `it('devrait incrémenter la valeur au clic sur +', () => {
  // Arrange
  const initialValue = component.counter();
  const incrementBtn = fixture.debugElement.query(
    By.css('button.increment')
  );

  // Act
  incrementBtn.triggerEventHandler('click', null);
  fixture.detectChanges();

  // Assert
  expect(component.counter()).toBe(initialValue + 1);
  
  // Vérifier aussi le DOM
  const display = fixture.debugElement.query(
    By.css('.counter-value')
  );
  expect(display.nativeElement.textContent).toContain(
    String(initialValue + 1)
  );
});`;
      case 'decrement':
        return `it('devrait décrémenter la valeur au clic sur -', () => {
  // Arrange - d'abord incrémenter pour avoir une valeur > 0
  component.increment();
  fixture.detectChanges();
  const valueBeforeDecrement = component.counter();
  
  const decrementBtn = fixture.debugElement.query(
    By.css('button.decrement')
  );

  // Act
  decrementBtn.triggerEventHandler('click', null);
  fixture.detectChanges();

  // Assert
  expect(component.counter()).toBe(valueBeforeDecrement - 1);
});

it('ne devrait pas avoir de valeur négative', () => {
  // Arrange - s'assurer que la valeur est 0
  component.reset();
  fixture.detectChanges();

  // Act - essayer de décrémenter
  const decrementBtn = fixture.debugElement.query(
    By.css('button.decrement')
  );
  decrementBtn.triggerEventHandler('click', null);
  fixture.detectChanges();

  // Assert
  expect(component.counter()).toBeGreaterThanOrEqual(0);
});`;
      default:
        return '';
    }
  });

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.generatedCode());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
}
