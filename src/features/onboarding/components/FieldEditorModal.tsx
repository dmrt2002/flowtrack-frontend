'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  formFieldSchema,
  type FormFieldFormData,
} from '../validations/form-field';
import type {
  FormField,
  FormFieldType,
  FormFieldOption,
} from '../types/form-fields';

interface FieldEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field?: FormField | null;
  existingFieldKeys: string[];
  onSave: (field: FormFieldFormData) => void;
}

const fieldTypeOptions: Array<{
  value: FormFieldType;
  label: string;
  icon: string;
}> = [
  { value: 'TEXT', label: 'Text', icon: '📝' },
  { value: 'EMAIL', label: 'Email', icon: '✉️' },
  { value: 'NUMBER', label: 'Number', icon: '🔢' },
  { value: 'DROPDOWN', label: 'Dropdown', icon: '📋' },
  { value: 'TEXTAREA', label: 'Textarea', icon: '📄' },
  { value: 'DATE', label: 'Date', icon: '📅' },
  { value: 'CHECKBOX', label: 'Checkbox', icon: '☑️' },
];

export function FieldEditorModal({
  open,
  onOpenChange,
  field,
  existingFieldKeys,
  onSave,
}: FieldEditorModalProps) {
  const [dropdownOptions, setDropdownOptions] = useState<FormFieldOption[]>(
    field?.fieldType === 'DROPDOWN' && field.options
      ? field.options
      : [
          { value: '', label: '' },
          { value: '', label: '' },
        ]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFieldFormData>({
    resolver: zodResolver(formFieldSchema),
    defaultValues: field
      ? {
          fieldKey: field.fieldKey,
          label: field.label,
          fieldType: field.fieldType,
          placeholder: field.placeholder || '',
          helpText: field.helpText || '',
          isRequired: field.isRequired,
          options: field.options,
          validationRules: field.validationRules,
          displayOrder: field.displayOrder,
        }
      : {
          fieldType: 'TEXT',
          isRequired: false,
          displayOrder: 0,
        },
  });

  const fieldType = watch('fieldType');

  useEffect(() => {
    if (
      fieldType === 'DROPDOWN' &&
      (!dropdownOptions.length || dropdownOptions.length < 2)
    ) {
      setDropdownOptions([
        { value: '', label: '' },
        { value: '', label: '' },
      ]);
    }
  }, [fieldType, dropdownOptions.length]);

  useEffect(() => {
    if (open && field) {
      reset({
        fieldKey: field.fieldKey,
        label: field.label,
        fieldType: field.fieldType,
        placeholder: field.placeholder || '',
        helpText: field.helpText || '',
        isRequired: field.isRequired,
        options: field.options,
        validationRules: field.validationRules,
        displayOrder: field.displayOrder,
      });
      if (field.fieldType === 'DROPDOWN' && field.options) {
        setDropdownOptions(field.options);
      }
    } else if (open && !field) {
      reset({
        fieldType: 'TEXT',
        isRequired: false,
        displayOrder: 0,
      });
      setDropdownOptions([
        { value: '', label: '' },
        { value: '', label: '' },
      ]);
    }
  }, [open, field, reset]);

  const addDropdownOption = () => {
    if (dropdownOptions.length < 20) {
      setDropdownOptions([...dropdownOptions, { value: '', label: '' }]);
    }
  };

  const removeDropdownOption = (index: number) => {
    if (dropdownOptions.length > 2) {
      const newOptions = dropdownOptions.filter((_, i) => i !== index);
      setDropdownOptions(newOptions);
      setValue('options', newOptions);
    }
  };

  const updateDropdownOption = (
    index: number,
    field: 'value' | 'label',
    newValue: string
  ) => {
    const newOptions = [...dropdownOptions];
    newOptions[index] = { ...newOptions[index], [field]: newValue };
    setDropdownOptions(newOptions);
    setValue('options', newOptions);
  };

  const generateFieldKey = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 50);
  };

  const onSubmit = (data: FormFieldFormData) => {
    // Auto-generate fieldKey from label if not provided
    if (!data.fieldKey && data.label) {
      let generatedKey = generateFieldKey(data.label);
      let counter = 1;
      const baseKey = generatedKey;
      while (existingFieldKeys.includes(generatedKey)) {
        generatedKey = `${baseKey}_${counter}`;
        counter++;
      }
      data.fieldKey = generatedKey;
    }

    // Validate fieldKey uniqueness (excluding current field if editing)
    const keysToCheck = field
      ? existingFieldKeys.filter((key) => key !== field.fieldKey)
      : existingFieldKeys;
    if (data.fieldKey && keysToCheck.includes(data.fieldKey)) {
      toast.error(
        'A field with this key already exists. Please use a different label.'
      );
      return;
    }

    // Set options for dropdown
    if (data.fieldType === 'DROPDOWN') {
      const validOptions = dropdownOptions.filter(
        (opt) => opt.value.trim() && opt.label.trim()
      );
      if (validOptions.length < 2) {
        return;
      }
      data.options = validOptions;
    } else {
      data.options = undefined;
    }

    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[90vw] max-w-[560px] flex-col gap-0 overflow-hidden bg-white p-0">
        <DialogHeader className="shrink-0 border-b px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            {field ? 'Edit Field' : 'Add Custom Field'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5 text-sm">
            {field
              ? 'Update the field configuration below.'
              : 'Configure your custom form field. This will be added to your intake form.'}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6 py-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            id="field-editor-form"
          >
            {/* Field Type */}
            <div className="space-y-2">
              <Label htmlFor="fieldType" className="text-sm font-medium">
                Field Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={fieldType}
                onValueChange={(value) =>
                  setValue('fieldType', value as FormFieldType)
                }
              >
                <SelectTrigger id="fieldType" className="w-full">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="mr-2">{option.icon}</span>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fieldType && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.fieldType.message}
                </p>
              )}
            </div>

            {/* Field Label */}
            <div className="space-y-2">
              <Label htmlFor="label" className="text-sm font-medium">
                Field Label <span className="text-destructive">*</span>
              </Label>
              <Input
                id="label"
                placeholder="e.g., Project Budget"
                {...register('label', {
                  onChange: (e) => {
                    // Auto-generate fieldKey from label if fieldKey is empty or matches old label
                    if (
                      !field ||
                      !watch('fieldKey') ||
                      watch('fieldKey') === generateFieldKey(field.label)
                    ) {
                      const generatedKey = generateFieldKey(e.target.value);
                      if (
                        generatedKey &&
                        !existingFieldKeys.includes(generatedKey)
                      ) {
                        setValue('fieldKey', generatedKey);
                      }
                    }
                  },
                })}
                className={cn('w-full', errors.label && 'border-destructive')}
              />
              {errors.label && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.label.message}
                </p>
              )}
            </div>

            {/* Field Key (read-only, auto-generated) */}
            <div className="space-y-2">
              <Label htmlFor="fieldKey" className="text-sm font-medium">
                Field Key <span className="text-destructive">*</span>
                <span className="text-muted-foreground ml-2 text-xs font-normal">
                  (Auto-generated, used in variables)
                </span>
              </Label>
              <Input
                id="fieldKey"
                placeholder="projectBudget"
                {...register('fieldKey')}
                className={cn(
                  'w-full font-mono text-sm',
                  errors.fieldKey && 'border-destructive'
                )}
              />
              {errors.fieldKey && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.fieldKey.message}
                </p>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                This will be available as{' '}
                <code className="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs">
                  {`{${watch('fieldKey') || 'fieldKey'}}`}
                </code>{' '}
                in email templates
              </p>
            </div>

            {/* Placeholder */}
            <div className="space-y-2">
              <Label htmlFor="placeholder" className="text-sm font-medium">
                Placeholder Text
              </Label>
              <Input
                id="placeholder"
                placeholder="e.g., Select your budget range"
                {...register('placeholder')}
                className="w-full"
              />
              {errors.placeholder && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.placeholder.message}
                </p>
              )}
            </div>

            {/* Help Text */}
            <div className="space-y-2">
              <Label htmlFor="helpText" className="text-sm font-medium">
                Help Text
              </Label>
              <Textarea
                id="helpText"
                placeholder="This helps us match you with the right package"
                rows={2}
                {...register('helpText')}
                className="w-full resize-none"
              />
            </div>

            {/* Dropdown Options Editor */}
            {fieldType === 'DROPDOWN' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Options <span className="text-destructive">*</span>
                  <span className="text-muted-foreground ml-2 text-xs font-normal">
                    ({dropdownOptions.length} of 20)
                  </span>
                </Label>
                <div className="space-y-2">
                  {dropdownOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Option value"
                        value={option.value}
                        onChange={(e) =>
                          updateDropdownOption(index, 'value', e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        placeholder="Option label"
                        value={option.label}
                        onChange={(e) =>
                          updateDropdownOption(index, 'label', e.target.value)
                        }
                        className="flex-1"
                      />
                      {dropdownOptions.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDropdownOption(index)}
                          className="text-muted-foreground hover:bg-destructive h-9 w-9 shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {dropdownOptions.length < 20 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addDropdownOption}
                    className="mt-2 w-full border-dashed"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                )}
                {errors.options && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.options.message}
                  </p>
                )}
              </div>
            )}

            {/* Required Toggle */}
            <div className="bg-muted/50 hover:bg-muted/70 flex items-start gap-3 rounded-lg p-4 transition-colors">
              <input
                type="checkbox"
                id="isRequired"
                {...register('isRequired')}
                className="border-input bg-background accent-primary mt-0.5 h-5 w-5 cursor-pointer rounded border-2 transition-colors"
              />
              <div className="flex-1">
                <Label
                  htmlFor="isRequired"
                  className="cursor-pointer text-sm font-medium"
                >
                  Required field
                </Label>
                <p className="text-muted-foreground mt-1 text-xs">
                  Leads must fill this field to submit
                </p>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="bg-muted/30 shrink-0 border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="field-editor-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : field ? 'Update Field' : 'Add Field'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
