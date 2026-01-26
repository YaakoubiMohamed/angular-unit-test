import { Component, signal, computed } from '@angular/core';
import { CounterPlaygroundComponent } from './playground/counter-playground.component';

interface TrickyScenario {
  id: string;
  title: string;
  difficulty: 'intermediate' | 'advanced';
  problem: string;
  solution: string;
  code: string;
  explanation: string;
}

interface BestPractice {
  title: string;
  description: string;
  doExample?: string;
  dontExample?: string;
}

@Component({
  selector: 'app-component-testing',
  standalone: true,
  imports: [CounterPlaygroundComponent],
  template: `
    <div class="component-testing-container">
      <header class="page-header">
        <h1> Tests de Composants</h1>
        <p>Maîtrisez les tests de composants Angular avec TestBed, fixtures et interactions DOM</p>
        
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
            <h2> Mode Interactif</h2>
            <p>
              Expérimentez avec les composants en temps réel ! Simulez des interactions, 
              testez des requêtes DOM et voyez les résultats instantanément.
            </p>
          </div>
          
          <app-counter-playground />
        </section>
      } @else {
        <!-- Tutorial Mode - Original Content -->

      <!-- Key Concepts Overview -->
      <section class="overview-section">
        <div class="concept-cards">
          <div class="concept-card card">
            <span class="concept-icon"></span>
            <h3>TestBed</h3>
            <p>Module de test Angular qui configure et crée des composants en isolation</p>
          </div>
          <div class="concept-card card">
            <span class="concept-icon"></span>
            <h3>ComponentFixture</h3>
            <p>Enveloppe autour du composant donnant accès à l'instance et au DOM</p>
          </div>
          <div class="concept-card card">
            <span class="concept-icon"></span>
            <h3>DebugElement</h3>
            <p>Enveloppe multiplateforme pour interroger et interagir avec le DOM</p>
          </div>
          <div class="concept-card card">
            <span class="concept-icon"></span>
            <h3>Détection des Changements</h3>
            <p>Déclenchez manuellement les mises à jour avec fixture.detectChanges()</p>
          </div>
        </div>
      </section>

      <!-- Tab Navigation -->
      <nav class="tabs">
        <button 
          class="tab" 
          [class.active]="activeTab() === 'setup'"
          (click)="activeTab.set('setup')">
           Configuration TestBed
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab() === 'queries'"
          (click)="activeTab.set('queries')">
           Requêtes DOM
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab() === 'events'"
          (click)="activeTab.set('events')">
           Événements Utilisateur
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab() === 'inputs'"
          (click)="activeTab.set('inputs')">
           Entrées/Sorties
        </button>
      </nav>

      <!-- TestBed Setup Section -->
      @if (activeTab() === 'setup') {
        <section class="tab-content animate-fade-in">
          <h2> Configuration de TestBed</h2>
          <p class="section-intro">
            TestBed crée un module de test spécifiquement pour votre composant. 
            C'est comme créer une mini application Angular juste pour les tests.
          </p>

          <div class="code-example card">
            <h4> Configuration de Base du Test de Composant</h4>
            <pre><code><span class="code-keyword">import</span> &#123; ComponentFixture, TestBed &#125; <span class="code-keyword">from</span> <span class="code-string">'&#64;angular/core/testing'</span>;
<span class="code-keyword">import</span> &#123; By &#125; <span class="code-keyword">from</span> <span class="code-string">'&#64;angular/platform-browser'</span>;
<span class="code-keyword">import</span> &#123; describe, it, expect, beforeEach &#125; <span class="code-keyword">from</span> <span class="code-string">'vitest'</span>;
<span class="code-keyword">import</span> &#123; CounterComponent &#125; <span class="code-keyword">from</span> <span class="code-string">'./counter.component'</span>;

<span class="code-function">describe</span>(<span class="code-string">'CounterComponent'</span>, () => &#123;
  <span class="code-keyword">let</span> component: <span class="code-class">CounterComponent</span>;
  <span class="code-keyword">let</span> fixture: <span class="code-class">ComponentFixture</span>&lt;<span class="code-class">CounterComponent</span>&gt;;

  <span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
    <span class="code-comment">// Configure the testing module</span>
    <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [CounterComponent]  <span class="code-comment">// Standalone component</span>
    &#125;).<span class="code-function">compileComponents</span>();

    <span class="code-comment">// Create component instance</span>
    fixture = TestBed.<span class="code-function">createComponent</span>(CounterComponent);
    component = fixture.componentInstance;
    
    <span class="code-comment">// Trigger initial change detection</span>
    fixture.<span class="code-function">detectChanges</span>();
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'should create'</span>, () => &#123;
    <span class="code-function">expect</span>(component).<span class="code-function">toBeTruthy</span>();
  &#125;);
&#125;);</code></pre>
          </div>

          <div class="info-grid">
            <div class="info-card card">
              <h4> Objets Clés</h4>
              <ul>
                <li><strong>fixture:</strong> Accès au composant + DOM</li>
                <li><strong>fixture.componentInstance:</strong> La classe du composant</li>
                <li><strong>fixture.debugElement:</strong> Enveloppe de l'élément DOM racine</li>
                <li><strong>fixture.nativeElement:</strong> Élément DOM réel</li>
              </ul>
            </div>
            <div class="info-card card">
              <h4> detectChanges()</h4>
              <p>Angular ne détecte pas automatiquement les changements dans les tests. Appelez <code>fixture.detectChanges()</code> après :</p>
              <ul>
                <li>Configuration initiale</li>
                <li>Modification des propriétés du composant</li>
                <li>Interactions utilisateur</li>
                <li>Fin des opérations asynchrones</li>
              </ul>
            </div>
          </div>

          <div class="code-example card">
            <h4> Avec Dépendances & Providers</h4>
            <pre><code><span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
  <span class="code-comment">// Create a mock service</span>
  <span class="code-keyword">const</span> mockUserService = &#123;
    <span class="code-function">getUser</span>: () => <span class="code-function">of</span>(&#123; name: <span class="code-string">'Test User'</span> &#125;)
  &#125;;

  <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
    <span class="code-property">imports</span>: [
      UserProfileComponent,
      HttpClientTestingModule  <span class="code-comment">// Mock HTTP</span>
    ],
    <span class="code-property">providers</span>: [
      <span class="code-comment">// Override the real service with mock</span>
      &#123; <span class="code-property">provide</span>: UserService, <span class="code-property">useValue</span>: mockUserService &#125;
    ]
  &#125;).<span class="code-function">compileComponents</span>();
&#125;);</code></pre>
          </div>
        </section>
      }

      <!-- DOM Queries Section -->
      @if (activeTab() === 'queries') {
        <section class="tab-content animate-fade-in">
          <h2> Interroger le DOM</h2>
          <p class="section-intro">
            Utilisez DebugElement et les utilitaires By pour trouver des éléments dans le template de votre composant.
            Préférez toujours les attributs <code>data-testid</code> pour des sélecteurs stables.
          </p>

          <div class="query-methods">
            <div class="query-card card">
              <h4>📍 By.css() - Sélecteurs CSS</h4>
              <pre><code><span class="code-comment">// ✅ MEILLEUR : Utilisez data-testid (stable, sémantique)</span>
<span class="code-keyword">const</span> btn = fixture.debugElement
  .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="submit-btn"]'</span>));

<span class="code-comment">// ⚠️ OK : Par type d'élément</span>
<span class="code-keyword">const</span> heading = fixture.debugElement
  .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'h1'</span>));

<span class="code-comment">// ❌ À ÉVITER : Classes CSS (casse si le style change)</span>
<span class="code-keyword">const</span> card = fixture.debugElement
  .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'.card-primary'</span>));</code></pre>
            </div>

            <div class="query-card card">
              <h4>📍 query() vs queryAll()</h4>
              <pre><code><span class="code-comment">// Élément unique (retourne DebugElement | null)</span>
<span class="code-keyword">const</span> button = fixture.debugElement
  .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'button'</span>));

<span class="code-comment">// Plusieurs éléments (retourne DebugElement[])</span>
<span class="code-keyword">const</span> allButtons = fixture.debugElement
  .<span class="code-function">queryAll</span>(<span class="code-function">By.css</span>(<span class="code-string">'button'</span>));

<span class="code-function">expect</span>(allButtons.length).<span class="code-function">toBe</span>(<span class="code-number">3</span>);</code></pre>
            </div>

            <div class="query-card card">
              <h4>📍 By.directive() - Trouver par Composant/Directive</h4>
              <pre><code><span class="code-comment">// Trouver les composants enfants</span>
<span class="code-keyword">const</span> childComponent = fixture.debugElement
  .<span class="code-function">query</span>(<span class="code-function">By.directive</span>(ChildComponent));

<span class="code-comment">// Accéder à l'instance du composant enfant</span>
<span class="code-keyword">const</span> childInstance = childComponent
  .componentInstance <span class="code-keyword">as</span> ChildComponent;</code></pre>
            </div>

            <div class="query-card card">
              <h4>📍 Accéder au Contenu des Éléments</h4>
              <pre><code><span class="code-keyword">const</span> title = fixture.debugElement
  .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="title"]'</span>));

<span class="code-comment">// Obtenir le contenu textuel</span>
<span class="code-function">expect</span>(title.nativeElement.textContent)
  .<span class="code-function">toContain</span>(<span class="code-string">'Welcome'</span>);

<span class="code-comment">// Obtenir un attribut</span>
<span class="code-function">expect</span>(title.nativeElement.<span class="code-function">getAttribute</span>(<span class="code-string">'class'</span>))
  .<span class="code-function">toContain</span>(<span class="code-string">'active'</span>);

<span class="code-comment">// Vérifier la visibilité</span>
<span class="code-function">expect</span>(title.nativeElement.hidden).<span class="code-function">toBe</span>(<span class="code-keyword">false</span>);</code></pre>
            </div>
          </div>

          <div class="alert alert-info">
            <span class="alert-icon"></span>
            <div>
              <strong>Conseil Pro :</strong> Ajoutez data-testid à vos templates de composants :
              <pre><code>&lt;button data-testid="submit-btn"&gt;Soumettre&lt;/button&gt;
&lt;input data-testid="email-input" /&gt;
&lt;div data-testid="error-msg"&gt;Erreur ici&lt;/div&gt;</code></pre>
            </div>
          </div>
        </section>
      }

      <!-- User Events Section -->
      @if (activeTab() === 'events') {
        <section class="tab-content animate-fade-in">
          <h2> Simuler les Événements Utilisateur</h2>
          <p class="section-intro">
            Testez les interactions utilisateur en déclenchant des événements DOM. Appelez toujours 
            <code>detectChanges()</code> après les événements pour mettre à jour la vue.
          </p>

          <div class="event-examples">
            <div class="event-card card">
              <h4> Événements de Clic</h4>
              <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait incrémenter au clic'</span>, () => &#123;
  <span class="code-keyword">const</span> btn = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="increment-btn"]'</span>));
  
  <span class="code-comment">// Simuler le clic</span>
  btn.nativeElement.<span class="code-function">click</span>();
  fixture.<span class="code-function">detectChanges</span>();
  
  <span class="code-function">expect</span>(component.<span class="code-function">count</span>()).<span class="code-function">toBe</span>(<span class="code-number">1</span>);
&#125;);

<span class="code-comment">// Alternative : triggerEventHandler</span>
btn.<span class="code-function">triggerEventHandler</span>(<span class="code-string">'click'</span>, <span class="code-keyword">null</span>);</code></pre>
            </div>

            <div class="event-card card">
              <h4> Événements de Saisie</h4>
              <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait se mettre à jour lors de la saisie'</span>, <span class="code-keyword">async</span> () => &#123;
  <span class="code-keyword">const</span> input = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="email-input"]'</span>));
  
  <span class="code-comment">// Définir la valeur et dispatcher l'événement</span>
  input.nativeElement.value = <span class="code-string">'test&#64;example.com'</span>;
  input.nativeElement.<span class="code-function">dispatchEvent</span>(
    <span class="code-keyword">new</span> <span class="code-class">Event</span>(<span class="code-string">'input'</span>)
  );
  
  fixture.<span class="code-function">detectChanges</span>();
  <span class="code-keyword">await</span> fixture.<span class="code-function">whenStable</span>();
  
  <span class="code-function">expect</span>(component.email).<span class="code-function">toBe</span>(<span class="code-string">'test&#64;example.com'</span>);
&#125;);</code></pre>
            </div>

            <div class="event-card card">
              <h4> Soumission de Formulaire</h4>
              <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait gérer la soumission du formulaire'</span>, () => &#123;
  <span class="code-comment">// Remplir d'abord les champs du formulaire</span>
  component.email = <span class="code-string">'user&#64;test.com'</span>;
  component.password = <span class="code-string">'secret123'</span>;
  fixture.<span class="code-function">detectChanges</span>();
  
  <span class="code-comment">// Soumettre le formulaire</span>
  <span class="code-keyword">const</span> form = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'form'</span>));
  form.<span class="code-function">triggerEventHandler</span>(<span class="code-string">'ngSubmit'</span>, <span class="code-keyword">null</span>);
  fixture.<span class="code-function">detectChanges</span>();
  
  <span class="code-function">expect</span>(component.<span class="code-function">isSubmitted</span>()).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
&#125;);</code></pre>
            </div>

            <div class="event-card card">
              <h4> Événements Blur/Focus</h4>
              <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait valider à la perte de focus'</span>, () => &#123;
  <span class="code-keyword">const</span> input = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="email-input"]'</span>));
  
  <span class="code-comment">// Laisser le champ vide et perdre le focus</span>
  input.nativeElement.<span class="code-function">dispatchEvent</span>(
    <span class="code-keyword">new</span> <span class="code-class">Event</span>(<span class="code-string">'blur'</span>)
  );
  fixture.<span class="code-function">detectChanges</span>();
  
  <span class="code-comment">// Vérifier que le message d'erreur apparaît</span>
  <span class="code-keyword">const</span> error = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="email-error"]'</span>));
  <span class="code-function">expect</span>(error).not.<span class="code-function">toBeNull</span>();
&#125;);</code></pre>
            </div>
          </div>

          <div class="alert alert-warning">
            <span class="alert-icon">⚠️</span>
            <div>
              <strong>Erreurs Courantes :</strong>
              <ul style="margin: 0.5rem 0 0; padding-left: 1.5rem;">
                <li>Oublier <code>fixture.detectChanges()</code> après les événements</li>
                <li>Ne pas utiliser <code>await fixture.whenStable()</code> avec ngModel</li>
                <li>Interroger avant que le DOM soit mis à jour</li>
              </ul>
            </div>
          </div>
        </section>
      }

      <!-- Inputs/Outputs Section -->
      @if (activeTab() === 'inputs') {
        <section class="tab-content animate-fade-in">
          <h2> Tester les Entrées et Sorties</h2>
          <p class="section-intro">
            Les composants communiquent via &#64;Input() et &#64;Output(). Voici comment les tester correctement.
          </p>

          <div class="io-examples">
            <div class="io-card card">
              <h4> Tester &#64;Input()</h4>
              <pre><code><span class="code-comment">// Composant sous test</span>
<span class="code-decorator">&#64;Component</span>(&#123;...&#125;)
<span class="code-keyword">export class</span> <span class="code-class">UserCardComponent</span> &#123;
  <span class="code-decorator">&#64;Input</span>() user!: User;
  <span class="code-decorator">&#64;Input</span>() showDetails = <span class="code-keyword">false</span>;
&#125;

<span class="code-comment">// Test</span>
<span class="code-function">it</span>(<span class="code-string">'devrait afficher le nom de l\'utilisateur'</span>, () => &#123;
  <span class="code-comment">// Définir l'entrée avant detectChanges</span>
  component.user = &#123; 
    name: <span class="code-string">'John Doe'</span>, 
    email: <span class="code-string">'john&#64;example.com'</span> 
  &#125;;
  fixture.<span class="code-function">detectChanges</span>();
  
  <span class="code-keyword">const</span> name = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="user-name"]'</span>));
  
  <span class="code-function">expect</span>(name.nativeElement.textContent)
    .<span class="code-function">toContain</span>(<span class="code-string">'John Doe'</span>);
&#125;);</code></pre>
            </div>

            <div class="io-card card">
              <h4> Tester &#64;Output() avec EventEmitter</h4>
              <pre><code><span class="code-comment">// Composant sous test</span>
<span class="code-decorator">&#64;Component</span>(&#123;...&#125;)
<span class="code-keyword">export class</span> <span class="code-class">DeleteButtonComponent</span> &#123;
  <span class="code-decorator">&#64;Output</span>() deleted = <span class="code-keyword">new</span> <span class="code-class">EventEmitter</span>&lt;<span class="code-class">string</span>&gt;();
  
  <span class="code-function">onDelete</span>(id: <span class="code-class">string</span>) &#123;
    <span class="code-keyword">this</span>.deleted.<span class="code-function">emit</span>(id);
  &#125;
&#125;

<span class="code-comment">// Test</span>
<span class="code-function">it</span>(<span class="code-string">'devrait émettre l\'événement deleted'</span>, () => &#123;
  <span class="code-keyword">let</span> emittedId: <span class="code-class">string</span> | <span class="code-keyword">undefined</span>;
  
  <span class="code-comment">// S'abonner à l'output</span>
  component.deleted.<span class="code-function">subscribe</span>((id) => &#123;
    emittedId = id;
  &#125;);
  
  <span class="code-comment">// Déclencher l'action</span>
  component.<span class="code-function">onDelete</span>(<span class="code-string">'user-123'</span>);
  
  <span class="code-function">expect</span>(emittedId).<span class="code-function">toBe</span>(<span class="code-string">'user-123'</span>);
&#125;);</code></pre>
            </div>

            <div class="io-card card">
              <h4>🆕 Tester les Entrées signal() (Angular 17+)</h4>
              <pre><code><span class="code-comment">// Composant avec entrées signal</span>
<span class="code-decorator">&#64;Component</span>(&#123;...&#125;)
<span class="code-keyword">export class</span> <span class="code-class">ModernComponent</span> &#123;
  name = <span class="code-function">input</span>&lt;<span class="code-class">string</span>&gt;(<span class="code-string">''</span>);
  count = <span class="code-function">input</span>.<span class="code-function">required</span>&lt;<span class="code-class">number</span>&gt;();
&#125;

<span class="code-comment">// Test avec ComponentRef</span>
<span class="code-function">it</span>(<span class="code-string">'devrait gérer les entrées signal'</span>, () => &#123;
  <span class="code-comment">// Utiliser fixture.componentRef pour les entrées signal</span>
  fixture.componentRef.<span class="code-function">setInput</span>(<span class="code-string">'name'</span>, <span class="code-string">'Test'</span>);
  fixture.componentRef.<span class="code-function">setInput</span>(<span class="code-string">'count'</span>, <span class="code-number">5</span>);
  fixture.<span class="code-function">detectChanges</span>();
  
  <span class="code-function">expect</span>(component.<span class="code-function">name</span>()).<span class="code-function">toBe</span>(<span class="code-string">'Test'</span>);
  <span class="code-function">expect</span>(component.<span class="code-function">count</span>()).<span class="code-function">toBe</span>(<span class="code-number">5</span>);
&#125;);</code></pre>
            </div>

            <div class="io-card card">
              <h4>🆕 Tester les Sorties output() Signals (Angular 17+)</h4>
              <pre><code><span class="code-comment">// Composant avec sorties signal</span>
<span class="code-decorator">&#64;Component</span>(&#123;...&#125;)
<span class="code-keyword">export class</span> <span class="code-class">ModernComponent</span> &#123;
  saved = <span class="code-function">output</span>&lt;<span class="code-class">Data</span>&gt;();
  
  <span class="code-function">save</span>(data: <span class="code-class">Data</span>) &#123;
    <span class="code-keyword">this</span>.saved.<span class="code-function">emit</span>(data);
  &#125;
&#125;

<span class="code-comment">// Test</span>
<span class="code-function">it</span>(<span class="code-string">'devrait émettre lors de la sauvegarde'</span>, () => &#123;
  <span class="code-keyword">let</span> result: <span class="code-class">Data</span> | <span class="code-keyword">undefined</span>;
  
  <span class="code-comment">// S'abonner au signal de sortie</span>
  component.saved.<span class="code-function">subscribe</span>((data) => &#123;
    result = data;
  &#125;);
  
  component.<span class="code-function">save</span>(&#123; id: <span class="code-number">1</span> &#125;);
  
  <span class="code-function">expect</span>(result).<span class="code-function">toEqual</span>(&#123; id: <span class="code-number">1</span> &#125;);
&#125;);</code></pre>
            </div>
          </div>
        </section>
      }

      <!-- Exemple Complet -->
      <section class="complete-example card">
        <h2> Exemple Complet de Test de Composant</h2>
        <pre><code><span class="code-keyword">import</span> &#123; ComponentFixture, TestBed &#125; <span class="code-keyword">from</span> <span class="code-string">'&#64;angular/core/testing'</span>;
<span class="code-keyword">import</span> &#123; By &#125; <span class="code-keyword">from</span> <span class="code-string">'&#64;angular/platform-browser'</span>;
<span class="code-keyword">import</span> &#123; describe, it, expect, beforeEach &#125; <span class="code-keyword">from</span> <span class="code-string">'vitest'</span>;
<span class="code-keyword">import</span> &#123; CounterComponent &#125; <span class="code-keyword">from</span> <span class="code-string">'./counter.component'</span>;

<span class="code-function">describe</span>(<span class="code-string">'CounterComponent'</span>, () => &#123;
  <span class="code-keyword">let</span> component: <span class="code-class">CounterComponent</span>;
  <span class="code-keyword">let</span> fixture: <span class="code-class">ComponentFixture</span>&lt;<span class="code-class">CounterComponent</span>&gt;;

  <span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
    <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [CounterComponent]
    &#125;).<span class="code-function">compileComponents</span>();

    fixture = TestBed.<span class="code-function">createComponent</span>(CounterComponent);
    component = fixture.componentInstance;
    fixture.<span class="code-function">detectChanges</span>();
  &#125;);

  <span class="code-function">describe</span>(<span class="code-string">'initialization'</span>, () => &#123;
    <span class="code-function">it</span>(<span class="code-string">'should start at zero'</span>, () => &#123;
      <span class="code-function">expect</span>(component.<span class="code-function">count</span>()).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
    &#125;);

    <span class="code-function">it</span>(<span class="code-string">'should display count in template'</span>, () => &#123;
      <span class="code-keyword">const</span> display = fixture.debugElement
        .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="count"]'</span>));
      <span class="code-function">expect</span>(display.nativeElement.textContent).<span class="code-function">toContain</span>(<span class="code-string">'0'</span>);
    &#125;);
  &#125;);

  <span class="code-function">describe</span>(<span class="code-string">'user interactions'</span>, () => &#123;
    <span class="code-function">it</span>(<span class="code-string">'should increment on button click'</span>, () => &#123;
      <span class="code-keyword">const</span> btn = fixture.debugElement
        .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="increment-btn"]'</span>));
      
      btn.nativeElement.<span class="code-function">click</span>();
      fixture.<span class="code-function">detectChanges</span>();
      
      <span class="code-function">expect</span>(component.<span class="code-function">count</span>()).<span class="code-function">toBe</span>(<span class="code-number">1</span>);
    &#125;);

    <span class="code-function">it</span>(<span class="code-string">'should disable decrement at zero'</span>, () => &#123;
      <span class="code-keyword">const</span> btn = fixture.debugElement
        .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="decrement-btn"]'</span>));
      
      <span class="code-function">expect</span>(btn.nativeElement.disabled).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
    &#125;);
  &#125;);
&#125;);</code></pre>
      </section>

      <!-- Section Best Practices -->
      <section class="best-practices-section card">
        <h2> Bonnes Pratiques pour les Tests de Composants</h2>
        <div class="practices-grid">
          @for (practice of bestPractices; track practice.title) {
            <div class="practice-card">
              <div class="practice-header">
                <span class="practice-icon"></span>
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
          Ces exemples avancés couvrent des situations délicates lors des tests de composants Angular.
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
              <h3>{{ scenario.title }}</h3>
              
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

      <!-- Section Checklist -->
      <section class="checklist-section card">
        <h2>✅ Checklist des Tests de Composants</h2>
        <div class="checklist-grid">
          <div class="checklist-column">
            <h4> Template & Rendu</h4>
            <ul>
              <li>Le composant s'affiche sans erreur</li>
              <li>Les bindings affichent les bonnes valeurs</li>
              <li>Les conditions &#64;if/&#64;for fonctionnent</li>
              <li>Les classes CSS sont appliquées correctement</li>
            </ul>
          </div>
          <div class="checklist-column">
            <h4> Interactions</h4>
            <ul>
              <li>Les clics déclenchent les actions</li>
              <li>Les saisies mettent à jour les valeurs</li>
              <li>Les formulaires se soumettent correctement</li>
              <li>Les éléments se désactivent/activent</li>
            </ul>
          </div>
          <div class="checklist-column">
            <h4> Entrées/Sorties</h4>
            <ul>
              <li>Les &#64;Input changent le rendu</li>
              <li>Les &#64;Output émettent les événements</li>
              <li>Les valeurs par défaut fonctionnent</li>
              <li>Les inputs requis sont validés</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Patterns Avancés -->
      <section class="advanced-patterns card">
        <h2> Patterns de Test Avancés</h2>
        
        <div class="pattern-item">
          <h4>1️⃣ Tester les Composants avec Services</h4>
          <pre><code><span class="code-function">describe</span>(<span class="code-string">'ComponentWithService'</span>, () => &#123;
  <span class="code-keyword">let</span> mockService: <span class="code-keyword">jasmine</span>.<span class="code-class">SpyObj</span>&lt;<span class="code-class">DataService</span>&gt;;

  <span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
    <span class="code-comment">// Créer un mock du service</span>
    mockService = <span class="code-keyword">jasmine</span>.<span class="code-function">createSpyObj</span>(<span class="code-string">'DataService'</span>, [<span class="code-string">'getData'</span>]);
    mockService.<span class="code-function">getData</span>.<span class="code-function">and</span>.<span class="code-function">returnValue</span>(<span class="code-function">of</span>([<span class="code-string">'item1'</span>, <span class="code-string">'item2'</span>]));

    <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [MyComponent],
      <span class="code-property">providers</span>: [
        &#123; <span class="code-property">provide</span>: DataService, <span class="code-property">useValue</span>: mockService &#125;
      ]
    &#125;).<span class="code-function">compileComponents</span>();
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait appeler le service au démarrage'</span>, () => &#123;
    fixture.<span class="code-function">detectChanges</span>();
    <span class="code-function">expect</span>(mockService.<span class="code-function">getData</span>).<span class="code-function">toHaveBeenCalled</span>();
  &#125;);
&#125;);</code></pre>
        </div>

        <div class="pattern-item">
          <h4>2️⃣ Tester les Composants Enfants</h4>
          <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait passer les données au composant enfant'</span>, () => &#123;
  component.userData = &#123; name: <span class="code-string">'Test'</span> &#125;;
  fixture.<span class="code-function">detectChanges</span>();

  <span class="code-keyword">const</span> childDebug = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.directive</span>(ChildComponent));
  <span class="code-keyword">const</span> childComponent = childDebug.componentInstance <span class="code-keyword">as</span> ChildComponent;

  <span class="code-function">expect</span>(childComponent.user).<span class="code-function">toEqual</span>(&#123; name: <span class="code-string">'Test'</span> &#125;);
&#125;);

<span class="code-function">it</span>(<span class="code-string">'devrait réagir aux événements du composant enfant'</span>, () => &#123;
  <span class="code-keyword">const</span> childDebug = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.directive</span>(ChildComponent));
  
  <span class="code-comment">// Émettre un événement depuis l'enfant</span>
  childDebug.<span class="code-function">triggerEventHandler</span>(<span class="code-string">'userChanged'</span>, &#123; name: <span class="code-string">'New'</span> &#125;);
  
  <span class="code-function">expect</span>(component.userData.name).<span class="code-function">toBe</span>(<span class="code-string">'New'</span>);
&#125;);</code></pre>
        </div>

        <div class="pattern-item">
          <h4>3️⃣ Tester les Pipes dans les Templates</h4>
          <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait afficher le prix formaté'</span>, () => &#123;
  component.price = <span class="code-number">1234.56</span>;
  fixture.<span class="code-function">detectChanges</span>();

  <span class="code-keyword">const</span> priceEl = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="price"]'</span>));
  
  <span class="code-comment">// Le pipe currency formate le nombre</span>
  <span class="code-function">expect</span>(priceEl.nativeElement.textContent)
    .<span class="code-function">toContain</span>(<span class="code-string">'1 234,56'</span>);
&#125;);</code></pre>
        </div>

        <div class="pattern-item">
          <h4>4️⃣ Tester les Directives Structurelles</h4>
          <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait afficher la liste avec &#64;for'</span>, () => &#123;
  component.items = [<span class="code-string">'A'</span>, <span class="code-string">'B'</span>, <span class="code-string">'C'</span>];
  fixture.<span class="code-function">detectChanges</span>();

  <span class="code-keyword">const</span> listItems = fixture.debugElement
    .<span class="code-function">queryAll</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="list-item"]'</span>));
  
  <span class="code-function">expect</span>(listItems.length).<span class="code-function">toBe</span>(<span class="code-number">3</span>);
  <span class="code-function">expect</span>(listItems[<span class="code-number">0</span>].nativeElement.textContent).<span class="code-function">toContain</span>(<span class="code-string">'A'</span>);
&#125;);

<span class="code-function">it</span>(<span class="code-string">'devrait afficher le message vide avec &#64;empty'</span>, () => &#123;
  component.items = [];
  fixture.<span class="code-function">detectChanges</span>();

  <span class="code-keyword">const</span> emptyMsg = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="empty-message"]'</span>));
  
  <span class="code-function">expect</span>(emptyMsg).<span class="code-function">toBeTruthy</span>();
&#125;);</code></pre>
        </div>
      </section>
      } <!-- End of tutorial mode -->
    </div>
  `,
  styles: [`
    .component-testing-container {
      max-width: 1100px;
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

    /* Overview Section */
    .overview-section {
      margin-bottom: 2rem;
    }

    .concept-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      
      @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }

    .concept-card {
      text-align: center;
      
      .concept-icon {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 0.75rem;
      }
      
      h3 { margin: 0 0 0.5rem; font-size: 1rem; }
      p { margin: 0; font-size: 0.85rem; }
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
    }

    .tab {
      padding: 0.75rem 1.25rem;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
      font-weight: 500;
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

    .tab-content {
      margin-bottom: 2rem;
      
      h2 { margin-bottom: 0.75rem; }
    }

    .section-intro {
      font-size: 1.05rem;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    /* Code Examples */
    .code-example {
      margin-bottom: 1.5rem;
      
      h4 { margin: 0 0 1rem; }
      
      pre { 
        margin: 0; 
        font-size: 0.85rem;
        line-height: 1.6;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      
      @media (max-width: 700px) {
        grid-template-columns: 1fr;
      }
    }

    .info-card {
      h4 { margin: 0 0 0.75rem; }
      
      ul {
        margin: 0;
        padding-left: 1.25rem;
        
        li {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
      }
      
      p { margin: 0 0 0.5rem; font-size: 0.9rem; }
    }

    /* Query Methods */
    .query-methods, .event-examples, .io-examples {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .query-card, .event-card, .io-card {
      h4 { margin: 0 0 1rem; }
      
      pre {
        margin: 0;
        font-size: 0.8rem;
        line-height: 1.5;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
    }

    /* Complete Example */
    .complete-example {
      margin-top: 2rem;
      
      h2 { margin-bottom: 1rem; }
      
      pre {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.6;
        overflow-x: visible;
        overflow-wrap: break-word;
        white-space: pre-wrap;
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

    /* Advanced Patterns */
    .advanced-patterns {
      margin-top: 2rem;
      
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

    /* Alert overrides */
    .alert {
      ul {
        margin: 0;
        padding-left: 1.5rem;
      }
    }
  `]
})
export class ComponentTestingComponent {
  // Mode toggle for interactive/tutorial
  mode = signal<'tutorial' | 'interactive'>('tutorial');
  
  activeTab = signal('setup');
  activeScenario = signal('conditional-rendering');

  readonly bestPractices: BestPractice[] = [
    {
      title: 'Utilisez data-testid pour les Sélecteurs',
      description: 'Les attributs data-testid sont stables et ne changent pas avec le refactoring CSS. Ils rendent vos tests plus résilients.',
      doExample: `<span class="code-keyword">const</span> btn = fixture.debugElement
  .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="submit-btn"]'</span>));`,
      dontExample: `<span class="code-keyword">const</span> btn = fixture.debugElement
  .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'.btn-primary.submit'</span>));`
    },
    {
      title: 'Appelez detectChanges() Après les Interactions',
      description: 'Angular ne met pas automatiquement à jour le DOM dans les tests. Appelez detectChanges() après chaque action qui modifie l\'état.',
      doExample: `btn.nativeElement.<span class="code-function">click</span>();
fixture.<span class="code-function">detectChanges</span>(); <span class="code-comment">// Mise à jour du DOM</span>
<span class="code-function">expect</span>(...).<span class="code-function">toBe</span>(...);`,
      dontExample: `btn.nativeElement.<span class="code-function">click</span>();
<span class="code-comment">// Oublié detectChanges() !</span>
<span class="code-function">expect</span>(...).<span class="code-function">toBe</span>(...);`
    },
    {
      title: 'Isolez les Tests avec des Mocks',
      description: 'Ne testez pas les dépendances. Utilisez des mocks pour les services afin de tester uniquement le composant.',
      doExample: `<span class="code-keyword">const</span> mockService = &#123; 
  <span class="code-function">getData</span>: () => <span class="code-function">of</span>([<span class="code-string">'test'</span>]) 
&#125;;
<span class="code-property">providers</span>: [&#123; provide: DataService, useValue: mockService &#125;]`
    },
    {
      title: 'Testez le Comportement, Pas l\'Implémentation',
      description: 'Vos tests devraient vérifier ce que l\'utilisateur voit et fait, pas les détails internes du composant.',
      doExample: `<span class="code-comment">// Test le comportement visible</span>
<span class="code-function">expect</span>(display.textContent).<span class="code-function">toContain</span>(<span class="code-string">'5'</span>);`,
      dontExample: `<span class="code-comment">// Test l'implémentation interne</span>
<span class="code-function">expect</span>(component[<span class="code-string">'_privateCount'</span>]).<span class="code-function">toBe</span>(<span class="code-number">5</span>);`
    },
    {
      title: 'Utilisez setInput() pour les Signal Inputs',
      description: 'Avec Angular 17+, utilisez fixture.componentRef.setInput() pour définir les entrées signal plutôt que d\'affecter directement.',
      doExample: `fixture.componentRef.<span class="code-function">setInput</span>(<span class="code-string">'count'</span>, <span class="code-number">5</span>);
fixture.<span class="code-function">detectChanges</span>();`,
      dontExample: `<span class="code-comment">// Ne fonctionne pas avec input()</span>
component.count = <span class="code-number">5</span>;`
    },
    {
      title: 'Utilisez whenStable() pour l\'Asynchrone',
      description: 'Quand le composant a des opérations asynchrones, attendez la stabilité avant de vérifier.',
      doExample: `fixture.<span class="code-function">detectChanges</span>();
<span class="code-keyword">await</span> fixture.<span class="code-function">whenStable</span>();
<span class="code-function">expect</span>(...).<span class="code-function">toBe</span>(...);`
    }
  ];

  readonly trickyScenarios: TrickyScenario[] = [
    {
      id: 'conditional-rendering',
      title: 'Rendu Conditionnel',
      difficulty: 'intermediate',
      problem: 'Comment tester un composant qui affiche différents contenus selon une condition @if ? Comment vérifier que les éléments sont présents ou absents ?',
      solution: 'Changez l\'état, appelez detectChanges(), puis vérifiez la présence/absence des éléments avec query() qui retourne null si non trouvé.',
      code: `<span class="code-comment">// Template du composant</span>
<span class="code-comment">// &#64;if (isLoading()) &#123;</span>
<span class="code-comment">//   &lt;div data-testid="loader"&gt;Chargement...&lt;/div&gt;</span>
<span class="code-comment">// &#125; &#64;else &#123;</span>
<span class="code-comment">//   &lt;div data-testid="content"&gt;Données ici&lt;/div&gt;</span>
<span class="code-comment">// &#125;</span>

<span class="code-function">describe</span>(<span class="code-string">'rendu conditionnel'</span>, () => &#123;
  <span class="code-function">it</span>(<span class="code-string">'devrait afficher le loader pendant le chargement'</span>, () => &#123;
    component.isLoading.<span class="code-function">set</span>(<span class="code-keyword">true</span>);
    fixture.<span class="code-function">detectChanges</span>();

    <span class="code-keyword">const</span> loader = fixture.debugElement
      .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="loader"]'</span>));
    <span class="code-keyword">const</span> content = fixture.debugElement
      .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="content"]'</span>));

    <span class="code-function">expect</span>(loader).<span class="code-function">toBeTruthy</span>();
    <span class="code-function">expect</span>(content).<span class="code-function">toBeNull</span>(); <span class="code-comment">// N'existe pas dans le DOM</span>
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait afficher le contenu après chargement'</span>, () => &#123;
    component.isLoading.<span class="code-function">set</span>(<span class="code-keyword">false</span>);
    fixture.<span class="code-function">detectChanges</span>();

    <span class="code-keyword">const</span> loader = fixture.debugElement
      .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="loader"]'</span>));
    <span class="code-keyword">const</span> content = fixture.debugElement
      .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="content"]'</span>));

    <span class="code-function">expect</span>(loader).<span class="code-function">toBeNull</span>();
    <span class="code-function">expect</span>(content).<span class="code-function">toBeTruthy</span>();
  &#125;);
&#125;);`,
      explanation: 'query() retourne null si l\'élément n\'est pas dans le DOM. C\'est parfait pour tester le rendu conditionnel. Assurez-vous d\'appeler detectChanges() après avoir modifié l\'état pour que Angular mette à jour le template.'
    },
    {
      id: 'form-validation',
      title: 'Validation de Formulaires',
      difficulty: 'advanced',
      problem: 'Comment tester un formulaire réactif avec validation, messages d\'erreur et soumission ? Les tests échouent car les événements ne sont pas déclenchés correctement.',
      solution: 'Utilisez dispatchEvent avec les bons types d\'événements (input, blur, submit) et attendez la stabilité pour ngModel.',
      code: `<span class="code-comment">// Composant avec formulaire réactif</span>
<span class="code-function">describe</span>(<span class="code-string">'LoginFormComponent'</span>, () => &#123;
  <span class="code-keyword">let</span> component: <span class="code-class">LoginFormComponent</span>;
  <span class="code-keyword">let</span> fixture: <span class="code-class">ComponentFixture</span>&lt;<span class="code-class">LoginFormComponent</span>&gt;;

  <span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
    <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [LoginFormComponent, ReactiveFormsModule]
    &#125;).<span class="code-function">compileComponents</span>();

    fixture = TestBed.<span class="code-function">createComponent</span>(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.<span class="code-function">detectChanges</span>();
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait afficher erreur pour email invalide'</span>, () => &#123;
    <span class="code-keyword">const</span> emailInput = fixture.debugElement
      .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="email"]'</span>)).nativeElement;

    <span class="code-comment">// Simuler saisie + perte de focus</span>
    emailInput.value = <span class="code-string">'invalid-email'</span>;
    emailInput.<span class="code-function">dispatchEvent</span>(<span class="code-keyword">new</span> <span class="code-class">Event</span>(<span class="code-string">'input'</span>));
    emailInput.<span class="code-function">dispatchEvent</span>(<span class="code-keyword">new</span> <span class="code-class">Event</span>(<span class="code-string">'blur'</span>));
    fixture.<span class="code-function">detectChanges</span>();

    <span class="code-keyword">const</span> errorMsg = fixture.debugElement
      .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="email-error"]'</span>));
    
    <span class="code-function">expect</span>(errorMsg).not.<span class="code-function">toBeNull</span>();
    <span class="code-function">expect</span>(errorMsg.nativeElement.textContent)
      .<span class="code-function">toContain</span>(<span class="code-string">'Email invalide'</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait désactiver le bouton si formulaire invalide'</span>, () => &#123;
    <span class="code-keyword">const</span> submitBtn = fixture.debugElement
      .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="submit-btn"]'</span>));
    
    <span class="code-function">expect</span>(submitBtn.nativeElement.disabled).<span class="code-function">toBe</span>(<span class="code-keyword">true</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait soumettre avec données valides'</span>, () => &#123;
    <span class="code-keyword">const</span> spy = vi.<span class="code-function">spyOn</span>(component, <span class="code-string">'onSubmit'</span>);

    <span class="code-comment">// Remplir le formulaire</span>
    component.form.<span class="code-function">patchValue</span>(&#123;
      email: <span class="code-string">'test&#64;email.com'</span>,
      password: <span class="code-string">'Password1!'</span>
    &#125;);
    fixture.<span class="code-function">detectChanges</span>();

    <span class="code-comment">// Soumettre</span>
    <span class="code-keyword">const</span> form = fixture.debugElement.<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'form'</span>));
    form.<span class="code-function">triggerEventHandler</span>(<span class="code-string">'ngSubmit'</span>, <span class="code-keyword">null</span>);

    <span class="code-function">expect</span>(spy).<span class="code-function">toHaveBeenCalled</span>();
  &#125;);
&#125;);`,
      explanation: 'Pour les formulaires réactifs, vous pouvez utiliser form.patchValue() pour définir les valeurs programmatiquement. Pour simuler une vraie saisie utilisateur, utilisez dispatchEvent avec les événements appropriés. N\'oubliez pas "blur" pour déclencher la validation touched.'
    },
    {
      id: 'signal-inputs',
      title: 'Signal Inputs (Angular 17+)',
      difficulty: 'intermediate',
      problem: 'Comment tester les composants utilisant la nouvelle API input() et output() de Angular 17+ ? L\'affectation directe ne fonctionne pas.',
      solution: 'Utilisez fixture.componentRef.setInput() pour les signal inputs. Pour les outputs, abonnez-vous comme avec les EventEmitters classiques.',
      code: `<span class="code-comment">// Composant avec signal inputs</span>
<span class="code-decorator">&#64;Component</span>(&#123;...&#125;)
<span class="code-keyword">export class</span> <span class="code-class">UserCardComponent</span> &#123;
  <span class="code-comment">// Signal inputs</span>
  name = <span class="code-function">input</span>.<span class="code-function">required</span>&lt;<span class="code-class">string</span>&gt;();
  age = <span class="code-function">input</span>(<span class="code-number">0</span>);
  
  <span class="code-comment">// Signal output</span>
  clicked = <span class="code-function">output</span>&lt;<span class="code-class">string</span>&gt;();
  
  <span class="code-comment">// Computed signal</span>
  displayName = <span class="code-function">computed</span>(() => <span class="code-string">\`\$&#123;this.name()&#125; (\$&#123;this.age()&#125;)\`</span>);
&#125;

<span class="code-comment">// Tests</span>
<span class="code-function">describe</span>(<span class="code-string">'UserCardComponent'</span>, () => &#123;
  <span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
    <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [UserCardComponent]
    &#125;).<span class="code-function">compileComponents</span>();

    fixture = TestBed.<span class="code-function">createComponent</span>(UserCardComponent);
    component = fixture.componentInstance;
    
    <span class="code-comment">// ⚠️ Définir les inputs requis AVANT detectChanges</span>
    fixture.componentRef.<span class="code-function">setInput</span>(<span class="code-string">'name'</span>, <span class="code-string">'Test User'</span>);
    fixture.<span class="code-function">detectChanges</span>();
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait afficher le nom'</span>, () => &#123;
    <span class="code-function">expect</span>(component.<span class="code-function">name</span>()).<span class="code-function">toBe</span>(<span class="code-string">'Test User'</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait mettre à jour avec setInput'</span>, () => &#123;
    fixture.componentRef.<span class="code-function">setInput</span>(<span class="code-string">'age'</span>, <span class="code-number">25</span>);
    fixture.<span class="code-function">detectChanges</span>();

    <span class="code-function">expect</span>(component.<span class="code-function">age</span>()).<span class="code-function">toBe</span>(<span class="code-number">25</span>);
    <span class="code-function">expect</span>(component.<span class="code-function">displayName</span>()).<span class="code-function">toBe</span>(<span class="code-string">'Test User (25)'</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait émettre l\'output au clic'</span>, () => &#123;
    <span class="code-keyword">let</span> emitted: <span class="code-class">string</span> | <span class="code-keyword">undefined</span>;
    component.clicked.<span class="code-function">subscribe</span>(val => emitted = val);

    component.clicked.<span class="code-function">emit</span>(<span class="code-string">'clicked!'</span>);

    <span class="code-function">expect</span>(emitted).<span class="code-function">toBe</span>(<span class="code-string">'clicked!'</span>);
  &#125;);
&#125;);`,
      explanation: 'Les signal inputs ne peuvent pas être assignés directement (ils sont en lecture seule). Utilisez setInput() sur componentRef. Pour les inputs requis, appelez setInput() AVANT le premier detectChanges() sinon Angular lèvera une erreur.'
    },
    {
      id: 'async-data',
      title: 'Données Asynchrones',
      difficulty: 'advanced',
      problem: 'Le composant charge des données via un service HTTP. Comment tester que les données s\'affichent correctement après le chargement asynchrone ?',
      solution: 'Mockez le service pour retourner un Observable contrôlé, utilisez fakeAsync/tick ou async/whenStable pour gérer l\'asynchronicité.',
      code: `<span class="code-comment">// Service mock</span>
<span class="code-keyword">const</span> mockUserService = &#123;
  <span class="code-function">getUsers</span>: vi.<span class="code-function">fn</span>()
&#125;;

<span class="code-function">describe</span>(<span class="code-string">'UserListComponent'</span>, () => &#123;
  <span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
    <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [UserListComponent],
      <span class="code-property">providers</span>: [
        &#123; <span class="code-property">provide</span>: UserService, <span class="code-property">useValue</span>: mockUserService &#125;
      ]
    &#125;).<span class="code-function">compileComponents</span>();
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait afficher les utilisateurs après chargement'</span>, <span class="code-keyword">async</span> () => &#123;
    <span class="code-comment">// Configurer le mock</span>
    mockUserService.<span class="code-function">getUsers</span>.<span class="code-function">mockReturnValue</span>(
      <span class="code-function">of</span>([&#123; id: <span class="code-number">1</span>, name: <span class="code-string">'Alice'</span> &#125;, &#123; id: <span class="code-number">2</span>, name: <span class="code-string">'Bob'</span> &#125;])
    );

    fixture = TestBed.<span class="code-function">createComponent</span>(UserListComponent);
    fixture.<span class="code-function">detectChanges</span>();
    <span class="code-keyword">await</span> fixture.<span class="code-function">whenStable</span>();
    fixture.<span class="code-function">detectChanges</span>(); <span class="code-comment">// Après résolution async</span>

    <span class="code-keyword">const</span> items = fixture.debugElement
      .<span class="code-function">queryAll</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="user-item"]'</span>));
    
    <span class="code-function">expect</span>(items.length).<span class="code-function">toBe</span>(<span class="code-number">2</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait afficher erreur si chargement échoue'</span>, <span class="code-keyword">async</span> () => &#123;
    mockUserService.<span class="code-function">getUsers</span>.<span class="code-function">mockReturnValue</span>(
      <span class="code-function">throwError</span>(() => <span class="code-keyword">new</span> <span class="code-class">Error</span>(<span class="code-string">'Erreur réseau'</span>))
    );

    fixture = TestBed.<span class="code-function">createComponent</span>(UserListComponent);
    fixture.<span class="code-function">detectChanges</span>();
    <span class="code-keyword">await</span> fixture.<span class="code-function">whenStable</span>();
    fixture.<span class="code-function">detectChanges</span>();

    <span class="code-keyword">const</span> error = fixture.debugElement
      .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="error-msg"]'</span>));
    
    <span class="code-function">expect</span>(error).<span class="code-function">toBeTruthy</span>();
    <span class="code-function">expect</span>(error.nativeElement.textContent)
      .<span class="code-function">toContain</span>(<span class="code-string">'Erreur'</span>);
  &#125;);
&#125;);`,
      explanation: 'of() retourne un Observable synchrone, parfait pour les tests simples. Utilisez throwError() pour simuler des erreurs. N\'oubliez pas d\'appeler detectChanges() après whenStable() pour mettre à jour le template avec les nouvelles données.'
    },
    {
      id: 'router-testing',
      title: 'Navigation & Router',
      difficulty: 'advanced',
      problem: 'Comment tester un composant qui utilise le Router pour la navigation ? Les tests échouent car le Router n\'est pas configuré.',
      solution: 'Utilisez RouterTestingModule ou mockez le Router. Pour tester les liens routerLink, vérifiez l\'attribut href ou utilisez By.directive(RouterLink).',
      code: `<span class="code-keyword">import</span> &#123; RouterTestingModule &#125; <span class="code-keyword">from</span> <span class="code-string">'&#64;angular/router/testing'</span>;
<span class="code-keyword">import</span> &#123; Router &#125; <span class="code-keyword">from</span> <span class="code-string">'&#64;angular/router'</span>;

<span class="code-function">describe</span>(<span class="code-string">'NavigationComponent'</span>, () => &#123;
  <span class="code-keyword">let</span> router: <span class="code-class">Router</span>;

  <span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
    <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [
        NavigationComponent,
        RouterTestingModule.<span class="code-function">withRoutes</span>([
          &#123; path: <span class="code-string">'home'</span>, component: <span class="code-class">DummyComponent</span> &#125;,
          &#123; path: <span class="code-string">'about'</span>, component: <span class="code-class">DummyComponent</span> &#125;
        ])
      ]
    &#125;).<span class="code-function">compileComponents</span>();

    router = TestBed.<span class="code-function">inject</span>(<span class="code-class">Router</span>);
    fixture = TestBed.<span class="code-function">createComponent</span>(NavigationComponent);
    fixture.<span class="code-function">detectChanges</span>();
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait avoir les bons liens'</span>, () => &#123;
    <span class="code-keyword">const</span> links = fixture.debugElement
      .<span class="code-function">queryAll</span>(<span class="code-function">By.css</span>(<span class="code-string">'a[routerLink]'</span>));
    
    <span class="code-function">expect</span>(links.length).<span class="code-function">toBe</span>(<span class="code-number">2</span>);
    <span class="code-function">expect</span>(links[<span class="code-number">0</span>].nativeElement.<span class="code-function">getAttribute</span>(<span class="code-string">'href'</span>))
      .<span class="code-function">toBe</span>(<span class="code-string">'/home'</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait naviguer au clic'</span>, <span class="code-keyword">async</span> () => &#123;
    <span class="code-keyword">const</span> spy = vi.<span class="code-function">spyOn</span>(router, <span class="code-string">'navigate'</span>);
    
    component.<span class="code-function">navigateTo</span>(<span class="code-string">'/about'</span>);
    
    <span class="code-function">expect</span>(spy).<span class="code-function">toHaveBeenCalledWith</span>([<span class="code-string">'/about'</span>]);
  &#125;);

  <span class="code-comment">// Alternative: Mocker complètement le Router</span>
  <span class="code-keyword">const</span> mockRouter = &#123;
    <span class="code-function">navigate</span>: vi.<span class="code-function">fn</span>(),
    <span class="code-property">url</span>: <span class="code-string">'/current'</span>
  &#125;;
  <span class="code-property">providers</span>: [&#123; <span class="code-property">provide</span>: Router, <span class="code-property">useValue</span>: mockRouter &#125;]
&#125;);`,
      explanation: 'RouterTestingModule fournit un Router fonctionnel pour les tests. Pour les tests simples, un mock du Router suffit. Vérifiez les attributs href pour les liens statiques, ou utilisez des spies pour les navigations programmatiques.'
    }
  ];

  currentScenario = computed(() => {
    return this.trickyScenarios.find(s => s.id === this.activeScenario()) ?? this.trickyScenarios[0];
  });
}
