import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface TutorialSection {
  title: string;
  description: string;
  route: string;
  topics: string[];
  disabled?: boolean;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <!-- Section Héro -->
      <section class="hero">
        <div class="hero-content">
          <h1>Tests Unitaires Angular</h1>
          <p class="hero-subtitle">
            Apprenez à écrire des tests robustes et maintenables avec <strong>Vitest</strong> et les
            utilitaires de test modernes d'Angular. Des concepts de base aux patterns avancés.
          </p>
          <div class="hero-actions">
            <a routerLink="/concepts" class="btn btn-primary">
              Commencer
            </a>
            <a routerLink="/playground" class="btn btn-secondary">
              Exemple Pratique
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="code-preview">
            <div class="code-header">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
              <span class="filename">calculator.service.spec.ts</span>
            </div>
            <pre class="code-content"><code><span class="code-keyword">describe</span>(<span class="code-string">'CalculatorService'</span>, () => &#123;
  <span class="code-keyword">let</span> service: <span class="code-class">CalculatorService</span>;

  <span class="code-function">beforeEach</span>(() => &#123;
    service = <span class="code-keyword">new</span> <span class="code-class">CalculatorService</span>();
  &#125;);

  <span class="code-function">it</span>(<span class="code-string">'should add numbers'</span>, () => &#123;
    <span class="code-comment">// Arrange</span>
    <span class="code-keyword">const</span> a = <span class="code-number">5</span>, b = <span class="code-number">3</span>;
    
    <span class="code-comment">// Act</span>
    <span class="code-keyword">const</span> result = service.<span class="code-function">add</span>(a, b);
    
    <span class="code-comment">// Assert</span>
    <span class="code-function">expect</span>(result).<span class="code-function">toBe</span>(<span class="code-number">8</span>);
  &#125;);
&#125;);</code></pre>
          </div>
          <div class="test-results">
            <div class="result-item pass">
              <span class="result-icon">✓</span>
              <span>devrait additionner les nombres</span>
              <span class="result-time">2ms</span>
            </div>
            <div class="result-item pass">
              <span class="result-icon">✓</span>
              <span>devrait gérer les négatifs</span>
              <span class="result-time">1ms</span>
            </div>
            <div class="result-item pass">
              <span class="result-icon">✓</span>
              <span>devrait diviser correctement</span>
              <span class="result-time">1ms</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Pourquoi Tester -->
      <section class="why-testing">
        <h2 class="section-title">
          <span> Pourquoi les Tests Unitaires ?</span>
        </h2>
        <div class="benefits-grid">
          @for (benefit of benefits; track benefit.title) {
            <div class="benefit-card card">
              <span class="benefit-icon">{{ benefit.icon }}</span>
              <h3>{{ benefit.title }}</h3>
              <p>{{ benefit.description }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Sections Tutoriels -->
      <section class="tutorials">
        <h2 class="section-title">
          <span> Modules du Cours</span>
        </h2>
        <div class="tutorials-grid">
          @for (section of sections; track section.route; let i = $index) {
            @if (section.disabled) {
              <div class="tutorial-card card disabled">
                <div class="tutorial-number">{{ i + 1 }}</div>
                <div class="tutorial-content">
                  <div class="tutorial-header">
                    <h3>{{ section.title }}</h3>
                    <span class="badge badge-muted">Bientôt</span>
                  </div>
                  <p>{{ section.description }}</p>
                  <ul class="tutorial-topics">
                    @for (topic of section.topics; track topic) {
                      <li>{{ topic }}</li>
                    }
                  </ul>
                </div>
                <span class="tutorial-arrow">🔒</span>
              </div>
            } @else {
              <a [routerLink]="section.route" class="tutorial-card card card-interactive">
                <div class="tutorial-number">{{ i + 1 }}</div>
                <div class="tutorial-content">
                  <div class="tutorial-header">
                    <h3>{{ section.title }}</h3>
                  </div>
                  <p>{{ section.description }}</p>
                  <ul class="tutorial-topics">
                    @for (topic of section.topics; track topic) {
                      <li>{{ topic }}</li>
                    }
                  </ul>
                </div>
                <span class="tutorial-arrow">→</span>
              </a>
            }
          }
        </div>
      </section>

      <!-- Conseils Rapides -->
      <section class="quick-tips">
        <h2 class="section-title">
          <span> Conseils Rapides pour les Tests</span>
        </h2>
        <div class="tips-container">
          @for (tip of tips; track tip.title) {
            <div class="tip-card">
              <span class="tip-number">{{ $index + 1 }}</span>
              <div class="tip-content">
                <h4>{{ tip.title }}</h4>
                <p>{{ tip.description }}</p>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Hero Section */
    .hero {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 3rem;
      align-items: center;
      padding: 2rem 0 4rem;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    .hero-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: rgba(234, 53, 171, 0.1);
      border: 1px solid rgba(234, 53, 171, 0.2);
      border-radius: 9999px;
      color: var(--angular-pink);
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .hero-content h1 {
      font-size: 2.75rem;
      line-height: 1.1;
      margin-bottom: 1rem;
      background: var(--angular-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
      
      strong {
        color: var(--secondary-color);
      }
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      
      @media (max-width: 1024px) {
        justify-content: center;
      }
    }

    .hero-stats {
      display: flex;
      gap: 3rem;
      
      @media (max-width: 1024px) {
        justify-content: center;
      }
    }

    .stat {
      display: flex;
      flex-direction: column;
      
      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        background: var(--angular-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .stat-label {
        color: var(--text-muted);
        font-size: 0.875rem;
      }
    }

    .hero-visual {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .code-preview {
      background: var(--code-bg);
      border-radius: var(--radius-lg);
      border: none;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      
      .code-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: #2d2d30;
        border-bottom: 1px solid #3e3e42;
        
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
          font-size: 0.875rem;
          color: #b4b4b4;
        }
      }
      
      .code-content {
        padding: 1rem;
        margin: 0;
        font-size: 0.875rem;
        line-height: 1.6;
        overflow-x: visible;
        overflow-wrap: break-word;
        white-space: pre-wrap;
        background: transparent;
        border: none;
      }
    }

    .test-results {
      background: white;
      border-radius: var(--radius-md);
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }

    .result-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
      
      &:last-child { margin-bottom: 0; }
      
      &.pass {
        background: rgba(22, 163, 74, 0.08);
        
        .result-icon {
          color: var(--success-color);
        }
      }
      
      .result-time {
        margin-left: auto;
        color: var(--text-muted);
        font-family: var(--font-mono);
        font-size: 0.75rem;
      }
    }

    /* Benefits Section */
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      
      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .benefit-card {
      text-align: center;
      
      .benefit-icon {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 1rem;
      }
      
      h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
      }
      
      p {
        font-size: 0.875rem;
        margin: 0;
      }
    }

    /* Tutorials Section */
    .tutorials-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .tutorial-card {
      display: grid;
      grid-template-columns: auto auto 1fr auto;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      text-decoration: none;
      color: inherit;
      
      &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        
        .tutorial-icon {
          filter: grayscale(0.5);
        }
        
        .tutorial-number {
          background: rgba(128, 128, 128, 0.1);
          color: var(--text-muted);
        }
        
        .tutorial-arrow {
          color: var(--text-muted);
        }
      }
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
    
    .badge-muted {
      background: rgba(128, 128, 128, 0.15);
      color: var(--text-muted);
    }

    .tutorial-number {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(234, 53, 171, 0.1);
      border-radius: 50%;
      font-weight: 700;
      color: var(--angular-pink);
      
      @media (max-width: 768px) {
        display: none;
      }
    }

    .tutorial-icon {
      font-size: 2.5rem;
    }

    .tutorial-content {
      .tutorial-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
        
        @media (max-width: 768px) {
          justify-content: center;
        }
      }
      
      h3 { margin: 0; }
      p { margin: 0 0 0.75rem; font-size: 0.9rem; }
    }

    .tutorial-topics {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      list-style: none;
      padding: 0;
      margin: 0;
      
      @media (max-width: 768px) {
        justify-content: center;
      }
      
      li {
        background: var(--bg-tertiary);
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        color: var(--text-secondary);
      }
    }

    .tutorial-arrow {
      font-size: 1.5rem;
      color: var(--text-muted);
      transition: all 0.2s;
      
      @media (max-width: 768px) {
        display: none;
      }
    }

    .tutorial-card:hover .tutorial-arrow {
      color: var(--angular-pink);
      transform: translateX(4px);
    }

    /* Tips Section */
    .tips-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .tip-card {
      display: flex;
      gap: 1rem;
      padding: 1.25rem;
      background: white;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      
      .tip-number {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--angular-gradient);
        color: white;
        border-radius: 50%;
        font-weight: 700;
        font-size: 0.875rem;
        flex-shrink: 0;
      }
      
      h4 {
        margin: 0 0 0.25rem;
        font-size: 1rem;
      }
      
      p {
        margin: 0;
        font-size: 0.875rem;
      }
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 3rem 0 1.5rem;
      
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
  `]
})
export class HomeComponent {
  readonly benefits = [
    {
      icon: '',
      title: 'Détecter les Bugs Tôt',
      description: 'Trouvez les problèmes avant la production'
    },
    {
      icon: '',
      title: 'Refactorer en Sécurité',
      description: 'Modifiez le code en toute confiance'
    },
    {
      icon: '',
      title: 'Documentation Vivante',
      description: 'Les tests décrivent le fonctionnement du code'
    },
    {
      icon: '',
      title: 'Développement Plus Rapide',
      description: 'Passez moins de temps à déboguer'
    }
  ];

  readonly sections: TutorialSection[] = [
    {      
      title: 'Fondamentaux des Tests',
      description: 'Concepts de base, pattern AAA et bases de Vitest',
      route: '/concepts',
      topics: ['Config Vitest', 'Pattern AAA', 'Matchers', 'Structure des Tests'],
    },
    {
      title: 'Tests de Services',
      description: 'Testez la logique métier dans les services Angular',
      route: '/services',
      topics: ['Fonctions Pures', 'Gestion Erreurs', 'Cas Limites', 'Dépendances'],
    },
    {      
      title: 'Tests de Composants',
      description: 'TestBed, fixtures et interactions DOM',
      route: '/components',
      topics: ['TestBed', 'Fixtures', 'Requêtes DOM', 'Événements Utilisateur'],
      disabled: true
    },
    {
      title: 'Tests Asynchrones',
      description: 'Observables, promesses et timing',
      route: '/async',
      topics: ['Observables', 'fakeAsync', 'waitForAsync', 'Tests HTTP'],
      disabled: true
    },
    {
      title: 'Mocking & Spies',
      description: 'Isolez les unités avec mocks et spies',
      route: '/mocking',
      topics: ['vi.fn()', 'vi.spyOn()', 'Services Mock', 'Injection de Dépendances'],
      disabled: true
    },
    {
      title: 'Exemple Pratique Interactif',
      description: 'Pratiquez avec des exemples en direct',
      route: '/playground',
      topics: ['Compteur', 'Formulaire Login', 'Calculatrice', 'Température'],
    },
    {
      title: ' Mini Task Manager Tutorial',
      description: 'Complete tutorial building a task manager with full test coverage',
      route: '/tutorial',
      topics: ['Theory & Concepts', 'Step-by-Step Implementation', 'Tips & Best Practices', 'Live Demo'],
    }
  ];

  readonly tips = [
    {
      title: 'Suivez le Pattern AAA',
      description: 'Arrange → Act → Assert. Structurez chaque test de manière cohérente.'
    },
    {
      title: 'Testez Une Seule Chose',
      description: 'Chaque test devrait vérifier un seul comportement ou exigence.'
    },
    {
      title: 'Utilisez des Noms Descriptifs',
      description: 'Les noms de tests doivent expliquer quel comportement est vérifié.'
    },
    {
      title: 'Gardez les Tests Rapides',
      description: 'Des tests rapides encouragent à les exécuter fréquemment pendant le développement.'
    },
    {
      title: 'Évitez les Détails d\'Implémentation',
      description: 'Testez le comportement, pas l\'implémentation interne. Cela rend les tests résilients.'
    },
    {
      title: 'Utilisez data-testid',
      description: 'Préférez les attributs data-testid aux classes CSS pour les requêtes DOM.'
    }
  ];

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'info';
    }
  }
}
