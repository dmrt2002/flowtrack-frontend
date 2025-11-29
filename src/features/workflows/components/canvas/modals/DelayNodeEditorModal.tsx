'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Clock, Save } from 'lucide-react';

interface DelayNodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  delayType: 'followUp' | 'deadline';
  initialDelayDays: number;
  onSave: (delayDays: number) => void;
}

const DELAY_TYPE_CONFIG = {
  followUp: {
    title: 'Follow-up Delay',
    description:
      'Time to wait before sending the follow-up email if no booking is made',
    min: 1,
    max: 7,
    defaultValue: 2,
    suggestions: [1, 2, 3, 5, 7],
  },
  deadline: {
    title: 'Deadline Duration',
    description: 'Total time to wait before marking the lead as lost',
    min: 1,
    max: 30,
    defaultValue: 7,
    suggestions: [3, 5, 7, 14, 30],
  },
};

export function DelayNodeEditorModal({
  isOpen,
  onClose,
  delayType,
  initialDelayDays,
  onSave,
}: DelayNodeEditorModalProps) {
  const [delayDays, setDelayDays] = useState(initialDelayDays);
  const config = DELAY_TYPE_CONFIG[delayType];

  useEffect(() => {
    setDelayDays(initialDelayDays);
  }, [initialDelayDays, isOpen]);

  const handleSave = () => {
    const validDays = Math.max(config.min, Math.min(config.max, delayDays));
    onSave(validDays);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelayDays(Number(e.target.value));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] gap-0 p-0">
        {/* Header */}
        <DialogHeader className="border-b border-neutral-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-neutral-900">
                {config.title}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-neutral-600">
                {config.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="space-y-6 px-6 py-6">
          {/* Current Value Display */}
          <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 py-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-5xl font-bold text-purple-600">
                  {delayDays}
                </div>
                <div className="mt-1 text-lg font-semibold text-purple-700">
                  {delayDays === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-neutral-900">
              Select Duration
            </Label>
            <div className="relative pt-2">
              <input
                type="range"
                min={config.min}
                max={config.max}
                value={delayDays}
                onChange={handleSliderChange}
                className="slider-thumb h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-200"
                style={{
                  background: `linear-gradient(to right, #9333EA 0%, #9333EA ${((delayDays - config.min) / (config.max - config.min)) * 100}%, #E9D5FF ${((delayDays - config.min) / (config.max - config.min)) * 100}%, #E9D5FF 100%)`,
                }}
              />
              <div className="mt-2 flex justify-between text-xs font-medium text-neutral-600">
                <span>
                  {config.min} day{config.min === 1 ? '' : 's'}
                </span>
                <span>
                  {config.max} day{config.max === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-900">
              Quick Select
            </Label>
            <div className="flex gap-2">
              {config.suggestions.map((days) => (
                <button
                  key={days}
                  onClick={() => setDelayDays(days)}
                  className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                    delayDays === days
                      ? 'border-purple-500 bg-purple-100 text-purple-700'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-900">
              Timeline Preview
            </Label>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-600">
                      Day 0
                    </span>
                    <span className="text-xs font-medium text-purple-600">
                      Day {delayDays}
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
                      style={{ width: `${(delayDays / config.max) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500">
                      {delayType === 'followUp'
                        ? 'No booking'
                        : 'Follow-up sent'}
                    </span>
                    <span className="text-[10px] font-semibold text-purple-600">
                      {delayType === 'followUp'
                        ? 'Send follow-up'
                        : 'Mark as lost'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            <Save className="mr-2 h-4 w-4 text-white" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
