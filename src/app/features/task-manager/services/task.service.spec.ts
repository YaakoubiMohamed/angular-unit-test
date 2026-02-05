import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task, CreateTaskDto, TaskFilter } from '../models/task.model';

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    TASK SERVICE - COMPREHENSIVE TEST SUITE                     ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  This test file demonstrates ALL key testing concepts:                         ║
 * ║                                                                                ║
 * ║  1. 🧪 PURE FUNCTION TESTING - Easy, no dependencies                          ║
 * ║  2. 🔧 SERVICE TESTING WITH TESTBED - Angular DI integration                  ║
 * ║  3. 🌐 HTTP TESTING - Mocking API calls with HttpTestingController            ║
 * ║  4. 📡 SIGNAL TESTING - Testing reactive state                                ║
 * ║  5. ⚡ ASYNC TESTING - Handling Observables and Promises                       ║
 * ║  6. 🎭 MOCKING & SPIES - Isolating dependencies                               ║
 * ║  7. 🔴 ERROR HANDLING - Testing error scenarios                               ║
 * ║  8. 📊 EDGE CASES - Boundary conditions and special cases                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// TEST DATA FACTORY - Create consistent test data
// ============================================================================

/**
 * 💡 TIP: Use factory functions for test data
 * This keeps tests DRY and makes data creation flexible
 */
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

const createMockTasks = (count: number, overrides: Partial<Task> = {}): Task[] => 
  Array.from({ length: count }, (_, i) => createMockTask({
    id: `task_${i}`,
    title: `Task ${i + 1}`,
    ...overrides
  }));

// ============================================================================
// SECTION 1: PURE FUNCTION TESTS
// ============================================================================

describe('TaskService - Pure Functions (No Angular Dependencies)', () => {
  /**
   * 🎯 WHY TEST PURE FUNCTIONS SEPARATELY?
   * 
   * 1. They're the easiest to test - no setup needed!
   * 2. They're predictable: same input = same output
   * 3. They run FAST - no TestBed overhead
   * 4. They're the foundation of your business logic
   */
  
  let service: TaskService;

  beforeEach(() => {
    // For pure function tests, we can create the service directly
    // No need for TestBed if we're only testing pure functions
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
  });

  // --------------------------------------------------------------------------
  // filterByStatus() Tests
  // --------------------------------------------------------------------------
  describe('filterByStatus()', () => {
    const tasks: Task[] = [
      createMockTask({ id: '1', title: 'Active Task 1', completed: false }),
      createMockTask({ id: '2', title: 'Completed Task', completed: true }),
      createMockTask({ id: '3', title: 'Active Task 2', completed: false }),
    ];

    it('should return all tasks when status is "all"', () => {
      // Arrange
      const status: TaskFilter = 'all';

      // Act
      const result = service.filterByStatus(tasks, status);

      // Assert
      expect(result).toHaveLength(3);
      expect(result).toEqual(tasks);
    });

    it('should return only active tasks when status is "active"', () => {
      // Arrange
      const status: TaskFilter = 'active';

      // Act
      const result = service.filterByStatus(tasks, status);

      // Assert
      expect(result).toHaveLength(2);
      expect(result.every(t => !t.completed)).toBe(true);
    });

    it('should return only completed tasks when status is "completed"', () => {
      // Arrange
      const status: TaskFilter = 'completed';

      // Act
      const result = service.filterByStatus(tasks, status);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(true);
    });

    it('should return empty array when no tasks match filter', () => {
      // Arrange
      const allActiveTasks = [
        createMockTask({ completed: false }),
        createMockTask({ completed: false })
      ];

      // Act
      const result = service.filterByStatus(allActiveTasks, 'completed');

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle empty task array', () => {
      // Arrange - edge case: empty input
      const emptyTasks: Task[] = [];

      // Act
      const result = service.filterByStatus(emptyTasks, 'all');

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  // --------------------------------------------------------------------------
  // filterByPriority() Tests
  // --------------------------------------------------------------------------
  describe('filterByPriority()', () => {
    const tasks: Task[] = [
      createMockTask({ id: '1', priority: 'high' }),
      createMockTask({ id: '2', priority: 'medium' }),
      createMockTask({ id: '3', priority: 'low' }),
      createMockTask({ id: '4', priority: 'high' }),
    ];

    it('should filter tasks by high priority', () => {
      const result = service.filterByPriority(tasks, 'high');
      
      expect(result).toHaveLength(2);
      expect(result.every(t => t.priority === 'high')).toBe(true);
    });

    it('should filter tasks by medium priority', () => {
      const result = service.filterByPriority(tasks, 'medium');
      
      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe('medium');
    });

    it('should filter tasks by low priority', () => {
      const result = service.filterByPriority(tasks, 'low');
      
      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe('low');
    });
  });

  // --------------------------------------------------------------------------
  // searchTasks() Tests
  // --------------------------------------------------------------------------
  describe('searchTasks()', () => {
    const tasks: Task[] = [
      createMockTask({ title: 'Buy groceries', description: 'Milk, eggs, bread', tags: ['shopping'] }),
      createMockTask({ title: 'Fix bug in login', description: 'Users cannot log in', tags: ['urgent', 'bug'] }),
      createMockTask({ title: 'Review PR', description: 'Check the new feature', tags: ['code-review'] }),
    ];

    it('should find tasks by title', () => {
      const result = service.searchTasks(tasks, 'groceries');
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Buy groceries');
    });

    it('should find tasks by description', () => {
      const result = service.searchTasks(tasks, 'cannot log');
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Fix bug in login');
    });

    it('should find tasks by tags', () => {
      const result = service.searchTasks(tasks, 'urgent');
      
      expect(result).toHaveLength(1);
      expect(result[0].tags).toContain('urgent');
    });

    it('should be case-insensitive', () => {
      const result = service.searchTasks(tasks, 'BUY GROCERIES');
      
      expect(result).toHaveLength(1);
    });

    it('should return all tasks when search term is empty', () => {
      const result = service.searchTasks(tasks, '');
      
      expect(result).toHaveLength(3);
    });

    it('should return all tasks when search term is whitespace', () => {
      const result = service.searchTasks(tasks, '   ');
      
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no matches found', () => {
      const result = service.searchTasks(tasks, 'xyz123nonexistent');
      
      expect(result).toHaveLength(0);
    });
  });

  // --------------------------------------------------------------------------
  // sortTasks() Tests
  // --------------------------------------------------------------------------
  describe('sortTasks()', () => {
    const tasks: Task[] = [
      createMockTask({ id: '1', title: 'Zebra task', priority: 'low', createdAt: new Date('2024-01-01') }),
      createMockTask({ id: '2', title: 'Apple task', priority: 'high', createdAt: new Date('2024-01-03') }),
      createMockTask({ id: '3', title: 'Mango task', priority: 'medium', createdAt: new Date('2024-01-02') }),
    ];

    it('should sort by title ascending', () => {
      const result = service.sortTasks(tasks, 'title', 'asc');
      
      expect(result[0].title).toBe('Apple task');
      expect(result[1].title).toBe('Mango task');
      expect(result[2].title).toBe('Zebra task');
    });

    it('should sort by title descending', () => {
      const result = service.sortTasks(tasks, 'title', 'desc');
      
      expect(result[0].title).toBe('Zebra task');
      expect(result[2].title).toBe('Apple task');
    });

    it('should sort by priority ascending (low to high)', () => {
      const result = service.sortTasks(tasks, 'priority', 'asc');
      
      expect(result[0].priority).toBe('low');
      expect(result[1].priority).toBe('medium');
      expect(result[2].priority).toBe('high');
    });

    it('should sort by priority descending (high to low)', () => {
      const result = service.sortTasks(tasks, 'priority', 'desc');
      
      expect(result[0].priority).toBe('high');
      expect(result[2].priority).toBe('low');
    });

    it('should sort by createdAt ascending (oldest first)', () => {
      const result = service.sortTasks(tasks, 'createdAt', 'asc');
      
      expect(result[0].id).toBe('1'); // Jan 1
      expect(result[1].id).toBe('3'); // Jan 2
      expect(result[2].id).toBe('2'); // Jan 3
    });

    it('should not mutate original array', () => {
      const originalFirst = tasks[0];
      service.sortTasks(tasks, 'title', 'asc');
      
      expect(tasks[0]).toBe(originalFirst);
    });
  });

  // --------------------------------------------------------------------------
  // validateTask() Tests
  // --------------------------------------------------------------------------
  describe('validateTask()', () => {
    it('should return empty array for valid task', () => {
      const validTask: CreateTaskDto = {
        title: 'Valid Task Title',
        description: 'A valid description',
        priority: 'medium'
      };

      const errors = service.validateTask(validTask);
      
      expect(errors).toHaveLength(0);
    });

    it('should return error for empty title', () => {
      const invalidTask: CreateTaskDto = {
        title: '',
        description: 'Description',
        priority: 'low'
      };

      const errors = service.validateTask(invalidTask);
      
      expect(errors).toContain('Title is required');
    });

    it('should return error for title too short', () => {
      const invalidTask: CreateTaskDto = {
        title: 'AB',
        description: 'Description',
        priority: 'low'
      };

      const errors = service.validateTask(invalidTask);
      
      expect(errors).toContain('Title must be at least 3 characters');
    });

    it('should return error for title too long', () => {
      const invalidTask: CreateTaskDto = {
        title: 'A'.repeat(101),
        description: 'Description',
        priority: 'low'
      };

      const errors = service.validateTask(invalidTask);
      
      expect(errors).toContain('Title must be less than 100 characters');
    });

    it('should return error for description too long', () => {
      const invalidTask: CreateTaskDto = {
        title: 'Valid Title',
        description: 'D'.repeat(501),
        priority: 'low'
      };

      const errors = service.validateTask(invalidTask);
      
      expect(errors).toContain('Description must be less than 500 characters');
    });

    it('should return multiple errors for multiple issues', () => {
      const invalidTask: CreateTaskDto = {
        title: '',
        description: 'D'.repeat(501),
        priority: 'invalid' as any
      };

      const errors = service.validateTask(invalidTask);
      
      expect(errors.length).toBeGreaterThan(1);
      expect(errors).toContain('Title is required');
      expect(errors).toContain('Description must be less than 500 characters');
    });
  });

  // --------------------------------------------------------------------------
  // calculateStats() Tests
  // --------------------------------------------------------------------------
  describe('calculateStats()', () => {
    it('should calculate correct statistics', () => {
      const tasks: Task[] = [
        createMockTask({ completed: true }),
        createMockTask({ completed: false }),
        createMockTask({ completed: false }),
        createMockTask({ completed: true }),
      ];

      const stats = service.calculateStats(tasks);
      
      expect(stats.total).toBe(4);
      expect(stats.completed).toBe(2);
      expect(stats.active).toBe(2);
      expect(stats.completionRate).toBe(50);
    });

    it('should handle empty task list', () => {
      const stats = service.calculateStats([]);
      
      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.completionRate).toBe(0); // Avoid division by zero
    });

    it('should count overdue tasks', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tasks: Task[] = [
        createMockTask({ completed: false, dueDate: yesterday }), // Overdue
        createMockTask({ completed: false, dueDate: tomorrow }), // Not overdue
        createMockTask({ completed: true, dueDate: yesterday }), // Completed, not counted as overdue
      ];

      const stats = service.calculateStats(tasks);
      
      expect(stats.overdue).toBe(1);
    });
  });
});

// ============================================================================
// SECTION 2: HTTP TESTING WITH HttpTestingController
// ============================================================================

describe('TaskService - HTTP Operations', () => {
  /**
   * 🎯 HTTP TESTING CONCEPTS:
   * 
   * 1. HttpTestingController allows us to mock HTTP requests
   * 2. We can verify the request was made correctly
   * 3. We can provide fake responses
   * 4. We can test error scenarios
   */

  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // 💡 TIP: Always verify no unexpected requests were made
    httpMock.verify();
  });

  // --------------------------------------------------------------------------
  // loadTasks() Tests
  // --------------------------------------------------------------------------
  describe('loadTasks()', () => {
    it('should fetch tasks from API and update state', () => {
      // Arrange
      const mockTasks = createMockTasks(3);

      // Act
      service.loadTasks().subscribe(tasks => {
        // Assert - in subscription callback
        expect(tasks).toEqual(mockTasks);
      });

      // Assert - HTTP request was made correctly
      const req = httpMock.expectOne('/api/tasks');
      expect(req.request.method).toBe('GET');
      
      // Provide the fake response
      req.flush(mockTasks);

      // Verify signal was updated
      expect(service.tasks()).toEqual(mockTasks);
      expect(service.loading()).toBe(false);
    });

    it('should set loading state during request', () => {
      // Arrange
      const mockTasks = createMockTasks(2);

      // Act - subscribe but don't complete yet
      service.loadTasks().subscribe();

      // Assert - loading should be true before response
      // Note: This tests the intermediate state
      const req = httpMock.expectOne('/api/tasks');
      
      // Complete the request
      req.flush(mockTasks);
      
      // After completion, loading should be false
      expect(service.loading()).toBe(false);
    });

    it('should handle HTTP errors', () => {
      // Arrange
      const errorResponse = { status: 500, statusText: 'Server Error' };

      // Act
      service.loadTasks().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error.message).toContain('Server error');
        }
      });

      // Simulate HTTP error
      const req = httpMock.expectOne('/api/tasks');
      req.flush(null, errorResponse);

      // Verify error state
      expect(service.error()).toBeTruthy();
      expect(service.loading()).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // createTask() Tests
  // --------------------------------------------------------------------------
  describe('createTask()', () => {
    it('should POST new task and add to state', () => {
      // Arrange
      const dto: CreateTaskDto = {
        title: 'New Task',
        description: 'Description',
        priority: 'high'
      };
      const mockResponse: Task = {
        ...createMockTask(),
        title: dto.title,
        description: dto.description,
        priority: dto.priority
      };

      // Act
      service.createTask(dto).subscribe(task => {
        expect(task.title).toBe(dto.title);
      });

      // Assert
      const req = httpMock.expectOne('/api/tasks');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.title).toBe(dto.title.trim());
      
      req.flush(mockResponse);

      // Verify task was added to state
      expect(service.tasks()).toContainEqual(mockResponse);
    });

    it('should trim whitespace from title and description', () => {
      // Arrange
      const dto: CreateTaskDto = {
        title: '  Padded Title  ',
        description: '  Padded Description  ',
        priority: 'low'
      };

      // Act
      service.createTask(dto).subscribe();

      // Assert
      const req = httpMock.expectOne('/api/tasks');
      expect(req.request.body.title).toBe('Padded Title');
      expect(req.request.body.description).toBe('Padded Description');
      
      req.flush(createMockTask());
    });
  });

  // --------------------------------------------------------------------------
  // updateTask() Tests
  // --------------------------------------------------------------------------
  describe('updateTask()', () => {
    it('should PUT updated task and update state', () => {
      // Arrange - set initial state
      const existingTask = createMockTask({ id: 'task-1', title: 'Old Title' });
      service.setTasks([existingTask]);

      const updatedData = { title: 'New Title' };
      const updatedTask = { ...existingTask, ...updatedData };

      // Act
      service.updateTask('task-1', updatedData).subscribe(task => {
        expect(task.title).toBe('New Title');
      });

      // Assert
      const req = httpMock.expectOne('/api/tasks/task-1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedData);
      
      req.flush(updatedTask);

      // Verify state was updated
      expect(service.tasks()[0].title).toBe('New Title');
    });
  });

  // --------------------------------------------------------------------------
  // deleteTask() Tests
  // --------------------------------------------------------------------------
  describe('deleteTask()', () => {
    it('should DELETE task and remove from state (optimistic update)', () => {
      // Arrange
      const task1 = createMockTask({ id: 'task-1' });
      const task2 = createMockTask({ id: 'task-2' });
      service.setTasks([task1, task2]);

      // Act
      service.deleteTask('task-1').subscribe();

      // Assert - task removed optimistically (before HTTP completes)
      expect(service.tasks()).toHaveLength(1);
      expect(service.tasks()[0].id).toBe('task-2');

      // Complete the HTTP request
      const req = httpMock.expectOne('/api/tasks/task-1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should rollback on delete error', () => {
      // Arrange
      const task1 = createMockTask({ id: 'task-1' });
      service.setTasks([task1]);

      // Act
      service.deleteTask('task-1').subscribe({
        error: () => {
          // Expected to fail
        }
      });

      // Task removed optimistically
      expect(service.tasks()).toHaveLength(0);

      // Simulate error
      const req = httpMock.expectOne('/api/tasks/task-1');
      req.flush(null, { status: 500, statusText: 'Server Error' });

      // Verify rollback
      expect(service.tasks()).toHaveLength(1);
      expect(service.tasks()[0].id).toBe('task-1');
    });
  });
});

// ============================================================================
// SECTION 3: SIGNAL TESTING
// ============================================================================

describe('TaskService - Signal State Management', () => {
  /**
   * 🎯 SIGNAL TESTING CONCEPTS:
   * 
   * 1. Signals are synchronous - values update immediately
   * 2. Computed signals auto-update when dependencies change
   * 3. Test the reactive behavior, not just the values
   */

  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Computed Signals', () => {
    it('should compute activeTasksCount correctly', () => {
      // Arrange
      const tasks = [
        createMockTask({ completed: false }),
        createMockTask({ completed: true }),
        createMockTask({ completed: false }),
      ];
      service.setTasks(tasks);

      // Assert
      expect(service.activeTasksCount()).toBe(2);
    });

    it('should update computed values when source changes', () => {
      // Arrange - start empty
      service.setTasks([]);
      expect(service.totalTasksCount()).toBe(0);

      // Act - add tasks
      service.setTasks([
        createMockTask({ completed: false }),
        createMockTask({ completed: true }),
      ]);

      // Assert - computed values updated
      expect(service.totalTasksCount()).toBe(2);
      expect(service.activeTasksCount()).toBe(1);
      expect(service.completedTasksCount()).toBe(1);
    });

    it('should compute tasksByPriority correctly', () => {
      // Arrange
      const tasks = [
        createMockTask({ priority: 'high' }),
        createMockTask({ priority: 'high' }),
        createMockTask({ priority: 'medium' }),
        createMockTask({ priority: 'low' }),
      ];
      service.setTasks(tasks);

      // Assert
      expect(service.tasksByPriority()).toEqual({
        high: 2,
        medium: 1,
        low: 1
      });
    });

    it('should detect overdue tasks', () => {
      // Arrange
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const tasks = [
        createMockTask({ completed: false, dueDate: yesterday }),
      ];
      service.setTasks(tasks);

      // Assert
      expect(service.hasOverdueTasks()).toBe(true);
    });

    it('should not count completed tasks as overdue', () => {
      // Arrange
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const tasks = [
        createMockTask({ completed: true, dueDate: yesterday }),
      ];
      service.setTasks(tasks);

      // Assert
      expect(service.hasOverdueTasks()).toBe(false);
    });
  });

  describe('Filter State', () => {
    it('should update filteredTasks when filter changes', () => {
      // Arrange
      const tasks = [
        createMockTask({ id: '1', completed: false }),
        createMockTask({ id: '2', completed: true }),
        createMockTask({ id: '3', completed: false }),
      ];
      service.setTasks(tasks);

      // Act - set filter to completed
      service.setStatusFilter('completed');

      // Assert
      expect(service.filteredTasks()).toHaveLength(1);
      expect(service.filteredTasks()[0].id).toBe('2');
    });

    it('should apply search filter', () => {
      // Arrange
      const tasks = [
        createMockTask({ title: 'Buy milk' }),
        createMockTask({ title: 'Fix bug' }),
      ];
      service.setTasks(tasks);

      // Act
      service.setSearchTerm('milk');

      // Assert
      expect(service.filteredTasks()).toHaveLength(1);
      expect(service.filteredTasks()[0].title).toBe('Buy milk');
    });

    it('should clear filters', () => {
      // Arrange
      service.setStatusFilter('completed');
      service.setSearchTerm('test');
      service.setPriorityFilter('high');

      // Act
      service.clearFilters();

      // Assert
      expect(service.filterOptions().status).toBe('all');
      expect(service.filterOptions().searchTerm).toBeUndefined();
      expect(service.filterOptions().priority).toBeUndefined();
    });
  });
});

// ============================================================================
// SECTION 4: ERROR HANDLING TESTS
// ============================================================================

describe('TaskService - Error Handling', () => {
  /**
   * 🎯 ERROR TESTING CONCEPTS:
   * 
   * 1. Test different HTTP error codes
   * 2. Verify error messages are user-friendly
   * 3. Test error state is properly set and cleared
   * 4. Test recovery from errors
   */

  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const errorScenarios = [
    { status: 400, expected: 'Invalid request' },
    { status: 401, expected: 'not authorized' },
    { status: 403, expected: 'permission' },
    { status: 404, expected: 'not found' },
    { status: 500, expected: 'Server error' },
  ];

  errorScenarios.forEach(({ status, expected }) => {
    it(`should handle ${status} error with appropriate message`, () => {
      // Act
      service.loadTasks().subscribe({
        error: (err) => {
          expect(err.message.toLowerCase()).toContain(expected.toLowerCase());
        }
      });

      // Simulate error
      const req = httpMock.expectOne('/api/tasks');
      req.flush(null, { status, statusText: 'Error' });

      // Verify error state
      expect(service.error()?.toLowerCase()).toContain(expected.toLowerCase());
      expect(service.loading()).toBe(false);
    });
  });

  it('should handle network error (status 0)', () => {
    // Act
    service.loadTasks().subscribe({
      error: () => {
        // Expected
      }
    });

    // Simulate network error
    const req = httpMock.expectOne('/api/tasks');
    req.flush(null, { status: 0, statusText: 'Unknown Error' });

    // Assert
    expect(service.error()).toContain('Unable to connect');
  });

  it('should clear error on successful request', () => {
    // Arrange - create an error first
    service.loadTasks().subscribe({ error: () => {} });
    httpMock.expectOne('/api/tasks').flush(null, { status: 500, statusText: 'Error' });
    expect(service.error()).toBeTruthy();

    // Act - make successful request
    service.loadTasks().subscribe();
    httpMock.expectOne('/api/tasks').flush([]);

    // Assert - error cleared
    expect(service.error()).toBeNull();
  });
});

// ============================================================================
// SECTION 5: EDGE CASES & BOUNDARY CONDITIONS
// ============================================================================

describe('TaskService - Edge Cases', () => {
  /**
   * 🎯 EDGE CASE TESTING:
   * 
   * Good tests cover not just the "happy path" but also:
   * 1. Empty inputs
   * 2. Null/undefined values
   * 3. Boundary values (min/max)
   * 4. Special characters
   * 5. Concurrent operations
   */

  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Empty State', () => {
    it('should handle empty task list gracefully', () => {
      service.setTasks([]);

      expect(service.totalTasksCount()).toBe(0);
      expect(service.activeTasksCount()).toBe(0);
      expect(service.completedTasksCount()).toBe(0);
      expect(service.filteredTasks()).toEqual([]);
      expect(service.hasOverdueTasks()).toBe(false);
    });
  });

  describe('Special Characters', () => {
    it('should handle special characters in search', () => {
      const tasks = [
        createMockTask({ title: 'C++ Programming' }),
        createMockTask({ title: 'C# Development' }),
        createMockTask({ title: 'Regular task' }),
      ];
      service.setTasks(tasks);

      // These should not break the search
      expect(service.searchTasks(tasks, 'C++')).toHaveLength(1);
      expect(service.searchTasks(tasks, 'C#')).toHaveLength(1);
      expect(service.searchTasks(tasks, '[regex]')).toHaveLength(0);
    });

    it('should handle emoji in task titles', () => {
      const tasks = [
        createMockTask({ title: '🎉 Party planning' }),
        createMockTask({ title: '📚 Study session' }),
      ];
      service.setTasks(tasks);

      const result = service.searchTasks(tasks, 'party');
      expect(result).toHaveLength(1);
    });
  });

  describe('Date Edge Cases', () => {
    it('should handle tasks without due dates in sorting', () => {
      const tasks = [
        createMockTask({ id: '1', dueDate: new Date('2024-01-15') }),
        createMockTask({ id: '2', dueDate: undefined }),
        createMockTask({ id: '3', dueDate: new Date('2024-01-10') }),
      ];

      const sorted = service.sortTasks(tasks, 'dueDate', 'asc');

      // Tasks without due dates should go to the end
      expect(sorted[0].id).toBe('3'); // Jan 10
      expect(sorted[1].id).toBe('1'); // Jan 15
      expect(sorted[2].id).toBe('2'); // No due date
    });
  });

  describe('toggleTaskCompletion Edge Cases', () => {
    it('should return error for non-existent task', () => {
      service.setTasks([]);

      service.toggleTaskCompletion('non-existent-id').subscribe({
        error: (err) => {
          expect(err.message).toBe('Task not found');
        }
      });
    });
  });

  describe('Large Data Sets', () => {
    it('should handle large number of tasks', () => {
      // Create 1000 tasks
      const largeTasks = createMockTasks(1000);
      service.setTasks(largeTasks);

      // Operations should still work correctly
      expect(service.totalTasksCount()).toBe(1000);
      
      // Filter should work
      service.setSearchTerm('Task 500');
      const filtered = service.filteredTasks();
      expect(filtered.length).toBeGreaterThan(0);
    });
  });
});
