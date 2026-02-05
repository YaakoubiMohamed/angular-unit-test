/**
 * Task Model
 * Represents a single task in our Mini Task Manager
 */

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
  tags?: string[];
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags?: string[];
}

export type TaskFilter = 'all' | 'active' | 'completed';
export type TaskSortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface TaskFilterOptions {
  status: TaskFilter;
  priority?: 'low' | 'medium' | 'high';
  searchTerm?: string;
  sortBy: TaskSortBy;
  sortOrder: SortOrder;
}
