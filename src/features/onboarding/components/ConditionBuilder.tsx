'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface QualificationCondition {
  field: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  value: number;
  currency: 'USD' | 'INR';
}

interface ConditionBuilderProps {
  id: string;
  value?: QualificationCondition | string;
  onChange: (condition: QualificationCondition) => void;
  availableFields: string[];
  operators: string[];
  defaultField?: string;
  defaultOperator?: string;
  defaultValue?: number;
  defaultCurrency?: 'USD' | 'INR';
  required?: boolean;
}

export function ConditionBuilder({
  id,
  value,
  onChange,
  availableFields,
  operators,
  defaultField = 'budget',
  defaultOperator = '>',
  defaultValue = 1000,
  defaultCurrency = 'USD',
  required = false,
}: ConditionBuilderProps) {
  // Parse initial value
  const parseValue = useCallback((): QualificationCondition => {
    if (!value) {
      return {
        field: defaultField,
        operator: defaultOperator as QualificationCondition['operator'],
        value: defaultValue,
        currency: defaultCurrency,
      };
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return {
          field: parsed.field || defaultField,
          operator: parsed.operator || defaultOperator,
          value: parsed.value || defaultValue,
          currency: parsed.currency || defaultCurrency,
        };
      } catch {
        return {
          field: defaultField,
          operator: defaultOperator as QualificationCondition['operator'],
          value: defaultValue,
          currency: defaultCurrency,
        };
      }
    }

    return value;
  }, [value, defaultField, defaultOperator, defaultValue, defaultCurrency]);

  const [condition, setCondition] = useState<QualificationCondition>(() =>
    parseValue()
  );

  // Update condition when value prop changes
  useEffect(() => {
    setCondition(parseValue());
  }, [parseValue]);

  // Update parent when condition changes
  useEffect(() => {
    onChange(condition);
  }, [condition, onChange]);

  const handleFieldChange = (field: string) => {
    setCondition((prev) => ({ ...prev, field }));
  };

  const handleOperatorChange = (operator: string) => {
    setCondition((prev) => ({
      ...prev,
      operator: operator as QualificationCondition['operator'],
    }));
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value) || 0;
    setCondition((prev) => ({ ...prev, value: numValue }));
  };

  const handleCurrencyChange = (currency: 'USD' | 'INR') => {
    setCondition((prev) => ({ ...prev, currency }));
  };

  // Format operator for display
  const formatOperator = (op: string): string => {
    const operatorMap: Record<string, string> = {
      '>': 'greater than',
      '<': 'less than',
      '>=': 'greater than or equal to',
      '<=': 'less than or equal to',
      '==': 'equal to',
      '!=': 'not equal to',
    };
    return operatorMap[op] || op;
  };

  // Format currency symbol
  const formatCurrency = (currency: 'USD' | 'INR'): string => {
    return currency === 'USD' ? '$' : '₹';
  };

  // Generate preview text
  const previewText = `{${condition.field}} ${condition.operator} ${formatCurrency(condition.currency)}${condition.value.toLocaleString()}`;

  // Ensure we have at least one field
  const fieldsToShow =
    availableFields.length > 0 ? availableFields : [defaultField];

  return (
    <div className="space-y-4">
      <div className="text-muted-foreground text-sm">
        Leads are qualified when:
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Field Selector */}
        <div className="min-w-[120px] flex-1">
          <Select
            value={condition.field}
            onValueChange={handleFieldChange}
            required={required}
          >
            <SelectTrigger id={`${id}-field`} className="h-12">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {fieldsToShow.map((field) => (
                <SelectItem key={field} value={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Operator Selector */}
        <div className="min-w-[100px] flex-1">
          <Select
            value={condition.operator}
            onValueChange={handleOperatorChange}
            required={required}
          >
            <SelectTrigger id={`${id}-operator`} className="h-12">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op} value={op}>
                  {formatOperator(op)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Value Input */}
        <div className="min-w-[120px] flex-1">
          <Input
            id={`${id}-value`}
            type="number"
            value={condition.value || ''}
            onChange={handleValueChange}
            placeholder="1000"
            min={0}
            step={1}
            className="h-12"
            required={required}
          />
        </div>

        {/* Currency Selector */}
        <div className="min-w-[100px] flex-1">
          <Select
            value={condition.currency}
            onValueChange={handleCurrencyChange}
            required={required}
          >
            <SelectTrigger id={`${id}-currency`} className="h-12">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="INR">INR (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-muted/50 border-border rounded-md border p-3">
        <div className="text-muted-foreground mb-1 text-xs font-medium">
          Preview:
        </div>
        <div className="text-foreground font-mono text-sm">{previewText}</div>
      </div>

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
