'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  GitBranch,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '../store/onboardingStore';
import { useActivateWorkflowMutation } from '../hooks/useActivateWorkflowMutation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type WorkflowBlock = {
  id: string;
  type:
    | 'trigger'
    | 'email'
    | 'condition'
    | 'delay'
    | 'end_success'
    | 'end_fail';
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  delay: number; // Animation delay in seconds
  branch?: 'yes' | 'no'; // For branching paths
  parentId?: string; // For branching
};

const workflowBlocks: WorkflowBlock[] = [
  {
    id: 'form-submit',
    type: 'trigger',
    title: 'Lead Submitted',
    description: 'Form submission received',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    delay: 0,
  },
  {
    id: 'welcome-email',
    type: 'email',
    title: 'Welcome Email',
    description: 'Send email with booking link',
    icon: Mail,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    delay: 0.4,
  },
  {
    id: 'booking-condition',
    type: 'condition',
    title: 'Booking Link Clicked?',
    description: 'Check if lead clicked booking link',
    icon: GitBranch,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    delay: 0.8,
  },
  // YES Branch
  {
    id: 'thank-you-email',
    type: 'email',
    title: 'Thank You Email',
    description: 'Booking confirmed!',
    icon: Mail,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    delay: 1.2,
    branch: 'yes',
    parentId: 'booking-condition',
  },
  {
    id: 'lead-converted',
    type: 'end_success',
    title: 'Lead Converted',
    description: 'Successfully booked',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    delay: 1.6,
    branch: 'yes',
    parentId: 'thank-you-email',
  },
  // NO Branch
  {
    id: 'wait-delay',
    type: 'delay',
    title: 'Wait 2 Days',
    description: 'Delay before follow-up',
    icon: Clock,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    delay: 1.2,
    branch: 'no',
    parentId: 'booking-condition',
  },
  {
    id: 'followup-email',
    type: 'email',
    title: 'Follow-up Email',
    description: 'Reminder to book',
    icon: Mail,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    delay: 1.6,
    branch: 'no',
    parentId: 'wait-delay',
  },
  {
    id: 'wait-booking',
    type: 'delay',
    title: 'Wait for Booking',
    description: 'Monitor for 10 days',
    icon: Clock,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    delay: 2.0,
    branch: 'no',
    parentId: 'followup-email',
  },
  {
    id: 'lead-lost',
    type: 'end_fail',
    title: 'Lead Lost',
    description: 'No booking after deadline',
    icon: XCircle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    delay: 2.4,
    branch: 'no',
    parentId: 'wait-booking',
  },
];

interface WorkflowBlockCardProps {
  block: WorkflowBlock;
  animationComplete: boolean;
}

function WorkflowBlockCard({
  block,
  animationComplete,
}: WorkflowBlockCardProps) {
  const Icon = block.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={animationComplete ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{
        delay: animationComplete ? 0 : block.delay,
        duration: 0.5,
        ease: 'easeOut',
      }}
      className={`relative mx-auto max-w-md rounded-2xl border-2 ${block.borderColor} ${block.bgColor} p-4 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${block.bgColor} ${block.color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold ${block.color} text-sm`}>
            {block.title}
          </h3>
          <p className="mt-0.5 text-xs text-gray-600">{block.description}</p>
        </div>
      </div>
      {block.branch && (
        <div
          className={`absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
            block.branch === 'yes'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {block.branch}
        </div>
      )}
    </motion.div>
  );
}

export function SimulationScreen() {
  const router = useRouter();
  const { configurationId, completeStep } = useOnboardingStore();
  const { mutate: activateWorkflow, isPending: isActivating } =
    useActivateWorkflowMutation();

  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Mark animation as complete after all blocks have animated in
    const maxDelay = Math.max(...workflowBlocks.map((b) => b.delay));
    const timer = setTimeout(
      () => {
        setAnimationComplete(true);
        completeStep(5); // Mark simulation step as complete
      },
      (maxDelay + 0.5) * 1000
    );

    return () => clearTimeout(timer);
  }, [completeStep]);

  const handleGoLive = async () => {
    if (!configurationId) {
      toast.error('Configuration ID is missing');
      return;
    }

    activateWorkflow(
      { configurationId },
      {
        onSuccess: async (response: any) => {
          const url = response?.data?.data?.publicFormUrl || '';
          router.push(
            `/dashboard-home?launchpad=true&publicFormUrl=${encodeURIComponent(url)}`
          );
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || 'Failed to activate workflow';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleBack = () => {
    router.push('/onboarding/configure');
  };

  // Separate blocks into main flow and branches
  const mainBlocks = workflowBlocks.filter((b) => !b.parentId);
  const yesBranch = workflowBlocks.filter((b) => b.branch === 'yes');
  const noBranch = workflowBlocks.filter((b) => b.branch === 'no');

  return (
    <div className="simulation-container flex h-screen flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-white px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex h-full max-w-5xl flex-col gap-6">
          {/* Header */}
          <div>
            <button
              onClick={handleBack}
              className="text-muted-foreground hover:text-primary mb-4 flex items-center gap-2 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="relative">
              <div className="text-muted-foreground absolute top-0 right-0 text-xs font-medium sm:text-sm">
                Step 4 of 4
              </div>
              <h1 className="text-foreground mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                The Kinetic Pipeline
              </h1>
              <p className="text-muted-foreground max-w-[720px] text-sm sm:text-base">
                Watch your workflow come to life. Each block represents a step
                in your lead automation journey.
              </p>
            </div>
          </div>

          {/* Workflow Canvas */}
          <div className="flex-1 pb-24">
            <div className="relative mx-auto max-w-3xl">
              {/* Vertical layout with branching */}
              <div className="space-y-4">
                {/* Main flow up to branching condition */}
                {mainBlocks.map((block, index) => (
                  <div key={block.id}>
                    <WorkflowBlockCard
                      block={block}
                      animationComplete={animationComplete}
                    />
                    {block.id === 'booking-condition' ? (
                      // Branching visualization
                      <div className="relative mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* YES Branch */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-green-200"></div>
                            <span className="text-xs font-semibold text-green-600 uppercase">
                              Yes - Booked
                            </span>
                            <div className="h-px flex-1 bg-green-200"></div>
                          </div>
                          {yesBranch.map((b) => (
                            <WorkflowBlockCard
                              key={b.id}
                              block={b}
                              animationComplete={animationComplete}
                            />
                          ))}
                        </div>

                        {/* NO Branch */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-red-200"></div>
                            <span className="text-xs font-semibold text-red-600 uppercase">
                              No - Follow-up
                            </span>
                            <div className="h-px flex-1 bg-red-200"></div>
                          </div>
                          {noBranch.map((b) => (
                            <WorkflowBlockCard
                              key={b.id}
                              block={b}
                              animationComplete={animationComplete}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Connection line
                      index < mainBlocks.length - 1 && (
                        <div className="mx-auto my-2 h-8 w-0.5 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                      )
                    )}
                  </div>
                ))}
              </div>

              {/* Animation progress indicator */}
              {!animationComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed bottom-32 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                    Building your workflow...
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-border fixed right-0 bottom-0 left-0 z-10 flex flex-col gap-3 border-t bg-white p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:px-10 lg:py-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isActivating}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleGoLive}
          disabled={isActivating || !animationComplete}
          className="hover:shadow-primary/30 w-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50 sm:w-auto"
        >
          {isActivating ? (
            'Activating...'
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Go Live
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
