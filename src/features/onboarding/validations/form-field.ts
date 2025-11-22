import { z } from 'zod';

/**
 * Validation schema for form field creation/editing
 */

export const formFieldOptionSchema = z.object({
  value: z.string().min(1, 'Option value is required'),
  label: z.string().min(1, 'Option label is required'),
});

export const formFieldValidationRulesSchema = z
  .object({
    minLength: z.number().min(1).max(5000).optional(),
    maxLength: z.number().min(1).max(5000).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    step: z.number().min(0.01).optional(),
    minDate: z.string().optional(),
    maxDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.minLength && data.maxLength) {
        return data.maxLength >= data.minLength;
      }
      return true;
    },
    {
      message: 'Maximum length must be greater than or equal to minimum length',
      path: ['maxLength'],
    }
  )
  .refine(
    (data) => {
      if (data.min !== undefined && data.max !== undefined) {
        return data.max >= data.min;
      }
      return true;
    },
    {
      message: 'Maximum value must be greater than or equal to minimum value',
      path: ['max'],
    }
  );

export const formFieldSchema = z
  .object({
    id: z.string().optional(),
    fieldKey: z
      .string()
      .min(1, 'Field key is required')
      .max(50, 'Field key cannot exceed 50 characters')
      .regex(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        'Field key must start with a letter and contain only letters, numbers, and underscores'
      ),
    label: z
      .string()
      .min(3, 'Label must be at least 3 characters')
      .max(150, 'Label cannot exceed 150 characters'),
    fieldType: z.enum([
      'TEXT',
      'EMAIL',
      'NUMBER',
      'DROPDOWN',
      'TEXTAREA',
      'DATE',
      'CHECKBOX',
    ]),
    placeholder: z
      .string()
      .max(255, 'Placeholder cannot exceed 255 characters')
      .optional(),
    helpText: z.string().optional(),
    isRequired: z.boolean().default(false),
    isDefault: z.boolean().optional(),
    options: z.array(formFieldOptionSchema).optional(),
    validationRules: formFieldValidationRulesSchema.optional(),
    displayOrder: z.number().int().min(0).default(0),
  })
  .refine(
    (data) => {
      if (data.fieldType === 'DROPDOWN') {
        return (
          data.options && data.options.length >= 2 && data.options.length <= 20
        );
      }
      return true;
    },
    {
      message: 'Dropdown fields require 2-20 options',
      path: ['options'],
    }
  )
  .refine(
    (data) => {
      if (data.fieldType === 'DROPDOWN' && data.options) {
        const values = data.options.map((opt) => opt.value);
        const uniqueValues = new Set(values);
        return values.length === uniqueValues.size;
      }
      return true;
    },
    {
      message: 'Dropdown options must have unique values',
      path: ['options'],
    }
  );

export type FormFieldFormData = z.infer<typeof formFieldSchema>;

export const formFieldsPayloadSchema = z.object({
  workflowId: z.string().uuid('Invalid workflow ID'),
  formFields: z.array(formFieldSchema).min(3, 'At least 3 fields are required'), // name, email, companyName minimum
});

export type FormFieldsPayloadData = z.infer<typeof formFieldsPayloadSchema>;
