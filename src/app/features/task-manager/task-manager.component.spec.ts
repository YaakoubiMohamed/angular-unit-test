import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { TaskManagerComponent } from './task-manager.component';
import { TaskService } from './services/task.service';
import { Task, CreateTaskDto } from './models/task.model';
import { signal } from '@angular/core';

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                TASK MANAGER COMPONENT - TEST SUITE                            ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  This test file demonstrates COMPONENT TESTING concepts:                      ║
 * ║                                                                                ║
 * ║  1. 🏗️ TESTBED SETUP - Configuring component test environment                 ║
 * ║  2. 🎯 DOM TESTING - Querying and asserting on rendered elements              ║
 * ║  3. 📝 FORM TESTING - Reactive form validation and submission                 ║
 * ║  4. 🖱️ USER INTERACTIONS - Simulating clicks, inputs, and events              ║
 * ║  5. 🎭 MOCKING SERVICES - Isolating component from dependencies               ║
 * ║  6. ⏱️ ASYNC TESTING - Handling async operations in components                ║
 * ║  7. 📊 DATA-TESTID - Using data attributes for stable selectors               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// TEST DATA FACTORY
// ============================================================================

const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: `task_${Math.random().toString(36).substring(7)}`,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  priority: 'medium',
  createdAt: new Date('2024-01-15'),
  dueDate: new Date('2024-02-15'),
  tags: ['test'],
  ...overrides
});

// ============================================================================
// MOCK SERVICE FACTORY
// ============================================================================

/**
 * 💡 TIP: Create a mock service that mimics the real service's interface
 * This gives you full control over the service behavior in tests
 */
const createMockTaskService = () => {
  const tasks = signal<Task[]>([]);
  const loading = signal(false);
  const error = signal<string | null>(null);
  const filteredTasks = signal<Task[]>([]);
  
  return {
    // Signals
    tasks: tasks.asReadonly(),
    loading: loading.asReadonly(),
    error: error.asReadonly(),
    filteredTasks: filteredTasks.asReadonly(),
    totalTasksCount: signal(0).asReadonly(),
    activeTasksCount: signal(0).asReadonly(),
    completedTasksCount: signal(0).asReadonly(),
    filterOptions: signal({ status: 'all', sortBy: 'createdAt', sortOrder: 'desc' }).asReadonly(),
    
    // Methods
    loadTasks: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
    createTask: vi.fn().mockReturnValue({ subscribe: vi.fn((callbacks: any) => callbacks.next?.(createMockTask())) }),
    updateTask: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
    deleteTask: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
    toggleTaskCompletion: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
    setStatusFilter: vi.fn(),
    setSearchTerm: vi.fn(),
    setSorting: vi.fn(),
    clearFilters: vi.fn(),
    
    // Internal setters for test control
    _setTasks: (t: Task[]) => {
      tasks.set(t);
      filteredTasks.set(t);
    },
    _setLoading: (l: boolean) => loading.set(l),
    _setError: (e: string | null) => error.set(e),
    _setFilteredTasks: (t: Task[]) => filteredTasks.set(t)
  };
};

// ============================================================================
// SECTION 1: COMPONENT SETUP & RENDERING TESTS
// ============================================================================

describe('TaskManagerComponent - Setup & Rendering', () => {
  /**
   * 🎯 COMPONENT TESTING FUNDAMENTALS:
   * 
   * 1. TestBed creates an Angular testing module
   * 2. ComponentFixture provides access to component & DOM
   * 3. detectChanges() triggers change detection
   * 4. nativeElement gives access to raw DOM
   */

  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;
  let mockTaskService: ReturnType<typeof createMockTaskService>;

  beforeEach(async () => {
    mockTaskService = createMockTaskService();

    await TestBed.configureTestingModule({
      imports: [
        TaskManagerComponent,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TaskService, useValue: mockTaskService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initial Render', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render header with title', () => {
      const header = fixture.debugElement.query(By.css('.task-header h2'));
      expect(header.nativeElement.textContent).toContain('Mini Task Manager');
    });

    it('should display stats bar', () => {
      const stats = fixture.debugElement.queryAll(By.css('.stat'));
      expect(stats.length).toBe(3); // Total, Active, Completed
    });

    it('should render add task button', () => {
      const addButton = fixture.debugElement.query(
        By.css('[data-testid="toggle-add-form"]')
      );
      expect(addButton).toBeTruthy();
      expect(addButton.nativeElement.textContent).toContain('Add Task');
    });

    it('should call loadTasks on init', () => {
      expect(mockTaskService.loadTasks).toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no tasks', () => {
      mockTaskService._setFilteredTasks([]);
      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(
        By.css('[data-testid="empty-state"]')
      );
      expect(emptyState).toBeTruthy();
    });
  });
});

// ============================================================================
// SECTION 2: FORM TESTING
// ============================================================================

describe('TaskManagerComponent - Form Testing', () => {
  /**
   * 🎯 FORM TESTING CONCEPTS:
   * 
   * 1. Access form controls programmatically
   * 2. Set values and trigger validation
   * 3. Test form submission
   * 4. Verify validation errors display
   */

  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;
  let mockTaskService: ReturnType<typeof createMockTaskService>;

  beforeEach(async () => {
    mockTaskService = createMockTaskService();

    await TestBed.configureTestingModule({
      imports: [TaskManagerComponent, ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [{ provide: TaskService, useValue: mockTaskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Form Display', () => {
    it('should hide form initially', () => {
      const form = fixture.debugElement.query(By.css('[data-testid="task-form"]'));
      expect(form).toBeFalsy();
    });

    it('should show form when add button clicked', () => {
      // Arrange
      const addButton = fixture.debugElement.query(
        By.css('[data-testid="toggle-add-form"]')
      );

      // Act
      addButton.nativeElement.click();
      fixture.detectChanges();

      // Assert
      const form = fixture.debugElement.query(By.css('[data-testid="task-form"]'));
      expect(form).toBeTruthy();
    });

    it('should toggle button text when form is visible', () => {
      const addButton = fixture.debugElement.query(
        By.css('[data-testid="toggle-add-form"]')
      );

      // Initially shows "Add Task"
      expect(addButton.nativeElement.textContent).toContain('Add Task');

      // Click to show form
      addButton.nativeElement.click();
      fixture.detectChanges();

      // Now shows "Cancel"
      expect(addButton.nativeElement.textContent).toContain('Cancel');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      // Show the form first
      component.toggleAddForm();
      fixture.detectChanges();
    });

    it('should have invalid form initially', () => {
      expect(component.taskForm.invalid).toBe(true);
    });

    it('should require title field', () => {
      const titleControl = component.taskForm.get('title');
      
      // Empty title should be invalid
      titleControl?.setValue('');
      expect(titleControl?.hasError('required')).toBe(true);
    });

    it('should validate minimum title length', () => {
      const titleControl = component.taskForm.get('title');
      
      titleControl?.setValue('AB');
      expect(titleControl?.hasError('minlength')).toBe(true);
      
      titleControl?.setValue('ABC');
      expect(titleControl?.hasError('minlength')).toBe(false);
    });

    it('should show error message for invalid title', () => {
      const titleInput = fixture.debugElement.query(
        By.css('[data-testid="task-title-input"]')
      );
      
      // Set invalid value and blur
      titleInput.nativeElement.value = '';
      titleInput.nativeElement.dispatchEvent(new Event('input'));
      titleInput.nativeElement.dispatchEvent(new Event('blur'));
      component.taskForm.get('title')?.markAsTouched();
      fixture.detectChanges();

      const errorMsg = fixture.debugElement.query(
        By.css('[data-testid="title-error"]')
      );
      expect(errorMsg).toBeTruthy();
      expect(errorMsg.nativeElement.textContent).toContain('required');
    });

    it('should have valid form with correct data', () => {
      component.taskForm.patchValue({
        title: 'Valid Task Title',
        description: 'A description',
        priority: 'high'
      });

      expect(component.taskForm.valid).toBe(true);
    });

    it('should disable submit button when form is invalid', () => {
      const submitBtn = fixture.debugElement.query(
        By.css('[data-testid="submit-task-btn"]')
      );
      
      expect(submitBtn.nativeElement.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.taskForm.patchValue({
        title: 'Valid Task Title',
        priority: 'medium'
      });
      fixture.detectChanges();

      const submitBtn = fixture.debugElement.query(
        By.css('[data-testid="submit-task-btn"]')
      );
      
      expect(submitBtn.nativeElement.disabled).toBe(false);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.toggleAddForm();
      fixture.detectChanges();
    });

    it('should call createTask on valid form submit', fakeAsync(() => {
      // Arrange
      const taskData = {
        title: 'New Task',
        description: 'Description',
        priority: 'high'
      };
      component.taskForm.patchValue(taskData);
      fixture.detectChanges();

      // Act
      const form = fixture.debugElement.query(By.css('[data-testid="task-form"]'));
      form.triggerEventHandler('ngSubmit', null);
      tick();

      // Assert
      expect(mockTaskService.createTask).toHaveBeenCalled();
    }));

    it('should not submit invalid form', () => {
      // Arrange - leave form invalid
      component.taskForm.patchValue({ title: '' });
      
      // Act
      component.onSubmit();

      // Assert
      expect(mockTaskService.createTask).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      // Arrange
      component.taskForm.patchValue({ title: '' });
      
      // Act
      component.onSubmit();

      // Assert
      expect(component.taskForm.get('title')?.touched).toBe(true);
    });
  });
});

// ============================================================================
// SECTION 3: USER INTERACTION TESTING
// ============================================================================

describe('TaskManagerComponent - User Interactions', () => {
  /**
   * 🎯 USER INTERACTION TESTING:
   * 
   * 1. Simulate clicks, inputs, and other DOM events
   * 2. Verify component responds correctly
   * 3. Test event handlers
   * 4. Verify UI updates
   */

  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;
  let mockTaskService: ReturnType<typeof createMockTaskService>;

  beforeEach(async () => {
    mockTaskService = createMockTaskService();

    await TestBed.configureTestingModule({
      imports: [TaskManagerComponent, ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [{ provide: TaskService, useValue: mockTaskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Filter Interactions', () => {
    it('should change filter when filter button clicked', () => {
      // Arrange
      const activeFilterBtn = fixture.debugElement.query(
        By.css('[data-testid="filter-active"]')
      );

      // Act
      activeFilterBtn.nativeElement.click();
      fixture.detectChanges();

      // Assert
      expect(component.currentFilter()).toBe('active');
      expect(mockTaskService.setStatusFilter).toHaveBeenCalledWith('active');
    });

    it('should highlight active filter button', () => {
      // Arrange
      const completedFilterBtn = fixture.debugElement.query(
        By.css('[data-testid="filter-completed"]')
      );

      // Act
      completedFilterBtn.nativeElement.click();
      fixture.detectChanges();

      // Assert
      expect(completedFilterBtn.nativeElement.classList.contains('active')).toBe(true);
    });

    it('should update search term on input', () => {
      // Arrange
      const searchInput = fixture.debugElement.query(
        By.css('[data-testid="search-input"]')
      );

      // Act
      searchInput.nativeElement.value = 'test query';
      searchInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // Assert
      expect(component.searchTerm()).toBe('test query');
      expect(mockTaskService.setSearchTerm).toHaveBeenCalledWith('test query');
    });

    it('should change sorting on select change', () => {
      // Arrange
      const sortSelect = fixture.debugElement.query(
        By.css('[data-testid="sort-select"]')
      );

      // Act
      sortSelect.nativeElement.value = 'priority-desc';
      sortSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      // Assert
      expect(mockTaskService.setSorting).toHaveBeenCalledWith('priority', 'desc');
    });
  });

  describe('Task Interactions', () => {
    beforeEach(() => {
      // Set up some tasks
      const tasks = [
        createMockTask({ id: '1', title: 'Task 1', completed: false }),
        createMockTask({ id: '2', title: 'Task 2', completed: true }),
      ];
      mockTaskService._setFilteredTasks(tasks);
      fixture.detectChanges();
    });

    it('should render task list', () => {
      const taskItems = fixture.debugElement.queryAll(By.css('.task-item'));
      expect(taskItems.length).toBe(2);
    });

    it('should display task title', () => {
      const taskTitle = fixture.debugElement.query(
        By.css('[data-testid="task-title-1"]')
      );
      expect(taskTitle.nativeElement.textContent).toContain('Task 1');
    });

    it('should call toggleTaskCompletion when checkbox clicked', () => {
      // Arrange
      const checkbox = fixture.debugElement.query(
        By.css('[data-testid="task-checkbox-1"]')
      );

      // Act
      checkbox.nativeElement.click();

      // Assert
      expect(mockTaskService.toggleTaskCompletion).toHaveBeenCalledWith('1');
    });

    it('should call deleteTask when delete button clicked', () => {
      // Mock window.confirm
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      // Arrange
      const deleteBtn = fixture.debugElement.query(
        By.css('[data-testid="delete-task-1"]')
      );

      // Act
      deleteBtn.nativeElement.click();

      // Assert
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith('1');
    });

    it('should NOT delete task when confirm is cancelled', () => {
      // Mock window.confirm to return false
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      // Arrange
      const deleteBtn = fixture.debugElement.query(
        By.css('[data-testid="delete-task-1"]')
      );

      // Act
      deleteBtn.nativeElement.click();

      // Assert
      expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
    });
  });
});

// ============================================================================
// SECTION 4: DATA-TESTID SELECTOR PATTERN
// ============================================================================

describe('TaskManagerComponent - Data-Testid Pattern', () => {
  /**
   * 🎯 WHY USE DATA-TESTID?
   * 
   * 1. ✅ Decoupled from CSS classes (no breaking when styles change)
   * 2. ✅ Decoupled from component structure (no breaking on refactor)
   * 3. ✅ Self-documenting (clearly indicates testing purpose)
   * 4. ✅ Can be removed in production builds
   * 
   * ❌ DON'T use: class selectors, element IDs, nth-child selectors
   */

  let fixture: ComponentFixture<TaskManagerComponent>;
  let mockTaskService: ReturnType<typeof createMockTaskService>;

  beforeEach(async () => {
    mockTaskService = createMockTaskService();

    await TestBed.configureTestingModule({
      imports: [TaskManagerComponent, ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [{ provide: TaskService, useValue: mockTaskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskManagerComponent);
    fixture.detectChanges();
  });

  // Helper to query by data-testid
  const getByTestId = (testId: string) => 
    fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));

  it('should find elements by data-testid', () => {
    expect(getByTestId('toggle-add-form')).toBeTruthy();
    expect(getByTestId('filters-section')).toBeTruthy();
    expect(getByTestId('search-input')).toBeTruthy();
  });

  it('should use dynamic data-testid for task items', () => {
    const tasks = [createMockTask({ id: 'abc123' })];
    mockTaskService._setFilteredTasks(tasks);
    fixture.detectChanges();

    expect(getByTestId('task-item-abc123')).toBeTruthy();
    expect(getByTestId('task-title-abc123')).toBeTruthy();
    expect(getByTestId('task-checkbox-abc123')).toBeTruthy();
    expect(getByTestId('delete-task-abc123')).toBeTruthy();
  });
});

// ============================================================================
// SECTION 5: LOADING & ERROR STATES
// ============================================================================

describe('TaskManagerComponent - Loading & Error States', () => {
  let fixture: ComponentFixture<TaskManagerComponent>;
  let mockTaskService: ReturnType<typeof createMockTaskService>;

  beforeEach(async () => {
    mockTaskService = createMockTaskService();

    await TestBed.configureTestingModule({
      imports: [TaskManagerComponent, ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [{ provide: TaskService, useValue: mockTaskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskManagerComponent);
  });

  it('should show loading indicator when loading', () => {
    mockTaskService._setLoading(true);
    fixture.detectChanges();

    const loading = fixture.debugElement.query(
      By.css('[data-testid="loading-indicator"]')
    );
    expect(loading).toBeTruthy();
  });

  it('should hide loading indicator when not loading', () => {
    mockTaskService._setLoading(false);
    fixture.detectChanges();

    const loading = fixture.debugElement.query(
      By.css('[data-testid="loading-indicator"]')
    );
    expect(loading).toBeFalsy();
  });

  it('should show error message when error occurs', () => {
    mockTaskService._setError('Failed to load tasks');
    fixture.detectChanges();

    const error = fixture.debugElement.query(
      By.css('[data-testid="error-message"]')
    );
    expect(error).toBeTruthy();
    expect(error.nativeElement.textContent).toContain('Failed to load tasks');
  });

  it('should call loadTasks when retry button clicked', () => {
    mockTaskService._setError('Network error');
    fixture.detectChanges();

    const retryBtn = fixture.debugElement.query(By.css('.error-state .btn'));
    retryBtn.nativeElement.click();

    // loadTasks is called once on init, and once on retry
    expect(mockTaskService.loadTasks).toHaveBeenCalledTimes(2);
  });
});

// ============================================================================
// SECTION 6: COMPONENT HELPER METHODS
// ============================================================================

describe('TaskManagerComponent - Helper Methods', () => {
  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;
  let mockTaskService: ReturnType<typeof createMockTaskService>;

  beforeEach(async () => {
    mockTaskService = createMockTaskService();

    await TestBed.configureTestingModule({
      imports: [TaskManagerComponent, ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [{ provide: TaskService, useValue: mockTaskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('isOverdue()', () => {
    it('should return true for overdue incomplete task', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const task = createMockTask({ 
        completed: false, 
        dueDate: yesterday 
      });

      expect(component.isOverdue(task)).toBe(true);
    });

    it('should return false for completed task even if overdue', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const task = createMockTask({ 
        completed: true, 
        dueDate: yesterday 
      });

      expect(component.isOverdue(task)).toBe(false);
    });

    it('should return false for task without due date', () => {
      const task = createMockTask({ dueDate: undefined });
      expect(component.isOverdue(task)).toBe(false);
    });

    it('should return false for future due date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const task = createMockTask({ 
        completed: false, 
        dueDate: tomorrow 
      });

      expect(component.isOverdue(task)).toBe(false);
    });
  });

  describe('formatDate()', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-03-15');
      const formatted = component.formatDate(date);
      
      expect(formatted).toContain('Mar');
      expect(formatted).toContain('15');
    });

    it('should handle string dates', () => {
      const formatted = component.formatDate('2024-06-20');
      
      expect(formatted).toContain('Jun');
      expect(formatted).toContain('20');
    });
  });

  describe('isFieldInvalid()', () => {
    it('should return true for invalid touched field', () => {
      component.toggleAddForm();
      const titleControl = component.taskForm.get('title');
      titleControl?.setValue('');
      titleControl?.markAsTouched();

      expect(component.isFieldInvalid('title')).toBe(true);
    });

    it('should return false for valid field', () => {
      component.toggleAddForm();
      const titleControl = component.taskForm.get('title');
      titleControl?.setValue('Valid Title');
      titleControl?.markAsTouched();

      expect(component.isFieldInvalid('title')).toBe(false);
    });

    it('should return false for invalid but untouched field', () => {
      component.toggleAddForm();
      // Field is invalid but not touched yet

      expect(component.isFieldInvalid('title')).toBe(false);
    });
  });
});
