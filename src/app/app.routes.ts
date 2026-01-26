import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ConceptsComponent } from './pages/concepts/concepts.component';
import { ServiceTestingComponent } from './pages/services/service-testing.component';
import { ComponentTestingComponent } from './pages/components/component-testing.component';
import { AsyncTestingComponent } from './pages/async/async-testing.component';
import { MockingTutorialComponent } from './pages/mocking/mocking-tutorial.component';
import { PlaygroundComponent } from './pages/playground/playground.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'concepts', component: ConceptsComponent },
  { path: 'services', component: ServiceTestingComponent },
  { path: 'components', component: ComponentTestingComponent },
  { path: 'async', component: AsyncTestingComponent },
  { path: 'mocking', component: MockingTutorialComponent },
  { path: 'playground', component: PlaygroundComponent },
  { path: '**', redirectTo: '' }
];
