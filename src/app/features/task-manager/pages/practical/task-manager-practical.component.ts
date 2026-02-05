import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  hint: string;
  starterCode: string;
  solution: string;
  validationKeywords: string[];
}

interface ExerciseResult {
  exerciseId: string;
  passed: boolean;
  message: string;
  feedback: string[];
}

@Component({
  selector: 'app-task-manager-practical',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="practical-container">
      <!-- Header -->
      <header class="page-header">
        <div class="header-content">
          <span class="badge">🎯 Pratique</span>
          <h1>Exercices Interactifs</h1>
          <p class="subtitle">
            Mettez en pratique les concepts avec ces exercices guidés.
            Écrivez votre code et validez instantanément !
          </p>
        </div>
        
        <!-- Score -->
        <div class="score-board">
          <div class="score-item">
            <span class="score-value">{{ completedCount() }}</span>
            <span class="score-label">Complétés</span>
          </div>
          <div class="score-divider">/</div>
          <div class="score-item">
            <span class="score-value">{{ exercises.length }}</span>
            <span class="score-label">Total</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressPercentage()"></div>
          </div>
        </div>
      </header>

      <!-- Liste des exercices -->
      <nav class="exercise-tabs">
        @for (ex of exercises; track ex.id; let i = $index) {
          <button
            class="exercise-tab"
            [class.active]="currentExercise() === ex.id"
            [class.completed]="isCompleted(ex.id)"
            (click)="selectExercise(ex.id)">
            <span class="tab-number">{{ i + 1 }}</span>
            <span class="tab-title">{{ ex.title }}</span>
            @if (isCompleted(ex.id)) {
              <span class="tab-check">✓</span>
            }
          </button>
        }
      </nav>

      <!-- Zone d'exercice -->
      <main class="exercise-area">
        @if (activeExercise(); as exercise) {
          <div class="exercise-content animate-fade-in">
            
            <!-- En-tête de l'exercice -->
            <div class="exercise-header">
              <div class="exercise-meta">
                <span class="difficulty-badge" [class]="exercise.difficulty">
                  {{ getDifficultyIcon(exercise.difficulty) }} {{ exercise.difficulty | titlecase }}
                </span>
              </div>
              <h2>{{ exercise.title }}</h2>
              <p class="exercise-description">{{ exercise.description }}</p>
            </div>

            <!-- Zone de code -->
            <div class="code-editor-section">
              <div class="editor-header">
                <span class="editor-label">📝 Votre Code</span>
                <div class="editor-actions">
                  <button class="action-btn hint" (click)="showHint()">
                    💡 Indice
                  </button>
                  <button class="action-btn reset" (click)="resetCode()">
                    🔄 Reset
                  </button>
                  <button class="action-btn solution" (click)="showSolution()">
                    👁️ Solution
                  </button>
                </div>
              </div>
              
              <textarea
                class="code-textarea"
                [(ngModel)]="userCode"
                [placeholder]="'Écrivez votre test ici...'"
                spellcheck="false">
              </textarea>

              @if (hintVisible()) {
                <div class="hint-box animate-slide-down">
                  <span class="hint-icon">💡</span>
                  <p>{{ exercise.hint }}</p>
                  <button class="close-btn" (click)="hintVisible.set(false)">×</button>
                </div>
              }

              @if (solutionVisible()) {
                <div class="solution-box animate-slide-down">
                  <div class="solution-header">
                    <span>✨ Solution</span>
                    <button class="close-btn" (click)="solutionVisible.set(false)">×</button>
                  </div>
                  <pre class="solution-code"><code>{{ exercise.solution }}</code></pre>
                  <button class="copy-btn" (click)="copyToClipboard(exercise.solution)">
                    📋 Copier
                  </button>
                </div>
              }
            </div>

            <!-- Bouton de validation -->
            <div class="validation-section">
              <button 
                class="validate-btn"
                [class.loading]="isValidating()"
                (click)="validateCode()"
                [disabled]="isValidating()">
                @if (isValidating()) {
                  <span class="spinner"></span> Validation...
                } @else {
                  🚀 Tester mon code
                }
              </button>
            </div>

            <!-- Résultat -->
            @if (currentResult(); as result) {
              <div class="result-section animate-pop-in" [class.success]="result.passed" [class.error]="!result.passed">
                <div class="result-header">
                  @if (result.passed) {
                    <span class="result-icon">🎉</span>
                    <h3>Excellent travail !</h3>
                  } @else {
                    <span class="result-icon">🔧</span>
                    <h3>Presque !</h3>
                  }
                </div>
                <p class="result-message">{{ result.message }}</p>
                
                @if (result.feedback.length > 0) {
                  <div class="feedback-list">
                    <h4>Détails :</h4>
                    <ul>
                      @for (item of result.feedback; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  </div>
                }
              </div>
            }
          </div>
        }
      </main>

      <!-- Navigation Footer -->
      <footer class="nav-footer">
        <a routerLink="/tutorial/theory" class="prev-btn">
          ← Retour à la Théorie
        </a>
        <a routerLink="/tutorial/tips" class="next-btn">
          Astuces & Tips →
        </a>
      </footer>
    </div>
  `,
  styles: [`
    .practical-container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
    
    .page-header { text-align: center; margin-bottom: 2rem; }
    .badge { display: inline-block; background: linear-gradient(135deg, #ff6b6b, #ee5a5a); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; margin-bottom: 1rem; }
    h1 { font-size: 2.2rem; color: #1a1a2e; margin-bottom: 0.5rem; }
    .subtitle { color: #666; font-size: 1.1rem; }

    .score-board { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 12px; }
    .score-item { text-align: center; }
    .score-value { display: block; font-size: 1.8rem; font-weight: 700; color: #667eea; }
    .score-label { font-size: 0.8rem; color: #666; }
    .score-divider { font-size: 1.5rem; color: #ccc; margin: 0 0.5rem; }
    .progress-bar { width: 150px; height: 8px; background: #e9ecef; border-radius: 4px; margin-left: 1rem; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 4px; transition: width 0.5s ease; }

    .exercise-tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; }
    .exercise-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border: none; background: white; border-radius: 8px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .exercise-tab:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .exercise-tab.active { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    .exercise-tab.completed { border: 2px solid #28a745; }
    .tab-number { display: flex; width: 24px; height: 24px; background: rgba(0,0,0,0.1); border-radius: 50%; align-items: center; justify-content: center; font-weight: 600; font-size: 0.8rem; }
    .exercise-tab.active .tab-number { background: rgba(255,255,255,0.3); }
    .tab-check { color: #28a745; font-weight: bold; }
    .exercise-tab.active .tab-check { color: white; }

    .exercise-area { background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
    .exercise-content { padding: 2rem; }

    .exercise-header { margin-bottom: 1.5rem; }
    .exercise-meta { margin-bottom: 0.5rem; }
    .difficulty-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
    .difficulty-badge.facile { background: #d4edda; color: #155724; }
    .difficulty-badge.moyen { background: #fff3cd; color: #856404; }
    .difficulty-badge.difficile { background: #f8d7da; color: #721c24; }
    .exercise-header h2 { font-size: 1.5rem; color: #1a1a2e; margin: 0.5rem 0; }
    .exercise-description { color: #666; line-height: 1.6; }

    .code-editor-section { margin-bottom: 1.5rem; }
    .editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem; }
    .editor-label { font-weight: 600; color: #1a1a2e; }
    .editor-actions { display: flex; gap: 0.5rem; }
    .action-btn { padding: 0.4rem 0.75rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
    .action-btn.hint { background: #fff3cd; color: #856404; }
    .action-btn.hint:hover { background: #ffeeba; }
    .action-btn.reset { background: #e9ecef; color: #495057; }
    .action-btn.reset:hover { background: #dee2e6; }
    .action-btn.solution { background: #d4edda; color: #155724; }
    .action-btn.solution:hover { background: #c3e6cb; }

    .code-textarea { width: 100%; min-height: 280px; padding: 1rem; font-family: 'Fira Code', 'Monaco', 'Consolas', monospace; font-size: 0.9rem; line-height: 1.6; background: #1e1e2e; color: #e4e4e7; border: none; border-radius: 8px; resize: vertical; outline: none; }
    .code-textarea::placeholder { color: #5c6370; }
    .code-textarea:focus { box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3); }

    .hint-box { display: flex; align-items: flex-start; gap: 0.75rem; background: #fff3cd; padding: 1rem; border-radius: 8px; margin-top: 0.75rem; position: relative; }
    .hint-icon { font-size: 1.25rem; }
    .hint-box p { margin: 0; color: #856404; flex: 1; }

    .solution-box { background: #f0f7ff; border: 1px solid #b8daff; border-radius: 8px; margin-top: 0.75rem; overflow: hidden; }
    .solution-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: #cce5ff; font-weight: 600; color: #004085; }
    .solution-code { margin: 0; padding: 1rem; background: #1e1e2e; color: #e4e4e7; font-size: 0.85rem; overflow-x: auto; }
    .copy-btn { display: block; width: 100%; padding: 0.75rem; border: none; background: #e2e8f0; cursor: pointer; font-size: 0.9rem; transition: background 0.2s; }
    .copy-btn:hover { background: #cbd5e0; }

    .close-btn { position: absolute; top: 0.5rem; right: 0.5rem; width: 24px; height: 24px; border: none; background: none; font-size: 1.25rem; cursor: pointer; color: inherit; opacity: 0.7; }
    .close-btn:hover { opacity: 1; }
    .solution-header .close-btn { position: static; width: auto; height: auto; }

    .validation-section { display: flex; justify-content: center; margin: 1.5rem 0; }
    .validate-btn { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 600; border: none; border-radius: 8px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; cursor: pointer; transition: all 0.2s; }
    .validate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    .validate-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .validate-btn.loading { background: #6c757d; }

    .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .result-section { padding: 1.5rem; border-radius: 12px; text-align: center; }
    .result-section.success { background: linear-gradient(135deg, #d4edda, #c3e6cb); border: 2px solid #28a745; }
    .result-section.error { background: linear-gradient(135deg, #f8d7da, #f5c6cb); border: 2px solid #dc3545; }
    .result-header { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 0.75rem; }
    .result-icon { font-size: 2rem; }
    .result-header h3 { margin: 0; font-size: 1.3rem; }
    .result-section.success h3 { color: #155724; }
    .result-section.error h3 { color: #721c24; }
    .result-message { margin: 0 0 1rem; }
    .result-section.success .result-message { color: #155724; }
    .result-section.error .result-message { color: #721c24; }

    .feedback-list { text-align: left; background: rgba(255,255,255,0.7); padding: 1rem; border-radius: 8px; }
    .feedback-list h4 { margin: 0 0 0.5rem; font-size: 0.95rem; }
    .feedback-list ul { margin: 0; padding-left: 1.25rem; }
    .feedback-list li { margin: 0.25rem 0; font-size: 0.9rem; }

    .nav-footer { display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e9ecef; flex-wrap: wrap; gap: 1rem; }
    .prev-btn, .next-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.2s; }
    .prev-btn { background: #e9ecef; color: #495057; }
    .prev-btn:hover { background: #dee2e6; }
    .next-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }

    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-slide-down { animation: slideDown 0.3s ease-out; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

    @media (max-width: 768px) {
      .practical-container { padding: 1rem; }
      h1 { font-size: 1.6rem; }
      .exercise-content { padding: 1.25rem; }
      .code-textarea { min-height: 220px; font-size: 0.85rem; }
      .editor-actions { width: 100%; justify-content: center; }
    }
  `]
})
export class TaskManagerPracticalComponent {
  exercises: Exercise[] = [
    {
      id: 'ex1',
      title: 'Pattern AAA',
      description: 'Écrivez un test qui vérifie que notre méthode filterByStatus retourne uniquement les tâches actives (non complétées). Utilisez le pattern Arrange-Act-Assert.',
      difficulty: 'facile',
      hint: 'Créez un tableau de tâches avec différents états "completed", appelez filterByStatus avec "active", puis vérifiez le résultat avec expect().',
      starterCode: `it('devrait filtrer les tâches actives', () => {
  // Arrange - Créez vos données de test


  // Act - Appelez la méthode à tester


  // Assert - Vérifiez le résultat

});`,
      solution: `it('devrait filtrer les tâches actives', () => {
  // Arrange
  const tasks = [
    { id: '1', title: 'Tâche 1', completed: false },
    { id: '2', title: 'Tâche 2', completed: true },
    { id: '3', title: 'Tâche 3', completed: false }
  ];
  
  // Act
  const result = service.filterByStatus(tasks, 'active');
  
  // Assert
  expect(result.length).toBe(2);
  expect(result.every(t => !t.completed)).toBe(true);
});`,
      validationKeywords: ['arrange', 'act', 'assert', 'expect', 'tasks', 'filter', 'completed']
    },
    {
      id: 'ex2',
      title: 'Test de Signal',
      description: 'Testez que le signal activeTasksCount() se met à jour correctement quand on ajoute une nouvelle tâche active.',
      difficulty: 'moyen',
      hint: 'Vérifiez d\'abord la valeur initiale du compteur, puis ajoutez une tâche avec addTask(), et enfin vérifiez que le compteur a augmenté.',
      starterCode: `it('devrait incrémenter le compteur de tâches actives', () => {
  // Arrange - État initial


  // Act - Ajouter une tâche


  // Assert - Vérifier le compteur

});`,
      solution: `it('devrait incrémenter le compteur de tâches actives', () => {
  // Arrange
  const service = TestBed.inject(TaskService);
  const initialCount = service.activeTasksCount();
  
  // Act
  service.addTask({
    title: 'Nouvelle tâche',
    priority: 'medium'
  });
  
  // Assert
  expect(service.activeTasksCount()).toBe(initialCount + 1);
});`,
      validationKeywords: ['signal', 'activeTasksCount', 'addTask', 'expect', 'inject']
    },
    {
      id: 'ex3',
      title: 'Spy sur Service',
      description: 'Créez un espion (spy) sur la méthode deleteTask du service et vérifiez qu\'elle est appelée avec le bon ID quand on clique sur supprimer.',
      difficulty: 'moyen',
      hint: 'Utilisez vi.spyOn(service, "deleteTask") pour créer l\'espion, puis déclenchez l\'action et vérifiez avec toHaveBeenCalledWith().',
      starterCode: `it('devrait appeler deleteTask avec le bon ID', () => {
  // Arrange - Créer le spy


  // Act - Déclencher la suppression


  // Assert - Vérifier l'appel

});`,
      solution: `it('devrait appeler deleteTask avec le bon ID', () => {
  // Arrange
  const taskId = '123';
  const deleteSpy = vi.spyOn(taskService, 'deleteTask');
  
  // Act
  component.onDelete(taskId);
  
  // Assert
  expect(deleteSpy).toHaveBeenCalledWith(taskId);
  expect(deleteSpy).toHaveBeenCalledTimes(1);
});`,
      validationKeywords: ['spy', 'spyOn', 'deleteTask', 'toHaveBeenCalledWith', 'id']
    },
    {
      id: 'ex4',
      title: 'Validation de Formulaire',
      description: 'Testez que le formulaire d\'ajout de tâche est invalide quand le titre est vide, et valide quand on entre un titre.',
      difficulty: 'facile',
      hint: 'Utilisez component.taskForm.valid pour vérifier l\'état du formulaire, et patchValue() pour simuler la saisie utilisateur.',
      starterCode: `it('devrait valider le formulaire correctement', () => {
  // Test 1: Formulaire invalide au départ


  // Test 2: Formulaire valide après saisie

});`,
      solution: `it('devrait valider le formulaire correctement', () => {
  // Test 1: Formulaire invalide au départ
  expect(component.taskForm.valid).toBe(false);
  expect(component.taskForm.get('title')?.errors?.['required']).toBeTruthy();
  
  // Test 2: Formulaire valide après saisie
  component.taskForm.patchValue({
    title: 'Ma nouvelle tâche',
    priority: 'medium'
  });
  
  expect(component.taskForm.valid).toBe(true);
});`,
      validationKeywords: ['taskForm', 'valid', 'invalid', 'patchValue', 'title', 'expect']
    },
    {
      id: 'ex5',
      title: 'Test Asynchrone',
      description: 'Utilisez fakeAsync et tick() pour tester une fonction de recherche avec debounce de 300ms.',
      difficulty: 'difficile',
      hint: 'Enveloppez votre test dans fakeAsync(() => {}), puis utilisez tick(300) pour avancer le temps virtuel après avoir déclenché la recherche.',
      starterCode: `it('devrait debounce la recherche', fakeAsync(() => {
  // Arrange - Créer un spy sur la recherche


  // Act - Déclencher la recherche


  // Assert avant le délai


  // Avancer le temps avec tick()


  // Assert après le délai

}));`,
      solution: `it('devrait debounce la recherche', fakeAsync(() => {
  // Arrange
  const searchSpy = vi.spyOn(service, 'search');
  
  // Act
  component.searchQuery.set('angular');
  
  // Assert avant le délai
  expect(searchSpy).not.toHaveBeenCalled();
  
  // Avancer le temps avec tick()
  tick(300);
  
  // Assert après le délai
  expect(searchSpy).toHaveBeenCalledWith('angular');
}));`,
      validationKeywords: ['fakeAsync', 'tick', 'debounce', 'search', 'expect', '300']
    }
  ];

  currentExercise = signal('ex1');
  userCode = '';
  completedExercises = signal<Set<string>>(new Set());
  hintVisible = signal(false);
  solutionVisible = signal(false);
  isValidating = signal(false);
  currentResult = signal<ExerciseResult | null>(null);

  activeExercise = computed(() => 
    this.exercises.find(e => e.id === this.currentExercise())
  );

  completedCount = computed(() => this.completedExercises().size);
  progressPercentage = computed(() => 
    (this.completedCount() / this.exercises.length) * 100
  );

  selectExercise(id: string) {
    this.currentExercise.set(id);
    const exercise = this.exercises.find(e => e.id === id);
    this.userCode = exercise?.starterCode || '';
    this.hintVisible.set(false);
    this.solutionVisible.set(false);
    this.currentResult.set(null);
  }

  isCompleted(id: string): boolean {
    return this.completedExercises().has(id);
  }

  getDifficultyIcon(difficulty: string): string {
    switch (difficulty) {
      case 'facile': return '🟢';
      case 'moyen': return '🟡';
      case 'difficile': return '🔴';
      default: return '⚪';
    }
  }

  showHint() {
    this.hintVisible.set(true);
    this.solutionVisible.set(false);
  }

  showSolution() {
    this.solutionVisible.set(true);
    this.hintVisible.set(false);
  }

  resetCode() {
    const exercise = this.activeExercise();
    if (exercise) {
      this.userCode = exercise.starterCode;
      this.currentResult.set(null);
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Optionally show a toast notification
    });
  }

  validateCode() {
    this.isValidating.set(true);
    this.currentResult.set(null);

    // Simulate validation delay for better UX
    setTimeout(() => {
      const exercise = this.activeExercise();
      if (!exercise) {
        this.isValidating.set(false);
        return;
      }

      const result = this.checkCode(exercise);
      this.currentResult.set(result);

      if (result.passed) {
        const updated = new Set(this.completedExercises());
        updated.add(exercise.id);
        this.completedExercises.set(updated);
      }

      this.isValidating.set(false);
    }, 800);
  }

  private checkCode(exercise: Exercise): ExerciseResult {
    const code = this.userCode.toLowerCase();
    const feedback: string[] = [];
    let score = 0;

    // Check for required keywords
    for (const keyword of exercise.validationKeywords) {
      if (code.includes(keyword.toLowerCase())) {
        score++;
        feedback.push(`✅ "${keyword}" trouvé`);
      } else {
        feedback.push(`❌ "${keyword}" manquant`);
      }
    }

    // Check for basic structure
    if (code.includes('it(') || code.includes('test(')) {
      score += 2;
    }
    if (code.includes('expect(')) {
      score += 2;
    }

    const threshold = Math.ceil(exercise.validationKeywords.length * 0.7);
    const keywordScore = exercise.validationKeywords.filter(k => 
      code.includes(k.toLowerCase())
    ).length;

    const passed = keywordScore >= threshold;

    return {
      exerciseId: exercise.id,
      passed,
      message: passed 
        ? `Bravo ! Vous avez validé ${keywordScore}/${exercise.validationKeywords.length} critères clés.`
        : `Continuez ! Vous avez validé ${keywordScore}/${exercise.validationKeywords.length} critères. Revoyez les éléments manquants.`,
      feedback
    };
  }

  constructor() {
    // Initialize with first exercise
    const first = this.exercises[0];
    if (first) {
      this.userCode = first.starterCode;
    }
  }
}
