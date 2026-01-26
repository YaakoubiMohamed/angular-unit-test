import { Component, signal, computed } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { CounterComponent } from '../../components/counter/counter.component';
import { LoginFormComponent, LoginCredentials } from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CounterComponent, LoginFormComponent, JsonPipe],
  template: `
    <div class="playground-container">
      <header class="page-header">
        <h1> Terrain de Jeu des Tests</h1>
        <p>Composants interactifs pour pratiquer les stratégies de tests</p>
      </header>

      <!-- Component Selector -->
      <section class="component-selector">
        <button 
          class="selector-btn" 
          [class.active]="activeComponent() === 'counter'"
          (click)="activeComponent.set('counter')">
          Composant Compteur
        </button>
        <button 
          class="selector-btn" 
          [class.active]="activeComponent() === 'login'"
          (click)="activeComponent.set('login')">
          🔐 Formulaire de Connexion
        </button>
      </section>

      <!-- Counter Playground -->
      @if (activeComponent() === 'counter') {
        <div class="playground-area animate-fade-in">
          <div class="playground-split">
            <!-- Live Component -->
            <section class="live-component card">
              <h3> Composant en Direct</h3>
              <div class="component-demo">
                <app-counter 
                  [initialValue]="counterInitialValue()" 
                  [step]="counterStep()"
                  (valueChanged)="onCounterChange($event)" />
              </div>
              <div class="demo-controls">
                <label>
                  <span>Valeur Initiale :</span>
                  <input 
                    type="number" 
                    [value]="counterInitialValue()"
                    (input)="counterInitialValue.set(+$any($event.target).value)" />
                </label>
                <label>
                  <span>Pas :</span>
                  <input 
                    type="number" 
                    [value]="counterStep()"
                    (input)="counterStep.set(+$any($event.target).value)" />
                </label>
              </div>
              @if (lastCounterValue() !== null) {
                <div class="output-log">
                  <span class="log-label">Sortie reçue :</span>
                  <code>valueChanged: {{ lastCounterValue() }}</code>
                </div>
              }
            </section>

            <!-- Test Code -->
            <section class="test-code card">
              <h3> Exemples de Tests</h3>
              <div class="test-tabs">
                <button 
                  [class.active]="counterTestTab() === 'basic'"
                  (click)="counterTestTab.set('basic')">Basique</button>
                <button 
                  [class.active]="counterTestTab() === 'inputs'"
                  (click)="counterTestTab.set('inputs')">Entrées</button>
                <button 
                  [class.active]="counterTestTab() === 'outputs'"
                  (click)="counterTestTab.set('outputs')">Sorties</button>
              </div>
              
              @if (counterTestTab() === 'basic') {
                <pre><code><span class="code-function">describe</span>(<span class="code-string">'CounterComponent'</span>, () => &#123;
  <span class="code-keyword">let</span> fixture: <span class="code-class">ComponentFixture</span>&lt;<span class="code-class">CounterComponent</span>&gt;;
  <span class="code-keyword">let</span> component: <span class="code-class">CounterComponent</span>;

  <span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
    <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [CounterComponent]
    &#125;).<span class="code-function">compileComponents</span>();

    fixture = TestBed.<span class="code-function">createComponent</span>(CounterComponent);
    component = fixture.componentInstance;
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait afficher la valeur initiale'</span>, () => &#123;
    fixture.<span class="code-function">detectChanges</span>();
    
    <span class="code-keyword">const</span> display = fixture.debugElement
      .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'.count'</span>));
    <span class="code-function">expect</span>(display.nativeElement.textContent)
      .<span class="code-function">toContain</span>(<span class="code-string">'0'</span>);
  &#125;);
&#125;);</code></pre>
              }
              
              @if (counterTestTab() === 'inputs') {
                <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait utiliser la valeur initiale personnalisée'</span>, () => &#123;
  <span class="code-comment">// Définir l'entrée avant le premier detectChanges</span>
  fixture.componentRef.<span class="code-function">setInput</span>(<span class="code-string">'initialValue'</span>, <span class="code-number">10</span>);
  fixture.<span class="code-function">detectChanges</span>();

  <span class="code-function">expect</span>(component.count()).<span class="code-function">toBe</span>(<span class="code-number">10</span>);
&#125;);

<span class="code-function">it</span>(<span class="code-string">'devrait incrémenter par pas personnalisé'</span>, () => &#123;
  fixture.componentRef.<span class="code-function">setInput</span>(<span class="code-string">'step'</span>, <span class="code-number">5</span>);
  fixture.<span class="code-function">detectChanges</span>();

  component.<span class="code-function">increment</span>();

  <span class="code-function">expect</span>(component.count()).<span class="code-function">toBe</span>(<span class="code-number">5</span>);
&#125;);</code></pre>
              }
              
              @if (counterTestTab() === 'outputs') {
                <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait émettre valueChanged à l\'incrémentation'</span>, () => &#123;
  fixture.<span class="code-function">detectChanges</span>();
  
  <span class="code-keyword">let</span> emittedValue: <span class="code-class">number</span> | <span class="code-keyword">undefined</span>;
  component.valueChanged.<span class="code-function">subscribe</span>(v => &#123;
    emittedValue = v;
  &#125;);

  component.<span class="code-function">increment</span>();

  <span class="code-function">expect</span>(emittedValue).<span class="code-function">toBe</span>(<span class="code-number">1</span>);
&#125;);

<span class="code-function">it</span>(<span class="code-string">'devrait émettre au clic du bouton'</span>, () => &#123;
  fixture.<span class="code-function">detectChanges</span>();
  
  <span class="code-keyword">const</span> spy = <span class="code-function">vi.fn</span>();
  component.valueChanged.<span class="code-function">subscribe</span>(spy);

  <span class="code-keyword">const</span> btn = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="increment"]'</span>));
  btn.<span class="code-function">triggerEventHandler</span>(<span class="code-string">'click'</span>);

  <span class="code-function">expect</span>(spy).<span class="code-function">toHaveBeenCalledWith</span>(<span class="code-number">1</span>);
&#125;);</code></pre>
              }
            </section>
          </div>
          
          <!-- Key Concepts -->
          <section class="key-concepts card">
            <h3> Concepts Clés pour le Compteur</h3>
            <div class="concepts-grid">
              <div class="concept">
                <span class="concept-icon"></span>
                <h4>Entrées Signal</h4>
                <p>Utiliser <code>fixture.componentRef.setInput()</code> pour les entrées signal modernes</p>
              </div>
              <div class="concept">
                <span class="concept-icon"></span>
                <h4>Événements de Sortie</h4>
                <p>S'abonner aux sorties ou utiliser le spy <code>vi.fn()</code> pour capturer les émissions</p>
              </div>
              <div class="concept">
                <span class="concept-icon"></span>
                <h4>Changements d'État</h4>
                <p>Appeler <code>detectChanges()</code> après les actions pour mettre à jour la vue</p>
              </div>
              <div class="concept">
                <span class="concept-icon"></span>
                <h4>Événements de Clic</h4>
                <p>Utiliser <code>triggerEventHandler('click')</code> ou click() natif</p>
              </div>
            </div>
          </section>
        </div>
      }

      <!-- Login Form Playground -->
      @if (activeComponent() === 'login') {
        <div class="playground-area animate-fade-in">
          <div class="playground-split">
            <!-- Live Component -->
            <section class="live-component card">
              <h3> Composant en Direct</h3>
              <div class="component-demo login-demo">
                <app-login-form (loginSuccess)="onLoginSubmit($event)" />
              </div>
              @if (lastLoginData()) {
                <div class="output-log">
                  <span class="log-label">Connexion soumise :</span>
                  <code>{{ lastLoginData() | json }}</code>
                </div>
              }
            </section>

            <!-- Test Code -->
            <section class="test-code card">
              <h3> Exemples de Tests</h3>
              <div class="test-tabs">
                <button 
                  [class.active]="loginTestTab() === 'form'"
                  (click)="loginTestTab.set('form')">Formulaire</button>
                <button 
                  [class.active]="loginTestTab() === 'validation'"
                  (click)="loginTestTab.set('validation')">Validation</button>
                <button 
                  [class.active]="loginTestTab() === 'submit'"
                  (click)="loginTestTab.set('submit')">Soumission</button>
              </div>
              
              @if (loginTestTab() === 'form') {
                <pre><code><span class="code-function">describe</span>(<span class="code-string">'LoginFormComponent'</span>, () => &#123;
  <span class="code-keyword">let</span> fixture: <span class="code-class">ComponentFixture</span>&lt;<span class="code-class">LoginFormComponent</span>&gt;;
  <span class="code-keyword">let</span> component: <span class="code-class">LoginFormComponent</span>;

  <span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
    <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [LoginFormComponent]
    &#125;).<span class="code-function">compileComponents</span>();

    fixture = TestBed.<span class="code-function">createComponent</span>(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.<span class="code-function">detectChanges</span>();
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait afficher les champs email et mot de passe'</span>, () => &#123;
    <span class="code-keyword">const</span> emailInput = fixture.debugElement
      .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'input[type="email"]'</span>));
    <span class="code-keyword">const</span> passwordInput = fixture.debugElement
      .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'input[type="password"]'</span>));

    <span class="code-function">expect</span>(emailInput).<span class="code-function">toBeTruthy</span>();
    <span class="code-function">expect</span>(passwordInput).<span class="code-function">toBeTruthy</span>();
  &#125;);
&#125;);</code></pre>
              }
              
              @if (loginTestTab() === 'validation') {
                <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait afficher une erreur pour un email invalide'</span>, () => &#123;
  <span class="code-keyword">const</span> emailInput = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'input[type="email"]'</span>));
  
  <span class="code-comment">// Saisir un email invalide</span>
  emailInput.nativeElement.value = <span class="code-string">'not-an-email'</span>;
  emailInput.nativeElement.<span class="code-function">dispatchEvent</span>(
    <span class="code-keyword">new</span> <span class="code-class">Event</span>(<span class="code-string">'input'</span>)
  );
  emailInput.nativeElement.<span class="code-function">dispatchEvent</span>(
    <span class="code-keyword">new</span> <span class="code-class">Event</span>(<span class="code-string">'blur'</span>)
  );
  fixture.<span class="code-function">detectChanges</span>();

  <span class="code-keyword">const</span> errorMsg = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'.error-message'</span>));
  
  <span class="code-function">expect</span>(errorMsg).<span class="code-function">toBeTruthy</span>();
&#125;);

<span class="code-function">it</span>(<span class="code-string">'devrait désactiver le bouton quand le formulaire est invalide'</span>, () => &#123;
  <span class="code-keyword">const</span> submitBtn = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'button[type="submit"]'</span>));
  
  <span class="code-function">expect</span>(submitBtn.nativeElement.disabled)
    .<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
&#125;);</code></pre>
              }
              
              @if (loginTestTab() === 'submit') {
                <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait émettre loginSubmit avec les identifiants'</span>, () => &#123;
  <span class="code-keyword">const</span> spy = <span class="code-function">vi.fn</span>();
  component.loginSubmit.<span class="code-function">subscribe</span>(spy);

  <span class="code-comment">// Remplir le formulaire avec des données valides</span>
  component.email.<span class="code-function">set</span>(<span class="code-string">'user&#64;example.com'</span>);
  component.password.<span class="code-function">set</span>(<span class="code-string">'Password123'</span>);
  fixture.<span class="code-function">detectChanges</span>();

  <span class="code-comment">// Soumettre le formulaire</span>
  <span class="code-keyword">const</span> form = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'form'</span>));
  form.<span class="code-function">triggerEventHandler</span>(<span class="code-string">'ngSubmit'</span>);

  <span class="code-function">expect</span>(spy).<span class="code-function">toHaveBeenCalledWith</span>(&#123;
    <span class="code-property">email</span>: <span class="code-string">'user&#64;example.com'</span>,
    <span class="code-property">password</span>: <span class="code-string">'Password123'</span>
  &#125;);
&#125;);</code></pre>
              }
            </section>
          </div>
          
          <!-- Key Concepts -->
          <section class="key-concepts card">
            <h3> Concepts Clés pour les Formulaires</h3>
            <div class="concepts-grid">
              <div class="concept">
                <span class="concept-icon"></span>
                <h4>Événements de Saisie</h4>
                <p>Dispatcher les événements <code>input</code> et <code>blur</code> pour déclencher la validation</p>
              </div>
              <div class="concept">
                <span class="concept-icon">⚠️</span>
                <h4>Validation</h4>
                <p>Tester les états valides et invalides, vérifier les messages d'erreur</p>
              </div>
              <div class="concept">
                <span class="concept-icon"></span>
                <h4>Soumission Formulaire</h4>
                <p>Utiliser le gestionnaire d'événement <code>ngSubmit</code>, pas le clic sur le bouton</p>
              </div>
              <div class="concept">
                <span class="concept-icon">🔒</span>
                <h4>État Désactivé</h4>
                <p>Vérifier que les boutons sont désactivés jusqu'à ce que le formulaire soit valide</p>
              </div>
            </div>
          </section>
        </div>
      }

      <!-- Run Tests Section -->
      <section class="run-tests card">
        <h3> Exécuter les Tests</h3>
        <p>Exécutez les fichiers de tests réels pour voir ces tests en action :</p>
        <div class="command-blocks">
          <div class="command-block">
            <code>npm test</code>
            <span class="command-desc">Exécuter tous les tests une fois</span>
          </div>
          <div class="command-block">
            <code>npm run test:watch</code>
            <span class="command-desc">Mode watch pour le développement</span>
          </div>
          <div class="command-block">
            <code>npm test -- counter</code>
            <span class="command-desc">Exécuter uniquement les tests du compteur</span>
          </div>
          <div class="command-block">
            <code>npm test -- login</code>
            <span class="command-desc">Exécuter uniquement les tests du formulaire</span>
          </div>
        </div>
        <div class="file-hints">
          <p><strong>Fichiers de Tests :</strong></p>
          <ul>
            <li> <code>src/app/components/counter/counter.component.spec.ts</code></li>
            <li> <code>src/app/components/login-form/login-form.component.spec.ts</code></li>
            <li> <code>src/app/services/*.spec.ts</code></li>
          </ul>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .playground-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;
      
      h1 { margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); font-size: 1.1rem; }
    }

    .component-selector {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .selector-btn {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        border-color: var(--primary-color);
        color: var(--text-primary);
      }
      
      &.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
      }
    }

    .playground-area {
      margin-bottom: 2rem;
    }

    .playground-split {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .live-component {
      h3 { margin-bottom: 1rem; }
    }

    .component-demo {
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 150px;
      border: 1px dashed var(--border-color);
      margin-bottom: 1rem;
    }

    .login-demo {
      min-height: 300px;
      padding: 1.5rem;
    }

    .demo-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        span {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        input {
          width: 80px;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
        }
      }
    }

    .output-log {
      background: var(--bg-primary);
      border-radius: var(--radius-sm);
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
      
      .log-label {
        color: var(--text-muted);
      }
      
      code {
        color: var(--success-color);
      }
    }

    .test-code {
      h3 { margin-bottom: 1rem; }
      
      pre {
        margin: 0;
        font-size: 0.8rem;
        line-height: 1.5;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
    }

    .test-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      
      button {
        padding: 0.5rem 1rem;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 0.85rem;
        
        &:hover {
          border-color: var(--primary-color);
        }
        
        &.active {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }
      }
    }

    .key-concepts {
      h3 { margin-bottom: 1rem; }
    }

    .concepts-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      
      @media (max-width: 800px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }

    .concept {
      text-align: center;
      padding: 1rem;
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      
      .concept-icon {
        font-size: 1.5rem;
        display: block;
        margin-bottom: 0.5rem;
      }
      
      h4 { margin: 0 0 0.5rem; font-size: 0.9rem; }
      p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }
    }

    .run-tests {
      h3 { margin-bottom: 0.75rem; }
      
      > p {
        color: var(--text-secondary);
        margin-bottom: 1rem;
      }
    }

    .command-blocks {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      
      @media (max-width: 800px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }

    .command-block {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: var(--radius-md);
      text-align: center;
      
      code {
        display: block;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        color: var(--primary-color);
      }
      
      .command-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
    }

    .file-hints {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: var(--radius-md);
      
      p {
        margin: 0 0 0.5rem;
        font-size: 0.9rem;
      }
      
      ul {
        margin: 0;
        padding-left: 1.25rem;
        
        li {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }
      }
    }
  `]
})
export class PlaygroundComponent {
  activeComponent = signal<'counter' | 'login'>('counter');
  
  // Counter playground state
  counterInitialValue = signal(0);
  counterStep = signal(1);
  lastCounterValue = signal<number | null>(null);
  counterTestTab = signal('basic');
  
  // Login playground state
  lastLoginData = signal<{ email: string; password: string } | null>(null);
  loginTestTab = signal('form');
  
  onCounterChange(value: number) {
    this.lastCounterValue.set(value);
  }
  
  onLoginSubmit(data: LoginCredentials) {
    this.lastLoginData.set(data);
  }
}
