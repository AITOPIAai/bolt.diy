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

  return (
    <div
      ref={boxRef}
      className={`fixed z-50 bg-bolt-elements-background-depth-3 rounded-lg shadow-2xl border border-bolt-elements-borderColor p-4 transition-all duration-200 ${
        isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: '400px',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(15, 15, 15, 0.95)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="i-ph:cursor-click text-bolt-elements-item-contentAccent" />
        <h3 className="text-sm font-medium text-bolt-elements-textPrimary">How would you like to modify it?</h3>
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
          className="flex-1 px-3 py-2 text-sm bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-md outline-none focus:border-bolt-elements-item-contentAccent text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-bolt-elements-item-backgroundAccent rounded-md hover:bg-bolt-elements-item-backgroundAccentHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <span>Send</span>
          <div className="i-ph:arrow-right text-sm" />
        </button>
      </div>

      <div className="mt-2 text-xs text-bolt-elements-textTertiary">Press Enter to send, Esc to cancel</div>
    </div>
  );
};
