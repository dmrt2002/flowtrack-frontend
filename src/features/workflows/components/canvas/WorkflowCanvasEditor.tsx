'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TriggerNode } from './nodes/TriggerNode';
import { EmailNode } from './nodes/EmailNode';
import { ConditionNode } from './nodes/ConditionNode';
import { DelayNode } from './nodes/DelayNode';
import { EndNode } from './nodes/EndNode';
import { EmailNodeEditorModal } from './modals/EmailNodeEditorModal';
import { DelayNodeEditorModal } from './modals/DelayNodeEditorModal';

interface WorkflowCanvasEditorProps {
  workflowId: string;
  configurationData: WorkflowConfiguration;
  onUpdate: (updates: Partial<WorkflowConfiguration>) => void;
}

export interface WorkflowConfiguration {
  welcomeSubject?: string;
  welcomeBody?: string;
  followUpSubject?: string;
  followUpBody?: string;
  followUpDelayDays?: number;
  thankYouSubject?: string;
  thankYouBody?: string;
  deadlineDays?: number;
}

interface NodeData {
  label: string;
  type?: string;
  subject?: string;
  body?: string;
  delayDays?: number;
  description?: string;
}

const nodeTypes = {
  trigger: TriggerNode,
  email: EmailNode,
  condition: ConditionNode,
  delay: DelayNode,
  end: EndNode,
};

export function WorkflowCanvasEditor({
  configurationData,
  onUpdate,
}: WorkflowCanvasEditorProps) {
  const [selectedEmailNode, setSelectedEmailNode] = useState<{
    id: string;
    type: 'welcome' | 'thankYou' | 'followUp';
  } | null>(null);
  const [selectedDelayNode, setSelectedDelayNode] = useState<{
    id: string;
    type: 'followUp' | 'deadline';
  } | null>(null);

  // Generate fixed workflow structure based on configuration with better spacing
  const { nodes, edges } = useMemo(() => {
    const workflowNodes: Node<NodeData>[] = [
      // Trigger Node
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 400, y: 0 },
        data: {
          label: 'Lead Submitted',
          description: 'New lead enters the system via form submission',
        },
      },
      // Welcome Email Node
      {
        id: 'email-welcome',
        type: 'email',
        position: { x: 350, y: 180 },
        data: {
          label: 'Welcome Email',
          type: 'welcome',
          subject:
            configurationData.welcomeSubject ||
            "Welcome! Here's your booking link",
          body:
            configurationData.welcomeBody ||
            'Hi {firstName}, thanks for your interest!',
        },
      },
      // Condition Node
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 340, y: 420 },
        data: {
          label: 'Booking Link Clicked?',
          description: 'Check if lead clicked the booking link',
        },
      },
      // Thank You Email Node (YES path)
      {
        id: 'email-thankyou',
        type: 'email',
        position: { x: 50, y: 650 },
        data: {
          label: 'Thank You Email',
          type: 'thankYou',
          subject: configurationData.thankYouSubject || 'Thanks for booking!',
          body:
            configurationData.thankYouBody ||
            'Hi {firstName}, looking forward to our meeting!',
        },
      },
      // Delay Node (NO path - Follow-up delay)
      {
        id: 'delay-followup',
        type: 'delay',
        position: { x: 750, y: 650 },
        data: {
          label: 'Wait',
          type: 'followUp',
          delayDays: configurationData.followUpDelayDays || 2,
        },
      },
      // Follow-up Email Node
      {
        id: 'email-followup',
        type: 'email',
        position: { x: 700, y: 850 },
        data: {
          label: 'Follow-up Email',
          type: 'followUp',
          subject: configurationData.followUpSubject || 'Still interested?',
          body:
            configurationData.followUpBody ||
            "Hi {firstName}, just checking if you're still interested...",
        },
      },
      // Delay Node (Deadline)
      {
        id: 'delay-deadline',
        type: 'delay',
        position: { x: 750, y: 1090 },
        data: {
          label: 'Wait Until Deadline',
          type: 'deadline',
          delayDays: configurationData.deadlineDays || 7,
        },
      },
      // End Node (Lead Lost)
      {
        id: 'end-lost',
        type: 'end',
        position: { x: 740, y: 1290 },
        data: {
          label: 'Lead Lost',
          description: 'No booking made within deadline',
        },
      },
      // End Node (Booked - from Thank You)
      {
        id: 'end-booked',
        type: 'end',
        position: { x: 50, y: 890 },
        data: {
          label: 'Lead Converted',
          description: 'Successfully booked a meeting',
        },
      },
    ];

    const workflowEdges: Edge[] = [
      // Trigger to Welcome Email
      {
        id: 'e-trigger-welcome',
        source: 'trigger-1',
        target: 'email-welcome',
        type: ConnectionLineType.SmoothStep,
        animated: true,
      },
      // Welcome Email to Condition
      {
        id: 'e-welcome-condition',
        source: 'email-welcome',
        target: 'condition-1',
        type: ConnectionLineType.SmoothStep,
      },
      // Condition to Thank You (YES)
      {
        id: 'e-condition-thankyou',
        source: 'condition-1',
        target: 'email-thankyou',
        sourceHandle: 'yes',
        type: ConnectionLineType.SmoothStep,
        label: 'YES',
        labelBgStyle: { fill: '#ECFDF5', fillOpacity: 1 },
        labelStyle: { fill: '#059669', fontWeight: 600, fontSize: 12 },
        style: { stroke: '#059669' },
        animated: true,
      },
      // Condition to Follow-up Delay (NO)
      {
        id: 'e-condition-delay',
        source: 'condition-1',
        target: 'delay-followup',
        sourceHandle: 'no',
        type: ConnectionLineType.SmoothStep,
        label: 'NO',
        labelBgStyle: { fill: '#FEF2F2', fillOpacity: 1 },
        labelStyle: { fill: '#DC2626', fontWeight: 600, fontSize: 12 },
        style: { stroke: '#DC2626' },
      },
      // Thank You to End (Booked)
      {
        id: 'e-thankyou-end',
        source: 'email-thankyou',
        target: 'end-booked',
        type: ConnectionLineType.SmoothStep,
      },
      // Delay to Follow-up Email
      {
        id: 'e-delay-followup',
        source: 'delay-followup',
        target: 'email-followup',
        type: ConnectionLineType.SmoothStep,
      },
      // Follow-up Email to Deadline Delay
      {
        id: 'e-followup-deadline',
        source: 'email-followup',
        target: 'delay-deadline',
        type: ConnectionLineType.SmoothStep,
      },
      // Deadline to End (Lost)
      {
        id: 'e-deadline-end',
        source: 'delay-deadline',
        target: 'end-lost',
        type: ConnectionLineType.SmoothStep,
      },
    ];

    return { nodes: workflowNodes, edges: workflowEdges };
  }, [configurationData]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type === 'email') {
        const emailType = node.data.type as 'welcome' | 'thankYou' | 'followUp';
        setSelectedEmailNode({ id: node.id, type: emailType });
      } else if (node.type === 'delay') {
        const delayType = node.data.type as 'followUp' | 'deadline';
        setSelectedDelayNode({ id: node.id, type: delayType });
      }
    },
    []
  );

  const handleEmailUpdate = (
    type: 'welcome' | 'thankYou' | 'followUp',
    subject: string,
    body: string
  ) => {
    const updates: Partial<WorkflowConfiguration> = {};

    if (type === 'welcome') {
      updates.welcomeSubject = subject;
      updates.welcomeBody = body;
    } else if (type === 'thankYou') {
      updates.thankYouSubject = subject;
      updates.thankYouBody = body;
    } else if (type === 'followUp') {
      updates.followUpSubject = subject;
      updates.followUpBody = body;
    }

    onUpdate(updates);
    setSelectedEmailNode(null);
  };

  const handleDelayUpdate = (
    type: 'followUp' | 'deadline',
    delayDays: number
  ) => {
    const updates: Partial<WorkflowConfiguration> = {};

    if (type === 'followUp') {
      updates.followUpDelayDays = delayDays;
    } else if (type === 'deadline') {
      updates.deadlineDays = delayDays;
    }

    onUpdate(updates);
    setSelectedDelayNode(null);
  };

  return (
    <>
      <div
        className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
        style={{ height: '800px' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
          minZoom={0.5}
          maxZoom={1.5}
          defaultEdgeOptions={{
            type: ConnectionLineType.SmoothStep,
            animated: false,
          }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background color="#E5E5E5" gap={16} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {selectedEmailNode && (
        <EmailNodeEditorModal
          isOpen={true}
          onClose={() => setSelectedEmailNode(null)}
          emailType={selectedEmailNode.type}
          initialSubject={
            selectedEmailNode.type === 'welcome'
              ? configurationData.welcomeSubject || ''
              : selectedEmailNode.type === 'thankYou'
                ? configurationData.thankYouSubject || ''
                : configurationData.followUpSubject || ''
          }
          initialBody={
            selectedEmailNode.type === 'welcome'
              ? configurationData.welcomeBody || ''
              : selectedEmailNode.type === 'thankYou'
                ? configurationData.thankYouBody || ''
                : configurationData.followUpBody || ''
          }
          onSave={(subject, body) =>
            handleEmailUpdate(selectedEmailNode.type, subject, body)
          }
        />
      )}

      {selectedDelayNode && (
        <DelayNodeEditorModal
          isOpen={true}
          onClose={() => setSelectedDelayNode(null)}
          delayType={selectedDelayNode.type}
          initialDelayDays={
            selectedDelayNode.type === 'followUp'
              ? configurationData.followUpDelayDays || 2
              : configurationData.deadlineDays || 7
          }
          onSave={(delayDays) =>
            handleDelayUpdate(selectedDelayNode.type, delayDays)
          }
        />
      )}
    </>
  );
}
