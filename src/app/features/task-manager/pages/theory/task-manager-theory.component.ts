import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface TheorySection {
  id: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-task-manager-theory',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="theory-container">
      <!-- Header -->
      <header class="page-header">
        <div class="header-content">
          <span class="badge"> Théorie</span>
          <h1>Concepts de Test du Mini Task Manager</h1>
          <p class="subtitle">
            Découvrez les concepts clés utilisés pour tester notre application. 
            Chaque notion est expliquée simplement avec des exemples concrets du projet.
          </p>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="theory-nav">
        @for (section of sections; track section.id) {
          <button
            class="nav-tab"
            [class.active]="activeSection() === section.id"
            (click)="activeSection.set(section.id)">
            {{ section.icon }} {{ section.title }}
          </button>
        }
      </nav>

      <!-- Contenu -->
      <main class="theory-content">
        
        <!-- Section 1: Pattern AAA -->
        @if (activeSection() === 'aaa') {
          <section class="content-section animate-fade-in">
            <h2>📐 Le Pattern AAA (Arrange-Act-Assert)</h2>
            
            <div class="intro-box">
              <p class="lead">
                Le pattern <strong>AAA</strong> est la structure de base de tout test unitaire. 
                C'est comme une recette de cuisine en 3 étapes : <em>préparer, cuisiner, goûter</em>.
              </p>
            </div>

            <div class="aaa-visual">
              <div class="aaa-step arrange-step">
                <div class="step-badge">1</div>
                <h3>Arrange 🎬</h3>
                <p class="step-subtitle">Préparer le terrain</p>
                <div class="step-content">
                  <p><strong>Quoi ?</strong> On prépare tout ce dont le test a besoin.</p>
                  <ul>
                    <li>Créer les objets (services, composants)</li>
                    <li>Définir les données de test</li>
                    <li>Configurer les mocks/spies</li>
                  </ul>
                </div>
              </div>

              <div class="aaa-arrow">→</div>

              <div class="aaa-step act-step">
                <div class="step-badge">2</div>
                <h3>Act 🎯</h3>
                <p class="step-subtitle">Exécuter l'action</p>
                <div class="step-content">
                  <p><strong>Quoi ?</strong> On exécute le code à tester.</p>
                  <ul>
                    <li>Appeler la méthode testée</li>
                    <li>Déclencher l'événement</li>
                    <li><em>Une seule action par test !</em></li>
                  </ul>
                </div>
              </div>

              <div class="aaa-arrow">→</div>

              <div class="aaa-step assert-step">
                <div class="step-badge">3</div>
                <h3>Assert ✅</h3>
                <p class="step-subtitle">Vérifier le résultat</p>
                <div class="step-content">
                  <p><strong>Quoi ?</strong> On vérifie que le résultat est correct.</p>
                  <ul>
                    <li>Comparer avec la valeur attendue</li>
                    <li>Vérifier l'état final</li>
                    <li>Utiliser <code>expect()</code></li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="code-example-box">
              <h4>💻 Exemple Concret : Filtrer les Tâches Actives</h4>
              <div class="code-block">
                <pre><code>it('devrait filtrer les tâches actives', () => &#123;
  <span class="code-comment">// 🎬 ARRANGE - Préparer les données de test</span>
  <span class="code-keyword">const</span> tasks: Task[] = [
    &#123; id: '1', title: 'Tâche 1', completed: <span class="code-keyword">false</span> &#125;,
    &#123; id: '2', title: 'Tâche 2', completed: <span class="code-keyword">true</span> &#125;,
    &#123; id: '3', title: 'Tâche 3', completed: <span class="code-keyword">false</span> &#125;
  ];

  <span class="code-comment">// 🎯 ACT - Exécuter le filtre</span>
  <span class="code-keyword">const</span> result = service.filterByStatus(tasks, 'active');

  <span class="code-comment">// ✅ ASSERT - Vérifier le résultat</span>
  expect(result.length).toBe(<span class="code-number">2</span>);
  expect(result.every(t => !t.completed)).toBe(<span class="code-keyword">true</span>);
&#125;);</code></pre>
              </div>
            </div>

            <div class="tip-box success">
              <span class="tip-icon">💡</span>
              <div>
                <strong>Astuce :</strong> Séparez visuellement les 3 parties avec des commentaires 
                (// Arrange, // Act, // Assert) pour une meilleure lisibilité !
              </div>
            </div>
          </section>
        }

        <!-- Section 2: Signals -->
        @if (activeSection() === 'signals') {
          <section class="content-section animate-fade-in">
            <h2>⚡ Les Signals Angular</h2>
            
            <div class="intro-box">
              <p class="lead">
                Les <strong>Signals</strong> sont la nouvelle façon de gérer l'état réactif dans Angular. 
                Imaginez-les comme des "boîtes intelligentes" qui contiennent une valeur et notifient 
                automatiquement quand elle change.
              </p>
            </div>

            <div class="concept-grid">
              <div class="concept-card">
                <div class="concept-icon">📦</div>
                <h3>signal() - Créer un état</h3>
                <p>Crée une valeur réactive que vous pouvez lire et modifier.</p>
                <div class="code-block small">
                  <pre><code><span class="code-comment">// Dans TaskService</span>
<span class="code-keyword">private</span> _tasks = signal&lt;Task[]&gt;([]);

<span class="code-comment">// Lire la valeur : appeler comme fonction</span>
console.log(<span class="code-keyword">this</span>._tasks()); <span class="code-comment">// []</span>

<span class="code-comment">// Modifier : .set() ou .update()</span>
<span class="code-keyword">this</span>._tasks.set([newTask]);
<span class="code-keyword">this</span>._tasks.update(t => [...t, newTask]);</code></pre>
                </div>
              </div>

              <div class="concept-card">
                <div class="concept-icon">🔄</div>
                <h3>computed() - Valeur dérivée</h3>
                <p>Crée une valeur calculée qui se met à jour automatiquement.</p>
                <div class="code-block small">
                  <pre><code><span class="code-comment">// Se recalcule auto quand _tasks change</span>
activeTasksCount = computed(() =>
  <span class="code-keyword">this</span>._tasks().filter(t => !t.completed).length
);

<span class="code-comment">// Utilisation</span>
console.log(<span class="code-keyword">this</span>.activeTasksCount()); <span class="code-comment">// 5</span></code></pre>
                </div>
              </div>
            </div>

            <div class="code-example-box">
              <h4>🧪 Tester les Signals dans notre Task Manager</h4>
              <div class="code-block">
                <pre><code>describe('TaskService - Signals', () => &#123;
  it('devrait mettre à jour le compteur quand on ajoute une tâche', () => &#123;
    <span class="code-comment">// Arrange</span>
    <span class="code-keyword">const</span> service = TestBed.inject(TaskService);
    expect(service.activeTasksCount()).toBe(<span class="code-number">0</span>); <span class="code-comment">// État initial</span>
    
    <span class="code-comment">// Act</span>
    service.addTask(&#123; title: 'Nouvelle tâche', priority: 'medium' &#125;);
    
    <span class="code-comment">// Assert - computed() se met à jour instantanément !</span>
    expect(service.activeTasksCount()).toBe(<span class="code-number">1</span>);
  &#125;);
&#125;);</code></pre>
              </div>
            </div>

            <div class="key-points">
              <h4>🎯 Points Clés pour les Tests</h4>
              <ul>
                <li>✅ Appeler le signal comme une fonction : <code>signal()</code> pas <code>signal</code></li>
                <li>✅ Les computed() sont synchrones - pas besoin de <code>detectChanges()</code></li>
                <li>✅ Utilisez <code>.set()</code> pour remplacer, <code>.update()</code> pour modifier</li>
                <li>✅ Exposez en lecture seule : <code>this.tasks = this._tasks.asReadonly()</code></li>
              </ul>
            </div>
          </section>
        }

        <!-- Section 3: Mocking -->
        @if (activeSection() === 'mocking') {
          <section class="content-section animate-fade-in">
            <h2>🎭 Le Mocking (Simulation)</h2>
            
            <div class="intro-box">
              <p class="lead">
                Le <strong>mocking</strong> consiste à remplacer les vraies dépendances par des 
                versions "factices" contrôlées. C'est comme utiliser un mannequin de crash-test 
                au lieu d'une vraie personne !
              </p>
            </div>

            <div class="why-mock">
              <h3>🤔 Pourquoi Mocker dans notre Task Manager ?</h3>
              <div class="reasons-grid">
                <div class="reason-card">
                  <span class="reason-icon">⚡</span>
                  <h4>Tests Rapides</h4>
                  <p>Pas d'appels HTTP = tests instantanés</p>
                </div>
                <div class="reason-card">
                  <span class="reason-icon">🎮</span>
                  <h4>Contrôle Total</h4>
                  <p>Simulez erreurs, délais, réponses vides...</p>
                </div>
                <div class="reason-card">
                  <span class="reason-icon">🔒</span>
                  <h4>Isolation</h4>
                  <p>Testez une seule chose à la fois</p>
                </div>
                <div class="reason-card">
                  <span class="reason-icon">🌐</span>
                  <h4>Sans Serveur</h4>
                  <p>Pas besoin d'API backend</p>
                </div>
              </div>
            </div>

            <div class="mock-types">
              <h3>📦 3 Types de Mocks Utilisés</h3>
              
              <div class="mock-type-card">
                <h4>1️⃣ Mock de Service Complet</h4>
                <p>Remplacez tout le TaskService par un objet factice dans les tests de composant.</p>
                <div class="code-block">
                  <pre><code><span class="code-comment">// Créer un faux service</span>
<span class="code-keyword">const</span> mockTaskService = &#123;
  tasks: signal&lt;Task[]&gt;([]),
  filteredTasks: signal&lt;Task[]&gt;([]),
  addTask: vi.fn(),
  deleteTask: vi.fn(),
  toggleComplete: vi.fn()
&#125;;

<span class="code-comment">// L'injecter dans TestBed</span>
TestBed.configureTestingModule(&#123;
  providers: [
    &#123; provide: TaskService, useValue: mockTaskService &#125;
  ]
&#125;);</code></pre>
                </div>
              </div>

              <div class="mock-type-card">
                <h4>2️⃣ Spy sur une Méthode</h4>
                <p>Gardez le vrai service mais "espionnez" une méthode spécifique.</p>
                <div class="code-block">
                  <pre><code><span class="code-keyword">const</span> service = TestBed.inject(TaskService);
<span class="code-keyword">const</span> addSpy = vi.spyOn(service, 'addTask');

<span class="code-comment">// Déclencher l'action</span>
component.onSubmit();

<span class="code-comment">// Vérifier que addTask a été appelé correctement</span>
expect(addSpy).toHaveBeenCalledWith(&#123;
  title: 'Ma tâche',
  priority: 'medium'
&#125;);</code></pre>
                </div>
              </div>

              <div class="mock-type-card">
                <h4>3️⃣ Mock HTTP avec HttpTestingController</h4>
                <p>Interceptez les appels HTTP et renvoyez des réponses simulées.</p>
                <div class="code-block">
                  <pre><code>TestBed.configureTestingModule(&#123;
  providers: [provideHttpClientTesting()]
&#125;);

<span class="code-keyword">const</span> httpMock = TestBed.inject(HttpTestingController);

<span class="code-comment">// Déclencher l'appel HTTP</span>
service.loadTasks().subscribe();

<span class="code-comment">// Intercepter et répondre</span>
<span class="code-keyword">const</span> req = httpMock.expectOne('/api/tasks');
req.flush([&#123; id: '1', title: 'Tâche Mock' &#125;]);

expect(service.tasks().length).toBe(<span class="code-number">1</span>);</code></pre>
                </div>
              </div>
            </div>
          </section>
        }

        <!-- Section 4: Tests de Formulaires -->
        @if (activeSection() === 'forms') {
          <section class="content-section animate-fade-in">
            <h2>📝 Tests de Formulaires Réactifs</h2>
            
            <div class="intro-box">
              <p class="lead">
                Notre Task Manager utilise les <strong>Reactive Forms</strong> pour le formulaire 
                d'ajout de tâche. Bonne nouvelle : la logique est dans le TypeScript, donc 
                facile à tester !
              </p>
            </div>

            <div class="form-test-flow">
              <h3>🔄 4 Choses à Tester dans un Formulaire</h3>
              <div class="flow-items">
                <div class="flow-item">
                  <span class="flow-number">1</span>
                  <span class="flow-label">État Initial</span>
                  <p>Le formulaire est vide et invalide au départ</p>
                </div>
                <div class="flow-item">
                  <span class="flow-number">2</span>
                  <span class="flow-label">Validation</span>
                  <p>Les validateurs (required, minLength) fonctionnent</p>
                </div>
                <div class="flow-item">
                  <span class="flow-number">3</span>
                  <span class="flow-label">Soumission</span>
                  <p>Le service est appelé avec les bonnes données</p>
                </div>
                <div class="flow-item">
                  <span class="flow-number">4</span>
                  <span class="flow-label">Reset</span>
                  <p>Le formulaire se réinitialise après soumission</p>
                </div>
              </div>
            </div>

            <div class="code-example-box">
              <h4>💻 Exemples de Tests du Formulaire de Tâche</h4>
              <div class="code-block">
                <pre><code>describe('Formulaire Tâche', () => &#123;
  it('devrait être invalide si le titre est vide', () => &#123;
    expect(component.taskForm.valid).toBe(<span class="code-keyword">false</span>);
    
    <span class="code-keyword">const</span> titleControl = component.taskForm.get('title');
    expect(titleControl?.errors?.['required']).toBeTruthy();
  &#125;);

  it('devrait être valide avec un titre correct', () => &#123;
    <span class="code-comment">// Simuler la saisie utilisateur</span>
    component.taskForm.patchValue(&#123;
      title: 'Ma nouvelle tâche',
      priority: 'medium'
    &#125;);
    
    expect(component.taskForm.valid).toBe(<span class="code-keyword">true</span>);
  &#125;);

  it('devrait appeler addTask lors de la soumission', () => &#123;
    <span class="code-keyword">const</span> spy = vi.spyOn(taskService, 'addTask');
    
    component.taskForm.patchValue(&#123;
      title: 'Tâche urgente',
      priority: 'high'
    &#125;);
    component.onSubmit();
    
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining(&#123; title: 'Tâche urgente' &#125;)
    );
  &#125;);
&#125;);</code></pre>
              </div>
            </div>

            <div class="tip-box warning">
              <span class="tip-icon">⚠️</span>
              <div>
                <strong>patchValue vs setValue :</strong> 
                <br><code>patchValue()</code> = modifier certains champs
                <br><code>setValue()</code> = remplir TOUS les champs (sinon erreur !)
              </div>
            </div>
          </section>
        }

        <!-- Section 5: Tests Asynchrones -->
        @if (activeSection() === 'async') {
          <section class="content-section animate-fade-in">
            <h2>⏱️ Tests Asynchrones</h2>
            
            <div class="intro-box">
              <p class="lead">
                Les opérations <strong>asynchrones</strong> (HTTP, setTimeout, debounce) nécessitent 
                des techniques spéciales. Angular fournit des outils puissants pour contrôler le temps !
              </p>
            </div>

            <div class="async-methods">
              <h3>🛠️ Méthodes de Test Asynchrone</h3>
              
              <div class="method-card recommended">
                <div class="method-header">
                  <span class="method-badge">⭐ Recommandé</span>
                  <h4>fakeAsync + tick()</h4>
                </div>
                <p>Contrôle total du temps. Parfait pour les délais et debounce de recherche.</p>
                <div class="code-block">
                  <pre><code>it('devrait debounce la recherche', fakeAsync(() => &#123;
  <span class="code-keyword">const</span> spy = vi.spyOn(service, 'search');
  
  component.searchQuery.set('angular');
  
  <span class="code-comment">// Pas encore appelé (debounce 300ms)</span>
  expect(spy).not.toHaveBeenCalled();
  
  <span class="code-comment">// Avancer le temps virtuellement</span>
  tick(<span class="code-number">300</span>);
  
  <span class="code-comment">// Maintenant c'est appelé !</span>
  expect(spy).toHaveBeenCalledWith('angular');
&#125;));</code></pre>
                </div>
              </div>

              <div class="method-card">
                <div class="method-header">
                  <h4>async / await</h4>
                </div>
                <p>Simple et familier. Idéal pour les Promises.</p>
                <div class="code-block">
                  <pre><code>it('devrait charger les tâches', <span class="code-keyword">async</span> () => &#123;
  <span class="code-keyword">await</span> service.loadTasks();
  
  expect(service.tasks().length).toBeGreaterThan(<span class="code-number">0</span>);
&#125;);</code></pre>
                </div>
              </div>

              <div class="method-card">
                <div class="method-header">
                  <h4>flush()</h4>
                </div>
                <p>Exécute TOUTES les tâches en attente (utile quand vous ne savez pas le délai exact).</p>
                <div class="code-block">
                  <pre><code>it('devrait traiter la file', fakeAsync(() => &#123;
  service.processAllPending();
  
  flush(); <span class="code-comment">// Exécute tout ce qui est en attente</span>
  
  expect(service.isComplete()).toBe(<span class="code-keyword">true</span>);
&#125;));</code></pre>
                </div>
              </div>
            </div>

            <div class="tip-box success">
              <span class="tip-icon">✨</span>
              <div>
                <strong>Bonne nouvelle :</strong> Avec les Signals Angular, beaucoup d'opérations 
                deviennent synchrones ! Moins de tests async nécessaires.
              </div>
            </div>
          </section>
        }

        <!-- Section 6: TestBed -->
        @if (activeSection() === 'testbed') {
          <section class="content-section animate-fade-in">
            <h2>🔧 Configuration TestBed</h2>
            
            <div class="intro-box">
              <p class="lead">
                <strong>TestBed</strong> est l'outil Angular pour créer un environnement de test isolé. 
                Il crée un mini-module Angular juste pour vos tests, avec uniquement ce dont vous avez besoin.
              </p>
            </div>

            <div class="testbed-anatomy">
              <h3>🔍 Configuration Type pour le Task Manager</h3>
              <div class="code-block large">
                <pre><code>describe('TaskManagerComponent', () => &#123;
  <span class="code-keyword">let</span> component: TaskManagerComponent;
  <span class="code-keyword">let</span> fixture: ComponentFixture&lt;TaskManagerComponent&gt;;
  <span class="code-keyword">let</span> taskService: TaskService;

  beforeEach(<span class="code-keyword">async</span> () => &#123;
    <span class="code-comment">// Configurer le module de test</span>
    <span class="code-keyword">await</span> TestBed.configureTestingModule(&#123;
      imports: [TaskManagerComponent], <span class="code-comment">// Composant standalone</span>
      providers: [
        &#123; provide: TaskService, useValue: mockTaskService &#125;
      ]
    &#125;).compileComponents();
    
    <span class="code-comment">// Créer l'instance du composant</span>
    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    
    <span class="code-comment">// Déclencher le premier cycle de détection</span>
    fixture.detectChanges();
  &#125;);
&#125;);</code></pre>
              </div>
            </div>

            <div class="key-points">
              <h4>📋 Éléments Clés à Retenir</h4>
              <div class="points-grid">
                <div class="point">
                  <strong>fixture</strong>
                  <p>Conteneur du composant avec accès au DOM et à l'instance</p>
                </div>
                <div class="point">
                  <strong>component</strong>
                  <p>L'instance TypeScript du composant (propriétés, méthodes)</p>
                </div>
                <div class="point">
                  <strong>nativeElement</strong>
                  <p>Accès au DOM réel : fixture.nativeElement</p>
                </div>
                <div class="point">
                  <strong>detectChanges()</strong>
                  <p>Force Angular à mettre à jour la vue</p>
                </div>
              </div>
            </div>

            <div class="tip-box success">
              <span class="tip-icon">💡</span>
              <div>
                <strong>TestBed.inject() :</strong> Utilisez cette méthode pour récupérer 
                n'importe quel service injecté dans le module de test.
              </div>
            </div>
          </section>
        }
      </main>

      <!-- Navigation Footer -->
      <footer class="nav-footer">
        <a routerLink="/tutorial/practical" class="next-btn">
          Passer à la Pratique →
        </a>
      </footer>
    </div>
  `,
  styles: [`
    .theory-container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
    .page-header { text-align: center; margin-bottom: 2rem; }
    .badge { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; margin-bottom: 1rem; }
    h1 { font-size: 2.2rem; color: #1a1a2e; margin-bottom: 1rem; }
    .subtitle { color: #666; font-size: 1.1rem; max-width: 700px; margin: 0 auto; }

    .theory-nav { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 12px; }
    .nav-tab { padding: 0.75rem 1.25rem; border: none; background: white; border-radius: 8px; cursor: pointer; font-size: 0.95rem; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .nav-tab:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .nav-tab.active { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }

    .content-section { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .content-section h2 { font-size: 1.8rem; color: #1a1a2e; margin-bottom: 1.5rem; }
    .intro-box { background: linear-gradient(135deg, #e8f4fd, #e8f0fe); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #667eea; }
    .lead { font-size: 1.1rem; line-height: 1.7; color: #333; margin: 0; }

    .aaa-visual { display: flex; align-items: stretch; gap: 1rem; margin: 2rem 0; flex-wrap: wrap; }
    .aaa-step { flex: 1; min-width: 200px; padding: 1.5rem; border-radius: 12px; position: relative; }
    .arrange-step { background: linear-gradient(135deg, #ffecd2, #fcb69f); }
    .act-step { background: linear-gradient(135deg, #a8edea, #fed6e3); }
    .assert-step { background: linear-gradient(135deg, #d4fc79, #96e6a1); }
    .step-badge { position: absolute; top: -10px; left: -10px; width: 30px; height: 30px; background: #1a1a2e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .aaa-step h3 { margin: 0 0 0.25rem; font-size: 1.3rem; }
    .step-subtitle { color: #555; font-size: 0.9rem; margin-bottom: 1rem; font-style: italic; }
    .step-content ul { margin: 0.5rem 0; padding-left: 1.2rem; }
    .step-content li { margin: 0.3rem 0; font-size: 0.95rem; }
    .aaa-arrow { display: flex; align-items: center; font-size: 2rem; color: #667eea; font-weight: bold; }

    .concept-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 1.5rem 0; }
    .concept-card { background: #f8f9fa; padding: 1.5rem; border-radius: 12px; border: 1px solid #e9ecef; }
    .concept-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .concept-card h3 { margin: 0 0 0.75rem; color: #1a1a2e; }

    .code-block { background: #1e1e2e; border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
    .code-block.small { padding: 0.75rem; font-size: 0.85rem; }
    .code-block.large { font-size: 0.95rem; }
    .code-block pre { margin: 0; }
    .code-block code { font-family: 'Fira Code', 'Monaco', monospace; font-size: 0.9rem; line-height: 1.5; color: #e4e4e7; }
    .code-keyword { color: #c678dd; }
    .code-string { color: #98c379; }
    .code-number { color: #d19a66; }
    .code-comment { color: #5c6370; font-style: italic; }

    .code-example-box { background: #f8f9fa; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; }
    .code-example-box h4 { margin: 0 0 1rem; color: #1a1a2e; }

    .tip-box { display: flex; gap: 1rem; padding: 1rem 1.5rem; border-radius: 8px; margin: 1.5rem 0; align-items: flex-start; }
    .tip-box.success { background: #d4edda; border: 1px solid #c3e6cb; }
    .tip-box.warning { background: #fff3cd; border: 1px solid #ffeeba; }
    .tip-icon { font-size: 1.5rem; }

    .key-points { background: #f0f7ff; padding: 1.5rem; border-radius: 12px; margin-top: 2rem; }
    .key-points h4 { margin: 0 0 1rem; }
    .key-points ul { margin: 0; padding-left: 1.5rem; }
    .key-points li { margin: 0.5rem 0; }
    .key-points code { background: #e2e8f0; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9rem; }

    .reasons-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .reason-card { background: #f8f9fa; padding: 1.25rem; border-radius: 10px; text-align: center; }
    .reason-icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
    .reason-card h4 { margin: 0 0 0.5rem; font-size: 1rem; }
    .reason-card p { margin: 0; font-size: 0.9rem; color: #666; }

    .mock-type-card { background: #f8f9fa; padding: 1.5rem; border-radius: 12px; margin: 1rem 0; }
    .mock-type-card h4 { margin: 0 0 0.5rem; color: #667eea; }

    .flow-items { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .flow-item { background: #f8f9fa; padding: 1.25rem; border-radius: 10px; text-align: center; }
    .flow-number { display: inline-flex; width: 32px; height: 32px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 50%; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 0.5rem; }
    .flow-label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
    .flow-item p { margin: 0; font-size: 0.9rem; color: #666; }

    .method-card { background: #f8f9fa; padding: 1.5rem; border-radius: 12px; margin: 1rem 0; }
    .method-card.recommended { border-left: 4px solid #28a745; }
    .method-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
    .method-header h4 { margin: 0; font-size: 1.1rem; }
    .method-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; background: #d4edda; color: #155724; }

    .points-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .point { background: white; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; }
    .point strong { display: block; color: #667eea; margin-bottom: 0.25rem; }
    .point p { margin: 0; font-size: 0.9rem; color: #666; }

    .nav-footer { display: flex; justify-content: flex-end; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e9ecef; }
    .next-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: transform 0.2s, box-shadow 0.2s; }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }

    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .theory-container { padding: 1rem; }
      h1 { font-size: 1.6rem; }
      .aaa-visual { flex-direction: column; }
      .aaa-arrow { transform: rotate(90deg); justify-content: center; }
    }
  `]
})
export class TaskManagerTheoryComponent {
  sections: TheorySection[] = [
    { id: 'aaa', title: 'Pattern AAA', icon: '📐' },
    { id: 'signals', title: 'Signals', icon: '⚡' },
    { id: 'mocking', title: 'Mocking', icon: '🎭' },
    { id: 'forms', title: 'Formulaires', icon: '📝' },
    { id: 'async', title: 'Async', icon: '⏱️' },
    { id: 'testbed', title: 'TestBed', icon: '🔧' }
  ];

  activeSection = signal('aaa');
}
