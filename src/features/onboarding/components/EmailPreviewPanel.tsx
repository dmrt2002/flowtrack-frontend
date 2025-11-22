'use client';

import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailPreviewPanelProps {
  emailTemplate: string;
  availableVariables: string[];
  responseTime?: number;
}

export function EmailPreviewPanel({
  emailTemplate,
  availableVariables,
  responseTime,
}: EmailPreviewPanelProps) {
  // Replace variables with sample data for preview
  const getPreviewText = (template: string) => {
    if (!template) return '';

    let preview = template;

    // Default sample data
    const defaultSampleData: Record<string, string> = {
      '{name}': 'John Doe',
      '{email}': 'john.doe@example.com',
      '{companyName}': 'Acme Corporation',
    };

    // Build sample data from available variables
    const sampleData: Record<string, string> = { ...defaultSampleData };

    availableVariables.forEach((variable) => {
      const varKey = variable.toLowerCase();
      if (!sampleData[variable]) {
        // Generate sample data based on variable name
        if (varKey.includes('name') && !varKey.includes('company')) {
          sampleData[variable] = 'John Doe';
        } else if (varKey.includes('email')) {
          sampleData[variable] = 'john.doe@example.com';
        } else if (varKey.includes('company')) {
          sampleData[variable] = 'Acme Corporation';
        } else if (varKey.includes('phone')) {
          sampleData[variable] = '+1 (555) 123-4567';
        } else if (varKey.includes('budget')) {
          sampleData[variable] = '$10,000';
        } else {
          // Generic sample data
          const varName = variable
            .replace(/[{}]/g, '')
            .replace(/([A-Z])/g, ' $1')
            .trim();
          sampleData[variable] = `Sample ${varName}`;
        }
      }
    });

    // Replace all variables with sample data
    Object.entries(sampleData).forEach(([variable, value]) => {
      const regex = new RegExp(variable.replace(/[{}]/g, '\\$&'), 'gi');
      preview = preview.replace(regex, value);
    });

    // Replace any remaining variables with a placeholder
    preview = preview.replace(/\{[^}]+\}/g, '[Variable]');

    return preview;
  };

  const previewText = getPreviewText(emailTemplate);

  return (
    <div className="flex h-[90%] flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-foreground mb-2 text-lg font-semibold">
          Email Preview
        </h2>
        <p className="text-muted-foreground text-sm">
          See how your email will look to leads
        </p>
      </div>

      {/* Email Preview Card */}
      <Card className="mb-6 flex min-h-0 flex-1 flex-col border-2">
        <CardHeader className="bg-muted/30 flex-shrink-0 border-b pb-3">
          <div className="flex items-center gap-2">
            <Mail className="text-primary h-4 w-4" />
            <CardTitle className="text-base font-semibold">
              Email Preview
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Email Header */}
            <div className="border-border flex-shrink-0 border-b pb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">
                  From:
                </span>
                <span className="text-foreground text-xs">
                  you@yourcompany.com
                </span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">
                  To:
                </span>
                <span className="text-foreground text-xs">
                  john.doe@example.com
                </span>
              </div>
              {responseTime && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-medium">
                    Response Time:
                  </span>
                  <span className="text-foreground text-xs font-semibold">
                    {responseTime} minutes
                  </span>
                </div>
              )}
            </div>

            {/* Email Body */}
            <div className="text-foreground text-sm leading-relaxed break-words whitespace-pre-wrap">
              {previewText || (
                <span className="text-muted-foreground italic">
                  Start typing your email template to see the preview...
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
