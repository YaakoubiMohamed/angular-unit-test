import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    // Arrange: Configure the testing module
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    // Arrange
    const fixture = TestBed.createComponent(App);
    
    // Act
    const app = fixture.componentInstance;
    
    // Assert
    expect(app).toBeTruthy();
  });

  it('should render router outlet', () => {
    // Arrange
    const fixture = TestBed.createComponent(App);
    
    // Act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Assert
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should render navigation with proper accessibility attributes', () => {
    // Arrange
    const fixture = TestBed.createComponent(App);
    
    // Act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const nav = compiled.querySelector('nav');
    
    // Assert
    expect(nav).toBeTruthy();
    expect(nav?.getAttribute('role')).toBe('navigation');
    expect(nav?.getAttribute('aria-label')).toBe('Navigation principale');
  });

  it('should render all navigation links', () => {
    // Arrange
    const fixture = TestBed.createComponent(App);
    const expectedLinks = ['Accueil', 'Concepts', 'Services', 'Composants', 'Async', 'Mocking', 'Exemple Pratique'];
    
    // Act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('nav a');
    
    // Assert
    expect(navLinks.length).toBe(expectedLinks.length);
  });

  it('should have main content with proper landmark role', () => {
    // Arrange
    const fixture = TestBed.createComponent(App);
    
    // Act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const main = compiled.querySelector('main');
    
    // Assert
    expect(main).toBeTruthy();
    expect(main?.getAttribute('role')).toBe('main');
    expect(main?.id).toBe('main-content');
  });

  it('should display footer with Angular version', () => {
    // Arrange
    const fixture = TestBed.createComponent(App);
    
    // Act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const footer = compiled.querySelector('.main-footer');
    
    // Assert
    expect(footer).toBeTruthy();
    expect(footer?.textContent).toContain('Angular');
    expect(footer?.textContent).toContain('Vitest');
  });

  it('should have skip link for keyboard accessibility', () => {
    // Arrange
    const fixture = TestBed.createComponent(App);
    
    // Act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const skipLink = compiled.querySelector('.skip-link');
    
    // Assert
    expect(skipLink).toBeTruthy();
    expect(skipLink?.getAttribute('href')).toBe('#main-content');
  });
});
