/**
 * Pitch Configuration Settings
 *
 * Main container for pitch customization with 4 tabs
 */

'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuickSettingsTab } from './QuickSettingsTab';
import { TemplatesTab } from './TemplatesTab';
import { AdvancedTab } from './AdvancedTab';
import { PreviewTab } from './PreviewTab';
import { Settings, FileText, Code, Eye } from 'lucide-react';

export function PitchConfigSettings() {
  const [activeTab, setActiveTab] = useState('quick');

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Sales Pitch Configuration
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Customize how AI generates personalized sales pitches for your leads
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 lg:inline-grid lg:w-auto">
          <TabsTrigger value="quick" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Settings</span>
            <span className="sm:hidden">Quick</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
            <span className="sm:hidden">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
            <span className="sm:hidden">Advanced</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
            <span className="sm:hidden">Preview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-6">
          <QuickSettingsTab />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <TemplatesTab />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <AdvancedTab />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <PreviewTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
