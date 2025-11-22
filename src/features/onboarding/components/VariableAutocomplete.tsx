'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface VariableAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  availableVariables: string[];
  placeholder?: string;
  rows?: number;
  id?: string;
  className?: string;
  required?: boolean;
}

export function VariableAutocomplete({
  value,
  onChange,
  availableVariables,
  placeholder,
  rows = 5,
  id,
  className,
  required,
}: VariableAutocompleteProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });

  // Extract variable names from format {name} -> name
  const variableNames = availableVariables.map((v) => {
    const match = v.match(/^{(.+)}$/);
    return match ? match[1] : v.replace(/[{}]/g, '');
  });

  // Insert variable at cursor position
  const insertVariable = useCallback(
    (variableName: string) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBefore = value.substring(0, cursorPos);
      const textAfter = value.substring(cursorPos);

      const variable = `{${variableName}}`;
      const newValue = textBefore + variable + textAfter;

      onChange(newValue);
      setShowDropdown(false);

      // Set cursor position after the inserted variable
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = cursorPos + variable.length;
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          textareaRef.current.focus();
        }
      }, 0);
    },
    [value, onChange]
  );

  // Handle keydown events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Show dropdown on Shift+Space
      if (e.shiftKey && e.key === ' ') {
        e.preventDefault();
        if (textareaRef.current && variableNames.length > 0) {
          const textarea = textareaRef.current;
          const cursorPos = textarea.selectionStart;

          // Calculate cursor position in pixels
          const textBeforeCursor = value.substring(0, cursorPos);
          const textareaStyles = window.getComputedStyle(textarea);

          // Create a temporary span to measure text width
          const measureElement = document.createElement('span');
          measureElement.style.position = 'absolute';
          measureElement.style.visibility = 'hidden';
          measureElement.style.whiteSpace = 'pre-wrap';
          measureElement.style.font = textareaStyles.font;
          measureElement.style.fontSize = textareaStyles.fontSize;
          measureElement.style.fontFamily = textareaStyles.fontFamily;
          measureElement.style.padding = textareaStyles.padding;
          measureElement.style.width = textareaStyles.width;
          measureElement.textContent = textBeforeCursor;
          document.body.appendChild(measureElement);

          const lines = textBeforeCursor.split('\n');
          const lastLine = lines[lines.length - 1];

          // Measure the last line width
          const lineMeasure = document.createElement('span');
          lineMeasure.style.position = 'absolute';
          lineMeasure.style.visibility = 'hidden';
          lineMeasure.style.font = textareaStyles.font;
          lineMeasure.style.fontSize = textareaStyles.fontSize;
          lineMeasure.style.fontFamily = textareaStyles.fontFamily;
          lineMeasure.textContent = lastLine;
          document.body.appendChild(lineMeasure);

          const lineWidth = lineMeasure.offsetWidth;
          const lineHeight = parseInt(textareaStyles.lineHeight) || 20;

          // Get textarea position
          const rect = textarea.getBoundingClientRect();
          const paddingTop = parseInt(textareaStyles.paddingTop) || 12;
          const paddingLeft = parseInt(textareaStyles.paddingLeft) || 12;

          // Calculate position relative to viewport (fixed positioning)
          const top =
            rect.top +
            (lines.length - 1) * lineHeight +
            paddingTop +
            lineHeight;
          const left = rect.left + lineWidth + paddingLeft;

          // Clean up
          document.body.removeChild(measureElement);
          document.body.removeChild(lineMeasure);

          setCursorPosition({
            top: top,
            left: left,
          });

          setShowDropdown(true);
          setSelectedIndex(0);
        }
        return;
      }

      // Handle dropdown navigation
      if (showDropdown) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < variableNames.length - 1 ? prev + 1 : 0
          );
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : variableNames.length - 1
          );
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          insertVariable(variableNames[selectedIndex]);
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowDropdown(false);
          return;
        }
      }
    },
    [showDropdown, selectedIndex, variableNames, value, insertVariable]
  );

  // Handle variable selection from dropdown
  const handleVariableSelect = useCallback(
    (variableName: string) => {
      insertVariable(variableName);
    },
    [insertVariable]
  );

  // Scroll selected item into view when selectedIndex changes
  useEffect(() => {
    if (showDropdown && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex, showDropdown]);

  // Initialize item refs array when dropdown opens
  useEffect(() => {
    if (showDropdown) {
      itemRefs.current = itemRefs.current.slice(0, variableNames.length);
    }
  }, [showDropdown, variableNames.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        id={id}
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={rows}
        required={required}
      />

      {/* Variable Dropdown */}
      {showDropdown && variableNames.length > 0 && (
        <div
          ref={dropdownRef}
          className="fixed z-50 max-w-[300px] min-w-[200px] rounded-md border bg-white shadow-md"
          style={{
            top: `${cursorPosition.top}px`,
            left: `${cursorPosition.left}px`,
          }}
        >
          <div className="p-1">
            <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
              Available Variables
            </div>
            <div className="max-h-[200px] overflow-auto">
              {variableNames.map((variableName, index) => (
                <button
                  key={variableName}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  type="button"
                  className={cn(
                    'w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors',
                    'hover:text-foreground hover:bg-blue-50',
                    'focus:text-foreground focus:bg-blue-50 focus:outline-none',
                    index === selectedIndex && 'text-foreground bg-blue-100'
                  )}
                  onClick={() => handleVariableSelect(variableName)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="font-mono">{`${variableName}`}</span>
                </button>
              ))}
            </div>
            <div className="text-muted-foreground border-t px-2 py-1.5 text-xs">
              Press Enter to select, Esc to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
