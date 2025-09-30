import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';

describe('debounce utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should debounce function calls', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('call1');
    debouncedFn('call2');
    debouncedFn('call3');

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('call3');
  });

  it('should call function after delay', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn('test');

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(499);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('should reset timer on subsequent calls', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    vi.advanceTimersByTime(50);

    debouncedFn('second');
    vi.advanceTimersByTime(50);

    debouncedFn('third');
    vi.advanceTimersByTime(50);

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  it('should handle multiple arguments', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('arg1', 'arg2', 123, { key: 'value' });

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123, { key: 'value' });
  });

  it('should handle no arguments', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should work with different delay values', () => {
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();

    const debounced1 = debounce(mockFn1, 100);
    const debounced2 = debounce(mockFn2, 300);

    debounced1('test1');
    debounced2('test2');

    vi.advanceTimersByTime(100);
    expect(mockFn1).toHaveBeenCalledWith('test1');
    expect(mockFn2).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(mockFn2).toHaveBeenCalledWith('test2');
  });

  it('should call function without context (arrow function behavior)', () => {
    /*
     * Debounce uses arrow function syntax, so context is not preserved
     * This is expected behavior - testing that it still calls the function
     */
    const mockFn = vi.fn();
    const debouncedMethod = debounce(mockFn, 100);

    debouncedMethod('test');

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('should handle rapid successive calls correctly', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 50);

    for (let i = 0; i < 100; i++) {
      debouncedFn(i);
      vi.advanceTimersByTime(10);
    }

    vi.advanceTimersByTime(50);

    // Should only be called once with the last value
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(99);
  });

  it('should work with zero delay', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn('test');

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('should handle async functions', async () => {
    const mockAsyncFn = vi.fn(async (value: string) => {
      return `result: ${value}`;
    });

    const debouncedFn = debounce(mockAsyncFn, 100);

    debouncedFn('test');

    vi.advanceTimersByTime(100);

    await vi.runAllTimersAsync();

    expect(mockAsyncFn).toHaveBeenCalledWith('test');
  });

  it('should handle errors in debounced function', () => {
    const errorFn = vi.fn(() => {
      throw new Error('Test error');
    });

    const debouncedFn = debounce(errorFn, 100);

    debouncedFn();

    expect(() => {
      vi.advanceTimersByTime(100);
    }).toThrow('Test error');

    expect(errorFn).toHaveBeenCalled();
  });

  it('should allow calling debounced function multiple times in sequence', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    // First call
    debouncedFn('first');
    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('first');

    mockFn.mockClear();

    // Second call
    debouncedFn('second');
    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('second');
  });

  it('should work with object mutations', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    const obj = { value: 1 };

    debouncedFn(obj);
    obj.value = 2;

    vi.advanceTimersByTime(100);

    // Should be called with the mutated object
    expect(mockFn).toHaveBeenCalledWith({ value: 2 });
  });
});
