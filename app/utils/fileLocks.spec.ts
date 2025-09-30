import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { getCurrentChatId, isFileLocked, isFolderLocked, hasLockedItems } from './fileLocks';
import * as lockedFiles from '~/lib/persistence/lockedFiles';

// Mock the lockedFiles module
vi.mock('~/lib/persistence/lockedFiles', () => ({
  getLockedItems: vi.fn(() => []),
  isFileLocked: vi.fn(() => ({ locked: false })),
  isFolderLocked: vi.fn(() => ({ locked: false })),
  isPathInLockedFolder: vi.fn(() => ({ locked: false })),
}));

describe('File Locks Utility', () => {
  let originalWindow: typeof globalThis.window;

  beforeEach(() => {
    originalWindow = globalThis.window;
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.window = originalWindow;
  });

  describe('getCurrentChatId', () => {
    it('should extract chat ID from URL', () => {
      Object.defineProperty(globalThis, 'window', {
        value: {
          location: {
            pathname: '/chat/abc123',
          },
        },
        writable: true,
        configurable: true,
      });

      const chatId = getCurrentChatId();
      expect(chatId).toBe('abc123');
    });

    it('should handle different URL formats', () => {
      const testCases = [
        { path: '/chat/test-id-123', expected: 'test-id-123' },
        { path: '/chat/uuid-v4-format', expected: 'uuid-v4-format' },
        { path: '/chat/123', expected: '123' },
        { path: '/chat/chat-with-dashes', expected: 'chat-with-dashes' },
      ];

      testCases.forEach(({ path, expected }) => {
        Object.defineProperty(globalThis, 'window', {
          value: { location: { pathname: path } },
          writable: true,
          configurable: true,
        });

        expect(getCurrentChatId()).toBe(expected);
      });
    });

    it('should return default when not in chat URL', () => {
      Object.defineProperty(globalThis, 'window', {
        value: {
          location: {
            pathname: '/settings',
          },
        },
        writable: true,
        configurable: true,
      });

      const chatId = getCurrentChatId();
      expect(chatId).toBe('default');
    });

    it('should return default when window is undefined', () => {
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const chatId = getCurrentChatId();
      expect(chatId).toBe('default');
    });

    it('should handle homepage URL', () => {
      Object.defineProperty(globalThis, 'window', {
        value: {
          location: {
            pathname: '/',
          },
        },
        writable: true,
        configurable: true,
      });

      expect(getCurrentChatId()).toBe('default');
    });

    it('should handle malformed chat URLs', () => {
      const malformedPaths = ['/chat/', '/chat', '/chat//', 'chat/abc'];

      malformedPaths.forEach((path) => {
        Object.defineProperty(globalThis, 'window', {
          value: { location: { pathname: path } },
          writable: true,
          configurable: true,
        });

        const result = getCurrentChatId();
        expect(result).toBeTruthy(); // Should not throw
      });
    });
  });

  describe('isFileLocked', () => {
    beforeEach(() => {
      Object.defineProperty(globalThis, 'window', {
        value: {
          location: {
            pathname: '/chat/test-chat',
          },
        },
        writable: true,
        configurable: true,
      });
    });

    it('should return locked status for a file', () => {
      vi.mocked(lockedFiles.isFileLocked).mockReturnValue({
        locked: true,
        lockedBy: 'user123',
      });

      const result = isFileLocked('/path/to/file.ts');

      expect(result.locked).toBe(true);
      expect(result.lockedBy).toBe('user123');
      expect(lockedFiles.isFileLocked).toHaveBeenCalledWith('test-chat', '/path/to/file.ts');
    });

    it('should check folder lock if file is not locked', () => {
      vi.mocked(lockedFiles.isFileLocked).mockReturnValue({ locked: false });
      vi.mocked(lockedFiles.isPathInLockedFolder).mockReturnValue({
        locked: true,
        lockedBy: 'folder-lock',
      });

      const result = isFileLocked('/folder/file.ts');

      expect(result.locked).toBe(true);
      expect(result.lockedBy).toBe('folder-lock');
      expect(lockedFiles.isPathInLockedFolder).toHaveBeenCalledWith('test-chat', '/folder/file.ts');
    });

    it('should use provided chatId', () => {
      vi.mocked(lockedFiles.isFileLocked).mockReturnValue({ locked: false });

      isFileLocked('/file.ts', 'custom-chat-id');

      expect(lockedFiles.isFileLocked).toHaveBeenCalledWith('custom-chat-id', '/file.ts');
    });

    it('should return not locked when both checks fail', () => {
      vi.mocked(lockedFiles.isFileLocked).mockReturnValue({ locked: false });
      vi.mocked(lockedFiles.isPathInLockedFolder).mockReturnValue({ locked: false });

      const result = isFileLocked('/unlocked/file.ts');

      expect(result.locked).toBe(false);
      expect(result.lockedBy).toBeUndefined();
    });

    it('should handle errors gracefully', () => {
      vi.mocked(lockedFiles.isFileLocked).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = isFileLocked('/file.ts');

      expect(result.locked).toBe(false);
      expect(result.lockedBy).toBeUndefined();
    });

    it('should handle different file paths', () => {
      const testPaths = [
        '/src/index.ts',
        '/app/components/Button.tsx',
        '/package.json',
        '/folder/subfolder/deep/file.js',
        'relative/path.ts',
      ];

      vi.mocked(lockedFiles.isFileLocked).mockReturnValue({ locked: false });
      vi.mocked(lockedFiles.isPathInLockedFolder).mockReturnValue({ locked: false });

      testPaths.forEach((path) => {
        const result = isFileLocked(path);
        expect(result).toHaveProperty('locked');
      });
    });
  });

  describe('isFolderLocked', () => {
    beforeEach(() => {
      Object.defineProperty(globalThis, 'window', {
        value: {
          location: {
            pathname: '/chat/test-chat',
          },
        },
        writable: true,
        configurable: true,
      });
    });

    it('should return locked status for a folder', () => {
      vi.mocked(lockedFiles.isFolderLocked).mockReturnValue({
        locked: true,
        lockedBy: 'user456',
      });

      const result = isFolderLocked('/src/components');

      expect(result.locked).toBe(true);
      expect(result.lockedBy).toBe('user456');
      expect(lockedFiles.isFolderLocked).toHaveBeenCalledWith('test-chat', '/src/components');
    });

    it('should use provided chatId', () => {
      vi.mocked(lockedFiles.isFolderLocked).mockReturnValue({ locked: false });

      isFolderLocked('/folder', 'custom-id');

      expect(lockedFiles.isFolderLocked).toHaveBeenCalledWith('custom-id', '/folder');
    });

    it('should handle errors gracefully', () => {
      vi.mocked(lockedFiles.isFolderLocked).mockImplementation(() => {
        throw new Error('Lock check failed');
      });

      const result = isFolderLocked('/folder');

      expect(result.locked).toBe(false);
    });

    it('should handle root folder', () => {
      vi.mocked(lockedFiles.isFolderLocked).mockReturnValue({ locked: false });

      const result = isFolderLocked('/');

      expect(result.locked).toBe(false);
      expect(lockedFiles.isFolderLocked).toHaveBeenCalledWith('test-chat', '/');
    });

    it('should handle nested folders', () => {
      vi.mocked(lockedFiles.isFolderLocked).mockReturnValue({
        locked: true,
        lockedBy: 'nested-lock',
      });

      const result = isFolderLocked('/a/b/c/d/e');

      expect(result.locked).toBe(true);
      expect(result.lockedBy).toBe('nested-lock');
    });
  });

  describe('hasLockedItems', () => {
    beforeEach(() => {
      Object.defineProperty(globalThis, 'window', {
        value: {
          location: {
            pathname: '/chat/current-chat',
          },
        },
        writable: true,
        configurable: true,
      });
    });

    it('should return true when chat has locked items', () => {
      vi.mocked(lockedFiles.getLockedItems).mockReturnValue([
        { chatId: 'current-chat', path: '/file.ts', isFolder: false },
        { chatId: 'other-chat', path: '/other.ts', isFolder: false },
      ]);

      const result = hasLockedItems();

      expect(result).toBe(true);
    });

    it('should return false when chat has no locked items', () => {
      vi.mocked(lockedFiles.getLockedItems).mockReturnValue([
        { chatId: 'other-chat', path: '/file.ts', isFolder: false },
      ]);

      const result = hasLockedItems();

      expect(result).toBe(false);
    });

    it('should return false when no items are locked', () => {
      vi.mocked(lockedFiles.getLockedItems).mockReturnValue([]);

      const result = hasLockedItems();

      expect(result).toBe(false);
    });

    it('should use provided chatId', () => {
      vi.mocked(lockedFiles.getLockedItems).mockReturnValue([
        { chatId: 'custom-chat', path: '/file.ts', isFolder: false },
      ]);

      const result = hasLockedItems('custom-chat');

      expect(result).toBe(true);
    });

    it('should handle errors gracefully', () => {
      vi.mocked(lockedFiles.getLockedItems).mockImplementation(() => {
        throw new Error('Failed to get locked items');
      });

      const result = hasLockedItems();

      expect(result).toBe(false);
    });

    it('should handle multiple locked items in same chat', () => {
      vi.mocked(lockedFiles.getLockedItems).mockReturnValue([
        { chatId: 'current-chat', path: '/file1.ts', isFolder: false },
        { chatId: 'current-chat', path: '/file2.ts', isFolder: false },
        { chatId: 'current-chat', path: '/folder', isFolder: true },
      ]);

      const result = hasLockedItems();

      expect(result).toBe(true);
    });

    it('should distinguish between different chat IDs', () => {
      vi.mocked(lockedFiles.getLockedItems).mockReturnValue([
        { chatId: 'chat-1', path: '/file.ts', isFolder: false },
        { chatId: 'chat-2', path: '/file.ts', isFolder: false },
        { chatId: 'chat-3', path: '/file.ts', isFolder: false },
      ]);

      expect(hasLockedItems('chat-1')).toBe(true);
      expect(hasLockedItems('chat-2')).toBe(true);
      expect(hasLockedItems('chat-4')).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete lock workflow', () => {
      Object.defineProperty(globalThis, 'window', {
        value: { location: { pathname: '/chat/workflow-test' } },
        writable: true,
        configurable: true,
      });

      // Check file not locked initially
      vi.mocked(lockedFiles.isFileLocked).mockReturnValue({ locked: false });
      vi.mocked(lockedFiles.isPathInLockedFolder).mockReturnValue({ locked: false });

      expect(isFileLocked('/src/app.ts').locked).toBe(false);

      // Simulate file getting locked
      vi.mocked(lockedFiles.isFileLocked).mockReturnValue({
        locked: true,
        lockedBy: 'user1',
      });

      expect(isFileLocked('/src/app.ts').locked).toBe(true);

      // Check has locked items
      vi.mocked(lockedFiles.getLockedItems).mockReturnValue([
        { chatId: 'workflow-test', path: '/src/app.ts', isFolder: false },
      ]);

      expect(hasLockedItems()).toBe(true);
    });

    it('should handle folder and file locks together', () => {
      Object.defineProperty(globalThis, 'window', {
        value: { location: { pathname: '/chat/mixed-locks' } },
        writable: true,
        configurable: true,
      });

      // Folder is locked
      vi.mocked(lockedFiles.isFolderLocked).mockReturnValue({
        locked: true,
        lockedBy: 'user1',
      });

      // File in locked folder
      vi.mocked(lockedFiles.isFileLocked).mockReturnValue({ locked: false });
      vi.mocked(lockedFiles.isPathInLockedFolder).mockReturnValue({
        locked: true,
        lockedBy: 'user1',
      });

      expect(isFolderLocked('/src').locked).toBe(true);
      expect(isFileLocked('/src/index.ts').locked).toBe(true);
    });
  });
});
