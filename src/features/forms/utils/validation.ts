/**
 * Form Validation Utilities
 */

import type { FormField, ValidationRules } from '../types/public-form';

export function validateField(field: FormField, value: any): string | null {
  if (
    field.isRequired &&
    (value === null || value === undefined || value === '')
  ) {
    return field.label + ' is required';
  }
  if (
    !field.isRequired &&
    (value === null || value === undefined || value === '')
  ) {
    return null;
  }
  const rules = field.validationRules;
  switch (field.fieldType) {
    case 'EMAIL':
      return validateEmail(value, rules);
    case 'PHONE':
      return validatePhone(value, rules);
    case 'NUMBER':
      return validateNumber(value, rules);
    case 'URL':
      return validateURL(value, rules);
    case 'TEXT':
    case 'TEXTAREA':
      return validateText(value, rules);
    case 'DATE':
      return validateDate(value, rules);
    case 'DROPDOWN':
      return validateDropdown(value, field);
    case 'CHECKBOX':
      return field.isRequired && !value
        ? 'Please check this box to continue'
        : null;
    default:
      return null;
  }
}

function validateEmail(value: string, rules?: ValidationRules): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'Please enter a valid email address';
  if (rules?.maxLength && value.length > rules.maxLength)
    return 'Email must be no more than ' + rules.maxLength + ' characters';
  return null;
}

function validatePhone(value: string, rules?: ValidationRules): string | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 10) return 'Please enter a valid phone number';
  if (rules?.pattern && !new RegExp(rules.pattern).test(value))
    return rules.customMessage || 'Invalid phone number format';
  return null;
}

function validateNumber(
  value: string | number,
  rules?: ValidationRules
): string | null {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'Please enter a number';
  if (rules?.min !== undefined && num < rules.min)
    return 'Must be at least ' + rules.min;
  if (rules?.max !== undefined && num > rules.max)
    return 'Must be no more than ' + rules.max;
  return null;
}

function validateURL(value: string): string | null {
  try {
    new URL(value);
    if (!value.match(/^https?:\/\//i))
      return 'URL must start with http:// or https://';
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
}

function validateText(value: string, rules?: ValidationRules): string | null {
  if (rules?.minLength && value.length < rules.minLength)
    return 'Must be at least ' + rules.minLength + ' characters';
  if (rules?.maxLength && value.length > rules.maxLength)
    return 'Must be no more than ' + rules.maxLength + ' characters';
  if (rules?.pattern && !new RegExp(rules.pattern).test(value))
    return rules.customMessage || 'Invalid format';
  return null;
}

function validateDate(value: string, rules?: ValidationRules): string | null {
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Please enter a valid date';
  if (rules?.minDate && date < new Date(rules.minDate))
    return 'Date must be after ' + new Date(rules.minDate).toLocaleDateString();
  if (rules?.maxDate && date > new Date(rules.maxDate))
    return (
      'Date must be before ' + new Date(rules.maxDate).toLocaleDateString()
    );
  return null;
}

function validateDropdown(value: string, field: FormField): string | null {
  if (!field.options || field.options.length === 0) return null;
  if (!field.options.map((opt) => opt.value).includes(value))
    return 'Please select a valid option';
  return null;
}

export function validateForm(
  fields: FormField[],
  formData: Record<string, any>
): Record<string, string> {
  const errors: Record<string, string> = {};
  fields.forEach((field) => {
    const error = validateField(field, formData[field.fieldKey]);
    if (error) errors[field.fieldKey] = error;
  });
  return errors;
}

export function sanitizeValue(fieldType: string, value: any): any {
  if (value === null || value === undefined || value === '') return null;
  switch (fieldType) {
    case 'TEXT':
    case 'EMAIL':
    case 'PHONE':
    case 'URL':
    case 'TEXTAREA':
      return typeof value === 'string' ? value.trim() : String(value).trim();
    case 'NUMBER':
      return typeof value === 'number' ? value : parseFloat(value);
    case 'CHECKBOX':
      return Boolean(value);
    case 'DATE':
      return value;
    case 'DROPDOWN':
      return String(value);
    default:
      return value;
  }
}
