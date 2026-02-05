import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface TipCategory {
  id: string;
  title: string;
  icon: string;
}

interface CodeExample {
  wrong: string;
  correct: string;
  wrongLabel: string;
  correctLabel: string;
}

@Component({
  selector: 'app-task-manager-tips',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="tips-container">
      <!-- Header -->
      <header class="page-header">
        <div class="header-content">
          <span class="badge">💡 Astuces</span>
          <h1>Conseils & Bonnes Pratiques</h1>
          <p class="subtitle">
            Évitez les pièges courants et adoptez les meilleures pratiques pour 
            des tests robustes et maintenables.
          </p>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="tips-nav">
        @for (category of categories; track category.id) {
          <button
            class="nav-tab"
            [class.active]="activeCategory() === category.id"
            (click)="activeCategory.set(category.id)">
            {{ category.icon }} {{ category.title }}
          </button>
        }
      </nav>

      <!-- Contenu -->
      <main class="tips-content">
        
        <!-- Erreurs Courantes -->
        @if (activeCategory() === 'errors') {
          <section class="content-section animate-fade-in">
            <h2>❌ Erreurs Courantes à Éviter</h2>

            @for (error of commonErrors; track error.title) {
              <article class="error-card">
                <div class="error-header">
                  <span class="error-badge">❌</span>
                  <h3>{{ error.title }}</h3>
                </div>
                <div class="error-body">
                  <div class="code-comparison">
                    <div class="code-wrong">
                      <span class="label">🚫 {{ error.code.wrongLabel }}</span>
                      <pre><code [innerHTML]="error.code.wrong"></code></pre>
                    </div>
                    <div class="code-correct">
                      <span class="label">✅ {{ error.code.correctLabel }}</span>
                      <pre><code [innerHTML]="error.code.correct"></code></pre>
                    </div>
                  </div>
                </div>
              </article>
            }
          </section>
        }

        <!-- Bonnes Pratiques -->
        @if (activeCategory() === 'best-practices') {
          <section class="content-section animate-fade-in">
            <h2>✅ Bonnes Pratiques</h2>

            <div class="practice-grid">
              @for (practice of bestPractices; track practice.title) {
                <article class="practice-card">
                  <div class="practice-icon">{{ practice.icon }}</div>
                  <h3>{{ practice.title }}</h3>
                  <p>{{ practice.description }}</p>
                  <div class="code-block">
                    <pre><code [innerHTML]="practice.code"></code></pre>
                  </div>
                </article>
              }
            </div>
          </section>
        }

        <!-- Patterns -->
        @if (activeCategory() === 'patterns') {
          <section class="content-section animate-fade-in">
            <h2>🔧 Patterns Utiles</h2>

            <div class="pattern-list">
              @for (pattern of patterns; track pattern.title) {
                <article class="pattern-card">
                  <h3>{{ pattern.icon }} {{ pattern.title }}</h3>
                  <p>{{ pattern.description }}</p>
                  <div class="code-block">
                    <pre><code [innerHTML]="pattern.code"></code></pre>
                  </div>
                </article>
              }
            </div>
          </section>
        }

        <!-- Checklist -->
        @if (activeCategory() === 'checklist') {
          <section class="content-section animate-fade-in">
            <h2>✅ Checklist Avant de Commiter</h2>

            <div class="checklist-container">
              <p class="checklist-intro">
                Avant de commiter vos tests, passez en revue cette checklist pour vous assurer 
                de la qualité de vos tests.
              </p>

              <div class="checklist-groups">
                @for (group of checklistGroups; track group.title) {
                  <div class="checklist-group">
                    <h3>{{ group.icon }} {{ group.title }}</h3>
                    <ul class="checklist">
                      @for (item of group.items; track item; let i = $index) {
                        <li>
                          <input type="checkbox" [id]="'c' + group.id + i">
                          <label [for]="'c' + group.id + i">{{ item }}</label>
                        </li>
                      }
                    </ul>
                  </div>
                }
              </div>
            </div>
          </section>
        }

        <!-- Snippets -->
        @if (activeCategory() === 'shortcuts') {
          <section class="content-section animate-fade-in">
            <h2>⚡ Snippets Rapides</h2>
            
            <p class="section-intro">
              Copiez ces templates pour démarrer rapidement vos tests.
            </p>

            <div class="snippet-list">
              @for (snippet of snippetsList; track snippet.title) {
                <article class="snippet-card">
                  <div class="snippet-header">
                    <h3>{{ snippet.icon }} {{ snippet.title }}</h3>
                    <button class="copy-btn" (click)="copySnippet(snippet.key)">📋 Copier</button>
                  </div>
                  <div class="code-block">
                    <pre><code [innerHTML]="snippet.code"></code></pre>
                  </div>
                </article>
              }
            </div>
          </section>
        }
      </main>

      <!-- Navigation Footer -->
      <footer class="nav-footer">
        <a routerLink="/tutorial/practical" class="prev-btn">
          ← Retour aux Exercices
        </a>
        <a routerLink="/tutorial" class="home-btn">
          🏠 Accueil Tutorial
        </a>
      </footer>
    </div>
  `,
  styles: [`
    .tips-container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
    
    .page-header { text-align: center; margin-bottom: 2rem; }
    .badge { display: inline-block; background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; margin-bottom: 1rem; }
    h1 { font-size: 2.2rem; color: #1a1a2e; margin-bottom: 0.5rem; }
    .subtitle { color: #666; font-size: 1.1rem; max-width: 600px; margin: 0 auto; }

    .tips-nav { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 12px; }
    .nav-tab { padding: 0.75rem 1.25rem; border: none; background: white; border-radius: 8px; cursor: pointer; font-size: 0.95rem; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .nav-tab:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .nav-tab.active { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }

    .content-section { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .content-section h2 { font-size: 1.6rem; color: #1a1a2e; margin-bottom: 1.5rem; }
    .section-intro { color: #666; margin-bottom: 1.5rem; font-size: 1.05rem; }

    .error-card { background: #fff8f8; border: 1px solid #f5c6cb; border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem; }
    .error-header { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; background: linear-gradient(135deg, #f8d7da, #f5c6cb); }
    .error-badge { font-size: 1.25rem; }
    .error-header h3 { margin: 0; font-size: 1.1rem; color: #721c24; }
    .error-body { padding: 1.25rem; }

    .code-comparison { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .code-wrong, .code-correct { border-radius: 8px; overflow: hidden; }
    .code-wrong { background: #1e1e2e; border: 2px solid #dc3545; }
    .code-correct { background: #1e1e2e; border: 2px solid #28a745; }
    .code-comparison .label { display: block; padding: 0.5rem 1rem; font-size: 0.85rem; font-weight: 600; }
    .code-wrong .label { background: #dc3545; color: white; }
    .code-correct .label { background: #28a745; color: white; }
    .code-comparison pre { margin: 0; padding: 1rem; overflow-x: auto; }
    .code-comparison code { font-family: 'Fira Code', monospace; font-size: 0.85rem; color: #e4e4e7; }

    .practice-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
    .practice-card { background: #f8f9fa; padding: 1.5rem; border-radius: 12px; border: 1px solid #e9ecef; }
    .practice-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .practice-card h3 { margin: 0 0 0.75rem; font-size: 1.1rem; color: #1a1a2e; }
    .practice-card > p { color: #666; margin-bottom: 1rem; font-size: 0.95rem; }

    .code-block { background: #1e1e2e; border-radius: 8px; padding: 1rem; overflow-x: auto; }
    .code-block pre { margin: 0; }
    .code-block code { font-family: 'Fira Code', monospace; font-size: 0.85rem; color: #e4e4e7; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }

    .pattern-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .pattern-card { background: #f0f7ff; border: 1px solid #b8daff; border-radius: 12px; padding: 1.5rem; }
    .pattern-card h3 { margin: 0 0 0.75rem; font-size: 1.15rem; color: #004085; }
    .pattern-card > p { color: #666; margin-bottom: 1rem; }

    .checklist-container { background: #f8f9fa; padding: 1.5rem; border-radius: 12px; }
    .checklist-intro { color: #666; margin-bottom: 1.5rem; font-size: 1rem; }
    .checklist-groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    .checklist-group { background: white; padding: 1.25rem; border-radius: 10px; border: 1px solid #e9ecef; }
    .checklist-group h3 { margin: 0 0 1rem; font-size: 1.05rem; color: #1a1a2e; }
    .checklist { list-style: none; padding: 0; margin: 0; }
    .checklist li { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem; }
    .checklist input[type="checkbox"] { width: 18px; height: 18px; margin-top: 2px; cursor: pointer; accent-color: #667eea; }
    .checklist label { cursor: pointer; font-size: 0.95rem; color: #495057; line-height: 1.4; }

    .snippet-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .snippet-card { background: #f8f9fa; border-radius: 12px; overflow: hidden; border: 1px solid #e9ecef; }
    .snippet-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; background: linear-gradient(135deg, #e8f4fd, #e8f0fe); }
    .snippet-header h3 { margin: 0; font-size: 1.05rem; color: #1a1a2e; }
    .copy-btn { padding: 0.4rem 0.75rem; border: none; border-radius: 6px; background: #667eea; color: white; cursor: pointer; font-size: 0.85rem; transition: background 0.2s; }
    .copy-btn:hover { background: #5a6fd6; }
    .snippet-card .code-block { border-radius: 0; }

    .nav-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e9ecef; flex-wrap: wrap; gap: 1rem; }
    .prev-btn, .home-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.2s; }
    .prev-btn { background: #e9ecef; color: #495057; }
    .prev-btn:hover { background: #dee2e6; }
    .home-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    .home-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }

    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .tips-container { padding: 1rem; }
      h1 { font-size: 1.6rem; }
      .content-section { padding: 1.25rem; }
      .code-comparison { grid-template-columns: 1fr; }
    }
  `]
})
export class TaskManagerTipsComponent {
  categories: TipCategory[] = [
    { id: 'errors', title: 'Erreurs Courantes', icon: '❌' },
    { id: 'best-practices', title: 'Bonnes Pratiques', icon: '✅' },
    { id: 'patterns', title: 'Patterns', icon: '🔧' },
    { id: 'checklist', title: 'Checklist', icon: '📋' },
    { id: 'shortcuts', title: 'Snippets', icon: '⚡' }
  ];

  activeCategory = signal('errors');

  commonErrors = [
    {
      title: "Oublier d'appeler le signal",
      code: {
        wrongLabel: 'Mauvais',
        wrong: `expect(service.tasks.length).toBe(3);
<span style="color:#5c6370;font-style:italic">// tasks est un signal, pas un tableau !</span>`,
        correctLabel: 'Correct',
        correct: `expect(service.tasks().length).toBe(3);
<span style="color:#5c6370;font-style:italic">// Appeler () pour lire la valeur</span>`
      }
    },
    {
      title: 'Tester plusieurs choses à la fois',
      code: {
        wrongLabel: 'Mauvais',
        wrong: `it('devrait gérer les tâches', () =&gt; &#123;
  service.addTask(task);
  expect(service.tasks().length).toBe(1);
  service.deleteTask(task.id);
  expect(service.tasks().length).toBe(0);
  <span style="color:#5c6370;font-style:italic">// Trop de choses !</span>
&#125;);`,
        correctLabel: 'Correct',
        correct: `it('devrait ajouter une tâche', () =&gt; &#123; ... &#125;);
it('devrait supprimer une tâche', () =&gt; &#123; ... &#125;);
it('devrait toggle complete', () =&gt; &#123; ... &#125;);
<span style="color:#5c6370;font-style:italic">// Un test = une responsabilité</span>`
      }
    },
    {
      title: "Ne pas vérifier l'état initial",
      code: {
        wrongLabel: 'Mauvais',
        wrong: `it('devrait incrémenter', () =&gt; &#123;
  service.addTask(task);
  expect(service.count()).toBe(1);
  <span style="color:#5c6370;font-style:italic">// Et si count était déjà à 5 ?</span>
&#125;);`,
        correctLabel: 'Correct',
        correct: `it('devrait incrémenter', () =&gt; &#123;
  <span style="color:#c678dd">const</span> initial = service.count();
  service.addTask(task);
  expect(service.count()).toBe(initial + 1);
&#125;);`
      }
    },
    {
      title: 'Utiliser setValue au lieu de patchValue',
      code: {
        wrongLabel: 'Problème',
        wrong: `form.setValue(&#123; title: 'Test' &#125;);
<span style="color:#5c6370;font-style:italic">// Erreur si le form a d'autres champs !</span>`,
        correctLabel: 'Mieux',
        correct: `form.patchValue(&#123; title: 'Test' &#125;);
<span style="color:#5c6370;font-style:italic">// Ne modifie que les champs spécifiés</span>`
      }
    }
  ];

  bestPractices = [
    {
      icon: '📝',
      title: 'Nommez vos tests en français clair',
      description: 'Un bon nom de test décrit ce qui est testé et le résultat attendu.',
      code: `<span style="color:#5c6370">// Mauvais</span>
it('test1', () =&gt; &#123; ... &#125;);

<span style="color:#5c6370">// Bon</span>
it('devrait afficher un message d\\'erreur
    quand le titre est vide', () =&gt; &#123; ... &#125;);`
    },
    {
      icon: '🎯',
      title: 'Un test = une assertion principale',
      description: 'Focalisez chaque test sur une seule vérification pour des erreurs claires.',
      code: `it('devrait avoir 3 tâches', () =&gt; &#123;
  expect(service.tasks().length).toBe(3);
&#125;);

it('devrait avoir la première tâche active', () =&gt; &#123;
  expect(service.tasks()[0].completed).toBe(false);
&#125;);`
    },
    {
      icon: '🏭',
      title: 'Utilisez des factories pour les données',
      description: 'Créez des fonctions helper pour générer des données de test cohérentes.',
      code: `<span style="color:#c678dd">function</span> createTask(overrides = &#123;&#125;) &#123;
  <span style="color:#c678dd">return</span> &#123;
    id: crypto.randomUUID(),
    title: 'Tâche test',
    completed: <span style="color:#c678dd">false</span>,
    ...overrides
  &#125;;
&#125;

<span style="color:#5c6370">// Utilisation</span>
<span style="color:#c678dd">const</span> urgentTask = createTask(&#123; priority: 'high' &#125;);`
    },
    {
      icon: '🔄',
      title: "Réinitialisez l'état entre les tests",
      description: 'Utilisez beforeEach pour garantir un état propre à chaque test.',
      code: `beforeEach(() =&gt; &#123;
  TestBed.resetTestingModule();
  TestBed.configureTestingModule(&#123; ... &#125;);
  service = TestBed.inject(TaskService);
&#125;);`
    },
    {
      icon: '🎭',
      title: 'Mockez les dépendances externes',
      description: 'Isolez le code testé en simulant les services HTTP, localStorage, etc.',
      code: `<span style="color:#c678dd">const</span> mockStorage = &#123;
  getItem: vi.fn().mockReturnValue('[]'),
  setItem: vi.fn()
&#125;;

TestBed.overrideProvider(STORAGE_TOKEN, &#123;
  useValue: mockStorage
&#125;);`
    },
    {
      icon: '📊',
      title: 'Testez les cas limites',
      description: "N'oubliez pas les cas vides, null, undefined, et les erreurs.",
      code: `it('devrait gérer une liste vide', () =&gt; &#123; ... &#125;);
it('devrait gérer un titre null', () =&gt; &#123; ... &#125;);
it('devrait rejeter un ID invalide', () =&gt; &#123; ... &#125;);
it('devrait gérer l\\'erreur réseau', () =&gt; &#123; ... &#125;);`
    }
  ];

  patterns = [
    {
      icon: '📦',
      title: 'Mock de Service Complet',
      description: 'Remplacez un service entier par un objet mock pour isoler le composant.',
      code: `<span style="color:#c678dd">const</span> mockTaskService = &#123;
  tasks: signal&lt;Task[]&gt;([]),
  filteredTasks: computed(() =&gt; []),
  activeTasksCount: computed(() =&gt; 0),
  addTask: vi.fn(),
  deleteTask: vi.fn(),
  toggleComplete: vi.fn()
&#125;;

TestBed.configureTestingModule(&#123;
  imports: [TaskManagerComponent],
  providers: [
    &#123; provide: TaskService, useValue: mockTaskService &#125;
  ]
&#125;);`
    },
    {
      icon: '🕵️',
      title: 'Spy pour vérifier les appels',
      description: "Espionnez une méthode pour vérifier qu'elle est appelée correctement.",
      code: `<span style="color:#c678dd">const</span> service = TestBed.inject(TaskService);
<span style="color:#c678dd">const</span> addSpy = vi.spyOn(service, 'addTask');

component.onSubmit();

expect(addSpy).toHaveBeenCalledOnce();
expect(addSpy).toHaveBeenCalledWith(
  expect.objectContaining(&#123; title: 'Ma tâche' &#125;)
);`
    },
    {
      icon: '⏱️',
      title: 'fakeAsync pour les délais',
      description: 'Contrôlez le temps pour tester debounce, timeout, et animations.',
      code: `<span style="color:#c678dd">import</span> &#123; fakeAsync, tick, flush &#125; <span style="color:#c678dd">from</span> '@angular/core/testing';

it('devrait debounce', fakeAsync(() =&gt; &#123;
  component.search('test');
  expect(spy).not.toHaveBeenCalled();
  
  tick(300); <span style="color:#5c6370">// Avancer de 300ms</span>
  expect(spy).toHaveBeenCalled();
  
  flush(); <span style="color:#5c6370">// Exécuter tout ce qui reste</span>
&#125;));`
    },
    {
      icon: '🌐',
      title: 'HttpTestingController',
      description: 'Interceptez les requêtes HTTP et simulez les réponses.',
      code: `<span style="color:#c678dd">const</span> httpMock = TestBed.inject(HttpTestingController);

service.loadTasks().subscribe();

<span style="color:#c678dd">const</span> req = httpMock.expectOne('/api/tasks');
expect(req.request.method).toBe('GET');

req.flush([&#123; id: '1', title: 'Mock Task' &#125;]);

httpMock.verify(); <span style="color:#5c6370">// Vérifie pas de requête en attente</span>`
    }
  ];

  checklistGroups = [
    {
      id: '1',
      icon: '📝',
      title: 'Structure des tests',
      items: [
        'Chaque test a un nom descriptif en français',
        'Pattern AAA respecté (Arrange-Act-Assert)',
        'Un seul comportement testé par test',
        'Tests groupés avec describe() logiques'
      ]
    },
    {
      id: '2',
      icon: '🎯',
      title: 'Couverture',
      items: [
        'Cas nominal testé (happy path)',
        "Cas d'erreur testés",
        'Cas limites testés (vide, null, max)',
        'Validation de formulaire testée'
      ]
    },
    {
      id: '3',
      icon: '🔧',
      title: 'Qualité',
      items: [
        'Pas de dépendances entre tests',
        'Mocks/Spies nettoyés dans afterEach',
        'Pas de console.log oubliés',
        'Tests exécutables en isolation'
      ]
    },
    {
      id: '4',
      icon: '⚡',
      title: 'Performance',
      items: [
        'Tests rapides (moins de 500ms chacun)',
        "HTTP mocké (pas d'appels réels)",
        'Timers mockés avec fakeAsync'
      ]
    }
  ];

  snippetsList = [
    {
      key: 'service',
      icon: '🧪',
      title: 'Test de Service Basique',
      code: `<span style="color:#c678dd">import</span> &#123; TestBed &#125; <span style="color:#c678dd">from</span> '@angular/core/testing';
<span style="color:#c678dd">import</span> &#123; TaskService &#125; <span style="color:#c678dd">from</span> './task.service';

describe('TaskService', () =&gt; &#123;
  <span style="color:#c678dd">let</span> service: TaskService;

  beforeEach(() =&gt; &#123;
    TestBed.configureTestingModule(&#123;
      providers: [TaskService]
    &#125;);
    service = TestBed.inject(TaskService);
  &#125;);

  it('devrait être créé', () =&gt; &#123;
    expect(service).toBeTruthy();
  &#125;);

  it('devrait ajouter une tâche', () =&gt; &#123;
    <span style="color:#5c6370">// Arrange</span>
    <span style="color:#c678dd">const</span> task = &#123; title: 'Test', priority: 'medium' &#125;;
    
    <span style="color:#5c6370">// Act</span>
    service.addTask(task);
    
    <span style="color:#5c6370">// Assert</span>
    expect(service.tasks().length).toBe(1);
  &#125;);
&#125;);`
    },
    {
      key: 'component',
      icon: '🖥️',
      title: 'Test de Composant',
      code: `<span style="color:#c678dd">import</span> &#123; ComponentFixture, TestBed &#125; <span style="color:#c678dd">from</span> '@angular/core/testing';
<span style="color:#c678dd">import</span> &#123; TaskManagerComponent &#125; <span style="color:#c678dd">from</span> './task-manager.component';
<span style="color:#c678dd">import</span> &#123; signal &#125; <span style="color:#c678dd">from</span> '@angular/core';

describe('TaskManagerComponent', () =&gt; &#123;
  <span style="color:#c678dd">let</span> component: TaskManagerComponent;
  <span style="color:#c678dd">let</span> fixture: ComponentFixture&lt;TaskManagerComponent&gt;;

  beforeEach(<span style="color:#c678dd">async</span> () =&gt; &#123;
    <span style="color:#c678dd">const</span> spy = &#123;
      tasks: signal([]),
      addTask: vi.fn()
    &#125;;

    <span style="color:#c678dd">await</span> TestBed.configureTestingModule(&#123;
      imports: [TaskManagerComponent],
      providers: [&#123; provide: TaskService, useValue: spy &#125;]
    &#125;).compileComponents();

    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  &#125;);

  it('devrait créer le composant', () =&gt; &#123;
    expect(component).toBeTruthy();
  &#125;);
&#125;);`
    },
    {
      key: 'form',
      icon: '📝',
      title: 'Test de Formulaire',
      code: `describe('Formulaire de tâche', () =&gt; &#123;
  it('devrait être invalide au départ', () =&gt; &#123;
    expect(component.taskForm.valid).toBe(<span style="color:#c678dd">false</span>);
  &#125;);

  it('devrait valider le titre requis', () =&gt; &#123;
    <span style="color:#c678dd">const</span> titleControl = component.taskForm.get('title');
    expect(titleControl?.errors?.['required']).toBeTruthy();
    
    titleControl?.setValue('Ma tâche');
    expect(titleControl?.errors).toBeNull();
  &#125;);

  it('devrait appeler addTask à la soumission', () =&gt; &#123;
    <span style="color:#c678dd">const</span> spy = vi.spyOn(service, 'addTask');
    
    component.taskForm.patchValue(&#123;
      title: 'Nouvelle tâche',
      priority: 'high'
    &#125;);
    component.onSubmit();
    
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining(&#123; title: 'Nouvelle tâche' &#125;)
    );
  &#125;);
&#125;);`
    },
    {
      key: 'http',
      icon: '🌐',
      title: 'Test HTTP',
      code: `<span style="color:#c678dd">import</span> &#123; provideHttpClient &#125; <span style="color:#c678dd">from</span> '@angular/common/http';
<span style="color:#c678dd">import</span> &#123; provideHttpClientTesting, HttpTestingController &#125;
  <span style="color:#c678dd">from</span> '@angular/common/http/testing';

describe('TaskService HTTP', () =&gt; &#123;
  <span style="color:#c678dd">let</span> service: TaskService;
  <span style="color:#c678dd">let</span> httpMock: HttpTestingController;

  beforeEach(() =&gt; &#123;
    TestBed.configureTestingModule(&#123;
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    &#125;);
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  &#125;);

  afterEach(() =&gt; &#123;
    httpMock.verify();
  &#125;);

  it('devrait charger les tâches', () =&gt; &#123;
    <span style="color:#c678dd">const</span> mockTasks = [&#123; id: '1', title: 'Test' &#125;];
    
    service.loadTasks().subscribe(tasks =&gt; &#123;
      expect(tasks).toEqual(mockTasks);
    &#125;);
    
    <span style="color:#c678dd">const</span> req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  &#125;);
&#125;);`
    }
  ];

  snippets: Record<string, string> = {
    service: `import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });
});`,
    component: `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskManagerComponent } from './task-manager.component';

describe('TaskManagerComponent', () => {
  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskManagerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });
});`,
    form: `describe('Formulaire', () => {
  it('devrait valider le champ requis', () => {
    const control = component.form.get('title');
    expect(control?.errors?.['required']).toBeTruthy();
    
    control?.setValue('Test');
    expect(control?.valid).toBe(true);
  });
});`,
    http: `import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

// In beforeEach
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()]
});
const httpMock = TestBed.inject(HttpTestingController);`
  };

  copySnippet(key: string) {
    const snippet = this.snippets[key];
    if (snippet) {
      navigator.clipboard.writeText(snippet);
    }
  }
}
