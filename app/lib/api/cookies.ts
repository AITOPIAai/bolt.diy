export function parseCookies(cookieHeader: string | null) {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) {
    return cookies;
  }

  // Split the cookie string by semicolons and spaces
  const items = cookieHeader.split(';').map((cookie) => cookie.trim());

  items.forEach((item) => {
    const [name, ...rest] = item.split('=');

    if (name && rest.length > 0) {
      // Decode the name and value, and join value parts in case it contains '='
      const decodedName = decodeURIComponent(name.trim());
      const decodedValue = decodeURIComponent(rest.join('=').trim());
      cookies[decodedName] = decodedValue;
    }
  });

  return cookies;
}

export function getApiKeysFromCookie(cookieHeader: string | null): Record<string, string> {
  const cookies = parseCookies(cookieHeader);

  if (!cookies.apiKeys) {
    return {};
  }

  try {
    const parsed = JSON.parse(cookies.apiKeys);

    // Validate that the parsed value is an object
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }

    console.error('Invalid API keys format in cookie - expected object, got:', typeof parsed);

    return {};
  } catch (error) {
    console.error('Failed to parse API keys from cookie:', error);
    return {};
  }
}

export function getProviderSettingsFromCookie(cookieHeader: string | null): Record<string, any> {
  const cookies = parseCookies(cookieHeader);

  if (!cookies.providers) {
    return {};
  }

  try {
    const parsed = JSON.parse(cookies.providers);

    // Validate that the parsed value is an object
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }

    console.error('Invalid provider settings format in cookie - expected object, got:', typeof parsed);

    return {};
  } catch (error) {
    console.error('Failed to parse provider settings from cookie:', error);
    return {};
  }
}
