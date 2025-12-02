'use client';

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Save, Trash2, Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type {
  LeadDetailResponse,
  UpdateLeadDto,
  LeadStatus,
} from '../types/lead';
import { LEAD_STATUS_LABELS } from '../types/lead';
import { getStatusColor, formatSourceLabel } from '../utils/lead-status-colors';
import { useUpdateLead, useDeleteLead } from '../hooks/use-leads';
import { LeadEmailsTab } from './LeadEmailsTab';

interface LeadDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: LeadDetailResponse | null;
  workspaceId: string;
  users?: Array<{ id: string; name: string }>;
}

const LEAD_STATUSES: LeadStatus[] = [
  'NEW',
  'EMAIL_SENT',
  'EMAIL_OPENED',
  'FOLLOW_UP_PENDING',
  'FOLLOW_UP_SENT',
  'RESPONDED',
  'BOOKED',
  'WON',
  'LOST',
  'DISQUALIFIED',
];

export function LeadDetailModal({
  open,
  onOpenChange,
  lead,
  workspaceId,
}: LeadDetailModalProps) {
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  const [formData, setFormData] = useState<UpdateLeadDto>({});

  // Update form data when lead changes
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email,
        phone: lead.phone || '',
        companyName: lead.companyName || '',
        status: lead.status,
        score: lead.score,
      });
    }
  }, [lead]);

  if (!lead) return null;

  const statusColors = getStatusColor(lead.status);

  const handleSave = async () => {
    try {
      await updateLeadMutation.mutateAsync({
        workspaceId,
        leadId: lead.id,
        dto: formData,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      await deleteLeadMutation.mutateAsync({
        workspaceId,
        leadId: lead.id,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  const isLoading =
    updateLeadMutation.isPending || deleteLeadMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Lead Details
          </DialogTitle>
          <DialogDescription>View and edit lead information</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {lead.name || 'Unknown Lead'}
                </h3>
                <p className="text-sm text-neutral-600">{lead.email}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${statusColors.bg} ${statusColors.text}`}
              >
                <span className={`h-2 w-2 rounded-full ${statusColors.dot}`} />
                {lead.status}
              </span>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-neutral-900">
                Contact Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.companyName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Lead Management */}
            <div className="space-y-4">
              <h4 className="font-medium text-neutral-900">Lead Management</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value as LeadStatus })
                    }
                  >
                    <SelectTrigger id="status" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {LEAD_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="score">Score</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        score: Number(e.target.value),
                      })
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Source Info */}
            <div className="space-y-2">
              <h4 className="font-medium text-neutral-900">
                Source Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">Source:</span>{' '}
                  <span className="font-medium">
                    {formatSourceLabel(lead.source)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-600">Workflow:</span>{' '}
                  <span className="font-medium">
                    {lead.workflow?.name || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-600">Created:</span>{' '}
                  <span className="font-medium">
                    {formatDistanceToNow(new Date(lead.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-600">Last Activity:</span>{' '}
                  <span className="font-medium">
                    {lead.lastActivityAt
                      ? formatDistanceToNow(new Date(lead.lastActivityAt), {
                          addSuffix: true,
                        })
                      : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            {lead.fieldData && lead.fieldData.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-neutral-900">Custom Fields</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {lead.fieldData.map((field) => (
                    <div key={field.id}>
                      <span className="text-neutral-600">
                        {field.fieldLabel}:
                      </span>{' '}
                      <span className="font-medium">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            {lead.events && lead.events.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-neutral-900">
                  Recent Activity
                </h4>
                <div className="max-h-[200px] space-y-2 overflow-y-auto">
                  {lead.events.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900">
                          {event.description}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {formatDistanceToNow(new Date(event.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="emails">
            <LeadEmailsTab workspaceId={workspaceId} leadId={lead.id} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Lead
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <div className="text-white">
                  <Save className="mr-2 h-4 w-4 text-white" />
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
