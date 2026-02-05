import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { 
  Task, 
  CreateTaskDto, 
  UpdateTaskDto, 
  TaskFilter, 
  TaskFilterOptions,
  TaskSortBy,
  SortOrder
} from '../models/task.model';

/**
 * TaskService - Core service for Mini Task Manager
 * 
 * This service demonstrates:
 * - State management with Angular Signals
 * - HTTP operations with RxJS
 * - Pure logic functions for filtering/sorting
 * - Error handling patterns
 * - Computed values and derived state
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = '/api/tasks';
  
  // ============================================
  // STATE MANAGEMENT WITH SIGNALS
  // ============================================
  
  /** All tasks loaded from the server */
  private readonly _tasks = signal<Task[]>([]);
  
  /** Current loading state */
  private readonly _loading = signal<boolean>(false);
  
  /** Current error message if any */
  private readonly _error = signal<string | null>(null);
  
  /** Current filter options */
  private readonly _filterOptions = signal<TaskFilterOptions>({
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // ============================================
  // PUBLIC READONLY SIGNALS (Exposed to components)
  // ============================================
  
  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filterOptions = this._filterOptions.asReadonly();

  // ============================================
  // COMPUTED VALUES (Derived state)
  // ============================================
  
  /** Filtered and sorted tasks based on current filter options */
  readonly filteredTasks = computed(() => {
    const tasks = this._tasks();
    const options = this._filterOptions();
    return this.applyFiltersAndSort(tasks, options);
  });

  /** Count of active (incomplete) tasks */
  readonly activeTasksCount = computed(() => 
    this._tasks().filter(task => !task.completed).length
  );

  /** Count of completed tasks */
  readonly completedTasksCount = computed(() => 
    this._tasks().filter(task => task.completed).length
  );

  /** Total number of tasks */
  readonly totalTasksCount = computed(() => this._tasks().length);

  /** Statistics about tasks by priority */
  readonly tasksByPriority = computed(() => ({
    high: this._tasks().filter(t => t.priority === 'high').length,
    medium: this._tasks().filter(t => t.priority === 'medium').length,
    low: this._tasks().filter(t => t.priority === 'low').length
  }));

  /** Check if there are any overdue tasks */
  readonly hasOverdueTasks = computed(() => {
    const now = new Date();
    return this._tasks().some(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < now
    );
  });

  constructor(private readonly http: HttpClient) {}

  // ============================================
  // HTTP OPERATIONS (CRUD)
  // ============================================

  /**
   * Load all tasks from the server
   * Demonstrates: HTTP GET, error handling, state updates
   */
  loadTasks(): Observable<Task[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Task[]>(this.API_URL).pipe(
      tap(tasks => {
        this._tasks.set(tasks);
        this._loading.set(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get a single task by ID
   * Demonstrates: HTTP GET with params, Optional chaining
   */
  getTaskById(id: string): Observable<Task | undefined> {
    // First check local cache
    const cachedTask = this._tasks().find(t => t.id === id);
    if (cachedTask) {
      return of(cachedTask);
    }

    return this.http.get<Task>(`${this.API_URL}/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Create a new task
   * Demonstrates: HTTP POST, optimistic updates, ID generation
   */
  createTask(dto: CreateTaskDto): Observable<Task> {
    const newTask: Task = {
      id: this.generateId(),
      title: dto.title.trim(),
      description: dto.description.trim(),
      completed: false,
      priority: dto.priority,
      createdAt: new Date(),
      dueDate: dto.dueDate,
      tags: dto.tags || []
    };

    this._loading.set(true);

    return this.http.post<Task>(this.API_URL, newTask).pipe(
      tap(createdTask => {
        this._tasks.update(tasks => [...tasks, createdTask]);
        this._loading.set(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Update an existing task
   * Demonstrates: HTTP PUT, partial updates, immutable state updates
   */
  updateTask(id: string, dto: UpdateTaskDto): Observable<Task> {
    this._loading.set(true);

    return this.http.put<Task>(`${this.API_URL}/${id}`, dto).pipe(
      tap(updatedTask => {
        this._tasks.update(tasks => 
          tasks.map(task => task.id === id ? updatedTask : task)
        );
        this._loading.set(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Delete a task
   * Demonstrates: HTTP DELETE, optimistic deletion with rollback
   */
  deleteTask(id: string): Observable<void> {
    const previousTasks = this._tasks();
    
    // Optimistic update - remove immediately
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));

    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(error => {
        // Rollback on error
        this._tasks.set(previousTasks);
        return this.handleError(error);
      })
    );
  }

  /**
   * Toggle task completion status
   * Demonstrates: Convenience method, state toggle
   */
  toggleTaskCompletion(id: string): Observable<Task> {
    const task = this._tasks().find(t => t.id === id);
    if (!task) {
      return throwError(() => new Error('Task not found'));
    }
    return this.updateTask(id, { completed: !task.completed });
  }

  // ============================================
  // PURE LOGIC FUNCTIONS (Easy to test!)
  // ============================================

  /**
   * Filter tasks by status
   * PURE FUNCTION - No side effects, easy to test
   */
  filterByStatus(tasks: Task[], status: TaskFilter): Task[] {
    switch (status) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'all':
      default:
        return tasks;
    }
  }

  /**
   * Filter tasks by priority
   * PURE FUNCTION
   */
  filterByPriority(tasks: Task[], priority: 'low' | 'medium' | 'high'): Task[] {
    return tasks.filter(task => task.priority === priority);
  }

  /**
   * Search tasks by title or description
   * PURE FUNCTION
   */
  searchTasks(tasks: Task[], searchTerm: string): Task[] {
    if (!searchTerm.trim()) {
      return tasks;
    }
    const term = searchTerm.toLowerCase().trim();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term) ||
      task.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  }

  /**
   * Sort tasks by a given field
   * PURE FUNCTION
   */
  sortTasks(tasks: Task[], sortBy: TaskSortBy, order: SortOrder): Task[] {
    const sorted = [...tasks].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'dueDate':
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          comparison = dateA - dateB;
          break;
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  /**
   * Apply all filters and sorting
   * Combines multiple pure functions
   */
  applyFiltersAndSort(tasks: Task[], options: TaskFilterOptions): Task[] {
    let result = this.filterByStatus(tasks, options.status);
    
    if (options.priority) {
      result = this.filterByPriority(result, options.priority);
    }
    
    if (options.searchTerm) {
      result = this.searchTasks(result, options.searchTerm);
    }
    
    return this.sortTasks(result, options.sortBy, options.sortOrder);
  }

  /**
   * Calculate task statistics
   * PURE FUNCTION
   */
  calculateStats(tasks: Task[]): {
    total: number;
    completed: number;
    active: number;
    completionRate: number;
    overdue: number;
  } {
    const now = new Date();
    const completed = tasks.filter(t => t.completed).length;
    const active = tasks.filter(t => !t.completed).length;
    const overdue = tasks.filter(t => 
      !t.completed && t.dueDate && new Date(t.dueDate) < now
    ).length;

    return {
      total: tasks.length,
      completed,
      active,
      completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
      overdue
    };
  }

  /**
   * Validate task data
   * PURE FUNCTION - Returns validation errors
   */
  validateTask(dto: CreateTaskDto): string[] {
    const errors: string[] = [];

    if (!dto.title?.trim()) {
      errors.push('Title is required');
    } else if (dto.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    } else if (dto.title.trim().length > 100) {
      errors.push('Title must be less than 100 characters');
    }

    if (dto.description && dto.description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }

    if (dto.dueDate && new Date(dto.dueDate) < new Date()) {
      errors.push('Due date cannot be in the past');
    }

    if (!['low', 'medium', 'high'].includes(dto.priority)) {
      errors.push('Invalid priority level');
    }

    return errors;
  }

  // ============================================
  // FILTER ACTIONS (Update filter state)
  // ============================================

  setStatusFilter(status: TaskFilter): void {
    this._filterOptions.update(options => ({ ...options, status }));
  }

  setPriorityFilter(priority: 'low' | 'medium' | 'high' | undefined): void {
    this._filterOptions.update(options => ({ ...options, priority }));
  }

  setSearchTerm(searchTerm: string): void {
    this._filterOptions.update(options => ({ ...options, searchTerm }));
  }

  setSorting(sortBy: TaskSortBy, sortOrder: SortOrder): void {
    this._filterOptions.update(options => ({ ...options, sortBy, sortOrder }));
  }

  clearFilters(): void {
    this._filterOptions.set({
      status: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Clear all tasks from local state
   * Useful for testing and reset scenarios
   */
  clearAllTasks(): void {
    this._tasks.set([]);
    this._error.set(null);
  }

  /**
   * Set tasks directly (useful for testing)
   */
  setTasks(tasks: Task[]): void {
    this._tasks.set(tasks);
  }

  // ============================================
  // PRIVATE HELPERS
  // ============================================

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this._loading.set(false);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to server. Please check your connection.';
          break;
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'You are not authorized. Please log in.';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    this._error.set(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
