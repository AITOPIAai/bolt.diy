import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  getLocalStorageRaw,
  setLocalStorageRaw,
  clearLocalStorage,
} from './localStorage';

describe('localStorage utilities', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      get length() {
        return Object.keys(store).length;
      },
      key: (index: number) => Object.keys(store)[index] || null,
    };
  })();

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: localStorageMock },
      writable: true,
      configurable: true,
    });

    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });

    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('getLocalStorage', () => {
    it('should return null when key does not exist', () => {
      const result = getLocalStorage('nonexistent');
      expect(result).toBeNull();
    });

    it('should parse and return JSON value', () => {
      const testData = { name: 'test', value: 123 };
      localStorage.setItem('test-key', JSON.stringify(testData));

      const result = getLocalStorage('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null and log error on invalid JSON', () => {
      localStorage.setItem('invalid-json', '{invalid}');

      const result = getLocalStorage('invalid-json');
      expect(result).toBeNull();
    });

    it('should handle arrays correctly', () => {
      const testArray = [1, 2, 3, 'test'];
      localStorage.setItem('array-key', JSON.stringify(testArray));

      const result = getLocalStorage('array-key');
      expect(result).toEqual(testArray);
    });

    it('should handle nested objects', () => {
      const nested = {
        level1: {
          level2: {
            level3: 'deep value',
          },
        },
      };
      localStorage.setItem('nested', JSON.stringify(nested));

      const result = getLocalStorage('nested');
      expect(result).toEqual(nested);
    });
  });

  describe('setLocalStorage', () => {
    it('should store value as JSON string', () => {
      const testData = { name: 'test', value: 456 };

      setLocalStorage('test-key', testData);

      const stored = localStorage.getItem('test-key');
      expect(stored).toBe(JSON.stringify(testData));
    });

    it('should handle primitive values', () => {
      setLocalStorage('string-key', 'hello');
      setLocalStorage('number-key', 42);
      setLocalStorage('boolean-key', true);

      expect(getLocalStorage('string-key')).toBe('hello');
      expect(getLocalStorage('number-key')).toBe(42);
      expect(getLocalStorage('boolean-key')).toBe(true);
    });

    it('should handle null and undefined', () => {
      setLocalStorage('null-key', null);
      setLocalStorage('undefined-key', undefined);

      expect(getLocalStorage('null-key')).toBeNull();

      // JSON.stringify(undefined) becomes "null", so we get null back
      expect(getLocalStorage('undefined-key')).toBeNull();
    });

    it('should overwrite existing values', () => {
      setLocalStorage('key', 'old-value');
      setLocalStorage('key', 'new-value');

      expect(getLocalStorage('key')).toBe('new-value');
    });
  });

  describe('removeLocalStorage', () => {
    it('should remove existing key', () => {
      localStorage.setItem('to-remove', 'value');

      const success = removeLocalStorage('to-remove');

      expect(success).toBe(true);
      expect(localStorage.getItem('to-remove')).toBeNull();
    });

    it('should handle removing non-existent key gracefully', () => {
      const success = removeLocalStorage('non-existent');
      expect(success).toBe(true);
    });
  });

  describe('getLocalStorageRaw', () => {
    it('should return raw string without parsing', () => {
      localStorage.setItem('raw-key', 'plain text');

      const result = getLocalStorageRaw('raw-key');
      expect(result).toBe('plain text');
    });

    it('should return JSON string as-is', () => {
      const jsonString = '{"test": "value"}';
      localStorage.setItem('json-raw', jsonString);

      const result = getLocalStorageRaw('json-raw');
      expect(result).toBe(jsonString);
    });

    it('should return null for non-existent key', () => {
      const result = getLocalStorageRaw('missing');
      expect(result).toBeNull();
    });
  });

  describe('setLocalStorageRaw', () => {
    it('should store string without JSON stringifying', () => {
      const success = setLocalStorageRaw('raw-key', 'raw value');

      expect(success).toBe(true);
      expect(localStorage.getItem('raw-key')).toBe('raw value');
    });

    it('should store empty string', () => {
      setLocalStorageRaw('empty', '');
      expect(getLocalStorageRaw('empty')).toBe('');
    });
  });

  describe('clearLocalStorage', () => {
    it('should clear all items', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.setItem('key3', 'value3');

      const success = clearLocalStorage();

      expect(success).toBe(true);
      expect(localStorage.length).toBe(0);
      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBeNull();
      expect(localStorage.getItem('key3')).toBeNull();
    });

    it('should work on empty localStorage', () => {
      const success = clearLocalStorage();
      expect(success).toBe(true);
      expect(localStorage.length).toBe(0);
    });
  });

  describe('error handling', () => {
    it('should handle quota exceeded errors on setItem', () => {
      // Mock storage quota error
      const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });

      const success = setLocalStorage('large-data', 'x'.repeat(10000000));

      expect(success).toBe(false);
      setItemSpy.mockRestore();
    });

    it('should handle corrupted localStorage getItem', () => {
      const getItemSpy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage corrupted');
      });

      const result = getLocalStorage('any-key');

      expect(result).toBeNull();
      getItemSpy.mockRestore();
    });

    it('should handle removeItem errors gracefully', () => {
      const removeItemSpy = vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Remove failed');
      });

      const success = removeLocalStorage('key');

      expect(success).toBe(false);
      removeItemSpy.mockRestore();
    });
  });

  describe('TypeScript generics', () => {
    interface User {
      id: number;
      name: string;
      email: string;
    }

    it('should work with typed interfaces', () => {
      const user: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      setLocalStorage('user', user);

      const retrieved = getLocalStorage<User>('user');

      expect(retrieved).toEqual(user);
      expect(retrieved?.id).toBe(1);
      expect(retrieved?.name).toBe('John Doe');
      expect(retrieved?.email).toBe('john@example.com');
    });

    it('should handle arrays with generics', () => {
      const users: User[] = [
        { id: 1, name: 'User 1', email: 'user1@test.com' },
        { id: 2, name: 'User 2', email: 'user2@test.com' },
      ];

      setLocalStorage('users', users);

      const retrieved = getLocalStorage<User[]>('users');

      expect(retrieved).toHaveLength(2);
      expect(retrieved?.[0].name).toBe('User 1');
    });
  });
});
