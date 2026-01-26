/**
 * Browser-based testing utilities
 * Provides expect() and test running capabilities for interactive tutorials
 */

export interface AssertionResult {
  passed: boolean;
  message: string;
  expected: unknown;
  actual: unknown;
}

export interface Expectation<T> {
  toBe(expected: T): AssertionResult;
  toEqual(expected: T): AssertionResult;
  toBeCloseTo(expected: number, precision?: number): AssertionResult;
  toThrow(message?: string): AssertionResult;
  toContain(item: unknown): AssertionResult;
  toBeTruthy(): AssertionResult;
  toBeFalsy(): AssertionResult;
  toBeNull(): AssertionResult;
  toBeUndefined(): AssertionResult;
  toBeDefined(): AssertionResult;
  toHaveLength(length: number): AssertionResult;
  toBeGreaterThan(expected: number): AssertionResult;
  toBeLessThan(expected: number): AssertionResult;
  toMatch(pattern: RegExp | string): AssertionResult;
  not: Expectation<T>;
}

export interface TestResult {
  name: string;
  results: AssertionResult[];
  passed: boolean;
  duration: number;
}

/**
 * Browser-based expect() function that mimics Vitest/Jest behavior
 */
export function expect<T>(actual: T | (() => T)): Expectation<T> {
  let negated = false;

  const check = (
    condition: boolean, 
    message: string, 
    expected: unknown, 
    actualValue: unknown
  ): AssertionResult => {
    const passed = negated ? !condition : condition;
    return {
      passed,
      message: passed ? 'Passed' : `Failed: ${message}`,
      expected: negated ? `not ${formatValue(expected)}` : expected,
      actual: actualValue
    };
  };

  const expectation: Expectation<T> = {
    toBe(expected: T) {
      return check(
        actual === expected, 
        `Expected ${formatValue(actual)} to be ${formatValue(expected)}`, 
        expected, 
        actual
      );
    },

    toEqual(expected: T) {
      const isEqual = JSON.stringify(actual) === JSON.stringify(expected);
      return check(isEqual, `Expected objects to be deeply equal`, expected, actual);
    },

    toBeCloseTo(expected: number, precision = 2) {
      const diff = Math.abs((actual as unknown as number) - expected);
      const isClose = diff < Math.pow(10, -precision) / 2;
      return check(isClose, `Expected ${actual} to be close to ${expected}`, expected, actual);
    },

    toThrow(message?: string) {
      if (typeof actual !== 'function') {
        return { 
          passed: false, 
          message: 'Expected a function to test for thrown error', 
          expected: 'function', 
          actual: typeof actual 
        };
      }
      try {
        (actual as () => unknown)();
        return check(false, 'Expected function to throw an error', 'Error thrown', 'No error thrown');
      } catch (e) {
        if (message) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          const matches = errorMsg.includes(message);
          return check(matches, `Expected error message to contain "${message}"`, message, errorMsg);
        }
        return check(true, '', 'Error thrown', e instanceof Error ? e.message : String(e));
      }
    },

    toContain(item: unknown) {
      const arr = actual as unknown[];
      if (typeof actual === 'string') {
        const contains = (actual as string).includes(item as string);
        return check(contains, `Expected string to contain "${item}"`, item, actual);
      }
      const contains = Array.isArray(arr) && arr.includes(item);
      return check(contains, `Expected array to contain ${formatValue(item)}`, item, actual);
    },

    toBeTruthy() {
      return check(!!actual, `Expected ${formatValue(actual)} to be truthy`, 'truthy value', actual);
    },

    toBeFalsy() {
      return check(!actual, `Expected ${formatValue(actual)} to be falsy`, 'falsy value', actual);
    },

    toBeNull() {
      return check(actual === null, `Expected ${formatValue(actual)} to be null`, null, actual);
    },

    toBeUndefined() {
      return check(actual === undefined, `Expected ${formatValue(actual)} to be undefined`, undefined, actual);
    },

    toBeDefined() {
      return check(actual !== undefined, `Expected value to be defined`, 'defined', actual);
    },

    toHaveLength(length: number) {
      const actualLength = (actual as unknown[] | string)?.length;
      return check(
        actualLength === length, 
        `Expected length ${length}, got ${actualLength}`, 
        length, 
        actualLength
      );
    },

    toBeGreaterThan(expected: number) {
      const num = actual as unknown as number;
      return check(num > expected, `Expected ${num} to be greater than ${expected}`, `> ${expected}`, num);
    },

    toBeLessThan(expected: number) {
      const num = actual as unknown as number;
      return check(num < expected, `Expected ${num} to be less than ${expected}`, `< ${expected}`, num);
    },

    toMatch(pattern: RegExp | string) {
      const str = actual as unknown as string;
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      const matches = regex.test(str);
      return check(matches, `Expected "${str}" to match ${pattern}`, pattern.toString(), str);
    },

    get not() {
      negated = true;
      return expectation;
    }
  };

  return expectation;
}

/**
 * Format a value for display
 */
export function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'function') return '[Function]';
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * Run a single test and return the result
 */
export function runTest(
  name: string, 
  testFn: () => AssertionResult | AssertionResult[]
): TestResult {
  const start = performance.now();
  try {
    const result = testFn();
    const results = Array.isArray(result) ? result : [result];
    return {
      name,
      results,
      passed: results.every(r => r.passed),
      duration: Math.round((performance.now() - start) * 100) / 100
    };
  } catch (e) {
    return {
      name,
      results: [{ 
        passed: false, 
        message: `Unexpected error: ${e instanceof Error ? e.message : String(e)}`, 
        expected: 'No error', 
        actual: String(e) 
      }],
      passed: false,
      duration: Math.round((performance.now() - start) * 100) / 100
    };
  }
}

/**
 * Run multiple tests and return all results
 */
export function runTestSuite(
  tests: Array<{ name: string; testFn: () => AssertionResult | AssertionResult[] }>
): { results: TestResult[]; passed: number; failed: number; totalTime: number } {
  const results = tests.map(t => runTest(t.name, t.testFn));
  return {
    results,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    totalTime: results.reduce((sum, r) => sum + r.duration, 0)
  };
}
