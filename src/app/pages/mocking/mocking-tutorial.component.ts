import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-mocking-tutorial',
  template: `
    <div class="mocking-container">
      <header class="page-header">
        <h1> Mocking & Espions</h1>
        <p>Isolez vos unités avec des mocks, espions et doublures de test</p>
      </header>

      <!-- Introduction -->
      <section class="intro-section card">
        <h2> Pourquoi Mocker ?</h2>
        <p class="intro-text">
          Les tests unitaires doivent tester <strong>une seule chose</strong> en isolation. Le mocking vous permet 
          de remplacer les dépendances par des doublures de test contrôlées, garantissant des tests rapides, 
          fiables et ciblés.
        </p>
        <div class="mock-types">
          <div class="mock-type">
            <span class="type-icon"></span>
            <h4>Spy (Espion)</h4>
            <p>Observe une vraie méthode, peut tracer les appels</p>
          </div>
          <div class="mock-type">
            <span class="type-icon"></span>
            <h4>Mock</h4>
            <p>Fausse implémentation avec comportement contrôlé</p>
          </div>
          <div class="mock-type">
            <span class="type-icon"></span>
            <h4>Stub</h4>
            <p>Retourne des valeurs prédéfinies, pas de logique</p>
          </div>
          <div class="mock-type">
            <span class="type-icon">🤖</span>
            <h4>Fake</h4>
            <p>Implémentation fonctionnelle pour les tests</p>
          </div>
        </div>
      </section>

      <!-- Tab Navigation -->
      <nav class="tabs">
        <button 
          class="tab" 
          [class.active]="activeTab() === 'vitest'"
          (click)="activeTab.set('vitest')">
           Mocking Vitest
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab() === 'services'"
          (click)="activeTab.set('services')">
           Mock de Services
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab() === 'spies'"
          (click)="activeTab.set('spies')">
           Espions
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab() === 'di'"
          (click)="activeTab.set('di')">
          💉 Injection de Dépendances
        </button>
      </nav>

      <!-- Vitest Mocking -->
      @if (activeTab() === 'vitest') {
        <section class="tab-content animate-fade-in">
          <h2> Bases du Mocking Vitest</h2>
          <p class="section-intro">
            Vitest fournit de puissants utilitaires de mocking via <code>vi</code>.
            Ceux-ci sont compatibles avec l'API de Jest.
          </p>

          <div class="example-card card">
            <h4> vi.fn() - Créer des Fonctions Mock</h4>
            <pre><code><span class="code-keyword">import</span> &#123; vi, describe, it, expect &#125; <span class="code-keyword">from</span> <span class="code-string">'vitest'</span>;

<span class="code-comment">// Créer une fonction mock</span>
<span class="code-keyword">const</span> mockCallback = <span class="code-function">vi.fn</span>();

<span class="code-comment">// L'utiliser</span>
mockCallback(<span class="code-string">'hello'</span>);
mockCallback(<span class="code-string">'world'</span>);

<span class="code-comment">// Vérifier les appels</span>
<span class="code-function">expect</span>(mockCallback).<span class="code-function">toHaveBeenCalledTimes</span>(<span class="code-number">2</span>);
<span class="code-function">expect</span>(mockCallback).<span class="code-function">toHaveBeenCalledWith</span>(<span class="code-string">'hello'</span>);
<span class="code-function">expect</span>(mockCallback).<span class="code-function">toHaveBeenLastCalledWith</span>(<span class="code-string">'world'</span>);</code></pre>
          </div>

          <div class="example-card card">
            <h4> Valeurs de Retour Mock</h4>
            <pre><code><span class="code-comment">// Retourner une valeur spécifique</span>
<span class="code-keyword">const</span> mockFn = <span class="code-function">vi.fn</span>().<span class="code-function">mockReturnValue</span>(<span class="code-number">42</span>);
<span class="code-function">expect</span>(<span class="code-function">mockFn</span>()).<span class="code-function">toBe</span>(<span class="code-number">42</span>);

<span class="code-comment">// Retourner différentes valeurs à chaque appel</span>
<span class="code-keyword">const</span> mockSequence = <span class="code-function">vi.fn</span>()
  .<span class="code-function">mockReturnValueOnce</span>(<span class="code-string">'premier'</span>)
  .<span class="code-function">mockReturnValueOnce</span>(<span class="code-string">'deuxième'</span>)
  .<span class="code-function">mockReturnValue</span>(<span class="code-string">'défaut'</span>);

<span class="code-function">expect</span>(<span class="code-function">mockSequence</span>()).<span class="code-function">toBe</span>(<span class="code-string">'premier'</span>);
<span class="code-function">expect</span>(<span class="code-function">mockSequence</span>()).<span class="code-function">toBe</span>(<span class="code-string">'deuxième'</span>);
<span class="code-function">expect</span>(<span class="code-function">mockSequence</span>()).<span class="code-function">toBe</span>(<span class="code-string">'défaut'</span>);

<span class="code-comment">// Mocker une promise résolue</span>
<span class="code-keyword">const</span> mockAsync = <span class="code-function">vi.fn</span>()
  .<span class="code-function">mockResolvedValue</span>(&#123; data: <span class="code-string">'succès'</span> &#125;);

<span class="code-keyword">await</span> <span class="code-function">expect</span>(<span class="code-function">mockAsync</span>())
  .<span class="code-property">resolves</span>.<span class="code-function">toEqual</span>(&#123; data: <span class="code-string">'succès'</span> &#125;);</code></pre>
          </div>

          <div class="example-card card">
            <h4> Implémentations Mock</h4>
            <pre><code><span class="code-comment">// Implémentation personnalisée</span>
<span class="code-keyword">const</span> mockFn = <span class="code-function">vi.fn</span>().<span class="code-function">mockImplementation</span>((x) => x * <span class="code-number">2</span>);
<span class="code-function">expect</span>(<span class="code-function">mockFn</span>(<span class="code-number">5</span>)).<span class="code-function">toBe</span>(<span class="code-number">10</span>);

<span class="code-comment">// Implémentation unique</span>
<span class="code-keyword">const</span> mock = <span class="code-function">vi.fn</span>()
  .<span class="code-function">mockImplementationOnce</span>(() => <span class="code-string">'premier appel'</span>)
  .<span class="code-function">mockImplementation</span>(() => <span class="code-string">'autres appels'</span>);</code></pre>
          </div>

          <div class="helper-grid">
            <div class="helper-card card">
              <h4>✅ Matchers Mock</h4>
              <ul>
                <li><code>.toHaveBeenCalled()</code></li>
                <li><code>.toHaveBeenCalledTimes(n)</code></li>
                <li><code>.toHaveBeenCalledWith(...args)</code></li>
                <li><code>.toHaveBeenLastCalledWith(...args)</code></li>
                <li><code>.toHaveBeenNthCalledWith(n, ...args)</code></li>
                <li><code>.toHaveReturned()</code></li>
              </ul>
            </div>
            <div class="helper-card card">
              <h4> Réinitialiser les Mocks</h4>
              <pre><code><span class="code-comment">// Effacer l'historique des appels</span>
mockFn.<span class="code-function">mockClear</span>();

<span class="code-comment">// Effacer + réinitialiser les valeurs de retour</span>
mockFn.<span class="code-function">mockReset</span>();

<span class="code-comment">// Revenir à l'original</span>
mockFn.<span class="code-function">mockRestore</span>();

<span class="code-comment">// Effacer tous les mocks</span>
<span class="code-function">vi.clearAllMocks</span>();</code></pre>
            </div>
          </div>
        </section>
      }

      <!-- Mock Services -->
      @if (activeTab() === 'services') {
        <section class="tab-content animate-fade-in">
          <h2> Mocker les Services Angular</h2>
          <p class="section-intro">
            Les composants dépendent souvent de services. Mockez-les pour tester les composants en isolation.
          </p>

          <div class="example-card card">
            <h4> Créer un Objet Service Mock</h4>
            <pre><code><span class="code-comment">// Interface du vrai service</span>
<span class="code-keyword">interface</span> <span class="code-class">UserService</span> &#123;
  <span class="code-function">getUser</span>(id: <span class="code-class">number</span>): <span class="code-class">Observable</span>&lt;<span class="code-class">User</span>&gt;;
  <span class="code-function">saveUser</span>(user: <span class="code-class">User</span>): <span class="code-class">Observable</span>&lt;<span class="code-class">User</span>&gt;;
&#125;

<span class="code-comment">// Service mock</span>
<span class="code-keyword">const</span> mockUserService = &#123;
  getUser: <span class="code-function">vi.fn</span>().<span class="code-function">mockReturnValue</span>(
    <span class="code-function">of</span>(&#123; id: <span class="code-number">1</span>, name: <span class="code-string">'Utilisateur Test'</span> &#125;)
  ),
  saveUser: <span class="code-function">vi.fn</span>().<span class="code-function">mockReturnValue</span>(
    <span class="code-function">of</span>(&#123; id: <span class="code-number">1</span>, name: <span class="code-string">'Utilisateur Sauvegardé'</span> &#125;)
  )
&#125;;</code></pre>
          </div>

          <div class="example-card card">
            <h4> Utiliser un Mock dans TestBed</h4>
            <pre><code><span class="code-function">describe</span>(<span class="code-string">'UserProfileComponent'</span>, () => &#123;
  <span class="code-keyword">let</span> component: <span class="code-class">UserProfileComponent</span>;
  <span class="code-keyword">let</span> fixture: <span class="code-class">ComponentFixture</span>&lt;<span class="code-class">UserProfileComponent</span>&gt;;
  <span class="code-keyword">let</span> mockService: <span class="code-keyword">typeof</span> mockUserService;

  <span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
    <span class="code-comment">// Nouveau mock pour chaque test</span>
    mockService = &#123;
      getUser: <span class="code-function">vi.fn</span>().<span class="code-function">mockReturnValue</span>(<span class="code-function">of</span>(&#123; id: <span class="code-number">1</span>, name: <span class="code-string">'Test'</span> &#125;)),
      saveUser: <span class="code-function">vi.fn</span>()
    &#125;;

    <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [UserProfileComponent],
      <span class="code-property">providers</span>: [
        <span class="code-comment">// Remplacer le vrai service par le mock</span>
        &#123; <span class="code-property">provide</span>: UserService, <span class="code-property">useValue</span>: mockService &#125;
      ]
    &#125;).<span class="code-function">compileComponents</span>();

    fixture = TestBed.<span class="code-function">createComponent</span>(UserProfileComponent);
    component = fixture.componentInstance;
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait charger l\'utilisateur à l\'initialisation'</span>, () => &#123;
    fixture.<span class="code-function">detectChanges</span>();
    
    <span class="code-function">expect</span>(mockService.getUser).<span class="code-function">toHaveBeenCalledWith</span>(<span class="code-number">1</span>);
    <span class="code-function">expect</span>(component.user?.name).<span class="code-function">toBe</span>(<span class="code-string">'Test'</span>);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait gérer les erreurs'</span>, () => &#123;
    <span class="code-comment">// Changer le comportement du mock pour ce test</span>
    mockService.getUser.<span class="code-function">mockReturnValue</span>(
      <span class="code-function">throwError</span>(() => <span class="code-keyword">new</span> <span class="code-class">Error</span>(<span class="code-string">'Échec'</span>))
    );
    
    fixture.<span class="code-function">detectChanges</span>();
    
    <span class="code-function">expect</span>(component.error).<span class="code-function">toBe</span>(<span class="code-string">'Échec'</span>);
  &#125;);
&#125;);</code></pre>
          </div>

          <div class="example-card card">
            <h4> Mocks Type-Safe avec Partial</h4>
            <pre><code><span class="code-comment">// Helper pour créer des mocks type-safe</span>
<span class="code-keyword">function</span> <span class="code-function">createMock</span>&lt;T&gt;(overrides: <span class="code-class">Partial</span>&lt;T&gt; = &#123;&#125;): T &#123;
  <span class="code-keyword">return</span> overrides <span class="code-keyword">as</span> T;
&#125;

<span class="code-comment">// Utilisation</span>
<span class="code-keyword">const</span> mockService = <span class="code-function">createMock</span>&lt;<span class="code-class">UserService</span>&gt;(&#123;
  getUser: <span class="code-function">vi.fn</span>().<span class="code-function">mockReturnValue</span>(<span class="code-function">of</span>(mockUser)),
  <span class="code-comment">// Mocker seulement ce dont vous avez besoin</span>
&#125;);</code></pre>
          </div>
        </section>
      }

      <!-- Spies -->
      @if (activeTab() === 'spies') {
        <section class="tab-content animate-fade-in">
          <h2> Utiliser les Espions</h2>
          <p class="section-intro">
            Les espions vous permettent d'observer et de contrôler le comportement des méthodes sur des objets existants
            sans les remplacer complètement.
          </p>

          <div class="example-card card">
            <h4> vi.spyOn() - Utilisation de Base</h4>
            <pre><code><span class="code-keyword">import</span> &#123; vi &#125; <span class="code-keyword">from</span> <span class="code-string">'vitest'</span>;

<span class="code-keyword">const</span> calculator = &#123;
  <span class="code-function">add</span>(a: <span class="code-class">number</span>, b: <span class="code-class">number</span>) &#123;
    <span class="code-keyword">return</span> a + b;
  &#125;
&#125;;

<span class="code-comment">// Créer un espion sur une méthode existante</span>
<span class="code-keyword">const</span> addSpy = <span class="code-function">vi.spyOn</span>(calculator, <span class="code-string">'add'</span>);

<span class="code-comment">// Appeler la vraie méthode</span>
<span class="code-keyword">const</span> result = calculator.<span class="code-function">add</span>(<span class="code-number">2</span>, <span class="code-number">3</span>);

<span class="code-comment">// Vérifier l'appel + le résultat</span>
<span class="code-function">expect</span>(addSpy).<span class="code-function">toHaveBeenCalledWith</span>(<span class="code-number">2</span>, <span class="code-number">3</span>);
<span class="code-function">expect</span>(result).<span class="code-function">toBe</span>(<span class="code-number">5</span>);  <span class="code-comment">// La vraie implémentation s'est exécutée</span>

<span class="code-comment">// N'oubliez pas de restaurer !</span>
addSpy.<span class="code-function">mockRestore</span>();</code></pre>
          </div>

          <div class="example-card card">
            <h4> Espion avec Implémentation Mock</h4>
            <pre><code><span class="code-keyword">const</span> spy = <span class="code-function">vi.spyOn</span>(service, <span class="code-string">'fetchData'</span>)
  .<span class="code-function">mockImplementation</span>(() => &#123;
    <span class="code-keyword">return</span> <span class="code-function">of</span>(&#123; data: <span class="code-string">'mocké'</span> &#125;);
  &#125;);

<span class="code-comment">// Ou juste mocker la valeur de retour</span>
<span class="code-keyword">const</span> spy = <span class="code-function">vi.spyOn</span>(service, <span class="code-string">'getUser'</span>)
  .<span class="code-function">mockReturnValue</span>(<span class="code-function">of</span>(mockUser));</code></pre>
          </div>

          <div class="example-card card">
            <h4> Espionner les Méthodes de Composant</h4>
            <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait appeler onSubmit quand le formulaire est valide'</span>, () => &#123;
  <span class="code-comment">// Espionner une méthode du composant</span>
  <span class="code-keyword">const</span> submitSpy = <span class="code-function">vi.spyOn</span>(component, <span class="code-string">'onSubmit'</span>);
  
  <span class="code-comment">// Remplir le formulaire</span>
  component.email = <span class="code-string">'test&#64;example.com'</span>;
  component.password = <span class="code-string">'password123'</span>;
  fixture.<span class="code-function">detectChanges</span>();
  
  <span class="code-comment">// Soumettre le formulaire</span>
  <span class="code-keyword">const</span> form = fixture.debugElement
    .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'form'</span>));
  form.<span class="code-function">triggerEventHandler</span>(<span class="code-string">'ngSubmit'</span>, <span class="code-keyword">null</span>);
  
  <span class="code-function">expect</span>(submitSpy).<span class="code-function">toHaveBeenCalled</span>();
&#125;);</code></pre>
          </div>

          <div class="example-card card">
            <h4> Espionner console, window, etc.</h4>
            <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait logger l\'erreur'</span>, () => &#123;
  <span class="code-keyword">const</span> consoleSpy = <span class="code-function">vi.spyOn</span>(console, <span class="code-string">'error'</span>)
    .<span class="code-function">mockImplementation</span>(() => &#123;&#125;); <span class="code-comment">// Supprimer l'affichage</span>
  
  service.<span class="code-function">handleError</span>(<span class="code-string">'Quelque chose s\'est mal passé'</span>);
  
  <span class="code-function">expect</span>(consoleSpy).<span class="code-function">toHaveBeenCalledWith</span>(
    <span class="code-string">'Error:'</span>, <span class="code-string">'Quelque chose s\'est mal passé'</span>
  );
  
  consoleSpy.<span class="code-function">mockRestore</span>();
&#125;);

<span class="code-function">it</span>(<span class="code-string">'devrait naviguer'</span>, () => &#123;
  <span class="code-keyword">const</span> locationSpy = <span class="code-function">vi.spyOn</span>(window.location, <span class="code-string">'href'</span>, <span class="code-string">'set'</span>);
  
  component.<span class="code-function">redirectTo</span>(<span class="code-string">'/home'</span>);
  
  <span class="code-function">expect</span>(locationSpy).<span class="code-function">toHaveBeenCalledWith</span>(<span class="code-string">'/home'</span>);
&#125;);</code></pre>
          </div>
        </section>
      }

      <!-- Dependency Injection -->
      @if (activeTab() === 'di') {
        <section class="tab-content animate-fade-in">
          <h2>💉 Injection de Dépendances dans les Tests</h2>
          <p class="section-intro">
            L'injection de dépendances d'Angular facilite les tests. Apprenez les différentes stratégies de provider.
          </p>

          <div class="provider-grid">
            <div class="provider-card card">
              <h4>useValue</h4>
              <p>Fournir une valeur/objet spécifique</p>
              <pre><code>&#123;
  <span class="code-property">provide</span>: UserService,
  <span class="code-property">useValue</span>: mockUserService
&#125;</code></pre>
            </div>

            <div class="provider-card card">
              <h4>useClass</h4>
              <p>Fournir une classe différente</p>
              <pre><code>&#123;
  <span class="code-property">provide</span>: UserService,
  <span class="code-property">useClass</span>: MockUserService
&#125;</code></pre>
            </div>

            <div class="provider-card card">
              <h4>useFactory</h4>
              <p>Création dynamique avec dépendances</p>
              <pre><code>&#123;
  <span class="code-property">provide</span>: UserService,
  <span class="code-property">useFactory</span>: () => &#123;
    <span class="code-keyword">return</span> <span class="code-keyword">new</span> MockUserService();
  &#125;
&#125;</code></pre>
            </div>

            <div class="provider-card card">
              <h4>useExisting</h4>
              <p>Alias vers un autre provider</p>
              <pre><code>&#123;
  <span class="code-property">provide</span>: AbstractLogger,
  <span class="code-property">useExisting</span>: ConsoleLogger
&#125;</code></pre>
            </div>
          </div>

          <div class="example-card card">
            <h4> Exemple Complet de Test DI</h4>
            <pre><code><span class="code-function">describe</span>(<span class="code-string">'OrderComponent'</span>, () => &#123;
  <span class="code-keyword">let</span> component: <span class="code-class">OrderComponent</span>;
  <span class="code-keyword">let</span> fixture: <span class="code-class">ComponentFixture</span>&lt;<span class="code-class">OrderComponent</span>&gt;;
  <span class="code-keyword">let</span> orderService: <span class="code-class">OrderService</span>;
  <span class="code-keyword">let</span> authService: <span class="code-class">AuthService</span>;

  <span class="code-keyword">const</span> mockOrderService = &#123;
    getOrders: <span class="code-function">vi.fn</span>().<span class="code-function">mockReturnValue</span>(<span class="code-function">of</span>([])),
    createOrder: <span class="code-function">vi.fn</span>()
  &#125;;

  <span class="code-keyword">const</span> mockAuthService = &#123;
    currentUser: <span class="code-function">signal</span>(&#123; id: <span class="code-number">1</span>, name: <span class="code-string">'Test'</span> &#125;),
    isAuthenticated: <span class="code-function">vi.fn</span>().<span class="code-function">mockReturnValue</span>(<span class="code-keyword">true</span>)
  &#125;;

  <span class="code-function">beforeEach</span>(<span class="code-keyword">async</span> () => &#123;
    <span class="code-keyword">await</span> TestBed.<span class="code-function">configureTestingModule</span>(&#123;
      <span class="code-property">imports</span>: [OrderComponent],
      <span class="code-property">providers</span>: [
        &#123; <span class="code-property">provide</span>: OrderService, <span class="code-property">useValue</span>: mockOrderService &#125;,
        &#123; <span class="code-property">provide</span>: AuthService, <span class="code-property">useValue</span>: mockAuthService &#125;
      ]
    &#125;).<span class="code-function">compileComponents</span>();

    fixture = TestBed.<span class="code-function">createComponent</span>(OrderComponent);
    component = fixture.componentInstance;
    
    <span class="code-comment">// Récupérer les services injectés</span>
    orderService = TestBed.<span class="code-function">inject</span>(OrderService);
    authService = TestBed.<span class="code-function">inject</span>(AuthService);
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'devrait charger les commandes de l\'utilisateur courant'</span>, () => &#123;
    fixture.<span class="code-function">detectChanges</span>();
    
    <span class="code-function">expect</span>(orderService.getOrders)
      .<span class="code-function">toHaveBeenCalledWith</span>(<span class="code-number">1</span>);  <span class="code-comment">// user.id</span>
  &#125;);
&#125;);</code></pre>
          </div>

          <div class="alert alert-info">
            <span class="alert-icon"></span>
            <div>
              <strong>Conseil Pro :</strong> Créez des factories de mock partagées pour les services couramment utilisés :
              <pre style="margin-top: 0.5rem;"><code><span class="code-comment">// testing/mocks.ts</span>
<span class="code-keyword">export const</span> <span class="code-function">createMockAuthService</span> = () => (&#123;
  currentUser: <span class="code-function">signal</span>(<span class="code-keyword">null</span>),
  login: <span class="code-function">vi.fn</span>(),
  logout: <span class="code-function">vi.fn</span>()
&#125;);</code></pre>
            </div>
          </div>
        </section>
      }

      <!-- Aide-Mémoire -->
      <section class="cheat-sheet card">
        <h2> Aide-Mémoire Mocking</h2>
        <div class="cheat-grid">
          <div class="cheat-item">
            <h4>Créer une Fonction Mock</h4>
            <code>vi.fn()</code>
          </div>
          <div class="cheat-item">
            <h4>Espionner une Méthode</h4>
            <code>vi.spyOn(obj, 'method')</code>
          </div>
          <div class="cheat-item">
            <h4>Mocker la Valeur de Retour</h4>
            <code>.mockReturnValue(val)</code>
          </div>
          <div class="cheat-item">
            <h4>Mocker une Promise</h4>
            <code>.mockResolvedValue(val)</code>
          </div>
          <div class="cheat-item">
            <h4>Mocker un Observable</h4>
            <code>.mockReturnValue(of(val))</code>
          </div>
          <div class="cheat-item">
            <h4>Effacer les Appels</h4>
            <code>mockFn.mockClear()</code>
          </div>
          <div class="cheat-item">
            <h4>Restaurer l'Original</h4>
            <code>spy.mockRestore()</code>
          </div>
          <div class="cheat-item">
            <h4>Vérifier l'Appel</h4>
            <code>expect(fn).toHaveBeenCalled()</code>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .mocking-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;
      
      h1 { margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); font-size: 1.1rem; }
    }

    .intro-section {
      margin-bottom: 2rem;
      
      h2 { margin-bottom: 0.75rem; }
      
      .intro-text {
        font-size: 1.05rem;
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
      }
    }

    .mock-types {
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

    .mock-type {
      text-align: center;
      padding: 1rem;
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      
      .type-icon {
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
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
    }

    .helper-grid, .provider-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      
      @media (max-width: 700px) {
        grid-template-columns: 1fr;
      }
    }

    .helper-card, .provider-card {
      h4 { margin: 0 0 0.75rem; }
      p { margin: 0 0 0.75rem; font-size: 0.9rem; }
      
      ul {
        margin: 0;
        padding-left: 1.25rem;
        
        li {
          margin-bottom: 0.4rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
      }
      
      pre {
        margin: 0;
        font-size: 0.8rem;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
    }

    .cheat-sheet {
      margin-top: 2rem;
      
      h2 { margin-bottom: 1.5rem; }
    }

    .cheat-grid {
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

    .cheat-item {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: var(--radius-md);
      
      h4 {
        margin: 0 0 0.5rem;
        font-size: 0.85rem;
        color: var(--text-secondary);
      }
      
      code {
        font-size: 0.8rem;
      }
    }
  `]
})
export class MockingTutorialComponent {
  activeTab = signal('vitest');
}
