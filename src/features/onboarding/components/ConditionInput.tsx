'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ConditionInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  availableFields: string[]; // Numeric fields from form (e.g., ['budget', 'projectBudget'])
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// Valid operators for conditions
const VALID_OPERATORS = ['>', '<', '>=', '<=', '==', '!='];

type SuggestionItem = {
  id: string;
  label: string;
  value: string;
  category: 'variable' | 'operator';
};

// Validate condition syntax
const validateCondition = (
  value: string
): { isValid: boolean; error?: string } => {
  if (!value.trim()) {
    return { isValid: false, error: 'Condition is required' };
  }

  // Pattern: {fieldName} operator value
  // Examples: {budget} > 1000, {projectBudget} >= 5000
  const conditionPattern =
    /^\{([a-zA-Z][a-zA-Z0-9_]*)\}\s*(>|<|>=|<=|==|!=)\s*(\d+(\.\d+)?)$/;
  const match = value.trim().match(conditionPattern);

  if (!match) {
    return {
      isValid: false,
      error:
        'Invalid format. Use: {fieldName} operator value (e.g., {budget} > 1000)',
    };
  }

  const [, , operator, valueStr] = match;

  // Validate operator
  if (!VALID_OPERATORS.includes(operator)) {
    return {
      isValid: false,
      error: `Invalid operator. Use: ${VALID_OPERATORS.join(', ')}`,
    };
  }

  // Validate value is a number
  const numValue = parseFloat(valueStr);
  if (isNaN(numValue) || numValue < 0) {
    return { isValid: false, error: 'Value must be a positive number' };
  }

  return { isValid: true };
};

export function ConditionInput({
  id,
  value,
  onChange,
  availableFields,
  placeholder = '{budget} > 1000',
  required = false,
  className,
}: ConditionInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [validationError, setValidationError] = useState<string | null>(null);

  const variableSuggestions: SuggestionItem[] = useMemo(
    () =>
      availableFields.map((field) => ({
        id: `var-${field}`,
        label: `{${field}}`,
        value: `{${field}}`,
        category: 'variable' as const,
      })),
    [availableFields]
  );
  const operatorSuggestions: SuggestionItem[] = useMemo(
    () =>
      VALID_OPERATORS.map((op) => ({
        id: `op-${op}`,
        label: op,
        value: ` ${op} `,
        category: 'operator' as const,
      })),
    []
  );
  const suggestionItems: SuggestionItem[] = useMemo(
    () => [...variableSuggestions, ...operatorSuggestions],
    [variableSuggestions, operatorSuggestions]
  );

  // Validate condition on change
  useEffect(() => {
    if (value) {
      const validation = validateCondition(value);
      setValidationError(validation.error || null);
    } else {
      setValidationError(null);
    }
  }, [value]);

  // Insert suggestion token at cursor position
  const insertToken = useCallback(
    (tokenValue: string) => {
      if (!inputRef.current) return;

      const input = inputRef.current;
      const cursorPos = input.selectionStart || 0;
      const textBefore = value.substring(0, cursorPos);
      const textAfter = value.substring(cursorPos);

      const newValue = textBefore + tokenValue + textAfter;
      onChange(newValue);
      setShowDropdown(false);

      // Set cursor position after the inserted variable
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = cursorPos + tokenValue.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          inputRef.current.focus();
        }
      }, 0);
    },
    [value, onChange]
  );

  // Handle keydown events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Show dropdown on Shift+Space
      if (e.shiftKey && e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();

        // Show helpful message if no variables available
        if (variableSuggestions.length === 0) {
          toast.info(
            'No variables available. Add numeric fields in the form builder step.'
          );
          return;
        }
        if (inputRef.current && suggestionItems.length > 0) {
          const input = inputRef.current;
          const rect = input.getBoundingClientRect();
          const cursorPos = input.selectionStart || 0;

          // Calculate position for dropdown
          const textBeforeCursor = value.substring(0, cursorPos);
          const inputStyles = window.getComputedStyle(input);

          // Create a temporary span to measure text width
          const measureElement = document.createElement('span');
          measureElement.style.position = 'absolute';
          measureElement.style.visibility = 'hidden';
          measureElement.style.font = inputStyles.font;
          measureElement.style.fontSize = inputStyles.fontSize;
          measureElement.style.fontFamily = inputStyles.fontFamily;
          measureElement.style.padding = inputStyles.padding;
          measureElement.style.whiteSpace = 'pre';
          measureElement.textContent = textBeforeCursor;
          document.body.appendChild(measureElement);

          const textWidth = measureElement.offsetWidth;
          const paddingLeft = parseInt(inputStyles.paddingLeft) || 12;

          // Calculate position relative to viewport (fixed positioning)
          const top = rect.bottom + 4;
          const left = rect.left + textWidth + paddingLeft;

          // Clean up
          document.body.removeChild(measureElement);

          setCursorPosition({ top, left });
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
            prev < suggestionItems.length - 1 ? prev + 1 : 0
          );
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestionItems.length - 1
          );
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          insertToken(suggestionItems[selectedIndex].value);
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowDropdown(false);
          return;
        }
      }
    },
    [
      showDropdown,
      selectedIndex,
      value,
      suggestionItems,
      insertToken,
      variableSuggestions.length,
    ]
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (item: SuggestionItem) => {
      insertToken(item.value);
    },
    [insertToken]
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
      itemRefs.current = itemRefs.current.slice(0, suggestionItems.length);
    }
  }, [showDropdown, suggestionItems.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
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

  // Parse condition for preview
  const parseCondition = () => {
    const validation = validateCondition(value);
    if (!validation.isValid || !value.trim()) return null;

    const match = value
      .trim()
      .match(
        /^\{([a-zA-Z][a-zA-Z0-9_]*)\}\s*(>|<|>=|<=|==|!=)\s*(\d+(\.\d+)?)$/
      );
    if (!match) return null;

    const [, fieldName, operator, valueStr] = match;
    const operatorMap: Record<string, string> = {
      '>': 'greater than',
      '<': 'less than',
      '>=': 'greater than or equal to',
      '<=': 'less than or equal to',
      '==': 'equal to',
      '!=': 'not equal to',
    };

    return `${fieldName} ${operatorMap[operator] || operator} ${valueStr}`;
  };

  const conditionPreview = parseCondition();

  const handleBeforeInput = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const nativeEvent = event.nativeEvent as InputEvent | undefined;
      const data = nativeEvent?.data;
      if (!data) return;

      if (/[{}<>!=A-Za-z]/.test(data)) {
        event.preventDefault();
        toast.info('Use Shift + Space to insert variables and operators.');
      }
    },
    []
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            validationError && 'border-destructive',
            className
          )}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBeforeInput={handleBeforeInput}
          required={required}
        />

        {/* Suggestion Dropdown */}
        {showDropdown && suggestionItems.length > 0 && (
          <div
            ref={dropdownRef}
            className="fixed z-50 max-w-[320px] min-w-[240px] rounded-md border bg-white shadow-md"
            style={{
              top: `${cursorPosition.top}px`,
              left: `${cursorPosition.left}px`,
            }}
          >
            <div className="p-1">
              {variableSuggestions.length > 0 && (
                <>
                  <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
                    Available Fields
                  </div>
                  <div className="max-h-[160px] overflow-auto">
                    {variableSuggestions.map((variable, index) => (
                      <button
                        key={variable.id}
                        ref={(el) => {
                          itemRefs.current[index] = el;
                        }}
                        type="button"
                        className={cn(
                          'w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors',
                          'hover:text-foreground hover:bg-blue-50',
                          'focus:text-foreground focus:bg-blue-50 focus:outline-none',
                          index === selectedIndex &&
                            'text-foreground bg-blue-100'
                        )}
                        onClick={() => handleSuggestionSelect(variable)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <span className="font-mono">{variable.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
              {operatorSuggestions.length > 0 && (
                <>
                  <div className="text-muted-foreground border-t px-2 py-1.5 text-xs font-semibold">
                    Operators
                  </div>
                  <div className="max-h-[120px] overflow-auto">
                    {operatorSuggestions.map((operator, index) => {
                      const globalIndex = variableSuggestions.length + index;
                      return (
                        <button
                          key={operator.id}
                          ref={(el) => {
                            itemRefs.current[globalIndex] = el;
                          }}
                          type="button"
                          className={cn(
                            'w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors',
                            'hover:text-foreground hover:bg-blue-50',
                            'focus:text-foreground focus:bg-blue-50 focus:outline-none',
                            globalIndex === selectedIndex &&
                              'text-foreground bg-blue-100'
                          )}
                          onClick={() => handleSuggestionSelect(operator)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          <span className="font-mono">{operator.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="text-muted-foreground border-t px-2 py-1.5 text-xs">
                Press Enter to select, Esc to close
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validation Error */}
      {validationError && (
        <p className="text-destructive text-sm font-medium">
          {validationError}
        </p>
      )}

      {/* Condition Preview */}
      {conditionPreview && !validationError && (
        <div className="bg-muted/50 border-border rounded-md border p-3">
          <div className="text-muted-foreground mb-1 text-xs font-medium">
            Preview:
          </div>
          <div className="text-foreground text-sm">
            Leads are qualified when: <strong>{conditionPreview}</strong>
          </div>
        </div>
      )}

      {/* Available Variables Display */}
      {availableFields.length > 0 && (
        <div className="bg-muted/50 rounded-md p-3">
          <p className="text-muted-foreground mb-2 text-xs font-medium">
            Available Variables:
          </p>
          <div className="flex flex-wrap gap-2">
            {variableSuggestions.map((variable) => (
              <span
                key={variable.id}
                className="border-border bg-background text-foreground rounded-md border px-2 py-1 font-mono text-xs"
              >
                {variable.label}
              </span>
            ))}
            {operatorSuggestions.map((operator) => (
              <span
                key={operator.id}
                className="border-border bg-background text-foreground rounded-md border px-2 py-1 font-mono text-xs"
              >
                {operator.label}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Press{' '}
            <kbd className="border-border bg-background rounded border px-1.5 py-0.5 font-mono">
              Shift + Space
            </kbd>{' '}
            to insert variables & operators
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="text-muted-foreground text-xs">
        <p>
          Format: {'{fieldName}'} operator value (e.g., {'{budget}'} {'>'} 1000)
        </p>
      </div>

      {/* Available Fields Info */}
      {availableFields.length === 0 && (
        <div className="text-muted-foreground rounded-md border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm">
          <p className="font-medium">No numeric fields available</p>
          <p className="mt-1 text-xs">
            Add a numeric field (like &ldquo;budget&rdquo;) in the form builder
            to create qualification conditions.
          </p>
        </div>
      )}
    </div>
  );
}
