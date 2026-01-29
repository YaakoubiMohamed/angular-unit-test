import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-async-testing',
  template: `
    <div class="async-container">
      <header class="page-header">
        <h1> Tests Asynchrones</h1>
        <p>Maîtrisez les tests d'opérations asynchrones : Promises, Observables et appels HTTP</p>
      </header>

      <!-- Async Challenges -->
      <section class="challenges-section card">
        <h2> Le Défi de l'Asynchrone</h2>
        <p class="intro">
          Le code asynchrone est partout dans Angular : appels HTTP, timers, événements utilisateur.
          Les tests se terminent immédiatement, mais pas les opérations asynchrones. Voici comment les gérer.
        </p>
        <div class="challenge-grid">
          <div class="challenge-item">
            <span class="icon"></span>
            <h4>Observables</h4>
            <p>Flux RxJS qui émettent des valeurs au fil du temps</p>
          </div>
          <div class="challenge-item">
            <span class="icon">⏳</span>
            <h4>Promises</h4>
            <p>Résolution de valeur asynchrone unique</p>
          </div>
          <div class="challenge-item">
            <span class="icon">🌐</span>
            <h4>Appels HTTP</h4>
            <p>Requêtes et réponses API</p>
          </div>
          <div class="challenge-item">
            <span class="icon">⏲️</span>
            <h4>Timers</h4>
            <p>setTimeout, setInterval, debounce</p>
          </div>
        </div>
      </section>

      <!-- Tab Navigation -->
      <nav class="tabs">
        <button 
          class="tab" 
          [class.active]="activeTab() === 'fakeAsync'"
          (click)="activeTab.set('fakeAsync')">
           fakeAsync
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab() === 'waitForAsync'"
          (click)="activeTab.set('waitForAsync')">
          ⏳ waitForAsync
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab() === 'observables'"
          (click)="activeTab.set('observables')">
           Observables
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab() === 'http'"
          (click)="activeTab.set('http')">
          🌐 HTTP Testing
        </button>
      </nav>

      <!-- fakeAsync Section -->
      @if (activeTab() === 'fakeAsync') {
        <section class="tab-content animate-fade-in">
          <h2> fakeAsync & tick()</h2>
          <p class="section-intro">
            <code>fakeAsync</code> crée une zone de test synchrone où vous contrôlez le temps.
            Utilisez <code>tick()</code> pour simuler le passage du temps.
          </p>

          <div class="example-card card">
            <h4> Utilisation de Base</h4>
            <pre><code><span class="code-keyword">import</span> &#123; fakeAsync, tick, flush &#125; <span class="code-keyword">from</span> <span class="code-string">'&#64;angular/core/testing'</span>;

<span class="code-function">it</span>(<span class="code-string">'devrait gérer setTimeout'</span>, <span class="code-function">fakeAsync</span>(() => &#123;
  <span class="code-keyword">let</span> value = <span class="code-string">'initial'</span>;
  
  <span class="code-function">setTimeout</span>(() => &#123;
    value = <span class="code-string">'updated'</span>;
  &#125;, <span class="code-number">1000</span>);
  
  <span class="code-comment">// La valeur n'a pas encore changé</span>
  <span class="code-function">expect</span>(value).<span class="code-function">toBe</span>(<span class="code-string">'initial'</span>);
  
  <span class="code-comment">// Avancer le temps de 1000ms</span>
  <span class="code-function">tick</span>(<span class="code-number">1000</span>);
  
  <span class="code-comment">// Maintenant c'est mis à jour !</span>
  <span class="code-function">expect</span>(value).<span class="code-function">toBe</span>(<span class="code-string">'updated'</span>);
&#125;));</code></pre>
          </div>

          <div class="example-card card">
            <h4> Tester une Saisie avec Debounce</h4>
            <pre><code><span class="code-comment">// Composant avec recherche debounced</span>
<span class="code-keyword">export class</span> <span class="code-class">SearchComponent</span> &#123;
  searchTerm = <span class="code-function">signal</span>(<span class="code-string">''</span>);
  results = <span class="code-function">signal</span>&lt;<span class="code-class">string</span>[]&gt;([]);
  
  <span class="code-function">onSearch</span>(term: <span class="code-class">string</span>) &#123;
    <span class="code-keyword">this</span>.searchTerm.<span class="code-function">set</span>(term);
    <span class="code-comment">// Debounce : attendre 300ms avant de chercher</span>
    <span class="code-function">setTimeout</span>(() => &#123;
      <span class="code-keyword">this</span>.results.<span class="code-function">set</span>([<span class="code-string">'Résultat 1'</span>, <span class="code-string">'Résultat 2'</span>]);
    &#125;, <span class="code-number">300</span>);
  &#125;
&#125;

<span class="code-comment">// Test</span>
<span class="code-function">it</span>(<span class="code-string">'devrait débouncer la recherche'</span>, <span class="code-function">fakeAsync</span>(() => &#123;
  component.<span class="code-function">onSearch</span>(<span class="code-string">'angular'</span>);
  
  <span class="code-comment">// Résultats pas encore prêts (seulement 100ms écoulées)</span>
  <span class="code-function">tick</span>(<span class="code-number">100</span>);
  <span class="code-function">expect</span>(component.<span class="code-function">results</span>().length).<span class="code-function">toBe</span>(<span class="code-number">0</span>);
  
  <span class="code-comment">// Maintenant les résultats sont prêts (300ms au total)</span>
  <span class="code-function">tick</span>(<span class="code-number">200</span>);
  <span class="code-function">expect</span>(component.<span class="code-function">results</span>().length).<span class="code-function">toBe</span>(<span class="code-number">2</span>);
&#125;));</code></pre>
          </div>

          <div class="helper-grid">
            <div class="helper-card card">
              <h4> Fonctions Utilitaires</h4>
              <ul>
                <li><code>tick(ms)</code> - Avancer le temps de ms</li>
                <li><code>tick()</code> - Traiter les microtâches</li>
                <li><code>flush()</code> - Compléter tous les timers</li>
                <li><code>flushMicrotasks()</code> - Compléter uniquement les microtâches</li>
              </ul>
            </div>
            <div class="helper-card card">
              <h4>⚠️ Pièges Courants</h4>
              <ul>
                <li>Oublier de flush les timers restants</li>
                <li>Utiliser du vrai async dans la zone fakeAsync</li>
                <li>Ne pas appeler detectChanges après tick</li>
              </ul>
            </div>
          </div>
        </section>
      }

      <!-- waitForAsync Section -->
      @if (activeTab() === 'waitForAsync') {
        <section class="tab-content animate-fade-in">
          <h2>⏳ waitForAsync (anciennement async)</h2>
          <p class="section-intro">
            <code>waitForAsync</code> exécute le test dans une zone async spéciale et attend que toutes 
            les opérations asynchrones se terminent. À utiliser avec <code>fixture.whenStable()</code>.
          </p>

          <div class="example-card card">
            <h4> Utilisation de Base</h4>
            <pre><code><span class="code-keyword">import</span> &#123; waitForAsync &#125; <span class="code-keyword">from</span> <span class="code-string">'&#64;angular/core/testing'</span>;

<span class="code-function">it</span>(<span class="code-string">'devrait charger les données'</span>, <span class="code-function">waitForAsync</span>(() => &#123;
  component.<span class="code-function">loadData</span>();
  
  <span class="code-comment">// Attendre toutes les opérations async</span>
  fixture.<span class="code-function">whenStable</span>().<span class="code-function">then</span>(() => &#123;
    fixture.<span class="code-function">detectChanges</span>();
    <span class="code-function">expect</span>(component.data.length).<span class="code-function">toBeGreaterThan</span>(<span class="code-number">0</span>);
  &#125;);
&#125;));</code></pre>
          </div>

          <div class="example-card card">
            <h4> Avec async/await</h4>
            <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait gérer les opérations async'</span>, <span class="code-function">waitForAsync</span>(<span class="code-keyword">async</span> () => &#123;
  <span class="code-comment">// Déclencher l'opération async</span>
  component.<span class="code-function">fetchUser</span>();
  
  <span class="code-comment">// Attendre la stabilité</span>
  <span class="code-keyword">await</span> fixture.<span class="code-function">whenStable</span>();
  fixture.<span class="code-function">detectChanges</span>();
  
  <span class="code-comment">// Maintenant faire les assertions</span>
  <span class="code-keyword">const</span> userName = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="user-name"]'</span>));
  <span class="code-function">expect</span>(userName.nativeElement.textContent)
    .<span class="code-function">toContain</span>(<span class="code-string">'John'</span>);
&#125;));</code></pre>
          </div>

          <div class="comparison card">
            <h4> fakeAsync vs waitForAsync</h4>
            <table>
              <thead>
                <tr>
                  <th>Fonctionnalité</th>
                  <th>fakeAsync</th>
                  <th>waitForAsync</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Contrôle du Temps</td>
                  <td>✅ Contrôle total avec tick()</td>
                  <td>❌ Le temps réel s'écoule</td>
                </tr>
                <tr>
                  <td>Idéal Pour</td>
                  <td>Timers, debounce, intervals</td>
                  <td>Promises, HTTP, async simple</td>
                </tr>
                <tr>
                  <td>Complexité</td>
                  <td>Plus de contrôle, plus de config</td>
                  <td>Plus simple, moins de contrôle</td>
                </tr>
                <tr>
                  <td>HTTP Réel</td>
                  <td>❌ Non supporté</td>
                  <td>✅ Supporté</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Observables Section -->
      @if (activeTab() === 'observables') {
        <section class="tab-content animate-fade-in">
          <h2> Tester les Observables</h2>
          <p class="section-intro">
            Les Observables sont au cœur d'Angular. Voici les patterns pour les tester efficacement.
          </p>

          <div class="example-card card">
            <h4> S'abonner dans les Tests</h4>
            <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait émettre des valeurs'</span>, () => &#123;
  <span class="code-keyword">const</span> values: <span class="code-class">number</span>[] = [];
  
  service.counter$.<span class="code-function">subscribe</span>((value) => &#123;
    values.<span class="code-function">push</span>(value);
  &#125;);
  
  service.<span class="code-function">increment</span>();
  service.<span class="code-function">increment</span>();
  
  <span class="code-function">expect</span>(values).<span class="code-function">toEqual</span>([<span class="code-number">0</span>, <span class="code-number">1</span>, <span class="code-number">2</span>]);
&#125;);</code></pre>
          </div>

          <div class="example-card card">
            <h4> Tester avec le Callback done()</h4>
            <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait compléter l\'observable'</span>, (done) => &#123;
  <span class="code-keyword">let</span> result: <span class="code-class">User</span> | <span class="code-keyword">undefined</span>;
  
  service.<span class="code-function">getUser</span>(<span class="code-number">1</span>).<span class="code-function">subscribe</span>(&#123;
    <span class="code-function">next</span>: (user) => &#123;
      result = user;
    &#125;,
    <span class="code-function">complete</span>: () => &#123;
      <span class="code-function">expect</span>(result?.name).<span class="code-function">toBe</span>(<span class="code-string">'John'</span>);
      <span class="code-function">done</span>();  <span class="code-comment">// Signaler la fin du test</span>
    &#125;,
    <span class="code-function">error</span>: (err) => <span class="code-function">done</span>(err)
  &#125;);
&#125;);</code></pre>
          </div>

          <div class="example-card card">
            <h4> Utiliser firstValueFrom (Recommandé)</h4>
            <pre><code><span class="code-keyword">import</span> &#123; firstValueFrom &#125; <span class="code-keyword">from</span> <span class="code-string">'rxjs'</span>;

<span class="code-function">it</span>(<span class="code-string">'devrait retourner l\'utilisateur'</span>, <span class="code-keyword">async</span> () => &#123;
  <span class="code-comment">// Convertir Observable en Promise</span>
  <span class="code-keyword">const</span> user = <span class="code-keyword">await</span> <span class="code-function">firstValueFrom</span>(
    service.<span class="code-function">getUser</span>(<span class="code-number">1</span>)
  );
  
  <span class="code-function">expect</span>(user.name).<span class="code-function">toBe</span>(<span class="code-string">'John'</span>);
  <span class="code-function">expect</span>(user.email).<span class="code-function">toContain</span>(<span class="code-string">'&#64;'</span>);
&#125;);</code></pre>
          </div>

          <div class="example-card card">
            <h4> Tester la Gestion d'Erreurs</h4>
            <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait gérer les erreurs'</span>, <span class="code-keyword">async</span> () => &#123;
  <span class="code-comment">// Faire en sorte que le mock lance une erreur</span>
  mockService.getUser.<span class="code-function">mockReturnValue</span>(
    <span class="code-function">throwError</span>(() => <span class="code-keyword">new</span> <span class="code-class">Error</span>(<span class="code-string">'Non trouvé'</span>))
  );

  <span class="code-keyword">try</span> &#123;
    <span class="code-keyword">await</span> <span class="code-function">firstValueFrom</span>(service.<span class="code-function">getUser</span>(<span class="code-number">999</span>));
    <span class="code-function">fail</span>(<span class="code-string">'Aurait dû lancer une erreur'</span>);
  &#125; <span class="code-keyword">catch</span> (error) &#123;
    <span class="code-function">expect</span>(error.message).<span class="code-function">toBe</span>(<span class="code-string">'Non trouvé'</span>);
  &#125;
&#125;);</code></pre>
          </div>
        </section>
      }

      <!-- HTTP Testing Section -->
      @if (activeTab() === 'http') {
        <section class="tab-content animate-fade-in">
          <h2>🌐 Tests HTTP</h2>
          <p class="section-intro">
            Utilisez <code>HttpClientTestingModule</code> pour mocker les requêtes HTTP 
            et vérifier les bonnes interactions API.
          </p>

          <div class="example-card card">
            <h4> Configuration</h4>
            <pre><code><span class="code-keyword">import</span> &#123; HttpClientTestingModule, HttpTestingController &#125; 
  <span class="code-keyword">from</span> <span class="code-string">'&#64;angular/common/http/testing'</span>;

<span class="code-function">describe</span>(<span class="code-string">'UserService'</span>, () => &#123;
  <span class="code-keyword">let</span> service: <span class="code-class">UserService</span>;
  <span class="code-keyword">let</span> httpMock: <span class="code-class">HttpTestingController</span>;

  <span class="code-function">beforeEach</span>(() => &#123;
    TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [HttpClientTestingModule],
      <span class="code-property">providers</span>: [UserService]
    &#125;);

    service = TestBed.<span class="code-function">inject</span>(UserService);
    httpMock = TestBed.<span class="code-function">inject</span>(HttpTestingController);
  &#125;);

  <span class="code-function">afterEach</span>(() => &#123;
    <span class="code-comment">// Vérifier qu'il n'y a pas de requêtes inattendues</span>
    httpMock.<span class="code-function">verify</span>();
  &#125;);
&#125;);</code></pre>
          </div>

          <div class="example-card card">
            <h4>✅ Tester les Requêtes GET</h4>
            <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait récupérer les utilisateurs'</span>, () => &#123;
  <span class="code-keyword">const</span> mockUsers = [
    &#123; id: <span class="code-number">1</span>, name: <span class="code-string">'John'</span> &#125;,
    &#123; id: <span class="code-number">2</span>, name: <span class="code-string">'Jane'</span> &#125;
  ];

  <span class="code-comment">// Faire la requête</span>
  service.<span class="code-function">getUsers</span>().<span class="code-function">subscribe</span>((users) => &#123;
    <span class="code-function">expect</span>(users.length).<span class="code-function">toBe</span>(<span class="code-number">2</span>);
    <span class="code-function">expect</span>(users[<span class="code-number">0</span>].name).<span class="code-function">toBe</span>(<span class="code-string">'John'</span>);
  &#125;);

  <span class="code-comment">// Attendre une requête spécifique</span>
  <span class="code-keyword">const</span> req = httpMock.<span class="code-function">expectOne</span>(<span class="code-string">'/api/users'</span>);
  <span class="code-function">expect</span>(req.request.method).<span class="code-function">toBe</span>(<span class="code-string">'GET'</span>);

  <span class="code-comment">// Répondre avec les données mock</span>
  req.<span class="code-function">flush</span>(mockUsers);
&#125;);</code></pre>
          </div>

          <div class="example-card card">
            <h4> Tester les Requêtes POST</h4>
            <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait créer un utilisateur'</span>, () => &#123;
  <span class="code-keyword">const</span> newUser = &#123; name: <span class="code-string">'Nouvel Utilisateur'</span>, email: <span class="code-string">'new&#64;test.com'</span> &#125;;
  <span class="code-keyword">const</span> createdUser = &#123; id: <span class="code-number">3</span>, ...newUser &#125;;

  service.<span class="code-function">createUser</span>(newUser).<span class="code-function">subscribe</span>((user) => &#123;
    <span class="code-function">expect</span>(user.id).<span class="code-function">toBe</span>(<span class="code-number">3</span>);
  &#125;);

  <span class="code-keyword">const</span> req = httpMock.<span class="code-function">expectOne</span>(<span class="code-string">'/api/users'</span>);
  <span class="code-function">expect</span>(req.request.method).<span class="code-function">toBe</span>(<span class="code-string">'POST'</span>);
  <span class="code-function">expect</span>(req.request.body).<span class="code-function">toEqual</span>(newUser);

  req.<span class="code-function">flush</span>(createdUser);
&#125;);</code></pre>
          </div>

          <div class="example-card card">
            <h4>❌ Tester les Réponses d'Erreur</h4>
            <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait gérer l\'erreur 404'</span>, () => &#123;
  service.<span class="code-function">getUser</span>(<span class="code-number">999</span>).<span class="code-function">subscribe</span>(&#123;
    <span class="code-function">next</span>: () => <span class="code-function">fail</span>(<span class="code-string">'Aurait dû échouer'</span>),
    <span class="code-function">error</span>: (error) => &#123;
      <span class="code-function">expect</span>(error.status).<span class="code-function">toBe</span>(<span class="code-number">404</span>);
      <span class="code-function">expect</span>(error.statusText).<span class="code-function">toBe</span>(<span class="code-string">'Not Found'</span>);
    &#125;
  &#125;);

  <span class="code-keyword">const</span> req = httpMock.<span class="code-function">expectOne</span>(<span class="code-string">'/api/users/999'</span>);
  
  <span class="code-comment">// Répondre avec une erreur</span>
  req.<span class="code-function">flush</span>(<span class="code-string">'Not found'</span>, &#123;
    <span class="code-property">status</span>: <span class="code-number">404</span>,
    <span class="code-property">statusText</span>: <span class="code-string">'Not Found'</span>
  &#125;);
&#125;);</code></pre>
          </div>

          <div class="alert alert-info">
            <span class="alert-icon"></span>
            <div>
              <strong>Always call httpMock.verify() in afterEach!</strong>
              <p style="margin: 0.5rem 0 0;">This ensures no unexpected HTTP requests were made during the test.</p>
            </div>
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .async-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;
      
      h1 { margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); font-size: 1.1rem; }
    }

    .challenges-section {
      margin-bottom: 2rem;
      
      h2 { margin-bottom: 0.75rem; }
      
      .intro {
        font-size: 1.05rem;
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
      }
    }

    .challenge-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      
      @media (max-width: 800px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 450px) {
        grid-template-columns: 1fr;
      }
    }

    .challenge-item {
      text-align: center;
      padding: 1rem;
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      
      .icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 0.5rem;
      }
      
      h4 { margin: 0 0 0.25rem; font-size: 0.95rem; }
      p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }
    }

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
      h2 { margin-bottom: 0.75rem; }
    }

    .section-intro {
      font-size: 1.05rem;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .example-card {
      margin-bottom: 1.25rem;
      
      h4 { margin: 0 0 1rem; }
      
      pre {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.6;
      }
    }

    .helper-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 1.5rem;
      
      @media (max-width: 700px) {
        grid-template-columns: 1fr;
      }
    }

    .helper-card {
      h4 { margin: 0 0 0.75rem; }
      
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

    .comparison {
      margin-top: 1.5rem;
      
      h4 { margin: 0 0 1rem; }
      
      table {
        width: 100%;
        border-collapse: collapse;
        
        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        
        th {
          background: var(--bg-primary);
          font-weight: 600;
        }
        
        td {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      }
    }
  `]
})
export class AsyncTestingComponent {
  activeTab = signal('fakeAsync');
}
