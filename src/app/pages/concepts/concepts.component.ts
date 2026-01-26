import { Component, signal } from '@angular/core';

interface Concept {
  id: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-concepts',
  standalone: true,
  imports: [],
  template: `
    <div class="concepts-container">
      <header class="page-header">
        <h1> Fondamentaux des Tests</h1>
        <p>Maîtrisez les concepts de base des tests unitaires en Angular avec Vitest</p>
      </header>

      <!-- Concept Navigation -->
      <nav class="concept-nav">
        @for (concept of concepts; track concept.id) {
          <button 
            class="concept-tab"
            [class.active]="activeConcept() === concept.id"
            (click)="activeConcept.set(concept.id)">
            {{ concept.icon }} {{ concept.title }}
          </button>
        }
      </nav>

      <!-- Section Pattern AAA -->
      @if (activeConcept() === 'aaa') {
        <section class="concept-section animate-fade-in">
          <h2> Le Pattern AAA (Arrange-Act-Assert)</h2>
          <p class="intro-text">
            Le pattern AAA est le <strong>standard d'excellence</strong> pour structurer les tests unitaires.
            Il fournit un format clair et cohérent qui rend les tests faciles à lire et à maintenir.
          </p>

          <div class="aaa-visual">
            <div class="aaa-step arrange">
              <div class="step-header">
                <span class="step-number">1</span>
                <h3>Arrange (Préparer)</h3>
              </div>
              <p>Configurer les conditions et les entrées du test</p>
              <ul>
                <li>Créer des instances de classes</li>
                <li>Préparer les données mock</li>
                <li>Configurer les dépendances du test</li>
              </ul>
              <div class="code-example">
                <pre><code><span class="code-comment">// Arrange - Set up test data</span>
<span class="code-keyword">const</span> calculator = <span class="code-keyword">new</span> <span class="code-class">CalculatorService</span>();
<span class="code-keyword">const</span> a = <span class="code-number">10</span>;
<span class="code-keyword">const</span> b = <span class="code-number">5</span>;</code></pre>
              </div>
            </div>

            <div class="aaa-arrow">→</div>

            <div class="aaa-step act">
              <div class="step-header">
                <span class="step-number">2</span>
                <h3>Act (Agir)</h3>
              </div>
              <p>Exécuter le code à tester</p>
              <ul>
                <li>Appeler la méthode à tester</li>
                <li>Déclencher un événement</li>
                <li>Généralement une seule action</li>
              </ul>
              <div class="code-example">
                <pre><code><span class="code-comment">// Act - Execute the action</span>
<span class="code-keyword">const</span> result = calculator.<span class="code-function">add</span>(a, b);</code></pre>
              </div>
            </div>

            <div class="aaa-arrow">→</div>

            <div class="aaa-step assert">
              <div class="step-header">
                <span class="step-number">3</span>
                <h3>Assert (Vérifier)</h3>
              </div>
              <p>Vérifier le résultat attendu</p>
              <ul>
                <li>Vérifier les valeurs de retour</li>
                <li>Vérifier les changements d'état</li>
                <li>Confirmer les appels de méthodes</li>
              </ul>
              <div class="code-example">
                <pre><code><span class="code-comment">// Assert - Verify the result</span>
<span class="code-function">expect</span>(result).<span class="code-function">toBe</span>(<span class="code-number">15</span>);</code></pre>
              </div>
            </div>
          </div>

          <div class="complete-example card">
            <h4> Exemple Complet</h4>
            <pre><code><span class="code-function">it</span>(<span class="code-string">'should add two numbers correctly'</span>, () => &#123;
  <span class="code-comment">// ========== ARRANGE ==========</span>
  <span class="code-keyword">const</span> service = <span class="code-keyword">new</span> <span class="code-class">CalculatorService</span>();
  <span class="code-keyword">const</span> firstNumber = <span class="code-number">10</span>;
  <span class="code-keyword">const</span> secondNumber = <span class="code-number">5</span>;

  <span class="code-comment">// ========== ACT ==========</span>
  <span class="code-keyword">const</span> result = service.<span class="code-function">add</span>(firstNumber, secondNumber);

  <span class="code-comment">// ========== ASSERT ==========</span>
  <span class="code-function">expect</span>(result).<span class="code-function">toBe</span>(<span class="code-number">15</span>);
  <span class="code-function">expect</span>(result).<span class="code-function">toBeGreaterThan</span>(<span class="code-number">0</span>);
  <span class="code-function">expect</span>(<span class="code-keyword">typeof</span> result).<span class="code-function">toBe</span>(<span class="code-string">'number'</span>);
&#125;);</code></pre>
          </div>

          <div class="tips-box">
            <h4> Conseils de Pro</h4>
            <ul>
              <li><strong>Arrange minimaliste :</strong> Ne configurer que ce qui est nécessaire pour ce test spécifique</li>
              <li><strong>Un seul Act :</strong> Idéalement, une seule action dans la phase Act</li>
              <li><strong>Assert significatifs :</strong> Vérifier le comportement, pas l'implémentation</li>
              <li><strong>Utilisez des commentaires :</strong> Marquer explicitement chaque section pour plus de clarté</li>
            </ul>
          </div>
        </section>
      }

      <!-- Section Structure des Tests -->
      @if (activeConcept() === 'structure') {
        <section class="concept-section animate-fade-in">
          <h2> Structure des Fichiers de Tests</h2>
          <p class="intro-text">
            Un fichier de test bien organisé facilite la recherche et la maintenance des tests.
            Voici la structure recommandée pour les tests Angular avec Vitest.
          </p>

          <div class="structure-visual">
            <div class="structure-block imports">
              <h4> Imports</h4>
              <pre><code><span class="code-keyword">import</span> &#123; describe, it, expect, beforeEach &#125; <span class="code-keyword">from</span> <span class="code-string">'vitest'</span>;
<span class="code-keyword">import</span> &#123; TestBed &#125; <span class="code-keyword">from</span> <span class="code-string">'&#64;angular/core/testing'</span>;
<span class="code-keyword">import</span> &#123; MyComponent &#125; <span class="code-keyword">from</span> <span class="code-string">'./my.component'</span>;</code></pre>
            </div>

            <div class="structure-block describe">
              <h4>describe() - Suite de Tests</h4>
              <pre><code><span class="code-function">describe</span>(<span class="code-string">'MyComponent'</span>, () => &#123;
  <span class="code-comment">// Tous les tests pour ce composant</span>
&#125;);</code></pre>
              <p>Regroupe les tests liés. Le nom doit correspondre à l'unité testée.</p>
            </div>

            <div class="structure-block hooks">
              <h4> Hooks du Cycle de Vie</h4>
              <pre><code><span class="code-function">beforeEach</span>(() => &#123;
  <span class="code-comment">// Exécuté avant CHAQUE test</span>
  TestBed.configureTestingModule(&#123;...&#125;);
&#125;);

<span class="code-function">afterEach</span>(() => &#123;
  <span class="code-comment">// Nettoyage après chaque test</span>
&#125;);

<span class="code-function">beforeAll</span>(() => &#123;
  <span class="code-comment">// Exécuté une fois avant tous les tests</span>
&#125;);

<span class="code-function">afterAll</span>(() => &#123;
  <span class="code-comment">// Exécuté une fois après tous les tests</span>
&#125;);</code></pre>
            </div>

            <div class="structure-block nested">
              <h4> describe() Imbriqués - Groupes de Fonctionnalités</h4>
              <pre><code><span class="code-function">describe</span>(<span class="code-string">'MyComponent'</span>, () => &#123;
  <span class="code-function">describe</span>(<span class="code-string">'initialisation'</span>, () => &#123;
    <span class="code-function">it</span>(<span class="code-string">'devrait créer'</span>, () => &#123;...&#125;);
    <span class="code-function">it</span>(<span class="code-string">'devrait avoir des valeurs par défaut'</span>, () => &#123;...&#125;);
  &#125;);

  <span class="code-function">describe</span>(<span class="code-string">'interactions utilisateur'</span>, () => &#123;
    <span class="code-function">it</span>(<span class="code-string">'devrait gérer le clic'</span>, () => &#123;...&#125;);
  &#125;);
&#125;);</code></pre>
            </div>

            <div class="structure-block it">
              <h4>✅ it() - Tests Individuels</h4>
              <pre><code><span class="code-function">it</span>(<span class="code-string">'devrait calculer le total correctement'</span>, () => &#123;
  <span class="code-comment">// Test de comportement unique</span>
&#125;);

<span class="code-comment">// Alternatives :</span>
<span class="code-function">test</span>(<span class="code-string">'calcule le total'</span>, () => &#123;...&#125;); <span class="code-comment">// Identique à it()</span>
<span class="code-function">it.skip</span>(<span class="code-string">'ignorer ce test'</span>, () => &#123;...&#125;);  <span class="code-comment">// Ignorer le test</span>
<span class="code-function">it.only</span>(<span class="code-string">'exécuter seulement celui-ci'</span>, () => &#123;...&#125;);  <span class="code-comment">// Focus sur celui-ci</span></code></pre>
            </div>
          </div>
        </section>
      }

      <!-- Section Matchers -->
      @if (activeConcept() === 'matchers') {
        <section class="concept-section animate-fade-in">
          <h2> Matchers Vitest</h2>
          <p class="intro-text">
            Les matchers sont des méthodes qui permettent de tester les valeurs de différentes manières.
            Vitest fournit un ensemble riche de matchers pour tous les scénarios de test.
          </p>

          <div class="matchers-grid">
            <!-- Matchers d'Égalité -->
            <div class="matcher-category card">
              <h4>Égalité</h4>
              <div class="matcher-list">
                <div class="matcher-item">
                  <code>.toBe(value)</code>
                  <span>Égalité stricte (===) pour valeurs primitives</span>
                </div>
                <div class="matcher-item">
                  <code>.toEqual(value)</code>
                  <span>Égalité profonde pour objets et tableaux</span>
                </div>
                <div class="matcher-item">
                  <code>.toStrictEqual(value)</code>
                  <span>Égalité profonde avec vérification des types</span>
                </div>
              </div>
              <pre><code><span class="code-function">expect</span>(<span class="code-number">2</span> + <span class="code-number">2</span>).<span class="code-function">toBe</span>(<span class="code-number">4</span>);
<span class="code-function">expect</span>(&#123;a: <span class="code-number">1</span>&#125;).<span class="code-function">toEqual</span>(&#123;a: <span class="code-number">1</span>&#125;);</code></pre>
            </div>

            <!-- Matchers Vérité -->
            <div class="matcher-category card">
              <h4>Vérité</h4>
              <div class="matcher-list">
                <div class="matcher-item">
                  <code>.toBeTruthy()</code>
                  <span>Vérifie que la valeur est truthy (non vide)</span>
                </div>
                <div class="matcher-item">
                  <code>.toBeFalsy()</code>
                  <span>Vérifie que la valeur est falsy (vide/nulle)</span>
                </div>
                <div class="matcher-item">
                  <code>.toBeNull()</code>
                  <span>Vérifie que la valeur est exactement null</span>
                </div>
                <div class="matcher-item">
                  <code>.toBeDefined()</code>
                  <span>Vérifie que la valeur n'est pas undefined</span>
                </div>
              </div>
              <pre><code><span class="code-function">expect</span>(user).<span class="code-function">toBeTruthy</span>();
<span class="code-function">expect</span>(error).<span class="code-function">toBeFalsy</span>();</code></pre>
            </div>

            <!-- Matchers Nombres -->
            <div class="matcher-category card">
              <h4>Nombres</h4>
              <div class="matcher-list">
                <div class="matcher-item">
                  <code>.toBeGreaterThan(n)</code>
                  <span>Vérifie que la valeur est supérieure à n</span>
                </div>
                <div class="matcher-item">
                  <code>.toBeLessThan(n)</code>
                  <span>Vérifie que la valeur est inférieure à n</span>
                </div>
                <div class="matcher-item">
                  <code>.toBeCloseTo(n, digits)</code>
                  <span>Compare les nombres à virgule flottante</span>
                </div>
              </div>
              <pre><code><span class="code-function">expect</span>(price).<span class="code-function">toBeGreaterThan</span>(<span class="code-number">0</span>);
<span class="code-function">expect</span>(<span class="code-number">0.1</span>+<span class="code-number">0.2</span>).<span class="code-function">toBeCloseTo</span>(<span class="code-number">0.3</span>);</code></pre>
            </div>

            <!-- Matchers Chaînes -->
            <div class="matcher-category card">
              <h4> Chaînes</h4>
              <div class="matcher-list">
                <div class="matcher-item">
                  <code>.toContain(str)</code>
                  <span>Vérifie qu'une sous-chaîne est présente</span>
                </div>
                <div class="matcher-item">
                  <code>.toMatch(regex)</code>
                  <span>Vérifie la correspondance avec un motif regex</span>
                </div>
                <div class="matcher-item">
                  <code>.toHaveLength(n)</code>
                  <span>Vérifie la longueur de la chaîne</span>
                </div>
              </div>
              <pre><code><span class="code-function">expect</span>(msg).<span class="code-function">toContain</span>(<span class="code-string">'error'</span>);
<span class="code-function">expect</span>(email).<span class="code-function">toMatch</span>(<span class="code-string">/&#64;/</span>);</code></pre>
            </div>

            <!-- Matchers Tableaux -->
            <div class="matcher-category card">
              <h4> Tableaux</h4>
              <div class="matcher-list">
                <div class="matcher-item">
                  <code>.toContain(item)</code>
                  <span>Vérifie qu'un élément est dans le tableau</span>
                </div>
                <div class="matcher-item">
                  <code>.toHaveLength(n)</code>
                  <span>Vérifie la taille du tableau</span>
                </div>
                <div class="matcher-item">
                  <code>.toContainEqual(obj)</code>
                  <span>Vérifie qu'un objet égal est présent</span>
                </div>
              </div>
              <pre><code><span class="code-function">expect</span>(arr).<span class="code-function">toContain</span>(<span class="code-string">'item'</span>);
<span class="code-function">expect</span>(users).<span class="code-function">toHaveLength</span>(<span class="code-number">3</span>);</code></pre>
            </div>

            <!-- Matchers Exceptions -->
            <div class="matcher-category card">
              <h4> Exceptions</h4>
              <div class="matcher-list">
                <div class="matcher-item">
                  <code>.toThrow()</code>
                  <span>Vérifie qu'une erreur est lancée</span>
                </div>
                <div class="matcher-item">
                  <code>.toThrow(message)</code>
                  <span>Vérifie le message de l'erreur</span>
                </div>
                <div class="matcher-item">
                  <code>.toThrowError(Error)</code>
                  <span>Vérifie le type d'erreur spécifique</span>
                </div>
              </div>
              <pre><code><span class="code-comment">// ⚠️ Doit être enveloppé dans une fonction !</span>
<span class="code-function">expect</span>(() => divide(<span class="code-number">1</span>,<span class="code-number">0</span>)).<span class="code-function">toThrow</span>();
<span class="code-function">expect</span>(() => fn()).<span class="code-function">toThrow</span>(<span class="code-string">'msg'</span>);</code></pre>
            </div>
          </div>

          <div class="alert alert-warning">
            <span class="alert-icon">⚠️</span>
            <div>
              <strong>Erreur Courante avec toThrow() :</strong>
              <p>Toujours envelopper l'appel de fonction : <code>expect(() => fn()).toThrow()</code></p>
              <p>❌ Faux : <code>expect(fn()).toThrow()</code> - Ceci appelle fn() immédiatement !</p>
            </div>
          </div>
        </section>
      }

      <!-- Section Fonctionnalités Vitest -->
      @if (activeConcept() === 'vitest') {
        <section class="concept-section animate-fade-in">
          <h2> Essentiels Vitest</h2>
          <p class="intro-text">
            Vitest est un framework de test nouvelle génération propulsé par Vite.
            Il est rapide, moderne et parfait pour les applications Angular.
          </p>

          <div class="vitest-features">
            <div class="feature-card card">
              <h4> Avantages Clés</h4>
              <ul>
                <li><strong>Ultra rapide :</strong> Propulsé par l'ESM natif de Vite</li>
                <li><strong>Compatible Jest :</strong> Migration facile depuis Jest</li>
                <li><strong>Mode watch :</strong> Retour instantané sur les changements</li>
                <li><strong>Mode UI :</strong> Interface visuelle du runner de tests</li>
                <li><strong>Couverture :</strong> Couverture de code intégrée</li>
              </ul>
            </div>

            <div class="feature-card card">
              <h4> Commandes CLI</h4>
              <pre><code><span class="code-comment"># Exécuter tous les tests</span>
npm run test

<span class="code-comment"># Mode watch</span>
npm run test:watch

<span class="code-comment"># Mode UI (visuel)</span>
npm run test:ui

<span class="code-comment"># Avec rapport de couverture</span>
npm run test:coverage</code></pre>
            </div>

            <div class="feature-card card full-width">
              <h4> Configuration (vitest.config.ts)</h4>
              <pre><code><span class="code-keyword">import</span> &#123; defineConfig &#125; <span class="code-keyword">from</span> <span class="code-string">'vitest/config'</span>;

<span class="code-keyword">export default</span> <span class="code-function">defineConfig</span>(&#123;
  <span class="code-property">test</span>: &#123;
    <span class="code-property">globals</span>: <span class="code-keyword">true</span>,           <span class="code-comment">// Use global APIs</span>
    <span class="code-property">environment</span>: <span class="code-string">'jsdom'</span>,    <span class="code-comment">// Browser environment</span>
    <span class="code-property">include</span>: [<span class="code-string">'**/*.spec.ts'</span>],
    <span class="code-property">setupFiles</span>: [<span class="code-string">'./src/test-setup.ts'</span>],
    <span class="code-property">coverage</span>: &#123;
      <span class="code-property">provider</span>: <span class="code-string">'v8'</span>,
      <span class="code-property">reporter</span>: [<span class="code-string">'text'</span>, <span class="code-string">'html'</span>]
    &#125;
  &#125;
&#125;);</code></pre>
            </div>
          </div>
        </section>
      }

      <!-- Section Bonnes Pratiques -->
      @if (activeConcept() === 'best-practices') {
        <section class="concept-section animate-fade-in">
          <h2> Bonnes Pratiques</h2>
          <p class="intro-text">
            Suivez ces pratiques standard de l'industrie pour écrire des tests maintenables et fiables.
          </p>

          <div class="practices-grid">
            <div class="practice-card card">
              <div class="practice-status do">✅ À FAIRE</div>
              <h4>Tester le Comportement, Pas l'Implémentation</h4>
              <pre><code><span class="code-comment">// ✅ Bien - Teste le comportement</span>
<span class="code-function">it</span>(<span class="code-string">'ajoute un article au panier'</span>, () => &#123;
  cart.<span class="code-function">addItem</span>(product);
  <span class="code-function">expect</span>(cart.items).<span class="code-function">toContain</span>(product);
&#125;);</code></pre>
            </div>

            <div class="practice-card card">
              <div class="practice-status dont">❌ À ÉVITER</div>
              <h4>Tester l'État Interne</h4>
              <pre><code><span class="code-comment">// ❌ Mauvais - Teste l'implémentation</span>
<span class="code-function">it</span>(<span class="code-string">'ajoute un article'</span>, () => &#123;
  cart.<span class="code-function">addItem</span>(product);
  <span class="code-comment">// Teste une méthode privée</span>
  <span class="code-function">expect</span>(cart._internalArray.length).<span class="code-function">toBe</span>(<span class="code-number">1</span>);
&#125;);</code></pre>
            </div>

            <div class="practice-card card">
              <div class="practice-status do">✅ À FAIRE</div>
              <h4>Utiliser des Noms de Tests Descriptifs</h4>
              <pre><code><span class="code-comment">// ✅ Bien - Décrit le comportement attendu</span>
<span class="code-function">it</span>(<span class="code-string">'devrait désactiver submit quand le form est invalide'</span>, ...)
<span class="code-function">it</span>(<span class="code-string">'devrait afficher une erreur pour email vide'</span>, ...)
<span class="code-function">it</span>(<span class="code-string">'devrait naviguer vers dashboard après login'</span>, ...)</code></pre>
            </div>

            <div class="practice-card card">
              <div class="practice-status dont">❌ À ÉVITER</div>
              <h4>Utiliser des Noms Vagues</h4>
              <pre><code><span class="code-comment">// ❌ Mauvais - Pas clair ce qui est testé</span>
<span class="code-function">it</span>(<span class="code-string">'fonctionne'</span>, ...)
<span class="code-function">it</span>(<span class="code-string">'test1'</span>, ...)
<span class="code-function">it</span>(<span class="code-string">'devrait fonctionner correctement'</span>, ...)</code></pre>
            </div>

            <div class="practice-card card">
              <div class="practice-status do">✅ À FAIRE</div>
              <h4>Utiliser data-testid pour les Requêtes</h4>
              <pre><code><span class="code-comment">// ✅ Bien - Sélecteur stable</span>
<span class="code-keyword">const</span> btn = fixture.<span class="code-function">debugElement</span>
  .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'[data-testid="submit"]'</span>));</code></pre>
            </div>

            <div class="practice-card card">
              <div class="practice-status dont">❌ À ÉVITER</div>
              <h4>Utiliser les Classes CSS pour les Tests</h4>
              <pre><code><span class="code-comment">// ❌ Mauvais - Casse si le style change</span>
<span class="code-keyword">const</span> btn = fixture.<span class="code-function">debugElement</span>
  .<span class="code-function">query</span>(<span class="code-function">By.css</span>(<span class="code-string">'.btn-primary.large'</span>));</code></pre>
            </div>
          </div>

          <div class="golden-rules card">
            <h4> Les Règles d'Or des Tests Unitaires</h4>
            <ol>
              <li><strong>Rapide :</strong> Les tests doivent s'exécuter en millisecondes</li>
              <li><strong>Isolé :</strong> Pas de dépendances entre les tests</li>
              <li><strong>Répétable :</strong> Même résultat à chaque fois</li>
              <li><strong>Auto-validant :</strong> Réussite ou échec, pas de vérification manuelle</li>
              <li><strong>Opportun :</strong> Écrits avant ou avec le code</li>
            </ol>
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .concepts-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;
      
      h1 { margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); font-size: 1.1rem; }
    }

    .concept-nav {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 2rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
    }

    .concept-tab {
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

    .concept-section {
      h2 { margin-bottom: 1rem; }
    }

    .intro-text {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
      
      strong { color: var(--primary-color); }
    }

    /* AAA Visual */
    .aaa-visual {
      display: flex;
      align-items: stretch;
      gap: 1rem;
      margin-bottom: 2rem;
      
      @media (max-width: 900px) {
        flex-direction: column;
      }
    }

    .aaa-arrow {
      display: flex;
      align-items: center;
      font-size: 2rem;
      color: var(--text-muted);
      
      @media (max-width: 900px) {
        justify-content: center;
        transform: rotate(90deg);
      }
    }

    .aaa-step {
      flex: 1;
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      border: 2px solid;
      
      &.arrange {
        background: rgba(96, 165, 250, 0.1);
        border-color: rgba(96, 165, 250, 0.3);
        
        .step-number { background: var(--info-color); }
      }
      
      &.act {
        background: rgba(250, 204, 21, 0.1);
        border-color: rgba(250, 204, 21, 0.3);
        
        .step-number { background: var(--warning-color); }
      }
      
      &.assert {
        background: rgba(22, 163, 74, 0.08);
        border-color: rgba(22, 163, 74, 0.2);
        
        .step-number { background: var(--success-color); }
      }
      
      .step-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        
        h3 { margin: 0; }
      }
      
      .step-number {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: white;
        font-weight: 700;
        font-size: 0.875rem;
      }
      
      p { margin-bottom: 0.75rem; }
      
      ul {
        margin: 0 0 1rem;
        padding-left: 1.25rem;
        
        li {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
      }
      
      .code-example pre {
        margin: 0;
        font-size: 0.8rem;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
    }

    .complete-example, .tips-box {
      margin-bottom: 1.5rem;
      
      h4 { margin-bottom: 1rem; }
      
      pre { margin: 0; white-space: pre-wrap; overflow-wrap: break-word; }
    }

    .tips-box {
      background: rgba(234, 53, 171, 0.08);
      border: 1px solid rgba(234, 53, 171, 0.2);
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      
      ul {
        margin: 0;
        padding-left: 1.5rem;
        
        li {
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }
      }
    }

    /* Structure Visual */
    .structure-visual {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .structure-block {
      padding: 1.25rem;
      border-radius: var(--radius-md);
      border-left: 4px solid;
      background: var(--bg-secondary);
      
      h4 { margin: 0 0 0.75rem; }
      p { margin: 0.75rem 0 0; font-size: 0.875rem; }
      pre { margin: 0; }
      
      &.imports { border-color: var(--info-color); }
      &.describe { border-color: var(--primary-color); }
      &.hooks { border-color: var(--warning-color); }
      &.nested { border-color: var(--secondary-color); }
      &.it { border-color: var(--success-color); }
    }

    /* Matchers Grid */
    .matchers-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .matcher-category {
      h4 { margin: 0 0 1rem; }
      pre { margin: 0; font-size: 0.8rem; }
    }

    .matcher-list {
      margin-bottom: 1rem;
    }

    .matcher-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background: var(--bg-primary);
      border-radius: var(--radius-sm);
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      
      code {
        color: #fff;
      }
      
      span {
        color: #1a1919;
        font-size: 0.85rem;
        font-weight: 400;
      }
    }

    /* Vitest Features */
    .vitest-features {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .feature-card {
      h4 { margin: 0 0 1rem; }
      
      ul {
        margin: 0;
        padding-left: 1.5rem;
        
        li {
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }
      }
      
      pre { margin: 0; font-size: 0.8rem; }
      
      &.full-width {
        grid-column: 1 / -1;
      }
    }

    /* Best Practices */
    .practices-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .practice-card {
      h4 { margin: 0.75rem 0; font-size: 1rem; }
      pre { margin: 0; font-size: 0.8rem; }
    }

    .practice-status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 0.75rem;
      
      &.do {
        background: rgba(22, 163, 74, 0.15);
        color: var(--success-color);
      }
      
      &.dont {
        background: rgba(220, 38, 38, 0.15);
        color: var(--danger-color);
      }
    }

    .golden-rules {
      background: linear-gradient(135deg, rgba(234, 53, 171, 0.06), rgba(22, 163, 74, 0.06));
      border: 1px solid rgba(234, 53, 171, 0.15);
      
      h4 { margin: 0 0 1rem; }
      
      ol {
        margin: 0;
        padding-left: 1.5rem;
        
        li {
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }
      }
    }
  `]
})
export class ConceptsComponent {
  activeConcept = signal('aaa');

  readonly concepts: Concept[] = [
    { id: 'aaa', title: 'Pattern AAA', icon: '' },
    { id: 'structure', title: 'Structure', icon: '' },
    { id: 'matchers', title: 'Matchers', icon: '' },
    { id: 'vitest', title: 'Vitest', icon: '' },
    { id: 'best-practices', title: 'Bonnes Pratiques', icon: '' }
  ];
}
