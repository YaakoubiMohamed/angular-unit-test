# 🚀 Migration Summary: Karma to Vitest

> **Date:** January 22, 2026  
> **Project:** guard  
> **Angular Version:** 20.3.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Why Migrate to Vitest?](#why-migrate-to-vitest)
3. [Changes Made](#changes-made)
4. [New Files Created](#new-files-created)
5. [Files Modified](#files-modified)
6. [Removed Dependencies](#removed-dependencies)
7. [Added Dependencies](#added-dependencies)
8. [New NPM Scripts](#new-npm-scripts)
9. [Running Tests](#running-tests)
10. [Configuration Details](#configuration-details)
11. [Migration Notes](#migration-notes)
12. [UI Component Testing Examples](#ui-component-testing-examples)
13. [Troubleshooting](#troubleshooting)

> 📚 **Looking for a step-by-step tutorial?**  
> See [tutorial-tests-unitaires-vitest.md](tutorial-tests-unitaires-vitest.md) for a progressive learning guide with exercises and quizzes!

---

## Overview

This document summarizes the migration from **Karma + Jasmine** testing framework to **Vitest** for the Angular `guard` project. Vitest is a next-generation testing framework powered by Vite, offering faster test execution, better DX, and native ESM support.

---

## Why Migrate to Vitest?

| Feature | Karma + Jasmine | Vitest |
|---------|-----------------|--------|
| **Speed** | Slower (browser-based) | ⚡ Faster (Node.js based) |
| **Hot Module Replacement** | ❌ No | ✅ Yes |
| **Native ESM Support** | Limited | ✅ Full support |
| **Watch Mode** | Basic | ✅ Smart & Fast |
| **Built-in UI** | ❌ No | ✅ `vitest --ui` |
| **TypeScript Support** | Requires setup | ✅ Out of the box |
| **Coverage** | Requires karma-coverage | ✅ Built-in (v8/istanbul) |
| **Parallel Execution** | Limited | ✅ Full support |
| **Snapshot Testing** | ❌ No | ✅ Yes |
| **Configuration** | Complex | ✅ Simple |

---

## Changes Made

### Summary

- ✅ Removed Karma and Jasmine dependencies
- ✅ Added Vitest and `@analogjs/vitest-angular` for Angular support
- ✅ Created Vitest configuration file
- ✅ Created test setup file for Angular testing environment
- ✅ Updated TypeScript configuration for spec files
- ✅ Removed Karma test configuration from `angular.json`
- ✅ Updated npm scripts

---

## New Files Created

### 1. `vitest.config.ts`

The main Vitest configuration file that sets up the testing environment:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/test-setup.ts', 'src/main.ts'],
    },
  },
});
```

### 2. `src/test-setup.ts`

The test setup file that initializes the Angular testing environment:

```typescript
import '@analogjs/vitest-angular/setup-zone';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
```

---

## Files Modified

### 1. `package.json`

**Changes:**
- Updated `test` script to use Vitest
- Added new test scripts (`test:watch`, `test:ui`, `test:coverage`)
- Removed Karma/Jasmine dependencies
- Added Vitest dependencies

### 2. `tsconfig.spec.json`

**Changes:**
- Changed `types` from `["jasmine"]` to `["vitest/globals", "node"]`
- Updated `include` to explicitly include spec files

**Before:**
```json
{
  "compilerOptions": {
    "types": ["jasmine"]
  },
  "include": ["src/**/*.ts"]
}
```

**After:**
```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "node"]
  },
  "include": ["src/**/*.ts", "src/**/*.spec.ts"]
}
```

### 3. `angular.json`

**Changes:**
- Removed the entire `test` architect configuration (Karma builder is no longer needed)

---

## Removed Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/jasmine` | ~5.1.0 | Jasmine type definitions |
| `jasmine-core` | ~5.9.0 | Jasmine testing framework |
| `karma` | ~6.4.0 | Karma test runner |
| `karma-chrome-launcher` | ~3.2.0 | Chrome browser launcher |
| `karma-coverage` | ~2.2.0 | Code coverage reporter |
| `karma-jasmine` | ~5.1.0 | Jasmine adapter for Karma |
| `karma-jasmine-html-reporter` | ~2.1.0 | HTML reporter |

---

## Added Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vitest` | ^3.1.1 | Vitest testing framework |
| `@analogjs/vitest-angular` | ^1.22.0 | Angular integration for Vitest |
| `@vitest/coverage-v8` | ^3.1.1 | V8 coverage provider |
| `@vitest/ui` | ^3.1.1 | Vitest UI for interactive testing |
| `jsdom` | ^26.0.0 | DOM environment for Node.js |
| `@angular/platform-browser-dynamic` | ^20.3.0 | Required for Angular test environment |

---

## New NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `vitest` | Run tests once in CI mode |
| `test:watch` | `vitest --watch` | Run tests in watch mode |
| `test:ui` | `vitest --ui` | Open Vitest UI in browser |
| `test:coverage` | `vitest run --coverage` | Run tests with coverage report |

---

## Running Tests

### Basic Test Run
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Interactive UI
```bash
npm run test:ui
```
This opens a beautiful web interface at `http://localhost:51204/__vitest__/`

### Coverage Report
```bash
npm run test:coverage
```
Coverage report will be generated in the `coverage/` directory.

---

## Configuration Details

### Vitest Configuration Options

| Option | Value | Description |
|--------|-------|-------------|
| `globals` | `true` | Enables global test functions (`describe`, `it`, `expect`) |
| `environment` | `jsdom` | Simulates browser DOM in Node.js |
| `setupFiles` | `['src/test-setup.ts']` | Files to run before each test file |
| `include` | `['src/**/*.spec.ts']` | Test file patterns to include |

### Coverage Configuration

| Option | Value | Description |
|--------|-------|-------------|
| `provider` | `v8` | Uses V8's built-in coverage |
| `reporter` | `['text', 'json', 'html']` | Output formats |
| `include` | `['src/**/*.ts']` | Files to measure coverage for |
| `exclude` | Spec files, setup, main.ts | Files to exclude from coverage |

---

## Migration Notes

### ✅ No Test File Changes Required

The good news is that **your existing test files require no modifications**! Both Jasmine and Vitest use the same syntax for:

- `describe()` - Test suites
- `it()` / `test()` - Test cases
- `expect()` - Assertions
- `beforeEach()` / `afterEach()` - Setup/teardown
- `beforeAll()` / `afterAll()` - Suite-level setup/teardown

### Jasmine vs Vitest Syntax Compatibility

| Feature | Jasmine | Vitest | Compatible? |
|---------|---------|--------|-------------|
| `describe()` | ✅ | ✅ | ✅ Yes |
| `it()` | ✅ | ✅ | ✅ Yes |
| `expect().toBe()` | ✅ | ✅ | ✅ Yes |
| `expect().toEqual()` | ✅ | ✅ | ✅ Yes |
| `expect().toBeTruthy()` | ✅ | ✅ | ✅ Yes |
| `expect().toThrow()` | ✅ | ✅ | ✅ Yes |
| `expect().toContain()` | ✅ | ✅ | ✅ Yes |
| `expect().toBeCloseTo()` | ✅ | ✅ | ✅ Yes |
| `beforeEach()` | ✅ | ✅ | ✅ Yes |
| `afterEach()` | ✅ | ✅ | ✅ Yes |
| Spies/Mocks | `spyOn()` | `vi.spyOn()` | ⚠️ Minor change |

### If Using Jasmine Spies

If your tests use `spyOn()`, you may need to update them:

**Jasmine:**
```typescript
spyOn(service, 'method').and.returnValue('value');
```

**Vitest:**
```typescript
vi.spyOn(service, 'method').mockReturnValue('value');
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot find module 'vitest/globals'"

**Solution:** Make sure to install dependencies first:
```bash
npm install
```

#### 2. Tests not found

**Solution:** Ensure your test files match the pattern `**/*.spec.ts` and are located in the `src/` directory.

#### 3. Angular components not rendering

**Solution:** Verify that `src/test-setup.ts` is properly configured and the `setupFiles` option in `vitest.config.ts` points to it.

#### 4. Zone.js errors

**Solution:** The `@analogjs/vitest-angular/setup-zone` import in `test-setup.ts` handles Zone.js setup. Ensure it's the first import.

#### 5. Coverage not working

**Solution:** Make sure `@vitest/coverage-v8` is installed:
```bash
npm install -D @vitest/coverage-v8
```

---

## Next Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run tests to verify migration:**
   ```bash
   npm test
   ```

3. **Optional: Delete old Karma files if they exist:**
   - `karma.conf.js`
   - `src/test.ts`

4. **Update CI/CD pipelines** if they reference `ng test`

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [AnalogJS Vitest Angular](https://analogjs.org/docs/features/testing/vitest)
- [Migrating from Jest/Jasmine](https://vitest.dev/guide/migration.html)

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Test Runner | Karma | Vitest |
| Assertion Library | Jasmine | Vitest (compatible) |
| Angular Integration | @angular/build:karma | @analogjs/vitest-angular |
| Speed | ~5-10s startup | ~1-2s startup |
| Watch Mode | Basic | Smart & instant |
| UI | None | Beautiful web UI |

✅ **Migration Complete!** Your Angular project is now using Vitest for testing.

---

## Migration Verification Results

The migration was verified successfully with all tests passing:

```
 ✓ src/app/services/discount.service.spec.ts (43 tests) 61ms
 ✓ src/app/services/calculator.service.spec.ts (33 tests) 54ms
 ✓ src/app/services/temperature.service.spec.ts (50 tests) 65ms
 ✓ src/app/app.spec.ts (2 tests) 214ms

 Test Files  4 passed (4)
      Tests  128 passed (128)
   Duration  5.02s
```

**All 128 tests passed successfully after migration!**

---

## UI Component Testing Examples

This project includes comprehensive UI component tests demonstrating real-world Angular testing with Vitest.

### 📁 Example Components

#### 1. Counter Component
- **Location**: `src/app/components/counter/`
- **Tests**: 18 test cases
- **Features Tested**:
  - Button click interactions
  - Disabled button states
  - Angular signals & computed values
  - Input event handling
  - Status message updates
  - CSS class bindings

#### 2. Login Form Component
- **Location**: `src/app/components/login-form/`
- **Tests**: 22 test cases
- **Features Tested**:
  - Form input bindings with ngModel
  - Email/password validation
  - Error message display
  - Async form submission
  - Loading states
  - Output event emission
  - Vitest-specific mocking (vi.fn, vi.spyOn)

---

### 🧪 Key Testing Patterns

#### 1. Button Click Testing
```typescript
it('should increment counter when button is clicked', () => {
  const button = fixture.debugElement.query(By.css('[data-testid="increment-btn"]'));
  
  button.nativeElement.click();
  fixture.detectChanges();
  
  expect(component.count()).toBe(1);
});
```

#### 2. Input Value Testing
```typescript
it('should update value when user types', fakeAsync(() => {
  const input = fixture.debugElement.query(By.css('[data-testid="email-input"]'));
  
  input.nativeElement.value = 'test@example.com';
  input.nativeElement.dispatchEvent(new Event('input'));
  tick();
  fixture.detectChanges();
  
  expect(component.email).toBe('test@example.com');
}));
```

#### 3. Disabled State Testing
```typescript
it('should disable button when counter is 0', () => {
  const button = fixture.debugElement.query(By.css('[data-testid="decrement-btn"]'));
  expect(button.nativeElement.disabled).toBe(true);
});
```

#### 4. Async Operations with fakeAsync
```typescript
it('should show loading state during submission', fakeAsync(() => {
  component.email = 'test@example.com';
  component.password = 'validpassword';
  
  component.onSubmit();
  fixture.detectChanges();
  
  expect(component.isLoading()).toBe(true);
  
  tick(1000); // Fast-forward 1 second
  fixture.detectChanges();
  
  expect(component.isLoading()).toBe(false);
  expect(component.successMessage()).toContain('successful');
}));
```

#### 5. Vitest Mocking with vi.fn()
```typescript
it('should use vi.fn() for mocking', () => {
  const mockFn = vi.fn().mockReturnValue('mocked');
  
  const result = mockFn('test');
  
  expect(mockFn).toHaveBeenCalledWith('test');
  expect(result).toBe('mocked');
});
```

#### 6. Spying on Methods with vi.spyOn()
```typescript
it('should spy on component methods', () => {
  const spy = vi.spyOn(component, 'validateEmail');
  
  component.validateEmail();
  
  expect(spy).toHaveBeenCalled();
});
```

#### 7. Timer Mocking with vi.useFakeTimers()
```typescript
it('should mock timers', async () => {
  vi.useFakeTimers();
  
  const promise = component.onSubmit();
  vi.advanceTimersByTime(1000);
  await promise;
  
  expect(component.successMessage()).toContain('successful');
  
  vi.useRealTimers();
});
```

#### 8. Testing Output Events
```typescript
it('should emit event on success', fakeAsync(() => {
  let emittedValue: any = null;
  component.loginSuccess.subscribe(value => {
    emittedValue = value;
  });
  
  component.email = 'test@example.com';
  component.password = 'validpassword';
  component.onSubmit();
  tick(1000);
  
  expect(emittedValue).toEqual({
    email: 'test@example.com',
    password: 'validpassword'
  });
}));
```

---

### 🏷️ Best Practices

1. **Use `data-testid` attributes** for selecting elements instead of CSS classes
2. **Always call `fixture.detectChanges()`** after component changes
3. **Use `fakeAsync` + `tick`** for testing async operations
4. **Group related tests** with `describe` blocks
5. **Test user interactions**, not implementation details
6. **Use `By.css()`** from `@angular/platform-browser` for queries
