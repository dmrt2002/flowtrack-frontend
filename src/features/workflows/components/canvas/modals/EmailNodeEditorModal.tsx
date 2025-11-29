'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Eye, Save } from 'lucide-react';

interface EmailNodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailType: 'welcome' | 'thankYou' | 'followUp';
  initialSubject: string;
  initialBody: string;
  onSave: (subject: string, body: string) => void;
}

const EMAIL_TYPE_LABELS = {
  welcome: 'Welcome Email',
  thankYou: 'Thank You Email',
  followUp: 'Follow-up Email',
};

const EMAIL_TYPE_DESCRIPTIONS = {
  welcome: 'Sent immediately when a lead submits the form',
  thankYou: 'Sent when a lead clicks the booking link',
  followUp: 'Sent after the delay period if no booking is made',
};

const AVAILABLE_VARIABLES = [
  { key: '{firstName}', description: "Lead's first name" },
  { key: '{lastName}', description: "Lead's last name" },
  { key: '{email}', description: "Lead's email address" },
  { key: '{phone}', description: "Lead's phone number" },
  { key: '{company}', description: "Lead's company name" },
  { key: '{bookingUrl}', description: 'Booking link URL' },
];

export function EmailNodeEditorModal({
  isOpen,
  onClose,
  emailType,
  initialSubject,
  initialBody,
  onSave,
}: EmailNodeEditorModalProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);

  useEffect(() => {
    setSubject(initialSubject);
    setBody(initialBody);
  }, [initialSubject, initialBody, isOpen]);

  const handleSave = () => {
    onSave(subject, body);
  };

  const insertVariable = (variable: string) => {
    setBody((prev) => prev + variable);
  };

  // Simple preview with variable replacement
  const getPreviewContent = () => {
    let previewBody = body;
    previewBody = previewBody.replace(/{firstName}/g, 'John');
    previewBody = previewBody.replace(/{lastName}/g, 'Doe');
    previewBody = previewBody.replace(/{email}/g, 'john.doe@example.com');
    previewBody = previewBody.replace(/{phone}/g, '+1 (555) 123-4567');
    previewBody = previewBody.replace(/{company}/g, 'Acme Inc');
    previewBody = previewBody.replace(
      /{bookingUrl}/g,
      'https://calendly.com/your-link'
    );
    return previewBody;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[90vh] max-w-[1200px] gap-0 p-0">
        {/* Header */}
        <DialogHeader className="border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-neutral-900">
                {EMAIL_TYPE_LABELS[emailType]}
              </DialogTitle>
              <p className="mt-0.5 text-sm text-neutral-600">
                {EMAIL_TYPE_DESCRIPTIONS[emailType]}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content: Side by Side */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Editor */}
          <div className="flex flex-1 flex-col overflow-hidden border-r border-neutral-200">
            <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                Email Editor
              </h3>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {/* Subject */}
              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-sm font-semibold text-neutral-900"
                >
                  Subject Line
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="border-neutral-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Body */}
              <div className="space-y-2">
                <Label
                  htmlFor="body"
                  className="text-sm font-semibold text-neutral-900"
                >
                  Email Body
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter email content..."
                  rows={12}
                  className="border-neutral-300 font-mono text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Variable Inserter */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-neutral-900">
                  Insert Variables
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_VARIABLES.map((variable) => (
                    <button
                      key={variable.key}
                      onClick={() => insertVariable(variable.key)}
                      className="group flex flex-col items-start gap-1 rounded-lg border border-neutral-200 px-3 py-2 text-left transition-colors hover:border-indigo-400 hover:bg-indigo-50"
                    >
                      <code className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                        {variable.key}
                      </code>
                      <span className="text-[10px] text-neutral-600">
                        {variable.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Preview */}
          <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50">
            <div className="border-b border-neutral-200 bg-neutral-100 px-6 py-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <Eye className="h-4 w-4 text-neutral-600" />
                Live Preview
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto max-w-2xl rounded-lg border border-neutral-200 bg-white shadow-sm">
                {/* Email Header */}
                <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                      <span className="font-medium">From:</span>
                      <span>FlowTrack (noreply@flowtrack.com)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                      <span className="font-medium">To:</span>
                      <span>john.doe@example.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                      <span className="text-xs font-medium text-neutral-600">
                        Subject:
                      </span>
                      <span>{subject || '(No subject)'}</span>
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="px-6 py-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="leading-relaxed whitespace-pre-wrap text-neutral-800">
                      {getPreviewContent() ||
                        '(Email body will appear here...)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-6 py-4">
          <p className="text-xs text-neutral-600">
            Changes are auto-saved when you click Save
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Save className="mr-2 h-4 w-4 text-white" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
