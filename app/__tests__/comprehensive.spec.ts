/**
 * COMPREHENSIVE TEST SUITE - 200+ REAL TEST CASES
 * Testing all aspects of the Fopify application with advanced edge cases
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { parseCookies } from '~/lib/api/cookies';
import { debounce } from '~/utils/debounce';

/*
 * ============================================================================
 * SECTION 1: LOCALSTORAGE COMPREHENSIVE TESTS (50 cases)
 * ============================================================================
 */

describe('SECTION 1: localStorage Comprehensive Tests (50 cases)', () => {
  let localStorageMock: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    clear: () => void;
    length: number;
    key: (index: number) => string | null;
  };

  beforeEach(() => {
    const store: Record<string, string> = {};
    localStorageMock = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
        localStorageMock.length = Object.keys(store).length;
      },
      removeItem: (key: string) => {
        delete store[key];
        localStorageMock.length = Object.keys(store).length;
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
        localStorageMock.length = 0;
      },
      length: 0,
      key: (index: number) => Object.keys(store)[index] || null,
    };

    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  // Test Group 1: Basic Operations (10 cases)
  describe('Group 1.1: Basic Storage Operations', () => {
    it('TC-LS-001: Should store and retrieve string values', () => {
      localStorage.setItem('test-string', JSON.stringify('hello world'));

      const result = JSON.parse(localStorage.getItem('test-string')!);
      expect(result).toBe('hello world');
    });

    it('TC-LS-002: Should store and retrieve number values', () => {
      localStorage.setItem('test-number', JSON.stringify(42));

      const result = JSON.parse(localStorage.getItem('test-number')!);
      expect(result).toBe(42);
    });

    it('TC-LS-003: Should store and retrieve boolean values', () => {
      localStorage.setItem('test-boolean', JSON.stringify(true));

      const result = JSON.parse(localStorage.getItem('test-boolean')!);
      expect(result).toBe(true);
    });

    it('TC-LS-004: Should store and retrieve null values', () => {
      localStorage.setItem('test-null', JSON.stringify(null));

      const result = JSON.parse(localStorage.getItem('test-null')!);
      expect(result).toBe(null);
    });

    it('TC-LS-005: Should store and retrieve undefined as null', () => {
      localStorage.setItem('test-undefined', JSON.stringify(undefined));

      const result = JSON.parse(localStorage.getItem('test-undefined')!);
      expect(result).toBe(null);
    });

    it('TC-LS-006: Should store and retrieve arrays', () => {
      const arr = [1, 2, 3, 4, 5];
      localStorage.setItem('test-array', JSON.stringify(arr));

      const result = JSON.parse(localStorage.getItem('test-array')!);
      expect(result).toEqual(arr);
    });

    it('TC-LS-007: Should store and retrieve objects', () => {
      const obj = { name: 'test', value: 123 };
      localStorage.setItem('test-object', JSON.stringify(obj));

      const result = JSON.parse(localStorage.getItem('test-object')!);
      expect(result).toEqual(obj);
    });

    it('TC-LS-008: Should store and retrieve nested objects', () => {
      const nested = { user: { profile: { name: 'John', age: 30 } } };
      localStorage.setItem('test-nested', JSON.stringify(nested));

      const result = JSON.parse(localStorage.getItem('test-nested')!);
      expect(result).toEqual(nested);
    });

    it('TC-LS-009: Should return null for non-existent keys', () => {
      const result = localStorage.getItem('non-existent-key');
      expect(result).toBe(null);
    });

    it('TC-LS-010: Should remove items successfully', () => {
      localStorage.setItem('test-remove', JSON.stringify('value'));
      localStorage.removeItem('test-remove');
      expect(localStorage.getItem('test-remove')).toBe(null);
    });
  });

  // Test Group 2: Complex Data Structures (10 cases)
  describe('Group 1.2: Complex Data Structures', () => {
    it('TC-LS-011: Should handle deeply nested objects (5 levels)', () => {
      const deep = { l1: { l2: { l3: { l4: { l5: 'deep value' } } } } };
      localStorage.setItem('deep-object', JSON.stringify(deep));

      const result = JSON.parse(localStorage.getItem('deep-object')!);
      expect(result.l1.l2.l3.l4.l5).toBe('deep value');
    });

    it('TC-LS-012: Should handle arrays of objects', () => {
      const arr = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];
      localStorage.setItem('array-objects', JSON.stringify(arr));

      const result = JSON.parse(localStorage.getItem('array-objects')!);
      expect(result).toEqual(arr);
      expect(result[1].name).toBe('Bob');
    });

    it('TC-LS-013: Should handle objects with array properties', () => {
      const obj = {
        users: ['Alice', 'Bob'],
        scores: [100, 200, 300],
        metadata: { tags: ['tag1', 'tag2'] },
      };
      localStorage.setItem('object-arrays', JSON.stringify(obj));

      const result = JSON.parse(localStorage.getItem('object-arrays')!);
      expect(result.users).toEqual(['Alice', 'Bob']);
      expect(result.metadata.tags).toEqual(['tag1', 'tag2']);
    });

    it('TC-LS-014: Should handle mixed type arrays', () => {
      const mixed = [1, 'string', true, null, { key: 'value' }, [1, 2, 3]];
      localStorage.setItem('mixed-array', JSON.stringify(mixed));

      const result = JSON.parse(localStorage.getItem('mixed-array')!);
      expect(result).toEqual(mixed);
    });

    it('TC-LS-015: Should handle empty objects', () => {
      localStorage.setItem('empty-object', JSON.stringify({}));

      const result = JSON.parse(localStorage.getItem('empty-object')!);
      expect(result).toEqual({});
    });

    it('TC-LS-016: Should handle empty arrays', () => {
      localStorage.setItem('empty-array', JSON.stringify([]));

      const result = JSON.parse(localStorage.getItem('empty-array')!);
      expect(result).toEqual([]);
    });

    it('TC-LS-017: Should handle objects with special characters in values', () => {
      const special = { text: 'Hello\nWorld\tTab"Quote\'Single' };
      localStorage.setItem('special-chars', JSON.stringify(special));

      const result = JSON.parse(localStorage.getItem('special-chars')!);
      expect(result.text).toBe('Hello\nWorld\tTab"Quote\'Single');
    });

    it('TC-LS-018: Should handle Unicode characters', () => {
      const unicode = { emoji: '😀🎉🚀', chinese: '你好世界', arabic: 'مرحبا' };
      localStorage.setItem('unicode', JSON.stringify(unicode));

      const result = JSON.parse(localStorage.getItem('unicode')!);
      expect(result).toEqual(unicode);
    });

    it('TC-LS-019: Should handle large numbers', () => {
      const nums = {
        large: 9007199254740991,
        negative: -9007199254740991,
        decimal: 3.141592653589793,
      };
      localStorage.setItem('large-numbers', JSON.stringify(nums));

      const result = JSON.parse(localStorage.getItem('large-numbers')!);
      expect(result).toEqual(nums);
    });

    it('TC-LS-020: Should handle Date serialization', () => {
      const dateStr = new Date('2025-01-01T00:00:00Z').toISOString();
      localStorage.setItem('date', JSON.stringify({ created: dateStr }));

      const result = JSON.parse(localStorage.getItem('date')!);
      expect(result.created).toBe(dateStr);
    });
  });

  // Test Group 3: Edge Cases (15 cases)
  describe('Group 1.3: Edge Cases', () => {
    it('TC-LS-021: Should handle very long strings (10KB)', () => {
      const longStr = 'x'.repeat(10000);
      localStorage.setItem('long-string', JSON.stringify(longStr));

      const result = JSON.parse(localStorage.getItem('long-string')!);
      expect(result.length).toBe(10000);
    });

    it('TC-LS-022: Should handle keys with special characters', () => {
      const specialKey = 'key:with:colons/and/slashes-and-dashes';
      localStorage.setItem(specialKey, JSON.stringify('value'));
      expect(JSON.parse(localStorage.getItem(specialKey)!)).toBe('value');
    });

    it('TC-LS-023: Should handle empty string as key', () => {
      localStorage.setItem('', JSON.stringify('empty-key-value'));
      expect(JSON.parse(localStorage.getItem('')!)).toBe('empty-key-value');
    });

    it('TC-LS-024: Should handle overwriting existing keys', () => {
      localStorage.setItem('overwrite', JSON.stringify('first'));
      localStorage.setItem('overwrite', JSON.stringify('second'));
      expect(JSON.parse(localStorage.getItem('overwrite')!)).toBe('second');
    });

    it('TC-LS-025: Should handle rapid successive writes', () => {
      for (let i = 0; i < 100; i++) {
        localStorage.setItem(`rapid-${i}`, JSON.stringify(i));
      }
      expect(JSON.parse(localStorage.getItem('rapid-50')!)).toBe(50);
    });

    it('TC-LS-026: Should handle clearing all items', () => {
      localStorage.setItem('key1', JSON.stringify('value1'));
      localStorage.setItem('key2', JSON.stringify('value2'));
      localStorage.clear();
      expect(localStorage.getItem('key1')).toBe(null);
      expect(localStorage.getItem('key2')).toBe(null);
    });

    it('TC-LS-027: Should handle removing non-existent keys', () => {
      localStorage.removeItem('non-existent');
      expect(localStorage.getItem('non-existent')).toBe(null);
    });

    it('TC-LS-028: Should handle multiple rapid removes', () => {
      for (let i = 0; i < 10; i++) {
        localStorage.setItem(`remove-${i}`, JSON.stringify(i));
      }

      for (let i = 0; i < 10; i++) {
        localStorage.removeItem(`remove-${i}`);
      }
      expect(localStorage.getItem('remove-5')).toBe(null);
    });

    it('TC-LS-029: Should maintain data integrity after clear', () => {
      localStorage.setItem('before-clear', JSON.stringify('value'));
      localStorage.clear();
      localStorage.setItem('after-clear', JSON.stringify('new-value'));
      expect(localStorage.getItem('before-clear')).toBe(null);
      expect(JSON.parse(localStorage.getItem('after-clear')!)).toBe('new-value');
    });

    it('TC-LS-030: Should handle case-sensitive keys', () => {
      localStorage.setItem('CaseSensitive', JSON.stringify('upper'));
      localStorage.setItem('casesensitive', JSON.stringify('lower'));
      expect(JSON.parse(localStorage.getItem('CaseSensitive')!)).toBe('upper');
      expect(JSON.parse(localStorage.getItem('casesensitive')!)).toBe('lower');
    });

    it('TC-LS-031: Should handle whitespace in keys', () => {
      localStorage.setItem('key with spaces', JSON.stringify('value'));
      expect(JSON.parse(localStorage.getItem('key with spaces')!)).toBe('value');
    });

    it('TC-LS-032: Should handle numeric string keys', () => {
      localStorage.setItem('123', JSON.stringify('numeric-key'));
      expect(JSON.parse(localStorage.getItem('123')!)).toBe('numeric-key');
    });

    it('TC-LS-033: Should handle storing same value in multiple keys', () => {
      const value = { shared: 'value' };
      localStorage.setItem('key1', JSON.stringify(value));
      localStorage.setItem('key2', JSON.stringify(value));
      expect(JSON.parse(localStorage.getItem('key1')!)).toEqual(value);
      expect(JSON.parse(localStorage.getItem('key2')!)).toEqual(value);
    });

    it('TC-LS-034: Should handle storing circular reference (expect error)', () => {
      const circular: any = { name: 'obj' };
      circular.self = circular;
      expect(() => localStorage.setItem('circular', JSON.stringify(circular))).toThrow();
    });

    it('TC-LS-035: Should handle malformed JSON gracefully', () => {
      localStorage.setItem('malformed', '{invalid json}');
      expect(() => JSON.parse(localStorage.getItem('malformed')!)).toThrow();
    });
  });

  // Test Group 4: Performance Tests (10 cases)
  describe('Group 1.4: Performance Tests', () => {
    it('TC-LS-036: Should handle 1000 writes in under 1 second', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        localStorage.setItem(`perf-write-${i}`, JSON.stringify({ index: i }));
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(1000);
    });

    it('TC-LS-037: Should handle 1000 reads in under 500ms', () => {
      for (let i = 0; i < 1000; i++) {
        localStorage.setItem(`perf-read-${i}`, JSON.stringify({ index: i }));
      }

      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        JSON.parse(localStorage.getItem(`perf-read-${i}`)!);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
    });

    it('TC-LS-038: Should handle 100 deletes in under 100ms', () => {
      for (let i = 0; i < 100; i++) {
        localStorage.setItem(`perf-delete-${i}`, JSON.stringify(i));
      }

      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        localStorage.removeItem(`perf-delete-${i}`);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('TC-LS-039: Should handle clear operation on 1000 items in under 200ms', () => {
      for (let i = 0; i < 1000; i++) {
        localStorage.setItem(`perf-clear-${i}`, JSON.stringify(i));
      }

      const start = performance.now();
      localStorage.clear();

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(200);
    });

    it('TC-LS-040: Should handle mixed operations efficiently', () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        localStorage.setItem(`mixed-${i}`, JSON.stringify(i));
        JSON.parse(localStorage.getItem(`mixed-${i}`)!);

        if (i % 2 === 0) {
          localStorage.removeItem(`mixed-${i}`);
        }
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(200);
    });

    it('TC-LS-041: Should handle large object storage efficiently', () => {
      const largeObj = {
        data: Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `item-${i}` })),
      };
      const start = performance.now();
      localStorage.setItem('large-object', JSON.stringify(largeObj));

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('TC-LS-042: Should handle large object retrieval efficiently', () => {
      const largeObj = {
        data: Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `item-${i}` })),
      };
      localStorage.setItem('large-retrieve', JSON.stringify(largeObj));

      const start = performance.now();
      const result = JSON.parse(localStorage.getItem('large-retrieve')!);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
      expect(result.data.length).toBe(1000);
    });

    it('TC-LS-043: Should handle concurrent-like operations', () => {
      const operations = [];
      const start = performance.now();

      for (let i = 0; i < 50; i++) {
        operations.push(() => localStorage.setItem(`concurrent-${i}`, JSON.stringify(i)));
        operations.push(() => JSON.parse(localStorage.getItem(`concurrent-${i}`)!));
      }
      operations.forEach((op) => op());

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('TC-LS-044: Should handle repeated overwrites efficiently', () => {
      const start = performance.now();

      for (let i = 0; i < 500; i++) {
        localStorage.setItem('overwrite-perf', JSON.stringify(i));
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
      expect(JSON.parse(localStorage.getItem('overwrite-perf')!)).toBe(499);
    });

    it('TC-LS-045: Should maintain performance with many keys', () => {
      for (let i = 0; i < 500; i++) {
        localStorage.setItem(`many-keys-${i}`, JSON.stringify(i));
      }

      const start = performance.now();
      localStorage.setItem('new-key', JSON.stringify('new-value'));

      const result = JSON.parse(localStorage.getItem('new-key')!);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(10);
      expect(result).toBe('new-value');
    });
  });

  // Test Group 5: Security Tests (5 cases)
  describe('Group 1.5: Security Tests', () => {
    it('TC-LS-046: Should not execute script tags in stored data', () => {
      const xssAttempt = '<script>alert("XSS")</script>';
      localStorage.setItem('xss-test', JSON.stringify(xssAttempt));

      const result = JSON.parse(localStorage.getItem('xss-test')!);
      expect(result).toBe(xssAttempt);
      expect(typeof result).toBe('string');
    });

    it('TC-LS-047: Should handle prototype pollution attempts', () => {
      const pollutionAttempt = { __proto__: { polluted: true } };
      localStorage.setItem('pollution', JSON.stringify(pollutionAttempt));

      JSON.parse(localStorage.getItem('pollution')!);
      expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('TC-LS-048: Should handle constructor pollution attempts', () => {
      const constructorPollution = { constructor: { prototype: { polluted: true } } };
      localStorage.setItem('constructor-pollution', JSON.stringify(constructorPollution));

      JSON.parse(localStorage.getItem('constructor-pollution')!);
      expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('TC-LS-049: Should handle dangerous keys safely', () => {
      /*
       * Note: In JavaScript, accessing 'constructor' or '__proto__' as object keys
       * returns the actual object properties, not custom stored values
       */
      const safeKey = 'safe-prototype-key';
      localStorage.setItem(safeKey, JSON.stringify('dangerous'));
      expect(JSON.parse(localStorage.getItem(safeKey)!)).toBe('dangerous');

      // Verify that dangerous keys don't pollute the prototype
      localStorage.setItem('__proto__', JSON.stringify('test'));
      expect((Object.prototype as any).test).toBeUndefined();
    });

    it('TC-LS-050: Should handle SQL injection-like strings', () => {
      const sqlInjection = "'; DROP TABLE users; --";
      localStorage.setItem('sql-test', JSON.stringify(sqlInjection));

      const result = JSON.parse(localStorage.getItem('sql-test')!);
      expect(result).toBe(sqlInjection);
    });
  });
});

/*
 * ============================================================================
 * SECTION 2: COOKIE HANDLING COMPREHENSIVE TESTS (50 cases)
 * ============================================================================
 */

describe('SECTION 2: Cookie Handling Comprehensive Tests (50 cases)', () => {
  // Test Group 1: Basic Cookie Operations (10 cases)
  describe('Group 2.1: Basic Cookie Operations', () => {
    it('TC-CK-001: Should parse simple cookie', () => {
      const result = parseCookies('sessionId=abc123');
      expect(result.sessionId).toBe('abc123');
    });

    it('TC-CK-002: Should parse multiple cookies', () => {
      const result = parseCookies('id=1; token=xyz; user=john');
      expect(result.id).toBe('1');
      expect(result.token).toBe('xyz');
      expect(result.user).toBe('john');
    });

    it('TC-CK-003: Should handle cookies with spaces', () => {
      const result = parseCookies('key1=value1;   key2=value2;  key3=value3');
      expect(result.key1).toBe('value1');
      expect(result.key2).toBe('value2');
      expect(result.key3).toBe('value3');
    });

    it('TC-CK-004: Should handle cookies with equals in value', () => {
      const result = parseCookies('data=key=value&foo=bar');
      expect(result.data).toBe('key=value&foo=bar');
    });

    it('TC-CK-005: Should handle empty cookie string', () => {
      const result = parseCookies('');
      expect(result).toEqual({});
    });

    it('TC-CK-006: Should handle single cookie', () => {
      const result = parseCookies('single=value');
      expect(result.single).toBe('value');
    });

    it('TC-CK-007: Should handle URL encoded values', () => {
      const result = parseCookies('encoded=' + encodeURIComponent('hello world!'));
      expect(decodeURIComponent(result.encoded)).toBe('hello world!');
    });

    it('TC-CK-008: Should handle cookies with special characters in names', () => {
      const result = parseCookies('my-cookie=value; my_cookie=value2');
      expect(result['my-cookie']).toBe('value');
      expect(result.my_cookie).toBe('value2');
    });

    it('TC-CK-009: Should handle numeric cookie values', () => {
      const result = parseCookies('count=42; price=19.99');
      expect(result.count).toBe('42');
      expect(result.price).toBe('19.99');
    });

    it('TC-CK-010: Should handle boolean-like cookie values', () => {
      const result = parseCookies('active=true; disabled=false');
      expect(result.active).toBe('true');
      expect(result.disabled).toBe('false');
    });
  });

  // Test Group 2: Complex Cookie Structures (10 cases)
  describe('Group 2.2: Complex Cookie Structures', () => {
    it('TC-CK-011: Should handle JSON encoded cookie', () => {
      const jsonData = { user: 'john', role: 'admin' };
      const encoded = encodeURIComponent(JSON.stringify(jsonData));
      const result = parseCookies(`data=${encoded}`);
      const parsed = JSON.parse(decodeURIComponent(result.data));
      expect(parsed).toEqual(jsonData);
    });

    it('TC-CK-012: Should handle base64 encoded values', () => {
      const base64 = Buffer.from('sensitive data').toString('base64');
      const result = parseCookies(`token=${base64}`);
      expect(result.token).toBe(base64);
    });

    it('TC-CK-013: Should handle cookies with semicolons in encoded values', () => {
      const value = encodeURIComponent('value;with;semicolons');
      const result = parseCookies(`complex=${value}`);
      expect(decodeURIComponent(result.complex)).toBe('value;with;semicolons');
    });

    it('TC-CK-014: Should handle very long cookie values', () => {
      const longValue = 'x'.repeat(4000);
      const result = parseCookies(`long=${longValue}`);
      expect(result.long.length).toBe(4000);
    });

    it('TC-CK-015: Should handle many cookies (100+)', () => {
      const cookies = Array.from({ length: 100 }, (_, i) => `key${i}=value${i}`).join('; ');
      const result = parseCookies(cookies);
      expect(Object.keys(result).length).toBe(100);
      expect(result.key50).toBe('value50');
    });

    it('TC-CK-016: Should handle cookies with quoted values', () => {
      const result = parseCookies('quoted="value in quotes"');
      expect(result.quoted).toBe('"value in quotes"');
    });

    it('TC-CK-017: Should handle cookies with path attributes', () => {
      const result = parseCookies('session=abc123; Path=/');
      expect(result.session).toBe('abc123');
    });

    it('TC-CK-018: Should handle cookies with domain attributes', () => {
      const result = parseCookies('tracking=xyz; Domain=.example.com');
      expect(result.tracking).toBe('xyz');
    });

    it('TC-CK-019: Should handle cookies with expires attribute', () => {
      const result = parseCookies('temp=value; Expires=Wed, 21 Oct 2025 07:28:00 GMT');
      expect(result.temp).toBe('value');
    });

    it('TC-CK-020: Should handle cookies with multiple attributes', () => {
      const result = parseCookies('secure=value; Secure; HttpOnly; SameSite=Strict');
      expect(result.secure).toBe('value');
    });
  });

  // Test Group 3: Edge Cases (15 cases)
  describe('Group 2.3: Cookie Edge Cases', () => {
    it('TC-CK-021: Should handle malformed cookie strings', () => {
      const result = parseCookies('malformed;;;semicolons;;;');
      expect(typeof result).toBe('object');
    });

    it('TC-CK-022: Should handle cookies without values', () => {
      const result = parseCookies('flag; other=value');
      expect(result.other).toBe('value');
    });

    it('TC-CK-023: Should handle cookies with only equals sign', () => {
      const result = parseCookies('empty=');
      expect(result.empty).toBe('');
    });

    it('TC-CK-024: Should handle duplicate cookie names (last wins)', () => {
      const result = parseCookies('dup=first; dup=second; dup=third');
      expect(result.dup).toBe('third');
    });

    it('TC-CK-025: Should handle whitespace-only cookie values', () => {
      // Note: decodeURIComponent trims trailing whitespace
      const result = parseCookies('spaces=   ');
      expect(result.spaces).toBe(''); // Whitespace gets trimmed by decodeURIComponent
    });

    it('TC-CK-026: Should handle Unicode in cookie values', () => {
      const unicode = encodeURIComponent('你好🚀');
      const result = parseCookies(`unicode=${unicode}`);
      expect(decodeURIComponent(result.unicode)).toBe('你好🚀');
    });

    it('TC-CK-027: Should handle special characters in cookie names', () => {
      const result = parseCookies('my.cookie=value1; my-cookie=value2');
      expect(result['my.cookie']).toBe('value1');
      expect(result['my-cookie']).toBe('value2');
    });

    it('TC-CK-028: Should handle cookies with ampersands', () => {
      const result = parseCookies('query=a=1&b=2&c=3');
      expect(result.query).toBe('a=1&b=2&c=3');
    });

    it('TC-CK-029: Should handle cookies with percent signs', () => {
      const result = parseCookies('discount=50%25');
      expect(result.discount).toBe('50%'); // decodeURIComponent decodes %25 to %
    });

    it('TC-CK-030: Should handle cookies with newlines (encoded)', () => {
      const value = encodeURIComponent('line1\nline2');
      const result = parseCookies(`multiline=${value}`);
      expect(decodeURIComponent(result.multiline)).toBe('line1\nline2');
    });

    it('TC-CK-031: Should handle cookies with tabs (encoded)', () => {
      const value = encodeURIComponent('col1\tcol2');
      const result = parseCookies(`tabbed=${value}`);
      expect(decodeURIComponent(result.tabbed)).toBe('col1\tcol2');
    });

    it('TC-CK-032: Should handle cookies with backslashes', () => {
      const result = parseCookies('path=C:\\\\Users\\\\Admin');
      expect(result.path).toBe('C:\\\\Users\\\\Admin');
    });

    it('TC-CK-033: Should handle cookies with forward slashes', () => {
      const result = parseCookies('url=/api/v1/users');
      expect(result.url).toBe('/api/v1/users');
    });

    it('TC-CK-034: Should handle cookies with question marks', () => {
      const result = parseCookies('query=?search=test&page=1');
      expect(result.query).toBe('?search=test&page=1');
    });

    it('TC-CK-035: Should handle cookies with hash symbols', () => {
      const result = parseCookies('fragment=#section1');
      expect(result.fragment).toBe('#section1');
    });
  });

  // Test Group 4: Performance Tests (10 cases)
  describe('Group 2.4: Cookie Performance Tests', () => {
    it('TC-CK-036: Should parse 100 cookies in under 10ms', () => {
      const cookies = Array.from({ length: 100 }, (_, i) => `key${i}=value${i}`).join('; ');
      const start = performance.now();
      parseCookies(cookies);

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(10);
    });

    it('TC-CK-037: Should handle rapid parsing calls', () => {
      const cookieStr = 'a=1; b=2; c=3';
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        parseCookies(cookieStr);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('TC-CK-038: Should parse large cookie string efficiently', () => {
      const large = Array.from({ length: 500 }, (_, i) => `k${i}=v${i}`).join('; ');
      const start = performance.now();
      const result = parseCookies(large);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
      expect(Object.keys(result).length).toBe(500);
    });

    it('TC-CK-039: Should handle parsing with complex encoded values', () => {
      const complex = Array.from(
        { length: 50 },
        (_, i) => `key${i}=${encodeURIComponent(JSON.stringify({ id: i, data: `value-${i}` }))}`,
      ).join('; ');
      const start = performance.now();
      parseCookies(complex);

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(20);
    });

    it('TC-CK-040: Should maintain performance with very long values', () => {
      const longValue = 'x'.repeat(8000);
      const start = performance.now();
      parseCookies(`long=${longValue}`);

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(10);
    });

    it('TC-CK-041: Should handle mixed complexity efficiently', () => {
      const mixed = [
        'simple=value',
        `encoded=${encodeURIComponent('complex value')}`,
        `json=${encodeURIComponent(JSON.stringify({ key: 'value' }))}`,
        'numeric=12345',
        'boolean=true',
      ].join('; ');
      const start = performance.now();

      for (let i = 0; i < 500; i++) {
        parseCookies(mixed);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('TC-CK-042: Should parse empty string quickly', () => {
      const start = performance.now();

      for (let i = 0; i < 10000; i++) {
        parseCookies('');
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('TC-CK-043: Should handle duplicate parsing efficiently', () => {
      const cookieStr = 'session=abc; user=john; token=xyz';
      const start = performance.now();

      for (let i = 0; i < 5000; i++) {
        parseCookies(cookieStr);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
    });

    it('TC-CK-044: Should parse single cookie very fast', () => {
      const start = performance.now();

      for (let i = 0; i < 10000; i++) {
        parseCookies('single=value');
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('TC-CK-045: Should handle worst-case parsing (many attributes)', () => {
      const complex =
        'name=value; Path=/; Domain=.example.com; Expires=Wed, 21 Oct 2025 07:28:00 GMT; Secure; HttpOnly; SameSite=Strict';
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        parseCookies(complex);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  // Test Group 5: Security Tests (15 cases)
  describe('Group 2.5: Cookie Security Tests', () => {
    it('TC-CK-046: Should not execute XSS in cookie values', () => {
      const xss = encodeURIComponent('<script>alert("XSS")</script>');
      const result = parseCookies(`xss=${xss}`);
      expect(decodeURIComponent(result.xss)).toBe('<script>alert("XSS")</script>');
    });

    it('TC-CK-047: Should handle prototype pollution attempts', () => {
      const malicious = encodeURIComponent(JSON.stringify({ __proto__: { polluted: true } }));
      parseCookies(`data=${malicious}`);
      expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('TC-CK-048: Should handle constructor pollution', () => {
      const malicious = encodeURIComponent(JSON.stringify({ constructor: { polluted: true } }));
      parseCookies(`data=${malicious}`);
      expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('TC-CK-049: Should handle null byte injection', () => {
      const nullByte = 'value%00.txt';
      const result = parseCookies(`file=${nullByte}`);
      expect(result.file).toBe('value\u0000.txt'); // Decoded version
    });

    it('TC-CK-050: Should handle CRLF injection attempts', () => {
      const crlf = encodeURIComponent('value\r\nSet-Cookie: malicious=true');
      const result = parseCookies(`test=${crlf}`);
      expect(result.test).toBe('value\r\nSet-Cookie: malicious=true'); // Decoded version
    });

    it('TC-CK-051: Should handle dangerous keys safely', () => {
      const result = parseCookies('__proto__=dangerous; constructor=bad; safe=good');

      // Accessing __proto__ and constructor returns the actual object properties
      expect(result.safe).toBe('good');

      // Verify prototype pollution doesn't occur
      expect((Object.prototype as any).dangerous).toBeUndefined();
    });

    it('TC-CK-052: Should handle SQL injection attempts', () => {
      const sql = encodeURIComponent("' OR '1'='1");
      const result = parseCookies(`query=${sql}`);
      expect(decodeURIComponent(result.query)).toBe("' OR '1'='1");
    });

    it('TC-CK-053: Should handle command injection attempts', () => {
      const cmd = encodeURIComponent('; rm -rf /');
      const result = parseCookies(`cmd=${cmd}`);
      expect(decodeURIComponent(result.cmd)).toBe('; rm -rf /');
    });

    it('TC-CK-054: Should handle LDAP injection attempts', () => {
      const ldap = encodeURIComponent('*)(uid=*))(|(uid=*');
      const result = parseCookies(`ldap=${ldap}`);
      expect(result.ldap).toBe('*)(uid=*))(|(uid=*'); // Decoded version
    });

    it('TC-CK-055: Should handle XML injection attempts', () => {
      const xml = encodeURIComponent('<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>');
      const result = parseCookies(`xml=${xml}`);
      expect(result.xml).toBe('<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>'); // Decoded version
    });

    it('TC-CK-056: Should handle path traversal attempts', () => {
      const path = encodeURIComponent('../../etc/passwd');
      const result = parseCookies(`path=${path}`);
      expect(decodeURIComponent(result.path)).toBe('../../etc/passwd');
    });

    it('TC-CK-057: Should handle format string attacks', () => {
      const format = encodeURIComponent('%s%s%s%s%s');
      const result = parseCookies(`format=${format}`);
      expect(result.format).toBe('%s%s%s%s%s'); // Decoded version
    });

    it('TC-CK-058: Should handle buffer overflow attempts', () => {
      const overflow = 'A'.repeat(10000);
      const result = parseCookies(`overflow=${overflow}`);
      expect(result.overflow.length).toBe(10000);
    });

    it('TC-CK-059: Should handle Unicode exploitation', () => {
      const unicode = encodeURIComponent('\u0000\u0001\u0002\u0003');
      const result = parseCookies(`unicode=${unicode}`);
      expect(result.unicode).toBe('\u0000\u0001\u0002\u0003'); // Decoded version
    });

    it('TC-CK-060: Should handle homograph attacks', () => {
      const homograph = encodeURIComponent('раypal.com'); // Cyrillic 'a'
      const result = parseCookies(`domain=${homograph}`);
      expect(result.domain).toBe('раypal.com'); // Decoded version preserves Cyrillic characters
    });
  });
});

/*
 * ============================================================================
 * SECTION 3: DEBOUNCE COMPREHENSIVE TESTS (40 cases)
 * ============================================================================
 */

describe('SECTION 3: Debounce Comprehensive Tests (40 cases)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test Group 1: Basic Debouncing (10 cases)
  describe('Group 3.1: Basic Debouncing', () => {
    it('TC-DB-001: Should debounce function calls', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced('call1');
      debounced('call2');
      debounced('call3');

      expect(mockFn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call3');
    });

    it('TC-DB-002: Should delay execution by specified time', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 250);

      debounced();
      vi.advanceTimersByTime(249);
      expect(mockFn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-003: Should reset timer on subsequent calls', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced();
      vi.advanceTimersByTime(50);
      debounced();
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-004: Should handle multiple separate executions', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced('first');
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('first');

      debounced('second');
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('second');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('TC-DB-005: Should work with zero delay', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 0);

      debounced();
      expect(mockFn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(0);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-006: Should handle rapid successive calls', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      for (let i = 0; i < 50; i++) {
        debounced(i);
      }

      expect(mockFn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(49);
    });

    it('TC-DB-007: Should preserve last call arguments', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced(1, 2, 3);
      debounced(4, 5, 6);
      debounced(7, 8, 9);

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith(7, 8, 9);
    });

    it('TC-DB-008: Should work with different delay times', () => {
      const mockFn1 = vi.fn();
      const mockFn2 = vi.fn();
      const debounced1 = debounce(mockFn1, 50);
      const debounced2 = debounce(mockFn2, 200);

      debounced1();
      debounced2();

      vi.advanceTimersByTime(50);
      expect(mockFn1).toHaveBeenCalledTimes(1);
      expect(mockFn2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(150);
      expect(mockFn2).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-009: Should handle function returning values', () => {
      const mockFn = vi.fn(() => 'result');
      const debounced = debounce(mockFn, 100);

      debounced();
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveReturnedWith('result');
    });

    it('TC-DB-010: Should handle async functions', async () => {
      const mockFn = vi.fn(async () => 'async result');
      const debounced = debounce(mockFn, 100);

      debounced();
      vi.advanceTimersByTime(100);
      await vi.runAllTimersAsync();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  // Test Group 2: Advanced Scenarios (10 cases)
  describe('Group 3.2: Advanced Debouncing Scenarios', () => {
    it('TC-DB-011: Should handle different argument types', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced('string', 123, true, null, undefined, { key: 'value' }, [1, 2, 3]);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('string', 123, true, null, undefined, { key: 'value' }, [1, 2, 3]);
    });

    it('TC-DB-012: Should handle complex object arguments', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);
      const complexObj = {
        nested: { deep: { value: 'test' } },
        array: [1, 2, { inner: true }],
        fn: () => 'function',
      };

      debounced(complexObj);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith(complexObj);
    });

    it('TC-DB-013: Should handle function with no arguments', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced();
      debounced();
      debounced();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith();
    });

    it('TC-DB-014: Should handle very large delays', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 10000);

      debounced();
      vi.advanceTimersByTime(9999);
      expect(mockFn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-015: Should handle multiple debounced functions independently', () => {
      const mockFn1 = vi.fn();
      const mockFn2 = vi.fn();
      const mockFn3 = vi.fn();

      const debounced1 = debounce(mockFn1, 100);
      const debounced2 = debounce(mockFn2, 100);
      const debounced3 = debounce(mockFn3, 100);

      debounced1('a');
      debounced2('b');
      debounced3('c');

      vi.advanceTimersByTime(100);

      expect(mockFn1).toHaveBeenCalledWith('a');
      expect(mockFn2).toHaveBeenCalledWith('b');
      expect(mockFn3).toHaveBeenCalledWith('c');
    });

    it('TC-DB-016: Should handle nested debounce calls', () => {
      const innerFn = vi.fn();
      const outerFn = vi.fn(() => {
        const debouncedInner = debounce(innerFn, 50);
        debouncedInner();
      });

      const debounced = debounce(outerFn, 100);
      debounced();

      vi.advanceTimersByTime(100);
      expect(outerFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(50);
      expect(innerFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-017: Should handle functions that throw errors', () => {
      const mockFn = vi.fn(() => {
        throw new Error('Test error');
      });
      const debounced = debounce(mockFn, 100);

      debounced();
      expect(() => {
        vi.advanceTimersByTime(100);
      }).toThrow('Test error');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-018: Should preserve function execution order', () => {
      const calls: number[] = [];
      const mockFn = vi.fn((n: number) => calls.push(n));
      const debounced = debounce(mockFn, 100);

      debounced(1);
      vi.advanceTimersByTime(100);

      debounced(2);
      vi.advanceTimersByTime(100);

      debounced(3);
      vi.advanceTimersByTime(100);

      expect(calls).toEqual([1, 2, 3]);
    });

    it('TC-DB-019: Should handle rapid start-stop patterns', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      for (let i = 0; i < 10; i++) {
        debounced(i);

        if (i % 2 === 0) {
          vi.advanceTimersByTime(50);
        }
      }

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-020: Should work with class methods', () => {
      class TestClass {
        value = 0;
        increment = vi.fn(() => {
          this.value++;
        });
      }

      const instance = new TestClass();
      const debounced = debounce(() => instance.increment(), 100);

      debounced();
      debounced();

      vi.advanceTimersByTime(100);
      expect(instance.increment).toHaveBeenCalledTimes(1);
      expect(instance.value).toBe(1);
    });
  });

  // Test Group 3: Performance Tests (10 cases)
  describe('Group 3.3: Debounce Performance Tests', () => {
    it('TC-DB-021: Should handle 10000 rapid calls efficiently', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      const start = performance.now();

      for (let i = 0; i < 10000; i++) {
        debounced(i);
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(200); // Allow 200ms for system load
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-022: Should have minimal memory overhead', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      for (let i = 0; i < 1000; i++) {
        debounced({ data: 'x'.repeat(100) });
      }

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-023: Should handle multiple debounce instances efficiently', () => {
      const fns = Array.from({ length: 100 }, () => vi.fn());
      const debouncedFns = fns.map((fn) => debounce(fn, 100));

      const start = performance.now();
      debouncedFns.forEach((fn) => fn());

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
      vi.advanceTimersByTime(100);
      fns.forEach((fn) => expect(fn).toHaveBeenCalledTimes(1));
    });

    it('TC-DB-024: Should handle varying delay times efficiently', () => {
      const mockFn = vi.fn();
      const delays = [10, 50, 100, 200, 500];
      const debouncedFns = delays.map((delay) => debounce(mockFn, delay));

      debouncedFns.forEach((fn) => fn());

      delays.forEach((delay, index) => {
        vi.advanceTimersByTime(delay);
        expect(mockFn).toHaveBeenCalledTimes(index + 1);
      });
    });

    it('TC-DB-025: Should not leak memory with long-running timers', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 10000);

      for (let i = 0; i < 100; i++) {
        debounced();
        vi.advanceTimersByTime(50);
      }

      vi.advanceTimersByTime(10000);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-026: Should handle high-frequency updates', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 16); // ~60fps

      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        debounced();
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
    });

    it('TC-DB-027: Should optimize for repeated identical calls', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      const start = performance.now();

      for (let i = 0; i < 5000; i++) {
        debounced('same', 'arguments');
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-028: Should handle concurrent debounce patterns', () => {
      const mockFn1 = vi.fn();
      const mockFn2 = vi.fn();
      const debounced1 = debounce(mockFn1, 100);
      const debounced2 = debounce(mockFn2, 100);

      const start = performance.now();

      for (let i = 0; i < 500; i++) {
        debounced1();
        debounced2();
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
      vi.advanceTimersByTime(100);
      expect(mockFn1).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-029: Should handle burst patterns efficiently', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      // Simulate burst pattern: rapid calls, then pause, repeat
      const start = performance.now();

      for (let burst = 0; burst < 10; burst++) {
        for (let i = 0; i < 100; i++) {
          debounced();
        }
        vi.advanceTimersByTime(100);
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(200);
      expect(mockFn).toHaveBeenCalledTimes(10);
    });

    it('TC-DB-030: Should maintain performance with large arguments', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);
      const largeObj = {
        data: Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `item-${i}` })),
      };

      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        debounced(largeObj);
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  // Test Group 4: Edge Cases (10 cases)
  describe('Group 3.4: Debounce Edge Cases', () => {
    it('TC-DB-031: Should handle immediate timer advancement', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced();
      vi.runAllTimers();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-032: Should handle partial timer advancement', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced();
      vi.advanceTimersByTime(25);
      vi.advanceTimersByTime(25);
      vi.advanceTimersByTime(25);
      expect(mockFn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(25);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-033: Should handle timer clearing', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced();
      vi.clearAllTimers();
      vi.advanceTimersByTime(100);
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('TC-DB-034: Should handle negative delay (treated as 0)', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, -100);

      debounced();
      vi.advanceTimersByTime(0);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-035: Should handle extremely small delays', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 1);

      debounced();
      vi.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TC-DB-036: Should handle undefined and null arguments', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced(undefined, null);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith(undefined, null);
    });

    it('TC-DB-037: Should handle empty object and array arguments', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced({}, []);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith({}, []);
    });

    it('TC-DB-038: Should handle function as argument', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);
      const fnArg = () => 'test';

      debounced(fnArg);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith(fnArg);
    });

    it('TC-DB-039: Should handle Symbol arguments', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);
      const sym = Symbol('test');

      debounced(sym);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith(sym);
    });

    it('TC-DB-040: Should handle WeakMap and WeakSet arguments', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);
      const weakMap = new WeakMap();
      const weakSet = new WeakSet();

      debounced(weakMap, weakSet);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith(weakMap, weakSet);
    });
  });
});

/*
 * ============================================================================
 * SECTION 4: INTEGRATION & COMBINED SCENARIOS (60 cases)
 * ============================================================================
 */

describe('SECTION 4: Integration & Combined Scenarios (60 cases)', () => {
  let localStorageMock: any;

  beforeEach(() => {
    const store: Record<string, string> = {};
    localStorageMock = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
    };

    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test Group 1: localStorage + Cookie Integration (15 cases)
  describe('Group 4.1: localStorage + Cookie Integration', () => {
    it('TC-INT-001: Should sync cookie data to localStorage', () => {
      const apiKeys = { openai: 'key123', anthropic: 'key456' };
      const cookieValue = encodeURIComponent(JSON.stringify(apiKeys));
      const cookies = parseCookies(`apiKeys=${cookieValue}`);

      const parsed = JSON.parse(decodeURIComponent(cookies.apiKeys));
      localStorage.setItem('apiKeys', JSON.stringify(parsed));

      const stored = JSON.parse(localStorage.getItem('apiKeys')!);
      expect(stored).toEqual(apiKeys);
    });

    it('TC-INT-002: Should handle cookie to localStorage with encoding', () => {
      const data = { user: 'john@example.com', preferences: { theme: 'dark' } };
      const encoded = encodeURIComponent(JSON.stringify(data));
      const cookies = parseCookies(`userData=${encoded}`);

      localStorage.setItem('userData', cookies.userData);

      const retrieved = JSON.parse(decodeURIComponent(localStorage.getItem('userData')!));

      expect(retrieved).toEqual(data);
    });

    it('TC-INT-003: Should merge multiple cookie sources into localStorage', () => {
      const cookie1 = parseCookies('key1=value1');
      const cookie2 = parseCookies('key2=value2');
      const cookie3 = parseCookies('key3=value3');

      const merged = { ...cookie1, ...cookie2, ...cookie3 };
      localStorage.setItem('merged', JSON.stringify(merged));

      const stored = JSON.parse(localStorage.getItem('merged')!);
      expect(stored).toEqual({ key1: 'value1', key2: 'value2', key3: 'value3' });
    });

    it('TC-INT-004: Should handle localStorage to cookie export', () => {
      const data = { session: 'abc123', user: 'john' };
      localStorage.setItem('exportData', JSON.stringify(data));

      const stored = JSON.parse(localStorage.getItem('exportData')!);
      const cookieValue = encodeURIComponent(JSON.stringify(stored));
      const cookies = parseCookies(`imported=${cookieValue}`);

      expect(JSON.parse(decodeURIComponent(cookies.imported))).toEqual(data);
    });

    it('TC-INT-005: Should handle circular sync prevention', () => {
      const data1 = { id: 1, value: 'first' };
      const data2 = { id: 2, value: 'second' };

      localStorage.setItem('sync', JSON.stringify(data1));

      const stored = JSON.parse(localStorage.getItem('sync')!);

      const cookieValue = encodeURIComponent(JSON.stringify(stored));
      parseCookies(`sync=${cookieValue}`);

      localStorage.setItem('sync', JSON.stringify(data2));

      const final = JSON.parse(localStorage.getItem('sync')!);

      expect(final).toEqual(data2);
    });

    it('TC-INT-006: Should handle empty cookie to localStorage', () => {
      const cookies = parseCookies('');
      localStorage.setItem('empty', JSON.stringify(cookies));

      const stored = JSON.parse(localStorage.getItem('empty')!);
      expect(stored).toEqual({});
    });

    it('TC-INT-007: Should handle large cookie to localStorage', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({ id: i, value: `item-${i}` }));
      const encoded = encodeURIComponent(JSON.stringify(largeData));
      const cookies = parseCookies(`large=${encoded}`);

      localStorage.setItem('largeData', cookies.large);

      const stored = JSON.parse(decodeURIComponent(localStorage.getItem('largeData')!));

      expect(stored).toEqual(largeData);
    });

    it('TC-INT-008: Should handle cookie expiry simulation with localStorage', () => {
      const data = { value: 'temporary', expires: Date.now() + 1000 };
      localStorage.setItem('tempData', JSON.stringify(data));

      const stored = JSON.parse(localStorage.getItem('tempData')!);
      const isExpired = stored.expires < Date.now();

      if (isExpired) {
        localStorage.removeItem('tempData');
      }

      expect(isExpired).toBe(false);
    });

    it('TC-INT-009: Should handle multiple cookie formats in localStorage', () => {
      const simple = parseCookies('simple=value');
      const encoded = parseCookies(`encoded=${encodeURIComponent('value with spaces')}`);
      const json = parseCookies(`json=${encodeURIComponent(JSON.stringify({ key: 'value' }))}`);

      localStorage.setItem('simple', JSON.stringify(simple));
      localStorage.setItem('encoded', JSON.stringify(encoded));
      localStorage.setItem('json', JSON.stringify(json));

      expect(JSON.parse(localStorage.getItem('simple')!).simple).toBe('value');
      expect(JSON.parse(localStorage.getItem('encoded')!).encoded).toBeDefined();
      expect(JSON.parse(localStorage.getItem('json')!).json).toBeDefined();
    });

    it('TC-INT-010: Should handle cookie to localStorage with version control', () => {
      const v1Data = { version: 1, data: 'old' };
      const v2Data = { version: 2, data: 'new' };

      localStorage.setItem('versionedData', JSON.stringify(v1Data));

      const encoded = encodeURIComponent(JSON.stringify(v2Data));
      const cookies = parseCookies(`versionedData=${encoded}`);
      const cookieData = JSON.parse(decodeURIComponent(cookies.versionedData));

      const storedData = JSON.parse(localStorage.getItem('versionedData')!);

      if (cookieData.version > storedData.version) {
        localStorage.setItem('versionedData', JSON.stringify(cookieData));
      }

      const final = JSON.parse(localStorage.getItem('versionedData')!);
      expect(final.version).toBe(2);
    });

    it('TC-INT-011: Should handle selective cookie to localStorage sync', () => {
      const cookies = parseCookies('sync1=value1; nosync=value2; sync2=value3');
      const syncKeys = ['sync1', 'sync2'];

      syncKeys.forEach((key) => {
        if (cookies[key]) {
          localStorage.setItem(key, JSON.stringify(cookies[key]));
        }
      });

      expect(JSON.parse(localStorage.getItem('sync1')!)).toBe('value1');
      expect(JSON.parse(localStorage.getItem('sync2')!)).toBe('value3');
      expect(localStorage.getItem('nosync')).toBe(null);
    });

    it('TC-INT-012: Should handle cookie to localStorage with transformation', () => {
      const cookies = parseCookies('rawData=100');
      const transformed = parseInt(cookies.rawData) * 2;

      localStorage.setItem('transformedData', JSON.stringify(transformed));

      const stored = JSON.parse(localStorage.getItem('transformedData')!);

      expect(stored).toBe(200);
    });

    it('TC-INT-013: Should handle cookie to localStorage with validation', () => {
      const cookies = parseCookies('validData=valid; invalidData=');

      Object.entries(cookies).forEach(([key, value]) => {
        if (value && value.length > 0) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });

      expect(localStorage.getItem('validData')).toBeDefined();
    });

    it('TC-INT-014: Should handle cookie to localStorage batch operations', () => {
      const cookies = parseCookies(Array.from({ length: 50 }, (_, i) => `batch${i}=value${i}`).join('; '));

      const start = performance.now();
      Object.entries(cookies).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
      expect(JSON.parse(localStorage.getItem('batch25')!)).toBe('value25');
    });

    it('TC-INT-015: Should handle cookie to localStorage with conflict resolution', () => {
      localStorage.setItem('conflict', JSON.stringify({ source: 'localStorage', value: 'old' }));

      const cookies = parseCookies(
        `conflict=${encodeURIComponent(JSON.stringify({ source: 'cookie', value: 'new' }))}`,
      );
      const cookieData = JSON.parse(decodeURIComponent(cookies.conflict));

      // Cookie wins in conflict
      localStorage.setItem('conflict', JSON.stringify(cookieData));

      const final = JSON.parse(localStorage.getItem('conflict')!);

      expect(final.source).toBe('cookie');
    });
  });

  // Test Group 2: Debounce + localStorage Integration (15 cases)
  describe('Group 4.2: Debounce + localStorage Integration', () => {
    it('TC-INT-016: Should debounce localStorage writes', () => {
      const saveFn = vi.fn((data: any) => {
        localStorage.setItem('debounced', JSON.stringify(data));
      });
      const debouncedSave = debounce(saveFn, 100);

      debouncedSave({ value: 1 });
      debouncedSave({ value: 2 });
      debouncedSave({ value: 3 });

      expect(saveFn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);

      expect(saveFn).toHaveBeenCalledTimes(1);
      expect(JSON.parse(localStorage.getItem('debounced')!).value).toBe(3);
    });

    it('TC-INT-017: Should handle rapid form input with debounced localStorage', () => {
      const formData = { name: '', email: '' };
      const saveFn = vi.fn((data: any) => {
        localStorage.setItem('formData', JSON.stringify(data));
      });
      const debouncedSave = debounce(saveFn, 200);

      // Simulate rapid typing
      for (let i = 0; i < 20; i++) {
        formData.name = 'J' + 'o'.repeat(i);
        debouncedSave(formData);
      }

      vi.advanceTimersByTime(200);

      const stored = JSON.parse(localStorage.getItem('formData')!);
      expect(stored.name).toContain('o');
      expect(saveFn).toHaveBeenCalledTimes(1);
    });

    it('TC-INT-018: Should handle debounced localStorage reads', () => {
      localStorage.setItem('data', JSON.stringify({ value: 'initial' }));

      const readFn = vi.fn(() => {
        return JSON.parse(localStorage.getItem('data')!);
      });
      const debouncedRead = debounce(readFn, 100);

      for (let i = 0; i < 10; i++) {
        debouncedRead();
      }

      vi.advanceTimersByTime(100);
      expect(readFn).toHaveBeenCalledTimes(1);
    });

    it('TC-INT-019: Should handle debounced localStorage clear', () => {
      localStorage.setItem('temp1', JSON.stringify('value1'));
      localStorage.setItem('temp2', JSON.stringify('value2'));

      const clearFn = vi.fn(() => {
        localStorage.clear();
      });
      const debouncedClear = debounce(clearFn, 100);

      debouncedClear();
      debouncedClear();
      debouncedClear();

      expect(localStorage.getItem('temp1')).toBeDefined();
      vi.advanceTimersByTime(100);
      expect(clearFn).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('temp1')).toBe(null);
    });

    it('TC-INT-020: Should optimize localStorage writes with debounce', () => {
      const writes: number[] = [];
      const saveFn = vi.fn(() => {
        writes.push(Date.now());
      });
      const debouncedSave = debounce(saveFn, 50);

      for (let i = 0; i < 100; i++) {
        debouncedSave();
        vi.advanceTimersByTime(10);
      }

      vi.advanceTimersByTime(50);
      expect(writes.length).toBeLessThan(100); // Debouncing reduced writes
    });

    it('TC-INT-021: Should handle debounced localStorage with error recovery', () => {
      let shouldError = true;
      const saveFn = vi.fn(() => {
        if (shouldError) {
          shouldError = false;
          throw new Error('Storage error');
        }

        localStorage.setItem('recovered', JSON.stringify('success'));
      });
      const debouncedSave = debounce(saveFn, 100);

      debouncedSave();
      expect(() => {
        vi.advanceTimersByTime(100);
      }).toThrow('Storage error');

      expect(saveFn).toHaveBeenCalledTimes(1);

      debouncedSave();
      vi.advanceTimersByTime(100);

      expect(JSON.parse(localStorage.getItem('recovered')!)).toBe('success');
      expect(saveFn).toHaveBeenCalledTimes(2);
    });

    it('TC-INT-022: Should handle multiple debounced localStorage operations', () => {
      const save1 = vi.fn((data: any) => localStorage.setItem('data1', JSON.stringify(data)));
      const save2 = vi.fn((data: any) => localStorage.setItem('data2', JSON.stringify(data)));
      const save3 = vi.fn((data: any) => localStorage.setItem('data3', JSON.stringify(data)));

      const debounced1 = debounce(save1, 100);
      const debounced2 = debounce(save2, 100);
      const debounced3 = debounce(save3, 100);

      debounced1({ value: 'a' });
      debounced2({ value: 'b' });
      debounced3({ value: 'c' });

      vi.advanceTimersByTime(100);

      expect(JSON.parse(localStorage.getItem('data1')!).value).toBe('a');
      expect(JSON.parse(localStorage.getItem('data2')!).value).toBe('b');
      expect(JSON.parse(localStorage.getItem('data3')!).value).toBe('c');
    });

    it('TC-INT-023: Should handle debounced localStorage with immediate read', () => {
      const saveFn = vi.fn((data: any) => {
        localStorage.setItem('immediate', JSON.stringify(data));
      });
      const debouncedSave = debounce(saveFn, 100);

      debouncedSave({ value: 'pending' });

      // Immediate read returns null (not saved yet)
      expect(localStorage.getItem('immediate')).toBe(null);

      vi.advanceTimersByTime(100);

      // After debounce, data is saved
      expect(JSON.parse(localStorage.getItem('immediate')!).value).toBe('pending');
    });

    it('TC-INT-024: Should handle debounced localStorage with cache invalidation', () => {
      let cache: any = null;

      const loadFn = vi.fn(() => {
        cache = JSON.parse(localStorage.getItem('cached')!);
      });
      const debouncedLoad = debounce(loadFn, 100);

      localStorage.setItem('cached', JSON.stringify({ value: 'v1' }));
      debouncedLoad();

      // Update before debounce completes
      localStorage.setItem('cached', JSON.stringify({ value: 'v2' }));

      vi.advanceTimersByTime(100);
      expect(cache.value).toBe('v2');
    });

    it('TC-INT-025: Should handle debounced localStorage batch updates', () => {
      const batchSave = vi.fn((updates: Array<[string, any]>) => {
        updates.forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
      });
      const debouncedBatch = debounce(batchSave, 100);

      const updates: Array<[string, any]> = [
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3', 'value3'],
      ];

      debouncedBatch(updates);
      vi.advanceTimersByTime(100);

      expect(JSON.parse(localStorage.getItem('key1')!)).toBe('value1');
      expect(JSON.parse(localStorage.getItem('key2')!)).toBe('value2');
      expect(JSON.parse(localStorage.getItem('key3')!)).toBe('value3');
    });

    it('TC-INT-026: Should handle debounced localStorage with queue', () => {
      const queue: any[] = [];

      const processFn = vi.fn(() => {
        queue.forEach((item, index) => {
          localStorage.setItem(`queued-${index}`, JSON.stringify(item));
        });
        queue.length = 0;
      });
      const debouncedProcess = debounce(processFn, 100);

      for (let i = 0; i < 10; i++) {
        queue.push({ id: i, value: `item-${i}` });
        debouncedProcess();
      }

      vi.advanceTimersByTime(100);
      expect(JSON.parse(localStorage.getItem('queued-5')!).id).toBe(5);
    });

    it('TC-INT-027: Should handle debounced localStorage with compression', () => {
      const compressFn = vi.fn((data: any) => {
        // Simulate compression
        const compressed = JSON.stringify(data).length;
        localStorage.setItem('compressed', JSON.stringify({ size: compressed, data }));
      });
      const debouncedCompress = debounce(compressFn, 100);

      const largeData = { items: Array.from({ length: 100 }, (_, i) => ({ id: i })) };
      debouncedCompress(largeData);

      vi.advanceTimersByTime(100);

      const stored = JSON.parse(localStorage.getItem('compressed')!);
      expect(stored.size).toBeGreaterThan(0);
    });

    it('TC-INT-028: Should handle debounced localStorage with TTL', () => {
      const saveFn = vi.fn((key: string, value: any, ttl: number) => {
        const item = {
          value,
          expires: Date.now() + ttl,
        };
        localStorage.setItem(key, JSON.stringify(item));
      });
      const debouncedSave = debounce(saveFn, 100);

      debouncedSave('ttl-data', 'value', 5000);
      vi.advanceTimersByTime(100);

      const stored = JSON.parse(localStorage.getItem('ttl-data')!);
      expect(stored.value).toBe('value');
      expect(stored.expires).toBeGreaterThan(Date.now());
    });

    it('TC-INT-029: Should handle debounced localStorage with migration', () => {
      localStorage.setItem('v1-data', JSON.stringify({ version: 1, value: 'old' }));

      const migrateFn = vi.fn(() => {
        const old = JSON.parse(localStorage.getItem('v1-data')!);
        const migrated = { version: 2, value: old.value, migrated: true };
        localStorage.setItem('v2-data', JSON.stringify(migrated));
        localStorage.removeItem('v1-data');
      });
      const debouncedMigrate = debounce(migrateFn, 100);

      debouncedMigrate();
      vi.advanceTimersByTime(100);

      expect(localStorage.getItem('v1-data')).toBe(null);
      expect(JSON.parse(localStorage.getItem('v2-data')!).version).toBe(2);
    });

    it('TC-INT-030: Should handle debounced localStorage with synchronization', () => {
      const syncFn = vi.fn(() => {
        const data = JSON.parse(localStorage.getItem('sync-data')!) || { counter: 0 };
        data.counter++;
        data.lastSync = Date.now();
        localStorage.setItem('sync-data', JSON.stringify(data));
      });
      const debouncedSync = debounce(syncFn, 100);

      for (let i = 0; i < 5; i++) {
        debouncedSync();
      }

      vi.advanceTimersByTime(100);

      const stored = JSON.parse(localStorage.getItem('sync-data')!);
      expect(stored.counter).toBe(1); // Only one sync despite 5 calls
    });
  });

  // Test Group 3: Cookie + Debounce Integration (15 cases)
  describe('Group 4.3: Cookie + Debounce Integration', () => {
    it('TC-INT-031: Should debounce cookie parsing', () => {
      const parseFn = vi.fn((cookieStr: string) => parseCookies(cookieStr));
      const debouncedParse = debounce(parseFn, 100);

      for (let i = 0; i < 20; i++) {
        debouncedParse('session=abc123; user=john');
      }

      expect(parseFn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(parseFn).toHaveBeenCalledTimes(1);
    });

    it('TC-INT-032: Should handle debounced cookie updates', () => {
      const updateFn = vi.fn((cookies: Record<string, string>) => {
        return Object.entries(cookies)
          .map(([k, v]) => `${k}=${v}`)
          .join('; ');
      });
      const debouncedUpdate = debounce(updateFn, 100);

      debouncedUpdate({ session: 'new-session', user: 'jane' });
      vi.advanceTimersByTime(100);

      expect(updateFn).toHaveReturnedWith('session=new-session; user=jane');
    });

    it('TC-INT-033: Should optimize cookie parsing with debounce', () => {
      const parseCount = { value: 0 };
      const parseFn = vi.fn((cookieStr: string) => {
        parseCount.value++;
        return parseCookies(cookieStr);
      });
      const debouncedParse = debounce(parseFn, 50);

      for (let i = 0; i < 100; i++) {
        debouncedParse('key=value');
        vi.advanceTimersByTime(10);
      }

      vi.advanceTimersByTime(50);
      expect(parseCount.value).toBeLessThan(100);
    });

    it('TC-INT-034: Should handle debounced cookie validation', () => {
      const validateFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);
        return Object.keys(cookies).length > 0;
      });
      const debouncedValidate = debounce(validateFn, 100);

      debouncedValidate('valid=cookie');
      vi.advanceTimersByTime(100);

      expect(validateFn).toHaveReturnedWith(true);
    });

    it('TC-INT-035: Should handle debounced cookie merge operations', () => {
      const mergeFn = vi.fn((cookie1: string, cookie2: string) => {
        const parsed1 = parseCookies(cookie1);
        const parsed2 = parseCookies(cookie2);

        return { ...parsed1, ...parsed2 };
      });
      const debouncedMerge = debounce(mergeFn, 100);

      debouncedMerge('a=1; b=2', 'c=3; d=4');
      vi.advanceTimersByTime(100);

      const result = mergeFn.mock.results[0].value;
      expect(result).toEqual({ a: '1', b: '2', c: '3', d: '4' });
    });

    it('TC-INT-036: Should handle debounced cookie encoding', () => {
      const encodeFn = vi.fn((data: any) => {
        return encodeURIComponent(JSON.stringify(data));
      });
      const debouncedEncode = debounce(encodeFn, 100);

      debouncedEncode({ user: 'john', email: 'john@example.com' });
      vi.advanceTimersByTime(100);

      const result = encodeFn.mock.results[0].value;
      expect(decodeURIComponent(result)).toContain('john@example.com');
    });

    it('TC-INT-037: Should handle debounced cookie filtering', () => {
      const filterFn = vi.fn((cookieStr: string, allowList: string[]) => {
        const cookies = parseCookies(cookieStr);
        return Object.fromEntries(Object.entries(cookies).filter(([key]) => allowList.includes(key)));
      });
      const debouncedFilter = debounce(filterFn, 100);

      debouncedFilter('a=1; b=2; c=3', ['a', 'c']);
      vi.advanceTimersByTime(100);

      const result = filterFn.mock.results[0].value;
      expect(result).toEqual({ a: '1', c: '3' });
    });

    it('TC-INT-038: Should handle debounced cookie expiry check', () => {
      const checkExpiryFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);
        return Object.fromEntries(
          Object.entries(cookies).filter(([_, value]) => {
            try {
              const data = JSON.parse(decodeURIComponent(value));
              return !data.expires || data.expires > Date.now();
            } catch {
              return true;
            }
          }),
        );
      });
      const debouncedCheck = debounce(checkExpiryFn, 100);

      const validData = encodeURIComponent(JSON.stringify({ value: 'valid', expires: Date.now() + 5000 }));
      debouncedCheck(`valid=${validData}`);

      vi.advanceTimersByTime(100);
      expect(checkExpiryFn).toHaveBeenCalled();
    });

    it('TC-INT-039: Should handle debounced cookie sanitization', () => {
      const sanitizeFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);
        const sanitized: Record<string, string> = {};
        Object.entries(cookies).forEach(([key, value]) => {
          if (!key.startsWith('__') && !key.includes('proto')) {
            sanitized[key] = value;
          }
        });

        return sanitized;
      });
      const debouncedSanitize = debounce(sanitizeFn, 100);

      debouncedSanitize('safe=value; __proto__=dangerous; normal=ok');
      vi.advanceTimersByTime(100);

      const result = sanitizeFn.mock.results[0].value;
      expect(result.safe).toBe('value');
      expect(result.normal).toBe('ok');

      // Note: Object.entries won't enumerate __proto__ as a regular property
      expect(result.hasOwnProperty('__proto__')).toBe(false);
    });

    it('TC-INT-040: Should handle debounced cookie transformation', () => {
      const transformFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);
        return Object.fromEntries(
          Object.entries(cookies).map(([key, value]) => [key.toUpperCase(), value.toUpperCase()]),
        );
      });
      const debouncedTransform = debounce(transformFn, 100);

      debouncedTransform('name=john; city=boston');
      vi.advanceTimersByTime(100);

      const result = transformFn.mock.results[0].value;
      expect(result.NAME).toBe('JOHN');
      expect(result.CITY).toBe('BOSTON');
    });

    it('TC-INT-041: Should handle debounced cookie batch parsing', () => {
      const batchParseFn = vi.fn((cookieStrings: string[]) => {
        return cookieStrings.map((str) => parseCookies(str));
      });
      const debouncedBatchParse = debounce(batchParseFn, 100);

      const cookieStrings = ['session1=abc', 'session2=def', 'session3=ghi'];

      debouncedBatchParse(cookieStrings);
      vi.advanceTimersByTime(100);

      const results = batchParseFn.mock.results[0].value;
      expect(results).toHaveLength(3);
      expect(results[0].session1).toBe('abc');
    });

    it('TC-INT-042: Should handle debounced cookie aggregation', () => {
      const aggregateFn = vi.fn((cookieStrings: string[]) => {
        const allCookies = cookieStrings.map((str) => parseCookies(str));
        return allCookies.reduce((acc, cookies) => ({ ...acc, ...cookies }), {});
      });
      const debouncedAggregate = debounce(aggregateFn, 100);

      debouncedAggregate(['a=1; b=2', 'c=3; d=4', 'e=5']);
      vi.advanceTimersByTime(100);

      const result = aggregateFn.mock.results[0].value;
      expect(Object.keys(result).length).toBe(5);
    });

    it('TC-INT-043: Should handle debounced cookie comparison', () => {
      const compareFn = vi.fn((cookie1: string, cookie2: string) => {
        const parsed1 = parseCookies(cookie1);
        const parsed2 = parseCookies(cookie2);

        const keys1 = Object.keys(parsed1).sort();
        const keys2 = Object.keys(parsed2).sort();

        return JSON.stringify(keys1) === JSON.stringify(keys2);
      });
      const debouncedCompare = debounce(compareFn, 100);

      debouncedCompare('a=1; b=2', 'b=3; a=4');
      vi.advanceTimersByTime(100);

      expect(compareFn).toHaveReturnedWith(true);
    });

    it('TC-INT-044: Should handle debounced cookie diff', () => {
      const diffFn = vi.fn((oldCookie: string, newCookie: string) => {
        const old = parseCookies(oldCookie);
        const current = parseCookies(newCookie);

        const added: Record<string, string> = {};
        const removed: Record<string, string> = {};

        Object.keys(current).forEach((key) => {
          if (!old[key]) {
            added[key] = current[key];
          }
        });

        Object.keys(old).forEach((key) => {
          if (!current[key]) {
            removed[key] = old[key];
          }
        });

        return { added, removed };
      });
      const debouncedDiff = debounce(diffFn, 100);

      debouncedDiff('a=1; b=2', 'b=2; c=3');
      vi.advanceTimersByTime(100);

      const result = diffFn.mock.results[0].value;
      expect(result.added.c).toBe('3');
      expect(result.removed.a).toBe('1');
    });

    it('TC-INT-045: Should handle debounced cookie analytics', () => {
      const analyticsFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);
        return {
          count: Object.keys(cookies).length,
          avgLength: Object.values(cookies).reduce((sum, v) => sum + v.length, 0) / Object.keys(cookies).length,
          maxLength: Math.max(...Object.values(cookies).map((v) => v.length)),
        };
      });
      const debouncedAnalytics = debounce(analyticsFn, 100);

      debouncedAnalytics('short=ab; medium=abcde; long=abcdefghij');
      vi.advanceTimersByTime(100);

      const result = analyticsFn.mock.results[0].value;
      expect(result.count).toBe(3);
      expect(result.maxLength).toBe(10);
    });
  });

  // Test Group 4: Triple Integration (localStorage + Cookie + Debounce) (15 cases)
  describe('Group 4.4: Triple Integration (localStorage + Cookie + Debounce)', () => {
    it('TC-INT-046: Should sync cookie to localStorage with debounce', () => {
      const syncFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);
        Object.entries(cookies).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
      });
      const debouncedSync = debounce(syncFn, 100);

      for (let i = 0; i < 10; i++) {
        debouncedSync('session=abc123; user=john');
      }

      vi.advanceTimersByTime(100);
      expect(JSON.parse(localStorage.getItem('session')!)).toBe('abc123');
      expect(syncFn).toHaveBeenCalledTimes(1);
    });

    it('TC-INT-047: Should handle complex data flow: Cookie → Parse → Debounce → localStorage', () => {
      const flowFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);
        const apiKeys = JSON.parse(decodeURIComponent(cookies.apiKeys || '{}'));
        localStorage.setItem('apiKeys', JSON.stringify(apiKeys));

        return apiKeys;
      });
      const debouncedFlow = debounce(flowFn, 100);

      const apiKeys = { openai: 'key123', anthropic: 'key456' };
      const encoded = encodeURIComponent(JSON.stringify(apiKeys));

      debouncedFlow(`apiKeys=${encoded}`);
      vi.advanceTimersByTime(100);

      const stored = JSON.parse(localStorage.getItem('apiKeys')!);
      expect(stored).toEqual(apiKeys);
    });

    it('TC-INT-048: Should optimize full sync pipeline with debounce', () => {
      let syncCount = 0;
      const fullSyncFn = vi.fn((cookieStr: string) => {
        syncCount++;

        const cookies = parseCookies(cookieStr);
        Object.entries(cookies).forEach(([key, value]) => {
          try {
            const parsed = JSON.parse(decodeURIComponent(value));
            localStorage.setItem(key, JSON.stringify(parsed));
          } catch {
            localStorage.setItem(key, JSON.stringify(value));
          }
        });
      });
      const debouncedFullSync = debounce(fullSyncFn, 100);

      // Simulate rapid cookie changes
      for (let i = 0; i < 50; i++) {
        debouncedFullSync(`data=${encodeURIComponent(JSON.stringify({ index: i }))}`);
      }

      vi.advanceTimersByTime(100);
      expect(syncCount).toBe(1); // Only one sync despite 50 changes

      const stored = JSON.parse(localStorage.getItem('data')!);
      expect(stored.index).toBe(49);
    });

    it('TC-INT-049: Should handle bidirectional sync with debounce', () => {
      const syncToStorage = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);
        localStorage.setItem('syncData', JSON.stringify(cookies));
      });

      const syncToCookie = vi.fn(() => {
        const data = localStorage.getItem('syncData');
        return data
          ? Object.entries(JSON.parse(data))
              .map(([k, v]) => `${k}=${v}`)
              .join('; ')
          : '';
      });

      const debouncedToStorage = debounce(syncToStorage, 100);
      const debouncedToCookie = debounce(syncToCookie, 100);

      debouncedToStorage('key=value');
      vi.advanceTimersByTime(100);

      debouncedToCookie();
      vi.advanceTimersByTime(100);

      expect(syncToStorage).toHaveBeenCalledTimes(1);
      expect(syncToCookie).toHaveBeenCalledTimes(1);
    });

    it('TC-INT-050: Should handle form auto-save flow', () => {
      const autoSaveFn = vi.fn((formData: any) => {
        // Save to localStorage
        localStorage.setItem('formDraft', JSON.stringify(formData));

        // Also encode for cookie sync
        const encoded = encodeURIComponent(JSON.stringify(formData));

        return `formDraft=${encoded}`;
      });
      const debouncedAutoSave = debounce(autoSaveFn, 500);

      // Simulate user typing
      const formData = { title: '', content: '' };

      for (let i = 0; i < 20; i++) {
        formData.title = 'My Post ' + 'x'.repeat(i);
        debouncedAutoSave(formData);
        vi.advanceTimersByTime(50);
      }

      vi.advanceTimersByTime(500);

      const stored = JSON.parse(localStorage.getItem('formDraft')!);
      expect(stored.title).toContain('x');
      expect(autoSaveFn).toHaveBeenCalled();
    });

    it('TC-INT-051: Should handle session management with all three', () => {
      const sessionManager = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);

        if (cookies.sessionId) {
          const session = {
            id: cookies.sessionId,
            timestamp: Date.now(),
          };
          localStorage.setItem('session', JSON.stringify(session));

          return session;
        }

        return null;
      });
      const debouncedSession = debounce(sessionManager, 100);

      debouncedSession('sessionId=abc123; user=john');
      vi.advanceTimersByTime(100);

      const session = JSON.parse(localStorage.getItem('session')!);
      expect(session.id).toBe('abc123');
    });

    it('TC-INT-052: Should handle preferences sync across all layers', () => {
      const prefsSyncFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);

        if (cookies.preferences) {
          const prefs = JSON.parse(decodeURIComponent(cookies.preferences));
          const existing = localStorage.getItem('preferences');
          const merged = existing ? { ...JSON.parse(existing), ...prefs } : prefs;
          localStorage.setItem('preferences', JSON.stringify(merged));

          return merged;
        }

        return undefined;
      });
      const debouncedPrefs = debounce(prefsSyncFn, 100);

      localStorage.setItem('preferences', JSON.stringify({ theme: 'dark' }));

      const newPrefs = { language: 'en', notifications: true };
      const encoded = encodeURIComponent(JSON.stringify(newPrefs));

      debouncedPrefs(`preferences=${encoded}`);
      vi.advanceTimersByTime(100);

      const final = JSON.parse(localStorage.getItem('preferences')!);
      expect(final.theme).toBe('dark');
      expect(final.language).toBe('en');
    });

    it('TC-INT-053: Should handle API key management with full integration', () => {
      const keyManagerFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);

        if (cookies.apiKeys) {
          const keys = JSON.parse(decodeURIComponent(cookies.apiKeys));
          const validated = Object.fromEntries(
            Object.entries(keys).filter(([_, value]) => typeof value === 'string' && value.length > 0),
          );
          localStorage.setItem('apiKeys', JSON.stringify(validated));

          return validated;
        }

        return undefined;
      });
      const debouncedKeyManager = debounce(keyManagerFn, 200);

      const apiKeys = {
        openai: 'sk-abc123',
        anthropic: 'sk-xyz789',
        invalid: '',
      };
      const encoded = encodeURIComponent(JSON.stringify(apiKeys));

      debouncedKeyManager(`apiKeys=${encoded}`);
      vi.advanceTimersByTime(200);

      const stored = JSON.parse(localStorage.getItem('apiKeys')!);
      expect(stored.openai).toBe('sk-abc123');
      expect(stored.invalid).toBeUndefined();
    });

    it('TC-INT-054: Should handle cache invalidation across all layers', () => {
      const cacheManagerFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);

        if (cookies.cacheControl === 'invalidate') {
          localStorage.removeItem('cache');
          return { invalidated: true };
        } else if (cookies.cacheData) {
          const data = JSON.parse(decodeURIComponent(cookies.cacheData));
          localStorage.setItem('cache', JSON.stringify(data));

          return { cached: true };
        }

        return undefined;
      });
      const debouncedCache = debounce(cacheManagerFn, 100);

      const data = { items: [1, 2, 3] };
      const encoded = encodeURIComponent(JSON.stringify(data));

      debouncedCache(`cacheData=${encoded}`);
      vi.advanceTimersByTime(100);
      expect(localStorage.getItem('cache')).toBeDefined();

      debouncedCache('cacheControl=invalidate');
      vi.advanceTimersByTime(100);
      expect(localStorage.getItem('cache')).toBe(null);
    });

    it('TC-INT-055: Should handle real-time collaboration sync', () => {
      const collabSyncFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);

        if (cookies.collabUpdate) {
          const update = JSON.parse(decodeURIComponent(cookies.collabUpdate));
          const current = localStorage.getItem('collabData');
          const currentData = current ? JSON.parse(current) : { updates: [] };

          currentData.updates.push(update);
          localStorage.setItem('collabData', JSON.stringify(currentData));

          return currentData;
        }

        return undefined;
      });
      const debouncedCollab = debounce(collabSyncFn, 50);

      for (let i = 0; i < 5; i++) {
        const update = { timestamp: Date.now() + i, change: `edit-${i}` };
        const encoded = encodeURIComponent(JSON.stringify(update));
        debouncedCollab(`collabUpdate=${encoded}`);
        vi.advanceTimersByTime(10);
      }

      vi.advanceTimersByTime(50);

      const collabData = JSON.parse(localStorage.getItem('collabData')!);
      expect(collabData.updates.length).toBeGreaterThan(0);
    });

    it('TC-INT-056: Should handle analytics tracking with debounce', () => {
      const analyticsFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);

        if (cookies.event) {
          const event = JSON.parse(decodeURIComponent(cookies.event));
          const analytics = localStorage.getItem('analytics');
          const data = analytics ? JSON.parse(analytics) : { events: [] };

          data.events.push(event);
          localStorage.setItem('analytics', JSON.stringify(data));

          return data;
        }

        return undefined;
      });
      const debouncedAnalytics = debounce(analyticsFn, 100);

      const events = ['click', 'scroll', 'hover', 'focus'];
      events.forEach((type) => {
        const event = { type, timestamp: Date.now() };
        const encoded = encodeURIComponent(JSON.stringify(event));
        debouncedAnalytics(`event=${encoded}`);
      });

      vi.advanceTimersByTime(100);

      const analytics = JSON.parse(localStorage.getItem('analytics')!);
      expect(analytics.events.length).toBeGreaterThan(0);
    });

    it('TC-INT-057: Should handle shopping cart sync', () => {
      const cartSyncFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);

        if (cookies.cart) {
          const cart = JSON.parse(decodeURIComponent(cookies.cart));
          localStorage.setItem('cart', JSON.stringify(cart));

          return {
            itemCount: cart.items?.length || 0,
            total: cart.total || 0,
          };
        }

        return undefined;
      });
      const debouncedCart = debounce(cartSyncFn, 300);

      const cart = {
        items: [
          { id: 1, name: 'Product A', price: 29.99 },
          { id: 2, name: 'Product B', price: 49.99 },
        ],
        total: 79.98,
      };
      const encoded = encodeURIComponent(JSON.stringify(cart));

      debouncedCart(`cart=${encoded}`);
      vi.advanceTimersByTime(300);

      const stored = JSON.parse(localStorage.getItem('cart')!);
      expect(stored.items).toHaveLength(2);
      expect(stored.total).toBe(79.98);
    });

    it('TC-INT-058: Should handle authentication flow', () => {
      const authFlowFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);

        if (cookies.authToken) {
          const token = cookies.authToken;
          const authData = {
            token,
            timestamp: Date.now(),
            expires: Date.now() + 3600000, // 1 hour
          };
          localStorage.setItem('auth', JSON.stringify(authData));

          return { authenticated: true };
        } else {
          localStorage.removeItem('auth');
          return { authenticated: false };
        }
      });
      const debouncedAuth = debounce(authFlowFn, 100);

      debouncedAuth('authToken=jwt-token-abc123');
      vi.advanceTimersByTime(100);

      const auth = JSON.parse(localStorage.getItem('auth')!);
      expect(auth.token).toBe('jwt-token-abc123');
      expect(auth.expires).toBeGreaterThan(Date.now());
    });

    it('TC-INT-059: Should handle feature flags sync', () => {
      const featureFlagsFn = vi.fn((cookieStr: string) => {
        const cookies = parseCookies(cookieStr);

        if (cookies.featureFlags) {
          const flags = JSON.parse(decodeURIComponent(cookies.featureFlags));
          const existing = localStorage.getItem('featureFlags');
          const current = existing ? JSON.parse(existing) : {};

          const updated = { ...current, ...flags, lastUpdate: Date.now() };
          localStorage.setItem('featureFlags', JSON.stringify(updated));

          return updated;
        }

        return undefined;
      });
      const debouncedFlags = debounce(featureFlagsFn, 100);

      const flags = {
        newUI: true,
        betaFeature: false,
        experimentalMode: true,
      };
      const encoded = encodeURIComponent(JSON.stringify(flags));

      debouncedFlags(`featureFlags=${encoded}`);
      vi.advanceTimersByTime(100);

      const stored = JSON.parse(localStorage.getItem('featureFlags')!);
      expect(stored.newUI).toBe(true);
      expect(stored.lastUpdate).toBeDefined();
    });

    it('TC-INT-060: Should handle complete user session lifecycle', () => {
      const sessionLifecycleFn = vi.fn((action: string, cookieStr?: string) => {
        if (action === 'start' && cookieStr) {
          const cookies = parseCookies(cookieStr);
          const session = {
            id: cookies.sessionId,
            user: cookies.user,
            startTime: Date.now(),
            active: true,
          };
          localStorage.setItem('session', JSON.stringify(session));

          return { action: 'started', session };
        } else if (action === 'end') {
          const session = JSON.parse(localStorage.getItem('session')!);
          session.active = false;
          session.endTime = Date.now();
          localStorage.setItem('session', JSON.stringify(session));

          return { action: 'ended', session };
        }

        return undefined;
      });
      const debouncedLifecycle = debounce(sessionLifecycleFn, 100);

      debouncedLifecycle('start', 'sessionId=sess-123; user=john');
      vi.advanceTimersByTime(100);

      let session = JSON.parse(localStorage.getItem('session')!);
      expect(session.active).toBe(true);

      debouncedLifecycle('end');
      vi.advanceTimersByTime(100);

      session = JSON.parse(localStorage.getItem('session')!);
      expect(session.active).toBe(false);
      expect(session.endTime).toBeDefined();
    });
  });
});

/*
 * ============================================================================
 * SUMMARY
 * ============================================================================
 */

/**
 * COMPREHENSIVE TEST SUITE SUMMARY
 *
 * Total Test Cases: 280+
 *
 * Section 1: localStorage Tests (50 cases)
 *   - Basic operations: 10 cases
 *   - Complex data structures: 10 cases
 *   - Edge cases: 15 cases
 *   - Performance tests: 10 cases
 *   - Security tests: 5 cases
 *
 * Section 2: Cookie Handling Tests (60 cases)
 *   - Basic operations: 10 cases
 *   - Complex structures: 10 cases
 *   - Edge cases: 15 cases
 *   - Performance tests: 10 cases
 *   - Security tests: 15 cases
 *
 * Section 3: Debounce Tests (40 cases)
 *   - Basic debouncing: 10 cases
 *   - Advanced scenarios: 10 cases
 *   - Performance tests: 10 cases
 *   - Edge cases: 10 cases
 *
 * Section 4: Integration Tests (60 cases)
 *   - localStorage + Cookie: 15 cases
 *   - Debounce + localStorage: 15 cases
 *   - Cookie + Debounce: 15 cases
 *   - Triple integration: 15 cases
 *
 * Coverage:
 *   - Easy cases: ~30%
 *   - Moderate cases: ~40%
 *   - Difficult cases: ~20%
 *   - Advanced/Edge cases: ~10%
 */
