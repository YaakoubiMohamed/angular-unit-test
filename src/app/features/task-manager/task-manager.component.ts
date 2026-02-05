import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from './services/task.service';
import { Task, CreateTaskDto, TaskFilter, TaskSortBy, SortOrder } from './models/task.model';

/**
 * TaskManagerComponent - Interactive Mini Task Manager
 * 
 * This component demonstrates:
 * - Component with reactive forms
 * - Signal-based state management
 * - User interaction handling
 * - Clean, testable component architecture
 */
@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="task-manager">
      <!-- Header with Stats -->
      <header class="task-header">
        <h2>📋 Mini Task Manager</h2>
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-value">{{ taskService.totalTasksCount() }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat active">
            <span class="stat-value">{{ taskService.activeTasksCount() }}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat completed">
            <span class="stat-value">{{ taskService.completedTasksCount() }}</span>
            <span class="stat-label">Completed</span>
          </div>
        </div>
      </header>

      <!-- Add Task Form -->
      <section class="add-task-section" data-testid="add-task-section">
        <button 
          class="btn btn-primary add-btn"
          (click)="toggleAddForm()"
          data-testid="toggle-add-form">
          {{ showAddForm() ? '✕ Cancel' : '+ Add Task' }}
        </button>

        @if (showAddForm()) {
          <form 
            [formGroup]="taskForm" 
            (ngSubmit)="onSubmit()"
            class="task-form animate-slide-down"
            data-testid="task-form">
            
            <div class="form-group">
              <label for="title">Title *</label>
              <input
                id="title"
                type="text"
                formControlName="title"
                placeholder="What needs to be done?"
                class="form-control"
                data-testid="task-title-input"
                [class.invalid]="isFieldInvalid('title')">
              @if (isFieldInvalid('title')) {
                <span class="error-message" data-testid="title-error">
                  @if (taskForm.get('title')?.errors?.['required']) {
                    Title is required
                  } @else if (taskForm.get('title')?.errors?.['minlength']) {
                    Title must be at least 3 characters
                  } @else if (taskForm.get('title')?.errors?.['maxlength']) {
                    Title must be less than 100 characters
                  }
                </span>
              }
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                formControlName="description"
                placeholder="Add more details..."
                rows="2"
                class="form-control"
                data-testid="task-description-input">
              </textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="priority">Priority</label>
                <select 
                  id="priority" 
                  formControlName="priority"
                  class="form-control"
                  data-testid="task-priority-select">
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              <div class="form-group">
                <label for="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  formControlName="dueDate"
                  class="form-control"
                  data-testid="task-due-date-input">
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-success"
                [disabled]="taskForm.invalid || isSubmitting()"
                data-testid="submit-task-btn">
                {{ isSubmitting() ? 'Adding...' : 'Add Task' }}
              </button>
            </div>
          </form>
        }
      </section>

      <!-- Filters -->
      <section class="filters-section" data-testid="filters-section">
        <div class="filter-group">
          <label>Status:</label>
          <div class="filter-buttons">
            @for (filter of statusFilters; track filter.value) {
              <button
                class="filter-btn"
                [class.active]="currentFilter() === filter.value"
                (click)="setFilter(filter.value)"
                [attr.data-testid]="'filter-' + filter.value">
                {{ filter.label }}
              </button>
            }
          </div>
        </div>

        <div class="search-group">
          <input
            type="search"
            placeholder="🔍 Search tasks..."
            [value]="searchTerm()"
            (input)="onSearch($event)"
            class="search-input"
            data-testid="search-input">
        </div>

        <div class="sort-group">
          <select 
            (change)="onSortChange($event)"
            class="sort-select"
            data-testid="sort-select">
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="priority-asc">Priority (Low to High)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </section>

      <!-- Task List -->
      <section class="task-list-section" data-testid="task-list-section">
        @if (taskService.loading()) {
          <div class="loading-state" data-testid="loading-indicator">
            <div class="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        } @else if (taskService.error()) {
          <div class="error-state" data-testid="error-message">
            <span class="error-icon">⚠️</span>
            <p>{{ taskService.error() }}</p>
            <button class="btn btn-secondary" (click)="retry()">Retry</button>
          </div>
        } @else if (taskService.filteredTasks().length === 0) {
          <div class="empty-state" data-testid="empty-state">
            @if (searchTerm() || currentFilter() !== 'all') {
              <p>No tasks match your filters</p>
              <button class="btn btn-secondary" (click)="clearFilters()">
                Clear Filters
              </button>
            } @else {
              <p>🎉 No tasks yet! Add your first task above.</p>
            }
          </div>
        } @else {
          <ul class="task-list" data-testid="task-list">
            @for (task of taskService.filteredTasks(); track task.id) {
              <li 
                class="task-item"
                [class.completed]="task.completed"
                [class.overdue]="isOverdue(task)"
                [attr.data-testid]="'task-item-' + task.id">
                
                <div class="task-checkbox">
                  <input
                    type="checkbox"
                    [checked]="task.completed"
                    (change)="toggleComplete(task)"
                    [attr.data-testid]="'task-checkbox-' + task.id">
                </div>

                <div class="task-content">
                  <div class="task-header-row">
                    <h4 class="task-title" [attr.data-testid]="'task-title-' + task.id">
                      {{ task.title }}
                    </h4>
                    <span 
                      class="priority-badge"
                      [class]="'priority-' + task.priority"
                      [attr.data-testid]="'task-priority-' + task.id">
                      {{ task.priority }}
                    </span>
                  </div>
                  @if (task.description) {
                    <p class="task-description">{{ task.description }}</p>
                  }
                  <div class="task-meta">
                    @if (task.dueDate) {
                      <span 
                        class="due-date"
                        [class.overdue]="isOverdue(task)">
                        📅 {{ formatDate(task.dueDate) }}
                      </span>
                    }
                    @if (task.tags?.length) {
                      <div class="task-tags">
                        @for (tag of task.tags; track tag) {
                          <span class="tag">{{ tag }}</span>
                        }
                      </div>
                    }
                  </div>
                </div>

                <div class="task-actions">
                  <button
                    class="btn-icon edit"
                    (click)="editTask(task)"
                    title="Edit task"
                    [attr.data-testid]="'edit-task-' + task.id">
                    ✏️
                  </button>
                  <button
                    class="btn-icon delete"
                    (click)="deleteTask(task)"
                    title="Delete task"
                    [attr.data-testid]="'delete-task-' + task.id">
                    🗑️
                  </button>
                </div>
              </li>
            }
          </ul>
        }
      </section>

      <!-- Footer with Actions -->
      @if (taskService.completedTasksCount() > 0) {
        <footer class="task-footer" data-testid="task-footer">
          <button 
            class="btn btn-danger"
            (click)="clearCompleted()"
            data-testid="clear-completed-btn">
            Clear Completed ({{ taskService.completedTasksCount() }})
          </button>
        </footer>
      }
    </div>
  `,
  styles: [`
    .task-manager {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      max-width: 700px;
      margin: 0 auto;
    }

    /* Header Styles */
    .task-header {
      background: var(--angular-gradient);
      padding: 1.5rem;
      color: white;
      
      h2 {
        margin: 0 0 1rem;
        font-size: 1.5rem;
      }
    }

    .stats-bar {
      display: flex;
      gap: 1.5rem;
    }

    .stat {
      text-align: center;
      
      .stat-value {
        display: block;
        font-size: 1.75rem;
        font-weight: 700;
      }
      
      .stat-label {
        font-size: 0.75rem;
        opacity: 0.9;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    /* Add Task Section */
    .add-task-section {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .add-btn {
      width: 100%;
    }

    .task-form {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
    }

    .form-group {
      margin-bottom: 1rem;
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        font-size: 0.875rem;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      font-size: 1rem;
      transition: border-color 0.2s;
      
      &:focus {
        outline: none;
        border-color: var(--angular-pink);
        box-shadow: 0 0 0 3px rgba(234, 53, 171, 0.1);
      }
      
      &.invalid {
        border-color: var(--danger-color);
      }
    }

    .error-message {
      color: var(--danger-color);
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    /* Filters Section */
    .filters-section {
      padding: 1rem;
      background: var(--bg-secondary);
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      label {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }

    .filter-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .filter-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-color);
      background: white;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: var(--bg-tertiary);
      }
      
      &.active {
        background: var(--angular-pink);
        color: white;
        border-color: var(--angular-pink);
      }
    }

    .search-group {
      flex: 1;
      min-width: 200px;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 9999px;
      font-size: 0.875rem;
      
      &:focus {
        outline: none;
        border-color: var(--angular-pink);
      }
    }

    .sort-select {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      background: white;
    }

    /* Task List */
    .task-list-section {
      min-height: 200px;
    }

    .task-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .task-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      transition: background 0.2s;
      
      &:hover {
        background: var(--bg-secondary);
      }
      
      &.completed {
        opacity: 0.6;
        
        .task-title {
          text-decoration: line-through;
        }
      }
      
      &.overdue:not(.completed) {
        border-left: 3px solid var(--danger-color);
      }
    }

    .task-checkbox input {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .task-content {
      flex: 1;
    }

    .task-header-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .task-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .priority-badge {
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.625rem;
      text-transform: uppercase;
      font-weight: 600;
      
      &.priority-high {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
      }
      
      &.priority-medium {
        background: rgba(245, 158, 11, 0.1);
        color: #d97706;
      }
      
      &.priority-low {
        background: rgba(34, 197, 94, 0.1);
        color: #16a34a;
      }
    }

    .task-description {
      margin: 0.5rem 0 0;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .task-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
      font-size: 0.75rem;
    }

    .due-date {
      color: var(--text-muted);
      
      &.overdue {
        color: var(--danger-color);
        font-weight: 500;
      }
    }

    .task-tags {
      display: flex;
      gap: 0.25rem;
    }

    .tag {
      padding: 0.125rem 0.5rem;
      background: var(--bg-tertiary);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
    }

    .task-actions {
      display: flex;
      gap: 0.25rem;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .task-item:hover .task-actions {
      opacity: 1;
    }

    .btn-icon {
      padding: 0.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1rem;
      border-radius: var(--radius-sm);
      transition: background 0.2s;
      
      &:hover {
        background: var(--bg-tertiary);
      }
      
      &.delete:hover {
        background: rgba(239, 68, 68, 0.1);
      }
    }

    /* States */
    .loading-state,
    .error-state,
    .empty-state {
      padding: 3rem;
      text-align: center;
      color: var(--text-secondary);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--bg-tertiary);
      border-top-color: var(--angular-pink);
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-state {
      color: var(--danger-color);
      
      .error-icon {
        font-size: 2rem;
      }
    }

    /* Footer */
    .task-footer {
      padding: 1rem;
      background: var(--bg-secondary);
      display: flex;
      justify-content: flex-end;
    }

    /* Animations */
    .animate-slide-down {
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Buttons */
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background: var(--angular-gradient);
      color: white;
      
      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }
    }

    .btn-success {
      background: var(--success-color);
      color: white;
    }

    .btn-secondary {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .btn-danger {
      background: transparent;
      color: var(--danger-color);
      border: 1px solid var(--danger-color);
      
      &:hover:not(:disabled) {
        background: var(--danger-color);
        color: white;
      }
    }
  `]
})
export class TaskManagerComponent implements OnInit {
  readonly taskService = inject(TaskService);
  private readonly fb = inject(FormBuilder);

  // Local UI state
  readonly showAddForm = signal(false);
  readonly isSubmitting = signal(false);
  readonly searchTerm = signal('');
  readonly currentFilter = signal<TaskFilter>('all');
  readonly editingTaskId = signal<string | null>(null);

  // Form
  taskForm!: FormGroup;

  // Filter options
  readonly statusFilters = [
    { label: 'All', value: 'all' as TaskFilter },
    { label: 'Active', value: 'active' as TaskFilter },
    { label: 'Completed', value: 'completed' as TaskFilter }
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadTasks();
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      priority: ['medium', Validators.required],
      dueDate: ['']
    });
  }

  private loadTasks(): void {
    this.taskService.loadTasks().subscribe();
  }

  toggleAddForm(): void {
    this.showAddForm.update(v => !v);
    if (!this.showAddForm()) {
      this.taskForm.reset({ priority: 'medium' });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;
    const dto: CreateTaskDto = {
      title: formValue.title,
      description: formValue.description || '',
      priority: formValue.priority,
      dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined
    };

    this.isSubmitting.set(true);
    
    this.taskService.createTask(dto).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showAddForm.set(false);
        this.taskForm.reset({ priority: 'medium' });
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  setFilter(filter: TaskFilter): void {
    this.currentFilter.set(filter);
    this.taskService.setStatusFilter(filter);
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.taskService.setSearchTerm(term);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const [sortBy, sortOrder] = value.split('-') as [TaskSortBy, SortOrder];
    this.taskService.setSorting(sortBy, sortOrder);
  }

  toggleComplete(task: Task): void {
    this.taskService.toggleTaskCompletion(task.id).subscribe();
  }

  editTask(task: Task): void {
    this.editingTaskId.set(task.id);
    this.showAddForm.set(true);
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : ''
    });
  }

  deleteTask(task: Task): void {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe();
    }
  }

  clearCompleted(): void {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
      const completedTasks = this.taskService.filteredTasks().filter(t => t.completed);
      completedTasks.forEach(task => {
        this.taskService.deleteTask(task.id).subscribe();
      });
    }
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.currentFilter.set('all');
    this.taskService.clearFilters();
  }

  retry(): void {
    this.loadTasks();
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
