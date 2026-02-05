import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    title: 'Accueil - Tests Unitaires Angular'
  },
  { 
    path: 'concepts', 
    loadComponent: () => import('./pages/concepts/concepts.component').then(m => m.ConceptsComponent),
    title: 'Concepts - Tests Unitaires Angular'
  },
  { 
    path: 'services', 
    loadComponent: () => import('./pages/services/service-testing.component').then(m => m.ServiceTestingComponent),
    title: 'Tests de Services - Tests Unitaires Angular'
  },
  { 
    path: 'components', 
    loadComponent: () => import('./pages/components/component-testing.component').then(m => m.ComponentTestingComponent),
    title: 'Tests de Composants - Tests Unitaires Angular'
  },
  { 
    path: 'async', 
    loadComponent: () => import('./pages/async/async-testing.component').then(m => m.AsyncTestingComponent),
    title: 'Tests Asynchrones - Tests Unitaires Angular'
  },
  { 
    path: 'mocking', 
    loadComponent: () => import('./pages/mocking/mocking-tutorial.component').then(m => m.MockingTutorialComponent),
    title: 'Mocking - Tests Unitaires Angular'
  },
  { 
    path: 'playground', 
    loadComponent: () => import('./pages/playground/playground.component').then(m => m.PlaygroundComponent),
    title: 'Playground - Tests Unitaires Angular'
  },
  // Mini Task Manager Tutorial
  {
    path: 'tutorial',
    children: [
      {
        path: '',
        redirectTo: 'theory',
        pathMatch: 'full'
      },
      {
        path: 'theory',
        loadComponent: () => import('./features/task-manager/pages/theory/task-manager-theory.component').then(m => m.TaskManagerTheoryComponent),
        title: 'Theory - Task Manager Tutorial'
      },
      {
        path: 'practical',
        loadComponent: () => import('./features/task-manager/pages/practical/task-manager-practical.component').then(m => m.TaskManagerPracticalComponent),
        title: 'Practical - Task Manager Tutorial'
      },
      {
        path: 'tips',
        loadComponent: () => import('./features/task-manager/pages/tips/task-manager-tips.component').then(m => m.TaskManagerTipsComponent),
        title: 'Tips & Best Practices - Task Manager Tutorial'
      },
      {
        path: 'demo',
        loadComponent: () => import('./features/task-manager/task-manager.component').then(m => m.TaskManagerComponent),
        title: 'Demo - Task Manager Tutorial'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
