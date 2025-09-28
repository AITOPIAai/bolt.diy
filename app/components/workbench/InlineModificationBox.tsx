import { useEffect, useRef, useState } from 'react';
import type { ElementInfo } from './Inspector';

interface InlineModificationBoxProps {
  element: ElementInfo | null;
  isVisible: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}

export const InlineModificationBox = ({ element, isVisible, onClose, onSend }: InlineModificationBoxProps) => {
  const [input, setInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && element) {
      setIsAnimating(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setIsAnimating(false);
      setInput('');
    }
  }, [isVisible, element]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible || !element) {
    return null;
  }

  const handleSend = () => {
    if (input.trim()) {
      // Format the message with element context
      const elementDescription = `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${
        element.className ? `.${element.className.split(' ')[0]}` : ''
      }`;
      const message = `Modify the selected ${elementDescription} element: ${input}`;
      onSend(message);
      setInput('');
      onClose();
    }
  };

  // Calculate position based on element rect
  const getBoxPosition = () => {
    const { rect } = element;
    const boxWidth = 400;
    const boxHeight = 120;
    const padding = 20;

    let left = rect.left + rect.width / 2 - boxWidth / 2;
    let top = rect.top + rect.height + padding;

    // Adjust if box goes off-screen
    if (left < padding) {
      left = padding;
    }

    if (left + boxWidth > window.innerWidth - padding) {
      left = window.innerWidth - boxWidth - padding;
    }

    // If not enough space below, show above
    if (top + boxHeight > window.innerHeight - padding) {
      top = rect.top - boxHeight - padding;
    }

    return { left, top };
  };

  const position = getBoxPosition();

  // Check if dark mode is active
  const isDarkMode =
    document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <div
      ref={boxRef}
      className={`fixed z-50 rounded-lg shadow-lg border p-4 transition-all duration-200 ${
        isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: '400px',
        backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="i-ph:cursor-click" style={{ color: '#7C3AED' }} />
        <h3 className="text-sm font-medium" style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}>
          How would you like to modify it?
        </h3>
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Describe your modification..."
          className="flex-1 px-3 py-2 text-sm rounded-md outline-none transition-colors"
          style={{
            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
            color: isDarkMode ? '#F3F4F6' : '#111827',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors flex items-center gap-2"
          style={{
            backgroundColor: input.trim() ? '#7C3AED' : '#9CA3AF',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            opacity: input.trim() ? 1 : 0.6,
          }}
          onMouseEnter={(e) => {
            if (input.trim()) {
              e.currentTarget.style.backgroundColor = '#6D28D9';
            }
          }}
          onMouseLeave={(e) => {
            if (input.trim()) {
              e.currentTarget.style.backgroundColor = '#7C3AED';
            }
          }}
        >
          <span>Send</span>
          <div className="i-ph:arrow-right text-sm" />
        </button>
      </div>

      <div className="mt-2 text-xs" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
        Press Enter to send, Esc to cancel
      </div>
    </div>
  );
};
