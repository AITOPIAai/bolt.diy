import { describe, expect, it } from 'vitest';
import { parseCookies, getApiKeysFromCookie, getProviderSettingsFromCookie } from './cookies';

describe('Cookie Utilities', () => {
  describe('parseCookies', () => {
    it('should parse simple cookie string', () => {
      const cookieHeader = 'name=value';
      const result = parseCookies(cookieHeader);

      expect(result).toEqual({ name: 'value' });
    });

    it('should parse multiple cookies', () => {
      const cookieHeader = 'first=value1; second=value2; third=value3';
      const result = parseCookies(cookieHeader);

      expect(result).toEqual({
        first: 'value1',
        second: 'value2',
        third: 'value3',
      });
    });

    it('should handle cookies with spaces', () => {
      const cookieHeader = '  name  =  value  ;  other  =  data  ';
      const result = parseCookies(cookieHeader);

      expect(result).toEqual({
        name: 'value',
        other: 'data',
      });
    });

    it('should handle URL-encoded values', () => {
      const cookieHeader = 'encoded=hello%20world; special=%21%40%23';
      const result = parseCookies(cookieHeader);

      expect(result).toEqual({
        encoded: 'hello world',
        special: '!@#',
      });
    });

    it('should handle empty cookie string', () => {
      const result = parseCookies('');
      expect(result).toEqual({});
    });

    it('should handle null cookie string', () => {
      const result = parseCookies(null);
      expect(result).toEqual({});
    });

    it('should handle malformed cookies gracefully', () => {
      const cookieHeader = 'valid=value; malformed; another=value2';
      const result = parseCookies(cookieHeader);

      expect(result).toHaveProperty('valid', 'value');
      expect(result).toHaveProperty('another', 'value2');
    });

    it('should handle cookies with equals signs in value', () => {
      const cookieHeader = 'base64=abc=def=ghi';
      const result = parseCookies(cookieHeader);

      expect(result.base64).toBe('abc=def=ghi');
    });

    it('should handle cookies with special characters', () => {
      const cookieHeader = 'special=%7B%22key%22%3A%22value%22%7D';
      const result = parseCookies(cookieHeader);

      expect(result.special).toBe('{"key":"value"}');
    });
  });

  describe('getApiKeysFromCookie', () => {
    it('should return valid API keys object', () => {
      const cookieHeader = `apiKeys=${encodeURIComponent(
        JSON.stringify({
          OpenAI: 'sk-test-key-123',
          Anthropic: 'sk-ant-test-456',
        }),
      )}`;

      const result = getApiKeysFromCookie(cookieHeader);

      expect(result).toEqual({
        OpenAI: 'sk-test-key-123',
        Anthropic: 'sk-ant-test-456',
      });
    });

    it('should return empty object when apiKeys cookie missing', () => {
      const cookieHeader = 'other=value';
      const result = getApiKeysFromCookie(cookieHeader);

      expect(result).toEqual({});
    });

    it('should return empty object when apiKeys is invalid JSON', () => {
      const cookieHeader = 'apiKeys={invalid json}';
      const result = getApiKeysFromCookie(cookieHeader);

      expect(result).toEqual({});
    });

    it('should return empty object when apiKeys is not an object', () => {
      const cookieHeader = `apiKeys=${encodeURIComponent(JSON.stringify('not an object'))}`;
      const result = getApiKeysFromCookie(cookieHeader);

      expect(result).toEqual({});
    });

    it('should return empty object when apiKeys is an array', () => {
      const cookieHeader = `apiKeys=${encodeURIComponent(JSON.stringify(['array', 'values']))}`;
      const result = getApiKeysFromCookie(cookieHeader);

      expect(result).toEqual({});
    });

    it('should return empty object when apiKeys is null', () => {
      const cookieHeader = `apiKeys=${encodeURIComponent(JSON.stringify(null))}`;
      const result = getApiKeysFromCookie(cookieHeader);

      expect(result).toEqual({});
    });

    it('should handle empty apiKeys object', () => {
      const cookieHeader = `apiKeys=${encodeURIComponent(JSON.stringify({}))}`;
      const result = getApiKeysFromCookie(cookieHeader);

      expect(result).toEqual({});
    });

    it('should handle multiple providers', () => {
      const cookieHeader = `apiKeys=${encodeURIComponent(
        JSON.stringify({
          OpenAI: 'key1',
          Anthropic: 'key2',
          Google: 'key3',
          Groq: 'key4',
        }),
      )}`;

      const result = getApiKeysFromCookie(cookieHeader);

      expect(Object.keys(result)).toHaveLength(4);
      expect(result.Google).toBe('key3');
    });
  });

  describe('getProviderSettingsFromCookie', () => {
    it('should return valid provider settings', () => {
      const cookieHeader = `providers=${encodeURIComponent(
        JSON.stringify({
          OpenAI: { baseUrl: 'https://api.openai.com', enabled: true },
          Anthropic: { baseUrl: 'https://api.anthropic.com', enabled: false },
        }),
      )}`;

      const result = getProviderSettingsFromCookie(cookieHeader);

      expect(result).toEqual({
        OpenAI: { baseUrl: 'https://api.openai.com', enabled: true },
        Anthropic: { baseUrl: 'https://api.anthropic.com', enabled: false },
      });
    });

    it('should return empty object when providers cookie missing', () => {
      const cookieHeader = 'other=value';
      const result = getProviderSettingsFromCookie(cookieHeader);

      expect(result).toEqual({});
    });

    it('should return empty object for invalid JSON', () => {
      const cookieHeader = 'providers={invalid';
      const result = getProviderSettingsFromCookie(cookieHeader);

      expect(result).toEqual({});
    });

    it('should return empty object when providers is not an object', () => {
      const cookieHeader = `providers=${encodeURIComponent(JSON.stringify('string value'))}`;
      const result = getProviderSettingsFromCookie(cookieHeader);

      expect(result).toEqual({});
    });

    it('should return empty object when providers is null', () => {
      const cookieHeader = `providers=${encodeURIComponent(JSON.stringify(null))}`;
      const result = getProviderSettingsFromCookie(cookieHeader);

      expect(result).toEqual({});
    });

    it('should return empty object when providers is an array', () => {
      const cookieHeader = `providers=${encodeURIComponent(JSON.stringify([1, 2, 3]))}`;
      const result = getProviderSettingsFromCookie(cookieHeader);

      expect(result).toEqual({});
    });
  });

  describe('integration tests', () => {
    it('should work with real-world cookie header', () => {
      const cookieHeader =
        `apiKeys=${encodeURIComponent(JSON.stringify({ OpenAI: 'sk-proj-abc123', Anthropic: 'sk-ant-xyz789' }))}; ` +
        `providers=${encodeURIComponent(JSON.stringify({ OpenAI: { baseUrl: 'https://api.openai.com', enabled: true } }))}; ` +
        'theme=dark; session=abc123';

      const cookies = parseCookies(cookieHeader);

      expect(cookies.theme).toBe('dark');
      expect(cookies.session).toBe('abc123');

      const apiKeys = getApiKeysFromCookie(cookieHeader);
      expect(apiKeys.OpenAI).toBe('sk-proj-abc123');
      expect(apiKeys.Anthropic).toBe('sk-ant-xyz789');

      const providers = getProviderSettingsFromCookie(cookieHeader);
      expect(providers.OpenAI.enabled).toBe(true);
      expect(providers.OpenAI.baseUrl).toBe('https://api.openai.com');
    });

    it('should handle corrupted cookie data gracefully', () => {
      const cookieHeader = 'apiKeys=corrupted; providers={invalid}; valid=value';

      const cookies = parseCookies(cookieHeader);
      const apiKeys = getApiKeysFromCookie(cookieHeader);
      const providers = getProviderSettingsFromCookie(cookieHeader);

      expect(apiKeys).toEqual({});
      expect(providers).toEqual({});
      expect(cookies.valid).toBe('value');
    });
  });
});
