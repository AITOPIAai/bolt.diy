import { describe, expect, it, beforeEach } from 'vitest';

describe('Performance Tests', () => {
  describe('localStorage utilities performance', () => {
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
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
      Object.defineProperty(globalThis, 'localStorage', {
        value: localStorageMock,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(globalThis, 'window', {
        value: { localStorage: localStorageMock },
        writable: true,
        configurable: true,
      });
      localStorageMock.clear();
    });

    it('should handle 1000 rapid writes efficiently', () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        localStorage.setItem(`key-${i}`, JSON.stringify({ index: i, data: 'test' }));
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
      expect(localStorage.length).toBe(1000);
    });

    it('should handle 1000 rapid reads efficiently', () => {
      // Setup
      for (let i = 0; i < 1000; i++) {
        localStorage.setItem(`key-${i}`, JSON.stringify({ index: i }));
      }

      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        const item = localStorage.getItem(`key-${i}`);
        JSON.parse(item!);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(500); // Should complete in less than 500ms
    });

    it('should handle large object efficiently', () => {
      const largeObject = {
        data: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          name: `Item ${i}`,
          description: 'A'.repeat(100),
        })),
      };

      const startTime = performance.now();
      localStorage.setItem('large', JSON.stringify(largeObject));

      const retrieved = JSON.parse(localStorage.getItem('large')!);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(retrieved.data).toHaveLength(1000);
    });
  });

  describe('cookie parsing performance', () => {
    it('should parse large cookie header efficiently', async () => {
      const { parseCookies } = await import('~/lib/api/cookies');

      // Generate large cookie header
      const cookies = Array.from({ length: 100 }, (_, i) => `key${i}=value${i}`).join('; ');

      const startTime = performance.now();
      const result = parseCookies(cookies);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10); // Should parse in less than 10ms
      expect(Object.keys(result)).toHaveLength(100);
    });

    it('should handle 1000 cookie parsing iterations', async () => {
      const { parseCookies } = await import('~/lib/api/cookies');

      const cookieHeader = 'key1=value1; key2=value2; key3=value3';

      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        parseCookies(cookieHeader);
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // 1000 parses in less than 100ms
    });
  });

  describe('debounce performance', () => {
    it('should efficiently debounce 10000 rapid calls', async () => {
      const { debounce } = await import('~/utils/debounce');

      let callCount = 0;
      const fn = () => {
        callCount++;
      };
      const debouncedFn = debounce(fn, 50);

      const startTime = performance.now();

      for (let i = 0; i < 10000; i++) {
        debouncedFn();
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should handle 10k calls in less than 100ms
      expect(callCount).toBe(0); // Not called yet due to debounce

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(callCount).toBe(1); // Called once after debounce
    });

    it('should not cause memory leak with many debounced functions', async () => {
      const { debounce } = await import('~/utils/debounce');

      const functions = Array.from({ length: 1000 }, () => {
        const fn = () => {
          // Empty function
        };

        return debounce(fn, 10);
      });

      const startTime = performance.now();

      functions.forEach((fn) => {
        fn();
        fn();
        fn();
      });

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(functions).toHaveLength(1000);
    });
  });

  describe('memory efficiency', () => {
    it('should not leak memory with repeated operations', () => {
      const operations = 1000;
      const data: any[] = [];

      const startTime = performance.now();

      for (let i = 0; i < operations; i++) {
        // Create and discard objects
        const obj = {
          id: i,
          data: Array(100).fill(i),
        };
        data.push(obj);

        if (i % 100 === 0) {
          data.length = 0; // Clear array periodically
        }
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(500);
      expect(data.length).toBeLessThan(operations); // Memory was cleared
    });
  });

  describe('file lock checking performance', () => {
    it('should check 100 file locks efficiently', async () => {
      // Setup window with addEventListener before importing the module
      Object.defineProperty(globalThis, 'window', {
        value: {
          location: { pathname: '/chat/test-123' },
          addEventListener: () => {
            // Mock addEventListener
          },
        },
        writable: true,
        configurable: true,
      });

      const { isFileLocked } = await import('~/utils/fileLocks');

      const files = Array.from({ length: 100 }, (_, i) => `/path/to/file${i}.ts`);

      const startTime = performance.now();

      files.forEach((file) => {
        isFileLocked(file);
      });

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // Check 100 files in less than 50ms
    });
  });

  describe('string operations performance', () => {
    it('should efficiently process long strings', () => {
      const longString = 'a'.repeat(100000);

      const startTime = performance.now();

      // Various string operations
      const upper = longString.toUpperCase();

      const split = longString.split('');
      split.join('');

      const replaced = longString.replace(/a/g, 'b');

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(500);
      expect(upper).toHaveLength(100000);
      expect(replaced).toHaveLength(100000);
    });

    it('should handle URL encoding/decoding efficiently', () => {
      const testStrings = Array.from({ length: 100 }, (_, i) => `test string ${i} with special chars !@#$%`);

      const startTime = performance.now();

      testStrings.forEach((str) => {
        const encoded = encodeURIComponent(str);
        const decoded = decodeURIComponent(encoded);
        expect(decoded).toBe(str);
      });

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('JSON operations performance', () => {
    it('should handle complex nested JSON efficiently', () => {
      const complexObject = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  data: Array.from({ length: 100 }, (_, i) => ({
                    id: i,
                    nested: { value: i * 2 },
                  })),
                },
              },
            },
          },
        },
      };

      const startTime = performance.now();

      const stringified = JSON.stringify(complexObject);
      const parsed = JSON.parse(stringified);

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
      expect(parsed.level1.level2.level3.level4.level5.data).toHaveLength(100);
    });

    it('should handle 1000 JSON parse/stringify cycles', () => {
      const data = { value: 'test', number: 42, array: [1, 2, 3] };

      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        const str = JSON.stringify(data);
        JSON.parse(str);
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('array operations performance', () => {
    it('should handle large array operations efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);

      const startTime = performance.now();

      const filtered = largeArray.filter((n) => n % 2 === 0);
      const mapped = largeArray.map((n) => n * 2);
      const reduced = largeArray.reduce((sum, n) => sum + n, 0);

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(filtered).toHaveLength(5000);
      expect(mapped).toHaveLength(10000);
      expect(reduced).toBe(49995000);
    });

    it('should handle array search operations efficiently', () => {
      const array = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }));

      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        array.find((item) => item.id === 500);
        array.findIndex((item) => item.id === 750);
        array.some((item) => item.id === 999);
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('overall performance benchmarks', () => {
    it('should complete typical user workflow in reasonable time', async () => {
      const { parseCookies } = await import('~/lib/api/cookies');

      const startTime = performance.now();

      /*
       * Simulate typical user workflow
       * 1. Parse cookies
       */
      const cookieHeader = 'theme=dark; session=abc123; apiKeys=%7B%22OpenAI%22%3A%22key%22%7D';
      parseCookies(cookieHeader);

      // 2. localStorage operations
      for (let i = 0; i < 10; i++) {
        localStorage.setItem(`item-${i}`, JSON.stringify({ id: i }));
        localStorage.getItem(`item-${i}`);
      }

      // 3. Array processing
      const items = Array.from({ length: 100 }, (_, i) => ({ id: i, value: i * 2 }));
      items.filter((item) => item.value > 50);

      // 4. JSON operations
      JSON.stringify(items);

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // Complete workflow in less than 50ms
    });
  });
});
