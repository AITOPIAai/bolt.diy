// Client-side storage utilities with error handling
import { logger } from '~/utils/logger';

// Check if localStorage is available at runtime (not at module load time)
function isClient(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Safely gets an item from localStorage and parses it as JSON
 * @param key The localStorage key
 * @returns The parsed value or null if not found or on error
 */
export function getLocalStorage<T = any>(key: string): T | null {
  if (!isClient()) {
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    logger.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Safely sets an item in localStorage by stringifying it as JSON
 * @param key The localStorage key
 * @param value The value to store
 * @returns true if successful, false on error
 */
export function setLocalStorage(key: string, value: any): boolean {
  if (!isClient()) {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Safely removes an item from localStorage
 * @param key The localStorage key to remove
 * @returns true if successful, false on error
 */
export function removeLocalStorage(key: string): boolean {
  if (!isClient()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    logger.error(`Error removing from localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Safely gets a raw string from localStorage without JSON parsing
 * @param key The localStorage key
 * @returns The raw string value or null if not found or on error
 */
export function getLocalStorageRaw(key: string): string | null {
  if (!isClient()) {
    return null;
  }

  try {
    return localStorage.getItem(key);
  } catch (error) {
    logger.error(`Error reading raw from localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Safely sets a raw string in localStorage without JSON stringifying
 * @param key The localStorage key
 * @param value The raw string value to store
 * @returns true if successful, false on error
 */
export function setLocalStorageRaw(key: string, value: string): boolean {
  if (!isClient()) {
    return false;
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    logger.error(`Error writing raw to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Safely clears all items from localStorage
 * @returns true if successful, false on error
 */
export function clearLocalStorage(): boolean {
  if (!isClient()) {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    logger.error('Error clearing localStorage:', error);
    return false;
  }
}
