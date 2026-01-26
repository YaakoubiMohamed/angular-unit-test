import { Component, signal, computed } from '@angular/core';
import { CalculatorPlaygroundComponent } from './playground/calculator-playground.component';

interface TestCase {
  name: string;
  code: string;
  status: 'pass' | 'fail' | 'pending';
  explanation: string;
  bestPractice?: string;
}

interface ServiceExample {
  id: string;
  title: string;
  description: string;
  serviceCode: string;
  testCases: TestCase[];
  keyLearnings?: string[];
}

interface BestPractice {
  title: string;
  description: string;
  doExample?: string;
  dontExample?: string;
}

interface TrickyScenario {
  id: string;
  title: string;
  difficulty: 'intermediate' | 'advanced';
  problem: string;
  solution: string;
  code: string;
  explanation: string;
}

@Component({
  selector: 'app-service-testing',
  standalone: true,
  imports: [CalculatorPlaygroundComponent],
  template: `
    <div class="services-container">
      <header class="page-header">
        <h1>Tests de Services</h1>
        <p>Apprenez à tester les services Angular - le cœur de la logique métier</p>
        
        <!-- Mode Toggle -->
        <div class="mode-toggle">
          <button 
            [class.active]="mode() === 'tutorial'"
            (click)="mode.set('tutorial')">
            Tutoriel
          </button>
          <button 
            [class.active]="mode() === 'interactive'"
            (click)="mode.set('interactive')">
            Interactif
          </button>
        </div>
      </header>

      @if (mode() === 'interactive') {
        <!-- Interactive Mode -->
        <section class="interactive-section animate-fade-in">
          <div class="interactive-intro">
            <h2>Mode Interactif</h2>
            <p>
              Expérimentez avec les services en temps réel ! Exécutez des tests, 
              créez vos propres cas de test et voyez les résultats instantanément.
            </p>
          </div>
          
          <app-calculator-playground />
        </section>
      } @else {
        <!-- Tutorial Mode - Original Content -->

      <!-- Introduction -->
      <section class="intro-section card">
        <h2>Pourquoi Tester les Services ?</h2>
        <div class="intro-grid">
          <div class="intro-item">
            <span class="intro-icon"></span>
            <h4>Logique Isolée</h4>
            <p>Les services contiennent la logique métier pure, faciles à tester sans DOM</p>
          </div>
          <div class="intro-item">
            <span class="intro-icon"></span>
            <h4>Réutilisables</h4>
            <p>Des services bien testés peuvent être réutilisés en toute sécurité entre composants</p>
          </div>
          <div class="intro-item">
            <span class="intro-icon"></span>
            <h4>Tests Rapides</h4>
            <p>Pas besoin de TestBed pour les services simples - instanciez et testez</p>
          </div>
          <div class="intro-item">
            <span class="intro-icon"></span>
            <h4>Couverture Élevée</h4>
            <p>Testez les cas limites, la gestion d'erreurs et tous les chemins de code</p>
          </div>
        </div>
      </section>

      <!-- Example Navigation -->
      <nav class="example-nav">
        @for (example of examples; track example.id) {
          <button
            class="example-tab"
            [class.active]="activeExample() === example.id"
            (click)="activeExample.set(example.id)">
            {{ example.title }}
          </button>
        }
      </nav>

      <!-- Active Example -->
      @if (currentExample(); as example) {
        <div class="example-content animate-fade-in">
          <div class="split-view">
            <!-- Service Code -->
            <div class="code-panel">
              <div class="panel-header">
                <h3> Code du Service</h3>
                <span class="badge badge-primary">{{ example.title }}</span>
              </div>
              <div class="code-editor">
                <div class="code-header">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                  <span class="filename">{{ example.id }}.service.ts</span>
                </div>
                <div class="code-content">
                  <pre><code [innerHTML]="example.serviceCode"></code></pre>
                </div>
              </div>
            </div>

            <!-- Test Cases -->
            <div class="test-panel">
              <div class="panel-header">
                <h3>Cas de Tests</h3>
                <div class="test-summary">
                  <span class="test-stat pass">{{ passCount() }} pass</span>
                  <span class="test-stat fail">{{ failCount() }} fail</span>
                </div>
              </div>
              <div class="test-cases">
                @for (test of example.testCases; track test.name; let i = $index) {
                  <div 
                    class="test-case"
                    [class.expanded]="expandedTest() === i"
                    (click)="toggleTest(i)">
                    <div class="test-header">
                      <span class="test-icon" [class]="test.status">
                        {{ test.status === 'pass' ? 'PASS' : test.status === 'fail' ? 'FAIL' : '-' }}
                      </span>
                      <span class="test-name">{{ test.name }}</span>
                      <span class="expand-icon">{{ expandedTest() === i ? '−' : '+' }}</span>
                    </div>
                    @if (expandedTest() === i) {
                      <div class="test-details animate-fade-in">
                        <pre><code [innerHTML]="test.code"></code></pre>
                        <div class="test-explanation">
                          <strong>Explication :</strong>
                          <p>{{ test.explanation }}</p>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Concepts Clés -->
          <div class="key-concepts card">
            <h3>Concepts Clés pour {{ example.title }}</h3>
            @switch (example.id) {
              @case ('calculator') {
                <div class="concepts-grid">
                  <div class="concept-item">
                    <h4>Tester les Fonctions Pures</h4>
                    <p>Les méthodes du calculateur sont pures - même entrée donne toujours même sortie. Parfait pour les tests unitaires !</p>
                  </div>
                  <div class="concept-item">
                    <h4>Gestion des Erreurs</h4>
                    <p>Testez que la division par zéro lance une erreur avec <code>expect(() => fn()).toThrow()</code></p>
                  </div>
                  <div class="concept-item">
                    <h4>Cas Limites</h4>
                    <p>Testez avec zéro, nombres négatifs, décimaux et grands nombres</p>
                  </div>
                  <div class="concept-item">
                    <h4>toBeCloseTo()</h4>
                    <p>Utilisez pour la comparaison en virgule flottante : <code>expect(0.1 + 0.2).toBeCloseTo(0.3)</code></p>
                  </div>
                </div>
              }
              @case ('temperature') {
                <div class="concepts-grid">
                  <div class="concept-item">
                    <h4>Tests de Conversion</h4>
                    <p>Vérifiez les formules avec des valeurs connues : 0°C = 32°F, 100°C = 212°F</p>
                  </div>
                  <div class="concept-item">
                    <h4>Tests aux Limites</h4>
                    <p>Testez le zéro absolu (-273.15°C) - les températures en dessous doivent lancer une erreur</p>
                  </div>
                  <div class="concept-item">
                    <h4>Tests Aller-Retour</h4>
                    <p>C→F→C devrait retourner la valeur d'origine (test des opérations inverses)</p>
                  </div>
                  <div class="concept-item">
                    <h4>Logique de Catégorie</h4>
                    <p>Testez la classification des températures aux valeurs limites</p>
                  </div>
                </div>
              }
              @case ('discount') {
                <div class="concepts-grid">
                  <div class="concept-item">
                    <h4>💰 Règles Métier</h4>
                    <p>Testez que les calculs de remise correspondent exactement aux exigences métier</p>
                  </div>
                  <div class="concept-item">
                    <h4>Validation Code Promo</h4>
                    <p>Codes valides, codes invalides, codes expirés, montant minimum requis</p>
                  </div>
                  <div class="concept-item">
                    <h4>Validation des Entrées</h4>
                    <p>Prix négatifs, pourcentages > 100, chaînes vides</p>
                  </div>
                  <div class="concept-item">
                    <h4>Objets Résultats</h4>
                    <p>Utilisez <code>toEqual()</code> pour la comparaison profonde d'objets</p>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      }

      <!-- Guide des Patterns de Test -->
      <section class="pattern-guide card">
        <h2>Patterns de Tests de Services</h2>
        
        <div class="pattern-item">
          <h4>1. Test de Service Basique (Sans Dépendances)</h4>
          <pre><code><span class="code-function">describe</span>(<span class="code-string">'CalculatorService'</span>, () => &#123;
  <span class="code-keyword">let</span> service: <span class="code-class">CalculatorService</span>;

  <span class="code-function">beforeEach</span>(() => &#123;
    <span class="code-comment">// Instanciation simple - pas besoin de TestBed !</span>
    service = <span class="code-keyword">new</span> <span class="code-class">CalculatorService</span>();
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait additionner les nombres'</span>, () => &#123;
    <span class="code-function">expect</span>(service.<span class="code-function">add</span>(<span class="code-number">2</span>, <span class="code-number">3</span>)).<span class="code-function">toBe</span>(<span class="code-number">5</span>);
  &#125;);
&#125;);</code></pre>
        </div>

        <div class="pattern-item">
          <h4>2. Service avec Dépendances (Utilisant TestBed)</h4>
          <pre><code><span class="code-function">describe</span>(<span class="code-string">'UserService'</span>, () => &#123;
  <span class="code-keyword">let</span> service: <span class="code-class">UserService</span>;
  <span class="code-keyword">let</span> httpMock: <span class="code-class">HttpTestingController</span>;

  <span class="code-function">beforeEach</span>(() => &#123;
    <span class="code-class">TestBed</span>.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [<span class="code-class">HttpClientTestingModule</span>],
      <span class="code-property">providers</span>: [<span class="code-class">UserService</span>]
    &#125;);

    service = <span class="code-class">TestBed</span>.<span class="code-function">inject</span>(<span class="code-class">UserService</span>);
    httpMock = <span class="code-class">TestBed</span>.<span class="code-function">inject</span>(<span class="code-class">HttpTestingController</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait récupérer les utilisateurs'</span>, () => &#123;
    <span class="code-comment">// Testez les appels HTTP ici</span>
  &#125;);
&#125;);</code></pre>
        </div>

        <div class="pattern-item">
          <h4>3. Tester les Erreurs</h4>
          <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait lancer une erreur sur division par zéro'</span>, () => &#123;
  <span class="code-comment">// Doit être enveloppé dans une fonction flèche !</span>
  <span class="code-function">expect</span>(() => service.<span class="code-function">divide</span>(<span class="code-number">10</span>, <span class="code-number">0</span>)).<span class="code-function">toThrow</span>();
  <span class="code-function">expect</span>(() => service.<span class="code-function">divide</span>(<span class="code-number">10</span>, <span class="code-number">0</span>)).<span class="code-function">toThrow</span>(<span class="code-string">'Cannot divide by zero'</span>);
&#125;);</code></pre>
        </div>

        <div class="pattern-item">
          <h4>4️⃣ Tester avec des Données Paramétrées</h4>
          <pre><code><span class="code-function">describe</span>(<span class="code-string">'conversions de température'</span>, () => &#123;
  <span class="code-keyword">const</span> testCases = [
    &#123; celsius: <span class="code-number">0</span>, fahrenheit: <span class="code-number">32</span> &#125;,
    &#123; celsius: <span class="code-number">100</span>, fahrenheit: <span class="code-number">212</span> &#125;,
    &#123; celsius: <span class="code-number">-40</span>, fahrenheit: <span class="code-number">-40</span> &#125;,
  ];

  testCases.<span class="code-function">forEach</span>((&#123; celsius, fahrenheit &#125;) => &#123;
    <span class="code-function">it</span>(<span class="code-string">\`devrait convertir \$&#123;celsius&#125;°C en \$&#123;fahrenheit&#125;°F\`</span>, () => &#123;
      <span class="code-function">expect</span>(service.<span class="code-function">celsiusToFahrenheit</span>(celsius))
        .<span class="code-function">toBe</span>(fahrenheit);
    &#125;);
  &#125;);
&#125;);</code></pre>
        </div>

        <div class="pattern-item">
          <h4>5️⃣ Tester les Valeurs Limites (Boundary Testing)</h4>
          <pre><code><span class="code-function">describe</span>(<span class="code-string">'validation de l\'âge'</span>, () => &#123;
  <span class="code-comment">// Testez aux frontières exactes</span>
  <span class="code-function">it</span>(<span class="code-string">'devrait rejeter l\'âge 17 (juste sous la limite)'</span>, () => &#123;
    <span class="code-function">expect</span>(service.<span class="code-function">isAdult</span>(<span class="code-number">17</span>)).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);
  &#125;);
  
  <span class="code-function">it</span>(<span class="code-string">'devrait accepter l\'âge 18 (à la limite)'</span>, () => &#123;
    <span class="code-function">expect</span>(service.<span class="code-function">isAdult</span>(<span class="code-number">18</span>)).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
  &#125;);
  
  <span class="code-function">it</span>(<span class="code-string">'devrait accepter l\'âge 19 (juste au-dessus)'</span>, () => &#123;
    <span class="code-function">expect</span>(service.<span class="code-function">isAdult</span>(<span class="code-number">19</span>)).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
  &#125;);
&#125;);</code></pre>
        </div>
      </section>

      <!-- Section Best Practices -->
      <section class="best-practices-section card">
        <h2> Bonnes Pratiques pour les Tests de Services</h2>
        <div class="practices-grid">
          @for (practice of bestPractices; track practice.title) {
            <div class="practice-card">
              <div class="practice-header">
                <h4>{{ practice.title }}</h4>
              </div>
              <p>{{ practice.description }}</p>
              @if (practice.doExample) {
                <div class="do-dont">
                  <div class="do-example">
                    <span class="label">✅ FAIRE</span>
                    <pre><code [innerHTML]="practice.doExample"></code></pre>
                  </div>
                  @if (practice.dontExample) {
                    <div class="dont-example">
                      <span class="label">❌ ÉVITER</span>
                      <pre><code [innerHTML]="practice.dontExample"></code></pre>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      </section>

      <!-- Section Scénarios Complexes -->
      <section class="tricky-section">
        <h2 class="section-title">
          <span> Scénarios Complexes & Solutions</span>
        </h2>
        <p class="section-intro">
          Ces exemples avancés montrent comment gérer des situations délicates couramment rencontrées 
          dans les tests de services. Maîtrisez ces patterns pour devenir expert en tests.
        </p>
        
        <div class="tricky-nav">
          @for (scenario of trickyScenarios; track scenario.id) {
            <button
              class="tricky-tab"
              [class.active]="activeScenario() === scenario.id"
              [class]="'difficulty-' + scenario.difficulty"
              (click)="activeScenario.set(scenario.id)">
              {{ scenario.title }}
            </button>
          }
        </div>

        @if (currentScenario(); as scenario) {
          <div class="tricky-content card animate-fade-in">
            <div class="scenario-header">
              <h3> {{ scenario.title }}</h3>
              
            </div>
            
            <div class="problem-solution">
              <div class="problem-box">
                <h4>❓ Le Problème</h4>
                <p>{{ scenario.problem }}</p>
              </div>
              <div class="solution-box">
                <h4> La Solution</h4>
                <p>{{ scenario.solution }}</p>
              </div>
            </div>

            <div class="code-solution">
              <h4> Code Complet</h4>
              <pre><code [innerHTML]="scenario.code"></code></pre>
            </div>

            <div class="explanation-box">
              <h4>Explication Détaillée</h4>
              <p>{{ scenario.explanation }}</p>
            </div>
          </div>
        }
      </section>

      <!-- Section Matchers Avancés -->
      <section class="matchers-section card">
        <h2> Matchers Vitest Essentiels</h2>
        <div class="matchers-grid">
          <div class="matcher-card">
            <h4>Comparaisons de Base</h4>
            <pre><code><span class="code-function">expect</span>(value).<span class="code-function">toBe</span>(<span class="code-number">5</span>);        <span class="code-comment">// Égalité stricte (===)</span>
<span class="code-function">expect</span>(obj).<span class="code-function">toEqual</span>(&#123;a:<span class="code-number">1</span>&#125;);   <span class="code-comment">// Égalité profonde</span>
<span class="code-function">expect</span>(str).<span class="code-function">toContain</span>(<span class="code-string">'hi'</span>); <span class="code-comment">// Contient substring</span>
<span class="code-function">expect</span>(num).<span class="code-function">toBeCloseTo</span>(<span class="code-number">0.3</span>); <span class="code-comment">// Pour les flottants</span></code></pre>
          </div>
          
          <div class="matcher-card">
            <h4>Vérifications de Vérité</h4>
            <pre><code><span class="code-function">expect</span>(val).<span class="code-function">toBeTruthy</span>();     <span class="code-comment">// Vrai en JS</span>
<span class="code-function">expect</span>(val).<span class="code-function">toBeFalsy</span>();      <span class="code-comment">// Faux en JS</span>
<span class="code-function">expect</span>(val).<span class="code-function">toBeNull</span>();       <span class="code-comment">// Exactement null</span>
<span class="code-function">expect</span>(val).<span class="code-function">toBeUndefined</span>();  <span class="code-comment">// undefined</span>
<span class="code-function">expect</span>(val).<span class="code-function">toBeDefined</span>();    <span class="code-comment">// Pas undefined</span></code></pre>
          </div>
          
          <div class="matcher-card">
            <h4>Comparaisons Numériques</h4>
            <pre><code><span class="code-function">expect</span>(num).<span class="code-function">toBeGreaterThan</span>(<span class="code-number">5</span>);
<span class="code-function">expect</span>(num).<span class="code-function">toBeGreaterThanOrEqual</span>(<span class="code-number">5</span>);
<span class="code-function">expect</span>(num).<span class="code-function">toBeLessThan</span>(<span class="code-number">10</span>);
<span class="code-function">expect</span>(num).<span class="code-function">toBeLessThanOrEqual</span>(<span class="code-number">10</span>);
<span class="code-function">expect</span>(num).<span class="code-function">toBeNaN</span>();</code></pre>
          </div>
          
          <div class="matcher-card">
            <h4>Tableaux & Objets</h4>
            <pre><code><span class="code-function">expect</span>(arr).<span class="code-function">toHaveLength</span>(<span class="code-number">3</span>);
<span class="code-function">expect</span>(arr).<span class="code-function">toContain</span>(item);
<span class="code-function">expect</span>(arr).<span class="code-function">toContainEqual</span>(&#123;id:<span class="code-number">1</span>&#125;);
<span class="code-function">expect</span>(obj).<span class="code-function">toHaveProperty</span>(<span class="code-string">'key'</span>);
<span class="code-function">expect</span>(obj).<span class="code-function">toMatchObject</span>(partial);</code></pre>
          </div>
          
          <div class="matcher-card">
            <h4>Exceptions</h4>
            <pre><code><span class="code-comment">// ⚠️ Toujours envelopper dans une fonction !</span>
<span class="code-function">expect</span>(() => fn()).<span class="code-function">toThrow</span>();
<span class="code-function">expect</span>(() => fn()).<span class="code-function">toThrow</span>(<span class="code-string">'message'</span>);
<span class="code-function">expect</span>(() => fn()).<span class="code-function">toThrow</span>(<span class="code-class">TypeError</span>);
<span class="code-function">expect</span>(() => fn()).<span class="code-function">toThrow</span>(<span class="code-string">/regex/</span>);</code></pre>
          </div>
          
          <div class="matcher-card">
            <h4>Négation</h4>
            <pre><code><span class="code-function">expect</span>(val).<span class="code-function">not</span>.<span class="code-function">toBe</span>(<span class="code-number">5</span>);
<span class="code-function">expect</span>(arr).<span class="code-function">not</span>.<span class="code-function">toContain</span>(item);
<span class="code-function">expect</span>(fn).<span class="code-function">not</span>.<span class="code-function">toThrow</span>();
<span class="code-function">expect</span>(str).<span class="code-function">not</span>.<span class="code-function">toMatch</span>(<span class="code-string">/pattern/</span>);</code></pre>
          </div>
        </div>
      </section>

      <!-- Checklist Finale -->
      <section class="checklist-section card">
        <h2>✅ Checklist des Tests de Services</h2>
        <div class="checklist-grid">
          <div class="checklist-column">
            <h4> Avant d'écrire les tests</h4>
            <ul>
              <li>Identifier tous les cas d'utilisation</li>
              <li>Lister les valeurs limites</li>
              <li>Prévoir les cas d'erreur</li>
              <li>Documenter les dépendances</li>
            </ul>
          </div>
          <div class="checklist-column">
            <h4> Pendant l'écriture</h4>
            <ul>
              <li>Un test = une assertion principale</li>
              <li>Noms descriptifs (devrait...)</li>
              <li>Pattern AAA (Arrange-Act-Assert)</li>
              <li>Tests indépendants et isolés</li>
            </ul>
          </div>
          <div class="checklist-column">
            <h4> Après l'écriture</h4>
            <ul>
              <li>Vérifier la couverture de code</li>
              <li>Revoir les cas limites</li>
              <li>Tester les erreurs et exceptions</li>
              <li>Refactorer si nécessaire</li>
            </ul>
          </div>
        </div>
      </section>
      } <!-- End of tutorial mode -->
    </div>
  `,
  styles: [`
    .services-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;
      
      h1 { margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); font-size: 1.1rem; }
    }

    /* Mode Toggle */
    .mode-toggle {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.25rem;

      button {
        padding: 0.75rem 1.5rem;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        color: var(--text-secondary);
        transition: all 0.2s;

        &:hover { 
          border-color: var(--primary-color); 
          color: var(--text-primary);
        }
        
        &.active {
          background: linear-gradient(135deg, var(--primary-color), #4f46e5);
          border-color: transparent;
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
      }
    }

    /* Interactive Section */
    .interactive-section {
      margin-top: 1rem;
    }

    .interactive-intro {
      text-align: center;
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 12px;

      h2 {
        margin: 0 0 0.5rem;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      p {
        margin: 0;
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto;
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Introduction */
    .intro-section {
      margin-bottom: 2rem;
      
      h2 { margin-bottom: 1.5rem; }
    }

    .intro-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      
      @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }

    .intro-item {
      text-align: center;
      
      .intro-icon {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 0.75rem;
      }
      
      h4 { margin: 0 0 0.5rem; font-size: 1rem; }
      p { margin: 0; font-size: 0.875rem; }
    }

    /* Example Navigation */
    .example-nav {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .example-tab {
      padding: 0.75rem 1.5rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
      font-weight: 500;
      font-size: 1rem;
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

    /* Split View */
    .split-view {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      
      @media (max-width: 1000px) {
        grid-template-columns: 1fr;
      }
    }

    .code-panel, .test-panel {
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-color);
      
      h3 { margin: 0; font-size: 1rem; }
    }

    .test-summary {
      display: flex;
      gap: 0.75rem;
    }

    .test-stat {
      font-family: var(--font-mono);
      font-size: 0.875rem;
      
      &.pass { color: var(--success-color); }
      &.fail { color: var(--danger-color); }
    }

    .code-editor {
      .code-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: var(--code-bg);
        border-bottom: 1px solid var(--border-color);
        
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          
          &.red { background: #ff5f56; }
          &.yellow { background: #ffbd2e; }
          &.green { background: #27ca40; }
        }
        
        .filename {
          margin-left: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      }
      
      .code-content {
        padding: 1rem;
        overflow-x: visible;
        overflow-wrap: break-word;
        
        pre {
          margin: 0;
          font-size: 0.8rem;
          line-height: 1.6;
          background: transparent;
          border: none;
          padding: 0;
          white-space: pre-wrap;
          overflow-wrap: break-word;
        }
      }
    }

    /* Test Cases */
    .test-cases {
      padding: 0.5rem;
    }

    .test-case {
      border-radius: var(--radius-md);
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      
      &:hover {
        border-color: var(--primary-color);
      }
      
      &.expanded {
        border-color: var(--primary-color);
      }
    }

    .test-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
    }

    .test-icon {
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: bold;
      
      &.pass {
        background: var(--success-color);
        color: white;
      }
      
      &.fail {
        background: var(--danger-color);
        color: white;
      }
      
      &.pending {
        background: var(--text-muted);
        color: white;
      }
    }

    .test-name {
      flex: 1;
      font-size: 0.875rem;
    }

    .expand-icon {
      color: var(--text-muted);
      font-size: 1.25rem;
    }

    .test-details {
      padding: 0 1rem 1rem;
      
      pre {
        margin: 0 0 1rem;
        font-size: 0.8rem;
        background: var(--code-bg);
        border-radius: var(--radius-sm);
        padding: 0.75rem;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
    }

    .test-explanation {
      background: rgba(234, 53, 171, 0.08);
      border: 1px solid rgba(234, 53, 171, 0.2);
      border-radius: var(--radius-sm);
      padding: 0.75rem;
      
      strong { color: var(--primary-color); }
      p { margin: 0.5rem 0 0; font-size: 0.875rem; }
    }

    /* Key Concepts */
    .key-concepts {
      margin-bottom: 2rem;
      
      h3 { margin-bottom: 1.5rem; }
    }

    .concepts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      
      @media (max-width: 700px) {
        grid-template-columns: 1fr;
      }
    }

    .concept-item {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      
      h4 { margin: 0 0 0.5rem; font-size: 0.95rem; }
      p { margin: 0; font-size: 0.875rem; }
    }

    /* Pattern Guide */
    .pattern-guide {
      h2 { margin-bottom: 1.5rem; }
    }

    .pattern-item {
      margin-bottom: 1.5rem;
      
      &:last-child { margin-bottom: 0; }
      
      h4 { margin: 0 0 0.75rem; }
      
      pre {
        margin: 0;
        font-size: 0.85rem;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
    }

    /* Best Practices Section */
    .best-practices-section {
      margin-top: 2rem;
      
      h2 { margin-bottom: 1.5rem; }
    }

    .practices-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .practice-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      
      .practice-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        
        .practice-icon {
          font-size: 1.5rem;
        }
        
        h4 { margin: 0; }
      }
      
      p { margin: 0 0 1rem; font-size: 0.9rem; }
    }

    .do-dont {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      
      @media (max-width: 700px) {
        grid-template-columns: 1fr;
      }
      
      .do-example, .dont-example {
        .label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        
        pre {
          margin: 0;
          font-size: 0.8rem;
          white-space: pre-wrap;
          overflow-wrap: break-word;
        }
      }
      
      .do-example .label { color: var(--success-color); }
      .dont-example .label { color: var(--danger-color); }
    }

    /* Tricky Section */
    .tricky-section {
      margin-top: 2rem;
      
      .section-title {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        
        span {
          font-size: 1.5rem;
          white-space: nowrap;
        }
        
        &::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, var(--border-color), transparent);
        }
      }
      
      .section-intro {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
      }
    }

    .tricky-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .tricky-tab {
      padding: 0.75rem 1rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
      
      .difficulty-badge {
        font-size: 0.7rem;
        padding: 0.2rem 0.5rem;
        border-radius: var(--radius-sm);
        background: rgba(128, 128, 128, 0.15);
      }
      
      &.difficulty-intermediate .difficulty-badge {
        background: rgba(245, 158, 11, 0.15);
        color: #d97706;
      }
      
      &.difficulty-advanced .difficulty-badge {
        background: rgba(239, 68, 68, 0.15);
        color: #dc2626;
      }
      
      &:hover {
        border-color: var(--primary-color);
        color: var(--text-primary);
      }
      
      &.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
        
        .difficulty-badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
      }
    }

    .tricky-content {
      .scenario-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
        
        h3 { margin: 0; }
      }
      
      .problem-solution {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
        
        @media (max-width: 700px) {
          grid-template-columns: 1fr;
        }
      }
      
      .problem-box, .solution-box {
        padding: 1rem;
        border-radius: var(--radius-md);
        
        h4 { margin: 0 0 0.5rem; }
        p { margin: 0; font-size: 0.9rem; }
      }
      
      .problem-box {
        background: rgba(239, 68, 68, 0.08);
        border: 1px solid rgba(239, 68, 68, 0.2);
      }
      
      .solution-box {
        background: rgba(22, 163, 74, 0.08);
        border: 1px solid rgba(22, 163, 74, 0.2);
      }
      
      .code-solution {
        margin-bottom: 1.5rem;
        
        h4 { margin: 0 0 0.75rem; }
        
        pre {
          margin: 0;
          font-size: 0.8rem;
          white-space: pre-wrap;
          overflow-wrap: break-word;
        }
      }
      
      .explanation-box {
        background: rgba(234, 53, 171, 0.08);
        border: 1px solid rgba(234, 53, 171, 0.2);
        padding: 1rem;
        border-radius: var(--radius-md);
        
        h4 { margin: 0 0 0.5rem; color: var(--primary-color); }
        p { margin: 0; font-size: 0.9rem; }
      }
    }

    /* Matchers Section */
    .matchers-section {
      margin-top: 2rem;
      
      h2 { margin-bottom: 1.5rem; }
    }

    .matchers-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      
      @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .matcher-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1rem;
      
      h4 { 
        margin: 0 0 0.75rem;
        font-size: 0.95rem;
      }
      
      pre {
        margin: 0;
        font-size: 0.75rem;
        line-height: 1.6;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
    }

    /* Checklist Section */
    .checklist-section {
      margin-top: 2rem;
      
      h2 { margin-bottom: 1.5rem; }
    }

    .checklist-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      
      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }
    }

    .checklist-column {
      h4 { 
        margin: 0 0 1rem;
        font-size: 1rem;
      }
      
      ul {
        margin: 0;
        padding-left: 1.25rem;
        
        li {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      }
    }
  `]
})
export class ServiceTestingComponent {
  // Mode toggle for interactive/tutorial
  mode = signal<'tutorial' | 'interactive'>('tutorial');
  
  activeExample = signal('calculator');
  expandedTest = signal<number | null>(0);
  activeScenario = signal('state-management');

  readonly bestPractices: BestPractice[] = [
    {
      title: 'Testez le Comportement, Pas l\'Implémentation',
      description: 'Vos tests devraient vérifier ce que fait la méthode, pas comment elle le fait. Cela rend les tests plus résilients aux refactorisations.',
      doExample: `<span class="code-function">expect</span>(service.<span class="code-function">getTotal</span>()).<span class="code-function">toBe</span>(<span class="code-number">100</span>);`,
      dontExample: `<span class="code-comment">// Teste l'implémentation interne</span>
<span class="code-function">expect</span>(service[<span class="code-string">'privateSum'</span>]).<span class="code-function">toBe</span>(<span class="code-number">100</span>);`
    },
    {
      title: 'Noms de Tests Descriptifs',
      description: 'Le nom du test devrait décrire le scénario et le résultat attendu. Utilisez "devrait" pour une meilleure lisibilité.',
      doExample: `<span class="code-function">it</span>(<span class="code-string">'devrait retourner 0 quand le panier est vide'</span>)`,
      dontExample: `<span class="code-function">it</span>(<span class="code-string">'test getTotal'</span>)`
    },
    {
      title: 'Tests Isolés et Indépendants',
      description: 'Chaque test doit pouvoir s\'exécuter seul, dans n\'importe quel ordre. Utilisez beforeEach pour réinitialiser l\'état.',
      doExample: `<span class="code-function">beforeEach</span>(() => &#123;
  service = <span class="code-keyword">new</span> <span class="code-class">CartService</span>();
&#125;);`,
      dontExample: `<span class="code-comment">// Service partagé entre tests</span>
<span class="code-keyword">const</span> service = <span class="code-keyword">new</span> <span class="code-class">CartService</span>();`
    },
    {
      title: 'Testez les Cas Limites',
      description: 'N\'oubliez pas de tester : valeurs nulles, tableaux vides, nombres négatifs, chaînes vides, valeurs maximales/minimales.',
      doExample: `<span class="code-function">it</span>(<span class="code-string">'devrait gérer un tableau vide'</span>, () => &#123;
  <span class="code-function">expect</span>(service.<span class="code-function">average</span>([])).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
&#125;);`
    },
    {
      title: 'Utilisez des Données de Test Réalistes',
      description: 'Vos données de test devraient ressembler aux vraies données, avec des cas typiques et des cas limites.',
      doExample: `<span class="code-keyword">const</span> user = &#123;
  name: <span class="code-string">'Jean Dupont'</span>,
  email: <span class="code-string">'jean.dupont&#64;email.com'</span>,
  age: <span class="code-number">35</span>
&#125;;`,
      dontExample: `<span class="code-keyword">const</span> user = &#123;
  name: <span class="code-string">'aaa'</span>,
  email: <span class="code-string">'xxx'</span>,
  age: <span class="code-number">1</span>
&#125;;`
    },
    {
      title: 'Un Assert Principal par Test',
      description: 'Chaque test devrait vérifier une seule chose. Plusieurs assertions sont OK si elles vérifient le même comportement.',
      doExample: `<span class="code-function">it</span>(<span class="code-string">'devrait calculer le total avec remise'</span>, () => &#123;
  <span class="code-keyword">const</span> result = service.<span class="code-function">calculateWithDiscount</span>(<span class="code-number">100</span>, <span class="code-number">10</span>);
  <span class="code-function">expect</span>(result.finalPrice).<span class="code-function">toBe</span>(<span class="code-number">90</span>);
  <span class="code-function">expect</span>(result.savings).<span class="code-function">toBe</span>(<span class="code-number">10</span>);
&#125;);`
    }
  ];

  readonly trickyScenarios: TrickyScenario[] = [
    {
      id: 'state-management',
      title: 'Service avec État Interne',
      difficulty: 'intermediate',
      problem: 'Comment tester un service qui maintient un état interne (comme un panier d\'achat) sans accéder directement aux propriétés privées ?',
      solution: 'Testez via les méthodes publiques uniquement. L\'état interne devrait être reflété dans les valeurs retournées par les méthodes.',
      code: `<span class="code-comment">// Service avec état</span>
<span class="code-decorator">@Injectable</span>(&#123; <span class="code-property">providedIn</span>: <span class="code-string">'root'</span> &#125;)
<span class="code-keyword">export class</span> <span class="code-class">CartService</span> &#123;
  <span class="code-keyword">private</span> items: CartItem[] = [];

  <span class="code-function">addItem</span>(item: CartItem): <span class="code-keyword">void</span> &#123;
    <span class="code-keyword">this</span>.items.<span class="code-function">push</span>(item);
  &#125;

  <span class="code-function">getTotal</span>(): <span class="code-class">number</span> &#123;
    <span class="code-keyword">return this</span>.items.<span class="code-function">reduce</span>((sum, i) => sum + i.price * i.qty, <span class="code-number">0</span>);
  &#125;

  <span class="code-function">getItemCount</span>(): <span class="code-class">number</span> &#123;
    <span class="code-keyword">return this</span>.items.length;
  &#125;
&#125;

<span class="code-comment">// ✅ Test correct</span>
<span class="code-function">describe</span>(<span class="code-string">'CartService'</span>, () => &#123;
  <span class="code-keyword">let</span> service: <span class="code-class">CartService</span>;

  <span class="code-function">beforeEach</span>(() => &#123;
    service = <span class="code-keyword">new</span> <span class="code-class">CartService</span>(); <span class="code-comment">// Nouvel état à chaque test</span>
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait démarrer avec un panier vide'</span>, () => &#123;
    <span class="code-function">expect</span>(service.<span class="code-function">getItemCount</span>()).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
    <span class="code-function">expect</span>(service.<span class="code-function">getTotal</span>()).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait calculer le total après ajout'</span>, () => &#123;
    service.<span class="code-function">addItem</span>(&#123; id: <span class="code-number">1</span>, price: <span class="code-number">50</span>, qty: <span class="code-number">2</span> &#125;);
    service.<span class="code-function">addItem</span>(&#123; id: <span class="code-number">2</span>, price: <span class="code-number">30</span>, qty: <span class="code-number">1</span> &#125;);

    <span class="code-function">expect</span>(service.<span class="code-function">getTotal</span>()).<span class="code-function">toBe</span>(<span class="code-number">130</span>);
    <span class="code-function">expect</span>(service.<span class="code-function">getItemCount</span>()).<span class="code-function">toBe</span>(<span class="code-number">2</span>);
  &#125;);
&#125;);`,
      explanation: 'La clé est de créer une nouvelle instance dans beforeEach pour garantir l\'isolation. On vérifie l\'état via les méthodes publiques (getTotal, getItemCount) plutôt que d\'accéder aux propriétés privées.'
    },
    {
      id: 'date-time',
      title: 'Tester avec Date/Heure',
      difficulty: 'advanced',
      problem: 'Le service utilise new Date() ou Date.now(). Les tests échouent de façon aléatoire car le temps change.',
      solution: 'Utilisez vi.useFakeTimers() de Vitest pour contrôler le temps, ou injectez une dépendance "horloge" pour les tests.',
      code: `<span class="code-comment">// Service qui dépend du temps</span>
<span class="code-keyword">export class</span> <span class="code-class">SessionService</span> &#123;
  <span class="code-keyword">private</span> loginTime?: <span class="code-class">Date</span>;

  <span class="code-function">login</span>(): <span class="code-keyword">void</span> &#123;
    <span class="code-keyword">this</span>.loginTime = <span class="code-keyword">new</span> <span class="code-class">Date</span>();
  &#125;

  <span class="code-function">isSessionExpired</span>(): <span class="code-class">boolean</span> &#123;
    <span class="code-keyword">if</span> (!<span class="code-keyword">this</span>.loginTime) <span class="code-keyword">return true</span>;
    <span class="code-keyword">const</span> hourInMs = <span class="code-number">60</span> * <span class="code-number">60</span> * <span class="code-number">1000</span>;
    <span class="code-keyword">return</span> <span class="code-class">Date</span>.<span class="code-function">now</span>() - <span class="code-keyword">this</span>.loginTime.<span class="code-function">getTime</span>() > hourInMs;
  &#125;
&#125;

<span class="code-comment">// ✅ Test avec faux timers</span>
<span class="code-keyword">import</span> &#123; vi, describe, it, expect, beforeEach, afterEach &#125; <span class="code-keyword">from</span> <span class="code-string">'vitest'</span>;

<span class="code-function">describe</span>(<span class="code-string">'SessionService'</span>, () => &#123;
  <span class="code-keyword">let</span> service: <span class="code-class">SessionService</span>;

  <span class="code-function">beforeEach</span>(() => &#123;
    vi.<span class="code-function">useFakeTimers</span>();
    vi.<span class="code-function">setSystemTime</span>(<span class="code-keyword">new</span> <span class="code-class">Date</span>(<span class="code-string">'2024-01-15T10:00:00'</span>));
    service = <span class="code-keyword">new</span> <span class="code-class">SessionService</span>();
  &#125;);

  <span class="code-function">afterEach</span>(() => &#123;
    vi.<span class="code-function">useRealTimers</span>();
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait être expiré sans login'</span>, () => &#123;
    <span class="code-function">expect</span>(service.<span class="code-function">isSessionExpired</span>()).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait être valide juste après login'</span>, () => &#123;
    service.<span class="code-function">login</span>();
    <span class="code-function">expect</span>(service.<span class="code-function">isSessionExpired</span>()).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait expirer après 1 heure'</span>, () => &#123;
    service.<span class="code-function">login</span>();
    
    <span class="code-comment">// Avancer le temps de 61 minutes</span>
    vi.<span class="code-function">advanceTimersByTime</span>(<span class="code-number">61</span> * <span class="code-number">60</span> * <span class="code-number">1000</span>);
    
    <span class="code-function">expect</span>(service.<span class="code-function">isSessionExpired</span>()).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
  &#125;);
&#125;);`,
      explanation: 'vi.useFakeTimers() remplace Date et les timers par des versions contrôlables. vi.setSystemTime() fixe l\'heure, et vi.advanceTimersByTime() permet d\'avancer le temps. N\'oubliez pas vi.useRealTimers() dans afterEach!'
    },
    {
      id: 'random-values',
      title: 'Tester les Valeurs Aléatoires',
      difficulty: 'intermediate',
      problem: 'Le service génère des valeurs aléatoires (IDs, codes, etc.). Comment tester quelque chose d\'imprévisible ?',
      solution: 'Mockez Math.random() ou injectez un générateur. Testez le format plutôt que la valeur exacte.',
      code: `<span class="code-comment">// Service avec génération aléatoire</span>
<span class="code-keyword">export class</span> <span class="code-class">TokenService</span> &#123;
  <span class="code-function">generateToken</span>(length: <span class="code-class">number</span> = <span class="code-number">16</span>): <span class="code-class">string</span> &#123;
    <span class="code-keyword">const</span> chars = <span class="code-string">'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'</span>;
    <span class="code-keyword">return</span> <span class="code-class">Array</span>.<span class="code-function">from</span>(
      &#123; length &#125;,
      () => chars.<span class="code-function">charAt</span>(<span class="code-class">Math</span>.<span class="code-function">floor</span>(<span class="code-class">Math</span>.<span class="code-function">random</span>() * chars.length))
    ).<span class="code-function">join</span>(<span class="code-string">''</span>);
  &#125;

  <span class="code-function">generateUniqueId</span>(): <span class="code-class">string</span> &#123;
    <span class="code-keyword">return</span> <span class="code-string">\`id_\$&#123;Date.now()&#125;_\$&#123;this.generateToken(8)&#125;\`</span>;
  &#125;
&#125;

<span class="code-comment">// ✅ Tests</span>
<span class="code-function">describe</span>(<span class="code-string">'TokenService'</span>, () => &#123;
  <span class="code-keyword">let</span> service: <span class="code-class">TokenService</span>;

  <span class="code-function">beforeEach</span>(() => &#123;
    service = <span class="code-keyword">new</span> <span class="code-class">TokenService</span>();
  &#125;);

  <span class="code-comment">// Approche 1: Tester le format</span>
  <span class="code-function">it</span>(<span class="code-string">'devrait générer un token de la bonne longueur'</span>, () => &#123;
    <span class="code-keyword">const</span> token = service.<span class="code-function">generateToken</span>(<span class="code-number">20</span>);
    <span class="code-function">expect</span>(token).<span class="code-function">toHaveLength</span>(<span class="code-number">20</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait contenir uniquement des caractères valides'</span>, () => &#123;
    <span class="code-keyword">const</span> token = service.<span class="code-function">generateToken</span>(<span class="code-number">100</span>);
    <span class="code-function">expect</span>(token).<span class="code-function">toMatch</span>(<span class="code-string">/^[A-Za-z0-9]+$/</span>);
  &#125;);

  <span class="code-comment">// Approche 2: Mocker Math.random</span>
  <span class="code-function">it</span>(<span class="code-string">'devrait générer un token prévisible avec mock'</span>, () => &#123;
    <span class="code-keyword">let</span> callCount = <span class="code-number">0</span>;
    vi.<span class="code-function">spyOn</span>(<span class="code-class">Math</span>, <span class="code-string">'random'</span>).<span class="code-function">mockImplementation</span>(() => &#123;
      <span class="code-keyword">return</span> (callCount++ % <span class="code-number">62</span>) / <span class="code-number">62</span>; <span class="code-comment">// Retourne 0, 0.016..., 0.032...</span>
    &#125;);

    <span class="code-keyword">const</span> token = service.<span class="code-function">generateToken</span>(<span class="code-number">4</span>);
    <span class="code-function">expect</span>(token).<span class="code-function">toBe</span>(<span class="code-string">'ABCD'</span>);
  &#125;);

  <span class="code-comment">// Approche 3: Tester l'unicité</span>
  <span class="code-function">it</span>(<span class="code-string">'devrait générer des tokens uniques'</span>, () => &#123;
    <span class="code-keyword">const</span> tokens = <span class="code-class">Array</span>.<span class="code-function">from</span>(&#123; length: <span class="code-number">100</span> &#125;, 
      () => service.<span class="code-function">generateToken</span>(<span class="code-number">16</span>)
    );
    <span class="code-keyword">const</span> unique = <span class="code-keyword">new</span> <span class="code-class">Set</span>(tokens);
    <span class="code-function">expect</span>(unique.size).<span class="code-function">toBe</span>(<span class="code-number">100</span>);
  &#125;);
&#125;);`,
      explanation: 'Trois approches : (1) Tester le format/contraintes plutôt que la valeur exacte, (2) Mocker Math.random pour des tests déterministes, (3) Tester les propriétés statistiques comme l\'unicité. Choisissez selon le niveau de confiance requis.'
    },
    {
      id: 'validation-complex',
      title: 'Validation Complexe avec Messages',
      difficulty: 'advanced',
      problem: 'Le service retourne des résultats de validation avec plusieurs erreurs possibles. Comment tester tous les scénarios efficacement ?',
      solution: 'Utilisez des tests paramétrés (data-driven testing) et toMatchObject pour les assertions partielles.',
      code: `<span class="code-comment">// Service de validation</span>
<span class="code-keyword">interface</span> <span class="code-class">ValidationResult</span> &#123;
  isValid: <span class="code-class">boolean</span>;
  errors: <span class="code-class">string</span>[];
&#125;

<span class="code-keyword">export class</span> <span class="code-class">PasswordValidator</span> &#123;
  <span class="code-function">validate</span>(password: <span class="code-class">string</span>): <span class="code-class">ValidationResult</span> &#123;
    <span class="code-keyword">const</span> errors: <span class="code-class">string</span>[] = [];
    
    <span class="code-keyword">if</span> (password.length < <span class="code-number">8</span>) 
      errors.<span class="code-function">push</span>(<span class="code-string">'Au moins 8 caractères'</span>);
    <span class="code-keyword">if</span> (!<span class="code-string">/[A-Z]/</span>.<span class="code-function">test</span>(password)) 
      errors.<span class="code-function">push</span>(<span class="code-string">'Au moins une majuscule'</span>);
    <span class="code-keyword">if</span> (!<span class="code-string">/[0-9]/</span>.<span class="code-function">test</span>(password)) 
      errors.<span class="code-function">push</span>(<span class="code-string">'Au moins un chiffre'</span>);
    <span class="code-keyword">if</span> (!<span class="code-string">/[!&#64;#$%^&*]/</span>.<span class="code-function">test</span>(password)) 
      errors.<span class="code-function">push</span>(<span class="code-string">'Au moins un caractère spécial'</span>);

    <span class="code-keyword">return</span> &#123; isValid: errors.length === <span class="code-number">0</span>, errors &#125;;
  &#125;
&#125;

<span class="code-comment">// ✅ Tests paramétrés</span>
<span class="code-function">describe</span>(<span class="code-string">'PasswordValidator'</span>, () => &#123;
  <span class="code-keyword">let</span> validator: <span class="code-class">PasswordValidator</span>;

  <span class="code-function">beforeEach</span>(() => &#123;
    validator = <span class="code-keyword">new</span> <span class="code-class">PasswordValidator</span>();
  &#125;);

  <span class="code-comment">// Tests paramétrés pour les mots de passe valides</span>
  <span class="code-keyword">const</span> validPasswords = [
    <span class="code-string">'Password1!'</span>,
    <span class="code-string">'Str0ng&#64;Pass'</span>,
    <span class="code-string">'C0mplex#Password123'</span>
  ];

  validPasswords.<span class="code-function">forEach</span>(password => &#123;
    <span class="code-function">it</span>(<span class="code-string">\`devrait valider "\$&#123;password&#125;"\`</span>, () => &#123;
      <span class="code-keyword">const</span> result = validator.<span class="code-function">validate</span>(password);
      <span class="code-function">expect</span>(result.isValid).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
      <span class="code-function">expect</span>(result.errors).<span class="code-function">toHaveLength</span>(<span class="code-number">0</span>);
    &#125;);
  &#125;);

  <span class="code-comment">// Tests paramétrés pour les erreurs spécifiques</span>
  <span class="code-keyword">const</span> invalidCases = [
    &#123; password: <span class="code-string">'Short1!'</span>, expectedError: <span class="code-string">'Au moins 8 caractères'</span> &#125;,
    &#123; password: <span class="code-string">'lowercase1!'</span>, expectedError: <span class="code-string">'Au moins une majuscule'</span> &#125;,
    &#123; password: <span class="code-string">'NoNumbers!'</span>, expectedError: <span class="code-string">'Au moins un chiffre'</span> &#125;,
    &#123; password: <span class="code-string">'NoSpecial1'</span>, expectedError: <span class="code-string">'Au moins un caractère spécial'</span> &#125;,
  ];

  invalidCases.<span class="code-function">forEach</span>(&#123; password, expectedError &#125; => &#123;
    <span class="code-function">it</span>(<span class="code-string">\`devrait rejeter "\$&#123;password&#125;" avec erreur: \$&#123;expectedError&#125;\`</span>, () => &#123;
      <span class="code-keyword">const</span> result = validator.<span class="code-function">validate</span>(password);
      <span class="code-function">expect</span>(result.isValid).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);
      <span class="code-function">expect</span>(result.errors).<span class="code-function">toContain</span>(expectedError);
    &#125;);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait retourner toutes les erreurs'</span>, () => &#123;
    <span class="code-keyword">const</span> result = validator.<span class="code-function">validate</span>(<span class="code-string">'a'</span>); <span class="code-comment">// Échoue tout</span>
    <span class="code-function">expect</span>(result.errors).<span class="code-function">toHaveLength</span>(<span class="code-number">4</span>);
    <span class="code-function">expect</span>(result.errors).<span class="code-function">toEqual</span>(<span class="code-function">expect</span>.<span class="code-function">arrayContaining</span>([
      <span class="code-string">'Au moins 8 caractères'</span>,
      <span class="code-string">'Au moins une majuscule'</span>,
      <span class="code-string">'Au moins un chiffre'</span>,
      <span class="code-string">'Au moins un caractère spécial'</span>
    ]));
  &#125;);
&#125;);`,
      explanation: 'Les tests paramétrés permettent de tester de nombreux cas avec peu de code. expect.arrayContaining() vérifie que certains éléments sont présents sans ordre spécifique. toContain() trouve une erreur précise dans la liste.'
    },
    {
      id: 'caching',
      title: 'Service avec Cache',
      difficulty: 'advanced',
      problem: 'Le service utilise un cache interne. Comment vérifier que le cache fonctionne et qu\'il s\'invalide correctement ?',
      solution: 'Utilisez des spies pour compter les appels aux méthodes sous-jacentes et vérifier le comportement du cache.',
      code: `<span class="code-comment">// Service avec cache</span>
<span class="code-keyword">export class</span> <span class="code-class">ExpensiveCalculator</span> &#123;
  <span class="code-keyword">private</span> cache = <span class="code-keyword">new</span> <span class="code-class">Map</span>&lt;<span class="code-class">string</span>, <span class="code-class">number</span>&gt;();
  <span class="code-keyword">public</span> computeCount = <span class="code-number">0</span>; <span class="code-comment">// Pour les tests</span>

  <span class="code-function">compute</span>(input: <span class="code-class">string</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">if</span> (<span class="code-keyword">this</span>.cache.<span class="code-function">has</span>(input)) &#123;
      <span class="code-keyword">return this</span>.cache.<span class="code-function">get</span>(input)!;
    &#125;

    <span class="code-comment">// Calcul coûteux simulé</span>
    <span class="code-keyword">this</span>.computeCount++;
    <span class="code-keyword">const</span> result = input.length * <span class="code-number">42</span>;
    
    <span class="code-keyword">this</span>.cache.<span class="code-function">set</span>(input, result);
    <span class="code-keyword">return</span> result;
  &#125;

  <span class="code-function">clearCache</span>(): <span class="code-keyword">void</span> &#123;
    <span class="code-keyword">this</span>.cache.<span class="code-function">clear</span>();
  &#125;
&#125;

<span class="code-comment">// ✅ Tests du cache</span>
<span class="code-function">describe</span>(<span class="code-string">'ExpensiveCalculator avec cache'</span>, () => &#123;
  <span class="code-keyword">let</span> calculator: <span class="code-class">ExpensiveCalculator</span>;

  <span class="code-function">beforeEach</span>(() => &#123;
    calculator = <span class="code-keyword">new</span> <span class="code-class">ExpensiveCalculator</span>();
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait calculer au premier appel'</span>, () => &#123;
    <span class="code-keyword">const</span> result = calculator.<span class="code-function">compute</span>(<span class="code-string">'test'</span>);
    <span class="code-function">expect</span>(result).<span class="code-function">toBe</span>(<span class="code-number">4</span> * <span class="code-number">42</span>);
    <span class="code-function">expect</span>(calculator.computeCount).<span class="code-function">toBe</span>(<span class="code-number">1</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait utiliser le cache au second appel'</span>, () => &#123;
    calculator.<span class="code-function">compute</span>(<span class="code-string">'test'</span>);
    calculator.<span class="code-function">compute</span>(<span class="code-string">'test'</span>);
    calculator.<span class="code-function">compute</span>(<span class="code-string">'test'</span>);
    
    <span class="code-function">expect</span>(calculator.computeCount).<span class="code-function">toBe</span>(<span class="code-number">1</span>); <span class="code-comment">// Un seul calcul réel</span>
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait recalculer après clearCache'</span>, () => &#123;
    calculator.<span class="code-function">compute</span>(<span class="code-string">'test'</span>);
    <span class="code-function">expect</span>(calculator.computeCount).<span class="code-function">toBe</span>(<span class="code-number">1</span>);

    calculator.<span class="code-function">clearCache</span>();
    calculator.<span class="code-function">compute</span>(<span class="code-string">'test'</span>);
    
    <span class="code-function">expect</span>(calculator.computeCount).<span class="code-function">toBe</span>(<span class="code-number">2</span>); <span class="code-comment">// Recalculé</span>
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait cacher par clé unique'</span>, () => &#123;
    calculator.<span class="code-function">compute</span>(<span class="code-string">'a'</span>);
    calculator.<span class="code-function">compute</span>(<span class="code-string">'b'</span>);
    calculator.<span class="code-function">compute</span>(<span class="code-string">'a'</span>); <span class="code-comment">// Cache hit</span>
    
    <span class="code-function">expect</span>(calculator.computeCount).<span class="code-function">toBe</span>(<span class="code-number">2</span>);
  &#125;);
&#125;);`,
      explanation: 'Pour tester un cache, on compte les appels réels via un compteur ou un spy. On vérifie que les appels répétés avec la même clé ne déclenchent pas de nouveaux calculs, et que clearCache() force un recalcul.'
    }
  ];

  currentScenario = computed(() => {
    return this.trickyScenarios.find(s => s.id === this.activeScenario()) ?? this.trickyScenarios[0];
  });

  readonly examples: ServiceExample[] = [
    {
      id: 'calculator',
      title: 'Calculator Service',
      description: 'Basic arithmetic operations',
      serviceCode: `<span class="code-decorator">@Injectable</span>(&#123; <span class="code-property">providedIn</span>: <span class="code-string">'root'</span> &#125;)
<span class="code-keyword">export class</span> <span class="code-class">CalculatorService</span> &#123;
  
  <span class="code-function">add</span>(a: <span class="code-class">number</span>, b: <span class="code-class">number</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">return</span> a + b;
  &#125;

  <span class="code-function">subtract</span>(a: <span class="code-class">number</span>, b: <span class="code-class">number</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">return</span> a - b;
  &#125;

  <span class="code-function">multiply</span>(a: <span class="code-class">number</span>, b: <span class="code-class">number</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">return</span> a * b;
  &#125;

  <span class="code-function">divide</span>(a: <span class="code-class">number</span>, b: <span class="code-class">number</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">if</span> (b === <span class="code-number">0</span>) &#123;
      <span class="code-keyword">throw new</span> <span class="code-class">Error</span>(<span class="code-string">'Cannot divide by zero'</span>);
    &#125;
    <span class="code-keyword">return</span> a / b;
  &#125;

  <span class="code-function">percentage</span>(value: <span class="code-class">number</span>, percent: <span class="code-class">number</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">return</span> (value * percent) / <span class="code-number">100</span>;
  &#125;

  <span class="code-function">power</span>(base: <span class="code-class">number</span>, exponent: <span class="code-class">number</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">return</span> <span class="code-class">Math</span>.<span class="code-function">pow</span>(base, exponent);
  &#125;
&#125;`,
      testCases: [
        {
          name: 'devrait additionner deux nombres positifs',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait additionner deux nombres positifs'</span>, () => &#123;
  <span class="code-comment">// Arrange</span>
  <span class="code-keyword">const</span> a = <span class="code-number">5</span>, b = <span class="code-number">3</span>;
  
  <span class="code-comment">// Act</span>
  <span class="code-keyword">const</span> result = service.<span class="code-function">add</span>(a, b);
  
  <span class="code-comment">// Assert</span>
  <span class="code-function">expect</span>(result).<span class="code-function">toBe</span>(<span class="code-number">8</span>);
&#125;);`,
          explanation: 'Test basique suivant le pattern AAA. On teste le chemin heureux en premier.',
          bestPractice: 'Toujours commencer par les cas simples et positifs avant les cas limites.'
        },
        {
          name: 'devrait gérer les nombres négatifs',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait gérer les nombres négatifs'</span>, () => &#123;
  <span class="code-function">expect</span>(service.<span class="code-function">add</span>(-<span class="code-number">5</span>, <span class="code-number">3</span>)).<span class="code-function">toBe</span>(-<span class="code-number">2</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">add</span>(-<span class="code-number">5</span>, -<span class="code-number">3</span>)).<span class="code-function">toBe</span>(-<span class="code-number">8</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">subtract</span>(-<span class="code-number">5</span>, -<span class="code-number">3</span>)).<span class="code-function">toBe</span>(-<span class="code-number">2</span>);
&#125;);`,
          explanation: 'Test des cas limites - les nombres négatifs sont une source courante de bugs.'
        },
        {
          name: 'devrait lancer une erreur pour division par zéro',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait lancer une erreur pour division par zéro'</span>, () => &#123;
  <span class="code-comment">// ⚠️ Doit être enveloppé dans une fonction flèche !</span>
  <span class="code-function">expect</span>(() => service.<span class="code-function">divide</span>(<span class="code-number">10</span>, <span class="code-number">0</span>))
    .<span class="code-function">toThrow</span>(<span class="code-string">'Cannot divide by zero'</span>);
&#125;);`,
          explanation: 'Test des erreurs. Notez la fonction flèche - c\'est obligatoire pour toThrow() !'
        },
        {
          name: 'devrait gérer les décimales avec toBeCloseTo',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait gérer les décimales avec toBeCloseTo'</span>, () => &#123;
  <span class="code-keyword">const</span> result = service.<span class="code-function">add</span>(<span class="code-number">0.1</span>, <span class="code-number">0.2</span>);
  
  <span class="code-comment">// ❌ Ceci ÉCHOUERAIT : expect(result).toBe(0.3)</span>
  <span class="code-comment">// ✅ Utilisez toBeCloseTo pour les flottants</span>
  <span class="code-function">expect</span>(result).<span class="code-function">toBeCloseTo</span>(<span class="code-number">0.3</span>);
&#125;);`,
          explanation: 'Problème de précision flottante ! 0.1 + 0.2 = 0.30000000000000004. Utilisez toBeCloseTo().'
        },
        {
          name: 'devrait calculer le pourcentage correctement',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait calculer le pourcentage'</span>, () => &#123;
  <span class="code-function">expect</span>(service.<span class="code-function">percentage</span>(<span class="code-number">200</span>, <span class="code-number">15</span>)).<span class="code-function">toBe</span>(<span class="code-number">30</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">percentage</span>(<span class="code-number">100</span>, <span class="code-number">0</span>)).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">percentage</span>(<span class="code-number">50</span>, <span class="code-number">100</span>)).<span class="code-function">toBe</span>(<span class="code-number">50</span>);
&#125;);`,
          explanation: 'Testez plusieurs cas dans une même assertion quand ils vérifient le même comportement.'
        },
        {
          name: 'devrait gérer la multiplication par zéro',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait gérer les cas avec zéro'</span>, () => &#123;
  <span class="code-comment">// Propriété mathématique : n * 0 = 0</span>
  <span class="code-function">expect</span>(service.<span class="code-function">multiply</span>(<span class="code-number">999</span>, <span class="code-number">0</span>)).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">multiply</span>(<span class="code-number">0</span>, <span class="code-number">999</span>)).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
  
  <span class="code-comment">// Propriété : n + 0 = n</span>
  <span class="code-function">expect</span>(service.<span class="code-function">add</span>(<span class="code-number">42</span>, <span class="code-number">0</span>)).<span class="code-function">toBe</span>(<span class="code-number">42</span>);
&#125;);`,
          explanation: 'Zéro est un cas limite important. Testez les propriétés mathématiques connues.'
        }
      ],
      keyLearnings: [
        'Utilisez toBe() pour les comparaisons primitives',
        'toBeCloseTo() est essentiel pour les nombres décimaux',
        'Toujours tester avec zéro et les nombres négatifs',
        'Enveloppez dans une arrow function pour tester les erreurs'
      ]
    },
    {
      id: 'temperature',
      title: 'Temperature Service',
      description: 'Temperature conversions',
      serviceCode: `<span class="code-decorator">@Injectable</span>(&#123; <span class="code-property">providedIn</span>: <span class="code-string">'root'</span> &#125;)
<span class="code-keyword">export class</span> <span class="code-class">TemperatureService</span> &#123;
  
  <span class="code-keyword">private readonly</span> ABSOLUTE_ZERO = -<span class="code-number">273.15</span>;

  <span class="code-function">celsiusToFahrenheit</span>(c: <span class="code-class">number</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">this</span>.<span class="code-function">validateTemp</span>(c);
    <span class="code-keyword">return</span> (c * <span class="code-number">9</span>/<span class="code-number">5</span>) + <span class="code-number">32</span>;
  &#125;

  <span class="code-function">fahrenheitToCelsius</span>(f: <span class="code-class">number</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">const</span> c = (f - <span class="code-number">32</span>) * <span class="code-number">5</span>/<span class="code-number">9</span>;
    <span class="code-keyword">this</span>.<span class="code-function">validateTemp</span>(c);
    <span class="code-keyword">return</span> c;
  &#125;

  <span class="code-function">celsiusToKelvin</span>(c: <span class="code-class">number</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">this</span>.<span class="code-function">validateTemp</span>(c);
    <span class="code-keyword">return</span> c + <span class="code-number">273.15</span>;
  &#125;

  <span class="code-function">getCategory</span>(c: <span class="code-class">number</span>): <span class="code-class">string</span> &#123;
    <span class="code-keyword">if</span> (c < <span class="code-number">0</span>) <span class="code-keyword">return</span> <span class="code-string">'freezing'</span>;
    <span class="code-keyword">if</span> (c < <span class="code-number">15</span>) <span class="code-keyword">return</span> <span class="code-string">'cold'</span>;
    <span class="code-keyword">if</span> (c < <span class="code-number">25</span>) <span class="code-keyword">return</span> <span class="code-string">'moderate'</span>;
    <span class="code-keyword">if</span> (c < <span class="code-number">35</span>) <span class="code-keyword">return</span> <span class="code-string">'hot'</span>;
    <span class="code-keyword">return</span> <span class="code-string">'extreme'</span>;
  &#125;

  <span class="code-keyword">private</span> <span class="code-function">validateTemp</span>(c: <span class="code-class">number</span>): <span class="code-class">void</span> &#123;
    <span class="code-keyword">if</span> (c < <span class="code-keyword">this</span>.ABSOLUTE_ZERO) &#123;
      <span class="code-keyword">throw new</span> <span class="code-class">Error</span>(<span class="code-string">'Below absolute zero'</span>);
    &#125;
  &#125;
&#125;`,
      testCases: [
        {
          name: 'devrait convertir des valeurs connues',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait convertir des valeurs connues'</span>, () => &#123;
  <span class="code-comment">// Points de conversion connus</span>
  <span class="code-function">expect</span>(service.<span class="code-function">celsiusToFahrenheit</span>(<span class="code-number">0</span>)).<span class="code-function">toBe</span>(<span class="code-number">32</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">celsiusToFahrenheit</span>(<span class="code-number">100</span>)).<span class="code-function">toBe</span>(<span class="code-number">212</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">fahrenheitToCelsius</span>(<span class="code-number">32</span>)).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
&#125;);`,
          explanation: 'Utilisez des valeurs bien connues (points de congélation/ébullition de l\'eau) comme données de test.'
        },
        {
          name: 'devrait gérer la conversion aller-retour',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait faire un aller-retour correct'</span>, () => &#123;
  <span class="code-keyword">const</span> original = <span class="code-number">25</span>;
  <span class="code-keyword">const</span> fahrenheit = service.<span class="code-function">celsiusToFahrenheit</span>(original);
  <span class="code-keyword">const</span> backToCelsius = service.<span class="code-function">fahrenheitToCelsius</span>(fahrenheit);
  
  <span class="code-function">expect</span>(backToCelsius).<span class="code-function">toBeCloseTo</span>(original);
&#125;);`,
          explanation: 'Test aller-retour - vérifie que les opérations inverses fonctionnent ensemble.'
        },
        {
          name: 'devrait rejeter en dessous du zéro absolu',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait rejeter en dessous du zéro absolu'</span>, () => &#123;
  <span class="code-function">expect</span>(() => service.<span class="code-function">celsiusToFahrenheit</span>(-<span class="code-number">300</span>))
    .<span class="code-function">toThrow</span>(<span class="code-string">'Below absolute zero'</span>);
    
  <span class="code-comment">// Juste au-dessus devrait fonctionner</span>
  <span class="code-function">expect</span>(() => service.<span class="code-function">celsiusToFahrenheit</span>(-<span class="code-number">273</span>))
    .not.<span class="code-function">toThrow</span>();
&#125;);`,
          explanation: 'Test des limites physiques - les températures en dessous de -273.15°C sont impossibles.'
        },
        {
          name: 'devrait catégoriser aux frontières',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait catégoriser aux frontières'</span>, () => &#123;
  <span class="code-comment">// Testez les valeurs aux frontières</span>
  <span class="code-function">expect</span>(service.<span class="code-function">getCategory</span>(-<span class="code-number">1</span>)).<span class="code-function">toBe</span>(<span class="code-string">'freezing'</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">getCategory</span>(<span class="code-number">0</span>)).<span class="code-function">toBe</span>(<span class="code-string">'cold'</span>);    <span class="code-comment">// Frontière !</span>
  <span class="code-function">expect</span>(service.<span class="code-function">getCategory</span>(<span class="code-number">14</span>)).<span class="code-function">toBe</span>(<span class="code-string">'cold'</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">getCategory</span>(<span class="code-number">15</span>)).<span class="code-function">toBe</span>(<span class="code-string">'moderate'</span>); <span class="code-comment">// Frontière !</span>
  <span class="code-function">expect</span>(service.<span class="code-function">getCategory</span>(<span class="code-number">25</span>)).<span class="code-function">toBe</span>(<span class="code-string">'hot'</span>);      <span class="code-comment">// Frontière !</span>
  <span class="code-function">expect</span>(service.<span class="code-function">getCategory</span>(<span class="code-number">35</span>)).<span class="code-function">toBe</span>(<span class="code-string">'extreme'</span>);
&#125;);`,
          explanation: 'Test aux frontières - testez aux valeurs exactes où le comportement change.'
        },
        {
          name: 'devrait convertir en Kelvin',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait convertir en Kelvin'</span>, () => &#123;
  <span class="code-function">expect</span>(service.<span class="code-function">celsiusToKelvin</span>(<span class="code-number">0</span>)).<span class="code-function">toBeCloseTo</span>(<span class="code-number">273.15</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">celsiusToKelvin</span>(-<span class="code-number">273.15</span>)).<span class="code-function">toBeCloseTo</span>(<span class="code-number">0</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">celsiusToKelvin</span>(<span class="code-number">100</span>)).<span class="code-function">toBeCloseTo</span>(<span class="code-number">373.15</span>);
&#125;);`,
          explanation: 'Testez avec des valeurs de référence scientifiques connues.'
        },
        {
          name: 'devrait utiliser toBeCloseTo pour les décimales',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait gérer les conversions décimales'</span>, () => &#123;
  <span class="code-comment">// 37°C (température corporelle)</span>
  <span class="code-keyword">const</span> bodyTempF = service.<span class="code-function">celsiusToFahrenheit</span>(<span class="code-number">37</span>);
  <span class="code-function">expect</span>(bodyTempF).<span class="code-function">toBeCloseTo</span>(<span class="code-number">98.6</span>);
  
  <span class="code-comment">// Vérification inverse</span>
  <span class="code-keyword">const</span> backToC = service.<span class="code-function">fahrenheitToCelsius</span>(<span class="code-number">98.6</span>);
  <span class="code-function">expect</span>(backToC).<span class="code-function">toBeCloseTo</span>(<span class="code-number">37</span>);
&#125;);`,
          explanation: 'Les conversions de température produisent souvent des décimales. Utilisez toujours toBeCloseTo().'
        }
      ],
      keyLearnings: [
        'Utilisez des valeurs de référence connues',
        'Testez les opérations inverses (aller-retour)',
        'Testez aux frontières des catégories',
        'Validez les contraintes physiques/métier'
      ]
    },
    {
      id: 'discount',
      title: 'Discount Service',
      description: 'Price calculations & promo codes',
      serviceCode: `<span class="code-decorator">@Injectable</span>(&#123; <span class="code-property">providedIn</span>: <span class="code-string">'root'</span> &#125;)
<span class="code-keyword">export class</span> <span class="code-class">DiscountService</span> &#123;
  
  <span class="code-keyword">private</span> promoCodes: Record&lt;<span class="code-class">string</span>, <span class="code-class">number</span>&gt; = &#123;
    <span class="code-string">'SAVE10'</span>: <span class="code-number">10</span>,
    <span class="code-string">'SAVE20'</span>: <span class="code-number">20</span>,
    <span class="code-string">'VIP50'</span>: <span class="code-number">50</span>
  &#125;;

  <span class="code-function">applyDiscount</span>(price: <span class="code-class">number</span>, percent: <span class="code-class">number</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">if</span> (price < <span class="code-number">0</span>) <span class="code-keyword">return</span> <span class="code-number">0</span>;
    <span class="code-keyword">if</span> (percent < <span class="code-number">0</span> || percent > <span class="code-number">100</span>) <span class="code-keyword">return</span> price;
    <span class="code-keyword">return</span> <span class="code-class">Math</span>.<span class="code-function">round</span>(price * (<span class="code-number">1</span> - percent / <span class="code-number">100</span>) * <span class="code-number">100</span>) / <span class="code-number">100</span>;
  &#125;

  <span class="code-function">isValidPromoCode</span>(code: <span class="code-class">string</span>): <span class="code-class">boolean</span> &#123;
    <span class="code-keyword">return</span> code.<span class="code-function">toUpperCase</span>() <span class="code-keyword">in</span> <span class="code-keyword">this</span>.promoCodes;
  &#125;

  <span class="code-function">getPromoDiscount</span>(code: <span class="code-class">string</span>): <span class="code-class">number</span> &#123;
    <span class="code-keyword">return this</span>.promoCodes[code.<span class="code-function">toUpperCase</span>()] ?? <span class="code-number">0</span>;
  &#125;

  <span class="code-function">calculateCart</span>(items: &#123;price: <span class="code-class">number</span>, qty: <span class="code-class">number</span>&#125;[], promoCode?: <span class="code-class">string</span>) &#123;
    <span class="code-keyword">const</span> subtotal = items.<span class="code-function">reduce</span>((sum, i) => sum + i.price * i.qty, <span class="code-number">0</span>);
    <span class="code-keyword">const</span> discount = promoCode ? <span class="code-keyword">this</span>.<span class="code-function">getPromoDiscount</span>(promoCode) : <span class="code-number">0</span>;
    <span class="code-keyword">const</span> discountAmount = <span class="code-keyword">this</span>.<span class="code-function">applyDiscount</span>(subtotal, discount);
    
    <span class="code-keyword">return</span> &#123;
      subtotal,
      discountPercent: discount,
      discountAmount: subtotal - discountAmount,
      total: discountAmount
    &#125;;
  &#125;
&#125;`,
      testCases: [
        {
          name: 'devrait calculer la remise correctement',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait appliquer le pourcentage de remise'</span>, () => &#123;
  <span class="code-function">expect</span>(service.<span class="code-function">applyDiscount</span>(<span class="code-number">100</span>, <span class="code-number">10</span>)).<span class="code-function">toBe</span>(<span class="code-number">90</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">applyDiscount</span>(<span class="code-number">200</span>, <span class="code-number">25</span>)).<span class="code-function">toBe</span>(<span class="code-number">150</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">applyDiscount</span>(<span class="code-number">50</span>, <span class="code-number">100</span>)).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
&#125;);`,
          explanation: 'Testez la logique métier principale avec différents pourcentages de remise.'
        },
        {
          name: 'devrait gérer les entrées invalides',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait gérer les cas limites'</span>, () => &#123;
  <span class="code-comment">// Prix négatif retourne 0</span>
  <span class="code-function">expect</span>(service.<span class="code-function">applyDiscount</span>(-<span class="code-number">100</span>, <span class="code-number">10</span>)).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
  
  <span class="code-comment">// Pourcentage invalide retourne le prix original</span>
  <span class="code-function">expect</span>(service.<span class="code-function">applyDiscount</span>(<span class="code-number">100</span>, -<span class="code-number">10</span>)).<span class="code-function">toBe</span>(<span class="code-number">100</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">applyDiscount</span>(<span class="code-number">100</span>, <span class="code-number">150</span>)).<span class="code-function">toBe</span>(<span class="code-number">100</span>);
&#125;);`,
          explanation: 'Tests de programmation défensive - vérifiez que le service gère gracieusement les mauvaises entrées.'
        },
        {
          name: 'devrait valider les codes promo (case insensitive)',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait valider les codes promo'</span>, () => &#123;
  <span class="code-function">expect</span>(service.<span class="code-function">isValidPromoCode</span>(<span class="code-string">'SAVE10'</span>)).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">isValidPromoCode</span>(<span class="code-string">'save10'</span>)).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>); <span class="code-comment">// Case insensitive</span>
  <span class="code-function">expect</span>(service.<span class="code-function">isValidPromoCode</span>(<span class="code-string">'VIP50'</span>)).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">isValidPromoCode</span>(<span class="code-string">'INVALID'</span>)).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">isValidPromoCode</span>(<span class="code-string">''</span>)).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);
&#125;);`,
          explanation: 'Testez la validation des codes avec des entrées valides, invalides, et vides. N\'oubliez pas la casse !'
        },
        {
          name: 'devrait retourner les détails complets du panier',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait calculer le panier complet'</span>, () => &#123;
  <span class="code-keyword">const</span> items = [
    &#123; price: <span class="code-number">50</span>, qty: <span class="code-number">2</span> &#125;,
    &#123; price: <span class="code-number">30</span>, qty: <span class="code-number">1</span> &#125;
  ];
  
  <span class="code-keyword">const</span> result = service.<span class="code-function">calculateCart</span>(items, <span class="code-string">'SAVE10'</span>);
  
  <span class="code-comment">// Utilisez toEqual pour la comparaison d'objets</span>
  <span class="code-function">expect</span>(result).<span class="code-function">toEqual</span>(&#123;
    subtotal: <span class="code-number">130</span>,
    discountPercent: <span class="code-number">10</span>,
    discountAmount: <span class="code-number">13</span>,
    total: <span class="code-number">117</span>
  &#125;);
&#125;);`,
          explanation: 'Utilisez toEqual() pour la comparaison profonde d\'objets, pas toBe() (qui vérifie l\'égalité de référence).'
        },
        {
          name: 'devrait arrondir les centimes correctement',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait arrondir les prix correctement'</span>, () => &#123;
  <span class="code-comment">// 19.99 * 0.85 = 16.9915 → devrait être 16.99</span>
  <span class="code-keyword">const</span> result = service.<span class="code-function">applyDiscount</span>(<span class="code-number">19.99</span>, <span class="code-number">15</span>);
  <span class="code-function">expect</span>(result).<span class="code-function">toBe</span>(<span class="code-number">16.99</span>);
  
  <span class="code-comment">// Vérifiez que c'est un nombre avec 2 décimales max</span>
  <span class="code-keyword">const</span> decimals = result.toString().split(<span class="code-string">'.'</span>)[<span class="code-number">1</span>]?.length ?? <span class="code-number">0</span>;
  <span class="code-function">expect</span>(decimals).<span class="code-function">toBeLessThanOrEqual</span>(<span class="code-number">2</span>);
&#125;);`,
          explanation: 'Les calculs de prix doivent toujours être arrondis aux centimes. Testez ce comportement explicitement !'
        },
        {
          name: 'devrait gérer un panier vide',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait gérer un panier vide'</span>, () => &#123;
  <span class="code-keyword">const</span> result = service.<span class="code-function">calculateCart</span>([], <span class="code-string">'SAVE10'</span>);
  
  <span class="code-function">expect</span>(result.subtotal).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
  <span class="code-function">expect</span>(result.total).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
  <span class="code-function">expect</span>(result.discountAmount).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
&#125;);`,
          explanation: 'N\'oubliez jamais de tester avec des collections vides - c\'est un cas limite très courant !'
        }
      ],
      keyLearnings: [
        'Utilisez toEqual() pour comparer des objets',
        'Testez l\'arrondi des valeurs monétaires',
        'N\'oubliez pas les collections/tableaux vides',
        'Testez la sensibilité à la casse des chaînes'
      ]
    },
    {
      id: 'user-validator',
      title: 'User Validator',
      description: 'Validation de données utilisateur',
      serviceCode: `<span class="code-decorator">@Injectable</span>(&#123; <span class="code-property">providedIn</span>: <span class="code-string">'root'</span> &#125;)
<span class="code-keyword">export class</span> <span class="code-class">UserValidatorService</span> &#123;
  
  <span class="code-function">validateEmail</span>(email: <span class="code-class">string</span>): &#123; valid: <span class="code-class">boolean</span>; error?: <span class="code-class">string</span> &#125; &#123;
    <span class="code-keyword">if</span> (!email) <span class="code-keyword">return</span> &#123; valid: <span class="code-keyword">false</span>, error: <span class="code-string">'Email requis'</span> &#125;;
    <span class="code-keyword">if</span> (!email.includes(<span class="code-string">'&#64;'</span>)) <span class="code-keyword">return</span> &#123; valid: <span class="code-keyword">false</span>, error: <span class="code-string">'Format invalide'</span> &#125;;
    <span class="code-keyword">if</span> (email.length > <span class="code-number">254</span>) <span class="code-keyword">return</span> &#123; valid: <span class="code-keyword">false</span>, error: <span class="code-string">'Trop long'</span> &#125;;
    <span class="code-keyword">return</span> &#123; valid: <span class="code-keyword">true</span> &#125;;
  &#125;

  <span class="code-function">validateAge</span>(age: <span class="code-class">number</span>): &#123; valid: <span class="code-class">boolean</span>; error?: <span class="code-class">string</span> &#125; &#123;
    <span class="code-keyword">if</span> (!<span class="code-class">Number</span>.<span class="code-function">isInteger</span>(age)) <span class="code-keyword">return</span> &#123; valid: <span class="code-keyword">false</span>, error: <span class="code-string">'Entier requis'</span> &#125;;
    <span class="code-keyword">if</span> (age < <span class="code-number">0</span>) <span class="code-keyword">return</span> &#123; valid: <span class="code-keyword">false</span>, error: <span class="code-string">'Âge invalide'</span> &#125;;
    <span class="code-keyword">if</span> (age < <span class="code-number">18</span>) <span class="code-keyword">return</span> &#123; valid: <span class="code-keyword">false</span>, error: <span class="code-string">'Doit être majeur'</span> &#125;;
    <span class="code-keyword">if</span> (age > <span class="code-number">120</span>) <span class="code-keyword">return</span> &#123; valid: <span class="code-keyword">false</span>, error: <span class="code-string">'Âge irréaliste'</span> &#125;;
    <span class="code-keyword">return</span> &#123; valid: <span class="code-keyword">true</span> &#125;;
  &#125;

  <span class="code-function">validateUsername</span>(username: <span class="code-class">string</span>): &#123; valid: <span class="code-class">boolean</span>; errors: <span class="code-class">string</span>[] &#125; &#123;
    <span class="code-keyword">const</span> errors: <span class="code-class">string</span>[] = [];
    
    <span class="code-keyword">if</span> (username.length < <span class="code-number">3</span>) errors.<span class="code-function">push</span>(<span class="code-string">'Min 3 caractères'</span>);
    <span class="code-keyword">if</span> (username.length > <span class="code-number">20</span>) errors.<span class="code-function">push</span>(<span class="code-string">'Max 20 caractères'</span>);
    <span class="code-keyword">if</span> (!<span class="code-string">/^[a-zA-Z0-9_]+$/</span>.<span class="code-function">test</span>(username)) 
      errors.<span class="code-function">push</span>(<span class="code-string">'Caractères alphanumériques uniquement'</span>);
    <span class="code-keyword">if</span> (<span class="code-string">/^[0-9]/</span>.<span class="code-function">test</span>(username)) 
      errors.<span class="code-function">push</span>(<span class="code-string">'Ne doit pas commencer par un chiffre'</span>);

    <span class="code-keyword">return</span> &#123; valid: errors.length === <span class="code-number">0</span>, errors &#125;;
  &#125;
&#125;`,
      testCases: [
        {
          name: 'devrait valider un email correct',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait valider un email correct'</span>, () => &#123;
  <span class="code-keyword">const</span> result = service.<span class="code-function">validateEmail</span>(<span class="code-string">'user&#64;example.com'</span>);
  
  <span class="code-function">expect</span>(result.valid).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
  <span class="code-function">expect</span>(result.error).<span class="code-function">toBeUndefined</span>();
&#125;);`,
          explanation: 'Testez d\'abord le cas positif - un email valide doit retourner valid: true sans erreur.'
        },
        {
          name: 'devrait rejeter un email vide',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait rejeter un email vide'</span>, () => &#123;
  <span class="code-function">expect</span>(service.<span class="code-function">validateEmail</span>(<span class="code-string">''</span>)).<span class="code-function">toEqual</span>(&#123;
    valid: <span class="code-keyword">false</span>,
    error: <span class="code-string">'Email requis'</span>
  &#125;);
  
  <span class="code-comment">// Testez aussi null/undefined si applicable</span>
  <span class="code-function">expect</span>(service.<span class="code-function">validateEmail</span>(<span class="code-keyword">null</span> <span class="code-keyword">as any</span>).valid).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);
&#125;);`,
          explanation: 'Testez les valeurs vides et nulles - ce sont des cas limites très courants.'
        },
        {
          name: 'devrait valider l\'âge aux frontières',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait valider l\'âge aux frontières'</span>, () => &#123;
  <span class="code-comment">// Juste en dessous de la limite</span>
  <span class="code-function">expect</span>(service.<span class="code-function">validateAge</span>(<span class="code-number">17</span>).valid).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">validateAge</span>(<span class="code-number">17</span>).error).<span class="code-function">toBe</span>(<span class="code-string">'Doit être majeur'</span>);
  
  <span class="code-comment">// À la limite exacte</span>
  <span class="code-function">expect</span>(service.<span class="code-function">validateAge</span>(<span class="code-number">18</span>).valid).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
  
  <span class="code-comment">// Juste au-dessus</span>
  <span class="code-function">expect</span>(service.<span class="code-function">validateAge</span>(<span class="code-number">19</span>).valid).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
  
  <span class="code-comment">// Limite supérieure</span>
  <span class="code-function">expect</span>(service.<span class="code-function">validateAge</span>(<span class="code-number">120</span>).valid).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
  <span class="code-function">expect</span>(service.<span class="code-function">validateAge</span>(<span class="code-number">121</span>).valid).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);
&#125;);`,
          explanation: 'Boundary testing : testez N-1, N, et N+1 pour chaque limite. C\'est là que les bugs se cachent !'
        },
        {
          name: 'devrait rejeter un âge décimal',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait rejeter un âge décimal'</span>, () => &#123;
  <span class="code-function">expect</span>(service.<span class="code-function">validateAge</span>(<span class="code-number">25.5</span>)).<span class="code-function">toEqual</span>(&#123;
    valid: <span class="code-keyword">false</span>,
    error: <span class="code-string">'Entier requis'</span>
  &#125;);
  
  <span class="code-function">expect</span>(service.<span class="code-function">validateAge</span>(<span class="code-number">18.1</span>).valid).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);
&#125;);`,
          explanation: 'Les âges doivent être des entiers. Testez que les décimales sont rejetées.'
        },
        {
          name: 'devrait retourner toutes les erreurs du username',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait accumuler toutes les erreurs'</span>, () => &#123;
  <span class="code-comment">// "1" viole plusieurs règles</span>
  <span class="code-keyword">const</span> result = service.<span class="code-function">validateUsername</span>(<span class="code-string">'1'</span>);
  
  <span class="code-function">expect</span>(result.valid).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);
  <span class="code-function">expect</span>(result.errors).<span class="code-function">toContain</span>(<span class="code-string">'Min 3 caractères'</span>);
  <span class="code-function">expect</span>(result.errors).<span class="code-function">toContain</span>(<span class="code-string">'Ne doit pas commencer par un chiffre'</span>);
  <span class="code-function">expect</span>(result.errors.length).<span class="code-function">toBe</span>(<span class="code-number">2</span>);
&#125;);`,
          explanation: 'Quand plusieurs règles échouent, toutes les erreurs doivent être retournées, pas seulement la première.'
        },
        {
          name: 'devrait accepter un username valide',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait accepter des usernames valides'</span>, () => &#123;
  <span class="code-keyword">const</span> validUsernames = [<span class="code-string">'john'</span>, <span class="code-string">'John_Doe'</span>, <span class="code-string">'user123'</span>, <span class="code-string">'_underscore'</span>];
  
  validUsernames.<span class="code-function">forEach</span>(username => &#123;
    <span class="code-keyword">const</span> result = service.<span class="code-function">validateUsername</span>(username);
    <span class="code-function">expect</span>(result.valid).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>, <span class="code-string">\`\$&#123;username&#125; devrait être valide\`</span>);
    <span class="code-function">expect</span>(result.errors).<span class="code-function">toHaveLength</span>(<span class="code-number">0</span>);
  &#125;);
&#125;);`,
          explanation: 'Utilisez des tests paramétrés pour tester plusieurs cas valides efficacement.'
        },
        {
          name: 'devrait rejeter les caractères spéciaux',
          status: 'pass',
          code: `<span class="code-function">it</span>(<span class="code-string">'devrait rejeter les caractères spéciaux'</span>, () => &#123;
  <span class="code-keyword">const</span> invalidUsernames = [<span class="code-string">'user&#64;name'</span>, <span class="code-string">'user name'</span>, <span class="code-string">'user-name'</span>, <span class="code-string">'user.name'</span>];
  
  invalidUsernames.<span class="code-function">forEach</span>(username => &#123;
    <span class="code-keyword">const</span> result = service.<span class="code-function">validateUsername</span>(username);
    <span class="code-function">expect</span>(result.valid).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);
    <span class="code-function">expect</span>(result.errors).<span class="code-function">toContain</span>(<span class="code-string">'Caractères alphanumériques uniquement'</span>);
  &#125;);
&#125;);`,
          explanation: 'Testez différents types de caractères spéciaux qui devraient être rejetés.'
        }
      ],
      keyLearnings: [
        'Utilisez le boundary testing (N-1, N, N+1)',
        'Testez les valeurs nulles et vides',
        'Vérifiez que toutes les erreurs sont retournées',
        'Utilisez toContain() pour les tableaux d\'erreurs'
      ]
    }
  ];

  currentExample = computed(() => {
    return this.examples.find(e => e.id === this.activeExample()) ?? this.examples[0];
  });

  passCount = computed(() => {
    return this.currentExample()?.testCases.filter(t => t.status === 'pass').length ?? 0;
  });

  failCount = computed(() => {
    return this.currentExample()?.testCases.filter(t => t.status === 'fail').length ?? 0;
  });

  toggleTest(index: number): void {
    this.expandedTest.set(this.expandedTest() === index ? null : index);
  }
}
