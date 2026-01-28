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
  { path: '**', redirectTo: '' }
];
