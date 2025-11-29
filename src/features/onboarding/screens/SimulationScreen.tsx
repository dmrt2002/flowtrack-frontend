'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { ArrowLeft, Play, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '../store/onboardingStore';
import { useSimulationMutation } from '../hooks/useSimulationMutation';
import { useActivateWorkflowMutation } from '../hooks/useActivateWorkflowMutation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { StrategyId, ConfigSchema } from '../types';

type SimulationPhase = 'idle' | 'loading' | 'running' | 'complete';
type ScenarioType = 'pass' | 'fail';
type PipelinePhase = 'idle' | 'lead' | 'logic' | 'result';

interface TestLead {
  name: string;
  email: string;
  budget?: number;
  company?: string;
}

interface LogicStep {
  id: string;
  label: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  status: 'pending' | 'active' | 'passed' | 'failed';
  delayDays?: number;
  emailNumber?: number;
}

interface ScenarioResult {
  type: ScenarioType;
  passed: boolean;
  message: string;
  emailSent: boolean;
  followUpScheduled?: boolean;
  bookingConfirmed?: boolean;
  declineReason?: string;
  nextEmailEtaDays?: number;
  failWindowDays?: number;
}

const DEFAULT_BUDGET_THRESHOLD = 2000;

const namePresets = {
  pass: 'Ava Booker',
  fail: 'Noah Follow-up',
};

const emailPresets = {
  pass: 'ava.booker@example.com',
  fail: 'noah.followup@example.com',
};

const parseQualificationValue = (criteria?: string): number | null => {
  if (!criteria) return null;
  const match = criteria.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (match) {
    const parsed = Number(match[1]);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
};

const deriveBudgetThreshold = (
  configuration?: Record<string, any>,
  configurationSchema?: ConfigSchema | null
): number => {
  const configValue = Number(configuration?.budgetThreshold);
  if (!Number.isNaN(configValue) && configValue > 0) {
    return configValue;
  }

  const schemaPlaceholder = configurationSchema?.fields.find(
    (field) => field.id === 'budgetThreshold'
  )?.placeholder;
  if (schemaPlaceholder) {
    const placeholderValue = Number(schemaPlaceholder);
    if (!Number.isNaN(placeholderValue) && placeholderValue > 0) {
      return placeholderValue;
    }
  }

  const qualificationValue = parseQualificationValue(
    configuration?.qualificationCriteria as string | undefined
  );
  if (qualificationValue) {
    return qualificationValue;
  }

  return DEFAULT_BUDGET_THRESHOLD;
};

const getNumericConfigValue = (
  fieldId: string,
  configuration?: Record<string, any>,
  configurationSchema?: ConfigSchema | null,
  fallback = 0
): number => {
  const configuredValue = Number(configuration?.[fieldId]);
  if (!Number.isNaN(configuredValue) && configuredValue > 0) {
    return configuredValue;
  }

  const schemaPlaceholder = configurationSchema?.fields.find(
    (field) => field.id === fieldId
  )?.placeholder;
  if (schemaPlaceholder) {
    const placeholderValue = Number(schemaPlaceholder);
    if (!Number.isNaN(placeholderValue) && placeholderValue > 0) {
      return placeholderValue;
    }
  }

  return fallback;
};

/**
 * Get strategy-specific logic steps
 */
function getLogicStepsForStrategy(
  strategyId: StrategyId | null,
  configuration?: Record<string, any>
): LogicStep[] {
  if (!strategyId) {
    return [
      {
        id: 'form',
        label: 'Form Submission',
        type: 'trigger',
        status: 'pending',
      },
      { id: 'action', label: 'Send Email', type: 'action', status: 'pending' },
    ];
  }

  switch (strategyId) {
    case 'gatekeeper':
      return [
        {
          id: 'form',
          label: 'Form Submission',
          type: 'trigger',
          status: 'pending',
        },
        {
          id: 'check',
          label: 'Check Budget',
          type: 'condition',
          status: 'pending',
        },
        {
          id: 'action',
          label: 'Send Email',
          type: 'action',
          status: 'pending',
        },
      ];

    case 'nurturer': {
      const firstEmailDelay = configuration?.firstEmailDelay || 3;
      const steps: LogicStep[] = [
        {
          id: 'form',
          label: 'Form Submission',
          type: 'trigger',
          status: 'pending',
        },
      ];

      for (let i = 1; i <= 5; i++) {
        steps.push({
          id: `delay${i}`,
          label: `Wait ${firstEmailDelay} days`,
          type: 'delay',
          status: 'pending',
          delayDays: firstEmailDelay,
        });
        steps.push({
          id: `email${i}`,
          label: `Send Email ${i}`,
          type: 'action',
          status: 'pending',
          emailNumber: i,
        });
      }

      return steps;
    }

    case 'closer':
      return [
        {
          id: 'form',
          label: 'Form Submission',
          type: 'trigger',
          status: 'pending',
        },
        {
          id: 'booking',
          label: 'Send Booking Link',
          type: 'action',
          status: 'pending',
        },
        {
          id: 'delay',
          label: 'Wait 1 day',
          type: 'delay',
          status: 'pending',
          delayDays: 1,
        },
        {
          id: 'reminder',
          label: 'Send Reminder',
          type: 'action',
          status: 'pending',
        },
      ];

    default:
      return [
        {
          id: 'form',
          label: 'Form Submission',
          type: 'trigger',
          status: 'pending',
        },
        {
          id: 'action',
          label: 'Send Email',
          type: 'action',
          status: 'pending',
        },
      ];
  }
}

/**
 * Get strategy-specific test leads
 */
function getTestLeadsForStrategy(
  strategyId: StrategyId | null,
  configuration?: Record<string, any>,
  budgetThreshold: number = DEFAULT_BUDGET_THRESHOLD
): { fail?: TestLead; pass?: TestLead; single?: TestLead } {
  if (!strategyId) {
    return {
      fail: { name: 'Test Lead', email: 'test@example.com' },
    };
  }

  switch (strategyId) {
    case 'gatekeeper': {
      return {
        fail: {
          name: namePresets.fail,
          email: emailPresets.fail,
          budget: Math.max(
            Math.floor(budgetThreshold * 1.1),
            budgetThreshold + 250
          ),
        },
        pass: {
          name: namePresets.pass,
          email: emailPresets.pass,
          budget: Math.max(
            Math.floor(budgetThreshold * 1.4),
            budgetThreshold + 500
          ),
        },
      };
    }

    case 'nurturer':
      return {
        single: {
          name: 'Emily Rodriguez',
          email: 'emily@example.com',
          company: 'Acme Corp',
        },
      };

    case 'closer':
      return {
        single: {
          name: 'Mike Chen',
          email: 'mike@example.com',
          company: 'Tech Startup',
        },
      };

    default:
      return {
        fail: { name: 'Test Lead', email: 'test@example.com' },
      };
  }
}

export function SimulationScreen() {
  const router = useRouter();
  const {
    configurationId,
    simulationData,
    configuration,
    configurationSchema,
    completeStep,
  } = useOnboardingStore();
  const { mutate: runSimulation, isPending: isSimulating } =
    useSimulationMutation();
  const { mutate: activateWorkflow, isPending: isActivating } =
    useActivateWorkflowMutation();

  const [simulationPhase, setSimulationPhase] =
    useState<SimulationPhase>('idle');
  const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(
    null
  );
  const [, setActiveLogicStep] = useState<number>(-1);
  const [focusedScenario, setFocusedScenario] = useState<ScenarioType>('pass');

  // Use unified strategy for all workflows
  const strategyId: StrategyId = 'gatekeeper'; // Default to gatekeeper for unified workflow
  const budgetThreshold = useMemo(
    () => deriveBudgetThreshold(configuration, configurationSchema),
    [configuration, configurationSchema]
  );
  const followUpDelayDays = useMemo(
    () =>
      getNumericConfigValue(
        'followUpDelayDays',
        configuration,
        configurationSchema,
        3
      ),
    [configuration, configurationSchema]
  );
  const bookingDeadlineDays = useMemo(
    () =>
      getNumericConfigValue(
        'bookingDeadlineDays',
        configuration,
        configurationSchema,
        7
      ),
    [configuration, configurationSchema]
  );

  // Initialize test leads based on strategy
  const testLeadProfiles = useMemo(
    () => getTestLeadsForStrategy(strategyId, configuration, budgetThreshold),
    [strategyId, configuration, budgetThreshold]
  );
  const testLeadFail = useMemo(
    () => testLeadProfiles.fail || { name: '', email: '' },
    [testLeadProfiles.fail]
  );
  const testLeadPass = useMemo(
    () => testLeadProfiles.pass || { name: '', email: '' },
    [testLeadProfiles.pass]
  );
  const testLeadSingle = useMemo(
    () => testLeadProfiles.single || { name: '', email: '' },
    [testLeadProfiles.single]
  );

  // Initialize logic steps based on strategy
  const initialLogicSteps = getLogicStepsForStrategy(strategyId, configuration);
  const [, setLogicSteps] = useState<LogicStep[]>(initialLogicSteps);

  const [scenarioResults, setScenarioResults] = useState<{
    fail: ScenarioResult | null;
    pass: ScenarioResult | null;
  }>({
    fail: null,
    pass: null,
  });
  const [pipelinePhase, setPipelinePhase] = useState<PipelinePhase>('idle');
  const pipelineTimersRef = useRef<NodeJS.Timeout[]>([]);
  const autoAdvanceRef = useRef(false);
  const clearPipelineTimers = useCallback(() => {
    pipelineTimersRef.current.forEach((timer) => clearTimeout(timer));
    pipelineTimersRef.current = [];
  }, []);
  const scenarioNarratives = useMemo<
    Record<
      ScenarioType,
      {
        id: string;
        title: string;
        summary: string;
        variableLabel: string;
        variableValue: string;
        resultBullets: string[];
        lead: TestLead;
      }
    >
  >(() => {
    const formatBudget = (value?: number) =>
      `$${Number(value || 0).toLocaleString()}`;
    const formatDays = (days: number) => `${days} day${days === 1 ? '' : 's'}`;

    return {
      pass: {
        id: 'scenario-1',
        title: 'Scenario 1: Lead Booked',
        summary: 'Lead qualified! Booking link was opened immediately.',
        variableLabel: 'Budget',
        variableValue: formatBudget(testLeadPass.budget || budgetThreshold),
        lead: testLeadPass,
        resultBullets: [
          'Booking link opened on first touch.',
          'Work stops once booking is confirmed.',
        ],
      },
      fail: {
        id: 'scenario-2',
        title: 'Scenario 2: Follow-up Scheduled',
        summary:
          'Lead qualifies but hasn’t booked yet. Follow-up email scheduled.',
        variableLabel: 'Budget',
        variableValue: formatBudget(testLeadFail.budget || 2250),
        lead: testLeadFail,
        resultBullets: [
          `Next email queued automatically after ${formatDays(followUpDelayDays)}.`,
          `Lead is marked failed if no booking within ${formatDays(
            bookingDeadlineDays
          )}.`,
        ],
      },
    };
  }, [
    testLeadPass,
    testLeadFail,
    budgetThreshold,
    followUpDelayDays,
    bookingDeadlineDays,
  ]);
  const ghostHistory = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      tone: ScenarioType;
      message: string;
    }> = [];
    if (scenarioResults.pass) {
      items.push({
        id: 'history-pass',
        title: 'Scenario 1 · Booked',
        tone: 'pass',
        message: scenarioResults.pass.message,
      });
    }
    if (scenarioResults.fail) {
      items.push({
        id: 'history-fail',
        title: 'Scenario 2 · Follow-up',
        tone: 'fail',
        message: scenarioResults.fail.message,
      });
    }
    return items;
  }, [scenarioResults]);
  const leadInitials = useMemo(() => {
    const source =
      scenarioNarratives[focusedScenario].lead.name?.trim() ||
      scenarioNarratives[focusedScenario].lead.email?.trim();
    if (!source) return 'LD';
    return source
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('');
  }, [scenarioNarratives, focusedScenario]);
  const pipeHeights: Record<PipelinePhase, number> = {
    idle: 140,
    lead: 220,
    logic: 320,
    result: 420,
  };
  const pipeColorMap: Record<'idle' | ScenarioType, string> = {
    idle: 'rgba(226,232,240,0.5)',
    pass: 'rgba(16,185,129,0.9)',
    fail: 'rgba(244,63,94,0.9)',
  };
  const pipeColor =
    pipelinePhase === 'logic'
      ? 'rgba(216,180,254,0.85)'
      : pipelinePhase === 'result'
        ? pipeColorMap[focusedScenario]
        : pipeColorMap.idle;
  const pipelineSpring: Transition = {
    type: 'spring',
    stiffness: 40,
    damping: 20,
  };
  const scenarioBackgroundClass =
    focusedScenario === 'pass'
      ? 'from-[#4f46e5]/80 via-[#2c1b63]/90 to-[#070710]/95'
      : 'from-[#7c3aed]/80 via-[#341250]/90 to-[#08070f]/95';
  const streamViewportOffsets: Record<PipelinePhase, number> = {
    idle: 0,
    lead: 0,
    logic: -90,
    result: -180,
  };

  const simulateScenario = useCallback(
    (scenarioType: ScenarioType, lead: TestLead, delay: number) => {
      // Only for Gatekeeper strategy
      if (strategyId !== 'gatekeeper') return;

      setTimeout(() => {
        let stepIndex = 0;
        const interval = setInterval(() => {
          if (stepIndex < 3) {
            setActiveLogicStep(stepIndex);
            setLogicSteps((prev) =>
              prev.map((step, idx) => {
                if (idx < stepIndex) {
                  return { ...step, status: 'passed' };
                } else if (idx === stepIndex) {
                  return { ...step, status: 'active' };
                }
                return step;
              })
            );
            stepIndex++;
          } else {
            clearInterval(interval);

            // Evaluate budget check
            const passed = (lead.budget || 0) >= budgetThreshold;
            const checkStepFailed = !passed;

            // Update logic steps based on result
            setLogicSteps((prev) =>
              prev.map((step, idx) => {
                if (idx === 1) {
                  // Budget check step
                  return {
                    ...step,
                    status: checkStepFailed ? 'failed' : 'passed',
                  };
                } else if (idx === 2) {
                  // Email action step
                  return { ...step, status: 'passed' };
                }
                return step;
              })
            );

            // Set result
            const result: ScenarioResult = {
              type: scenarioType,
              passed: passed,
              message:
                scenarioType === 'pass'
                  ? 'Lead qualified! Booking link was opened immediately.'
                  : passed
                    ? `Lead qualifies but has not booked yet. Follow-up email scheduled in ${followUpDelayDays} day${
                        followUpDelayDays === 1 ? '' : 's'
                      }.`
                    : 'Lead rejected. Decline email will be sent.',
              emailSent: true,
              bookingConfirmed: scenarioType === 'pass' && passed,
              followUpScheduled: scenarioType === 'fail' && passed,
              nextEmailEtaDays:
                scenarioType === 'fail' && passed
                  ? followUpDelayDays
                  : undefined,
              failWindowDays:
                scenarioType === 'fail' && passed
                  ? bookingDeadlineDays
                  : undefined,
              declineReason: !passed
                ? `Budget ${Number(lead.budget || 0).toLocaleString()} < ${budgetThreshold.toLocaleString()}`
                : undefined,
            };

            setScenarioResults((prev) => ({
              ...prev,
              [scenarioType]: result,
            }));

            // If we just finished booking scenario, run follow-up scenario
            if (scenarioType === 'pass') {
              setTimeout(() => {
                setActiveScenario('fail');
                const steps = getLogicStepsForStrategy(
                  strategyId,
                  configuration
                );
                setLogicSteps(steps);
                simulateScenario('fail', testLeadFail, 0);
              }, 1800);
            } else {
              // Both scenarios complete
              setTimeout(() => {
                setSimulationPhase('complete');
                setActiveScenario(null);
                toast.success('Simulation complete! Both scenarios verified.');
              }, 800);
            }
          }
        }, 1500);
      }, delay);
    },
    [
      strategyId,
      budgetThreshold,
      configuration,
      testLeadFail,
      followUpDelayDays,
      bookingDeadlineDays,
    ]
  );

  const simulateNurturerScenario = useCallback(
    (lead: TestLead, delay: number, totalSteps: number) => {
      // Nurturer: Email sequence simulation
      setTimeout(() => {
        let stepIndex = 0;

        const interval = setInterval(() => {
          if (stepIndex < totalSteps) {
            setActiveLogicStep(stepIndex);
            setLogicSteps((prev) =>
              prev.map((step, idx) => {
                if (idx < stepIndex) {
                  return { ...step, status: 'passed' };
                } else if (idx === stepIndex) {
                  return { ...step, status: 'active' };
                }
                return step;
              })
            );
            stepIndex++;
          } else {
            clearInterval(interval);

            // Mark all steps as passed
            setLogicSteps((prev) =>
              prev.map((step) => ({ ...step, status: 'passed' }))
            );

            // Set result
            const result: ScenarioResult = {
              type: 'pass',
              passed: true,
              message:
                '5-email sequence completed. Lead will receive all emails over 15 days.',
              emailSent: true,
            };

            setScenarioResults({
              fail: null,
              pass: result,
            });

            setSimulationPhase('complete');
            setActiveScenario(null);
            toast.success('Simulation complete! Email sequence verified.');
          }
        }, 800); // Faster for longer sequence
      }, delay);
    },
    []
  );

  const simulateCloserScenario = useCallback(
    (lead: TestLead, delay: number, totalSteps: number) => {
      // Closer: Instant booking simulation
      setTimeout(() => {
        let stepIndex = 0;

        const interval = setInterval(() => {
          if (stepIndex < totalSteps) {
            setActiveLogicStep(stepIndex);
            setLogicSteps((prev) =>
              prev.map((step, idx) => {
                if (idx < stepIndex) {
                  return { ...step, status: 'passed' };
                } else if (idx === stepIndex) {
                  return { ...step, status: 'active' };
                }
                return step;
              })
            );
            stepIndex++;
          } else {
            clearInterval(interval);

            // Mark all steps as passed
            setLogicSteps((prev) =>
              prev.map((step) => ({ ...step, status: 'passed' }))
            );

            // Set result
            const result: ScenarioResult = {
              type: 'pass',
              passed: true,
              message:
                'Booking link sent immediately. Reminder will be sent 1 day before call.',
              emailSent: true,
            };

            setScenarioResults({
              fail: null,
              pass: result,
            });

            setSimulationPhase('complete');
            setActiveScenario(null);
            toast.success('Simulation complete! Booking flow verified.');
          }
        }, 1200);
      }, delay);
    },
    []
  );

  const runDualScenarioSimulation = useCallback(() => {
    // Reset logic steps based on strategy
    const steps = getLogicStepsForStrategy(strategyId, configuration);
    setLogicSteps(steps);
    const totalSteps = steps.length;
    setScenarioResults({ fail: null, pass: null });

    // Strategy-specific simulation flow
    if (strategyId === 'gatekeeper') {
      // Gatekeeper: Run booking scenario first, then follow-up
      setActiveScenario('pass');
      simulateScenario('pass', testLeadPass, 0);
    } else if (strategyId === 'nurturer') {
      // Nurturer: Run single scenario with email sequence
      setActiveScenario('pass');
      simulateNurturerScenario(testLeadSingle, 0, totalSteps);
    } else if (strategyId === 'closer') {
      // Closer: Run single scenario with booking flow
      setActiveScenario('pass');
      simulateCloserScenario(testLeadSingle, 0, totalSteps);
    } else {
      // Default: Run fail scenario
      setActiveScenario('fail');
      simulateScenario('fail', testLeadFail, 0);
    }
  }, [
    strategyId,
    configuration,
    simulateScenario,
    testLeadPass,
    testLeadFail,
    testLeadSingle,
    simulateNurturerScenario,
    simulateCloserScenario,
  ]);

  const handleRunSimulation = () => {
    if (configurationId) {
      setSimulationPhase('loading');

      // Run simulation for both scenarios
      runSimulation(
        {
          configurationId,
        },
        {
          onSuccess: () => {
            setSimulationPhase('running');
            runDualScenarioSimulation();
            // Mark Step 5 (Simulation) as complete
            completeStep(5);
            toast.success('Simulation step completed!');
          },
        }
      );
    } else if (simulationData) {
      setSimulationPhase('complete');
      runDualScenarioSimulation();
      // Mark Step 5 (Simulation) as complete if not already
      completeStep(5);
    }
  };

  const handleGoLive = async () => {
    if (!configurationId) {
      toast.error('Configuration ID is missing');
      return;
    }

    activateWorkflow(
      { configurationId },
      {
        onSuccess: async (response: any) => {
          // Extract publicFormUrl from response
          // Response structure: { data: { success: true, data: { publicFormUrl, ... } } }
          const url = response?.data?.data?.publicFormUrl || '';

          // Navigate to dashboard with launchpad modal parameters
          router.push(
            `/dashboard-home?launchpad=true&publicFormUrl=${encodeURIComponent(url)}`
          );
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || 'Failed to activate workflow';

          // Check if it's the Step 5 completion error
          if (errorMessage.includes('Step 5')) {
            toast.error('Please run the simulation first before going live', {
              description: 'Click "Run Simulation" to complete Step 5',
            });
          } else {
            toast.error(errorMessage);
          }
        },
      }
    );
  };

  const handleBack = () => {
    router.push('/onboarding/configure');
  };

  const cycleScenario = (direction: 'prev' | 'next') => {
    setFocusedScenario((prev) => {
      const nextScenario =
        direction === 'next'
          ? prev === 'pass'
            ? 'fail'
            : 'pass'
          : prev === 'fail'
            ? 'pass'
            : 'fail';

      if (nextScenario === 'pass') {
        autoAdvanceRef.current = false;
      }

      // Reset pipeline phase when manually switching
      setPipelinePhase('idle');

      return nextScenario;
    });
  };

  const handleScenarioFocus = (scenario: ScenarioType) => {
    if (scenario === 'pass') {
      autoAdvanceRef.current = false;
    }
    setFocusedScenario(scenario);
    // Reset pipeline phase when manually switching
    setPipelinePhase('idle');
  };

  useEffect(() => {
    if (activeScenario) {
      if (activeScenario === 'pass') {
        autoAdvanceRef.current = false;
      }
      setFocusedScenario(activeScenario);
    }
  }, [activeScenario]);

  useEffect(() => {
    clearPipelineTimers();

    if (!focusedScenario) {
      setPipelinePhase('idle');
      return;
    }

    setPipelinePhase('lead');
    const toLogic = setTimeout(() => setPipelinePhase('logic'), 2500);
    const toResult = setTimeout(() => setPipelinePhase('result'), 5000);
    pipelineTimersRef.current = [toLogic, toResult];

    return () => {
      clearPipelineTimers();
    };
  }, [focusedScenario, clearPipelineTimers]);

  useEffect(() => {
    return () => {
      clearPipelineTimers();
    };
  }, [clearPipelineTimers]);

  useEffect(() => {
    if (
      focusedScenario !== 'pass' ||
      pipelinePhase !== 'result' ||
      autoAdvanceRef.current
    ) {
      return;
    }

    const timer = setTimeout(() => {
      autoAdvanceRef.current = true;
      setFocusedScenario('fail');
    }, 3500);

    return () => clearTimeout(timer);
  }, [pipelinePhase, focusedScenario]);

  // Auto-run simulation on mount if conditions are met
  useEffect(() => {
    if (configurationId && simulationPhase === 'idle' && !simulationData) {
      // Don't auto-run, wait for user to click "Run Simulation"
    } else if (simulationData && simulationPhase === 'idle') {
      // Start running animation, complete phase will be set by runDualScenarioSimulation
      setSimulationPhase('running');
      runDualScenarioSimulation();
    }
  }, [
    configurationId,
    simulationData,
    simulationPhase,
    runDualScenarioSimulation,
  ]);

  return (
    <div className="simulation-container flex h-screen flex-col bg-[#05030d]">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-6">
        <div className="mx-auto flex h-full max-w-[760px] flex-col gap-6">
          {/* Header */}
          <div className="">
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
                Focus on a single lead in motion. Watch data rise through the
                Vertical Stream — form, logic, and result — without the clutter.
              </p>
            </div>
          </div>

          {/* Kinetic Pipeline Stage */}
          <div className="min-h-0 flex-1">
            <motion.div
              layout
              className="relative flex h-full flex-col overflow-y-auto rounded-[36px] border border-white/10 bg-[#08051a]/90 text-white shadow-[0_25px_60px_rgba(3,3,20,0.65)]"
            >
              <motion.div
                className={`pointer-events-none absolute inset-0 bg-linear-to-b ${scenarioBackgroundClass}`}
                animate={{ opacity: focusedScenario === 'pass' ? 0.9 : 0.9 }}
                transition={{ duration: 1.5 }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={focusedScenario}
                  initial={{
                    opacity: 0,
                    x: focusedScenario === 'pass' ? 40 : -40,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: focusedScenario === 'pass' ? -40 : 40,
                  }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="relative z-10 flex h-full flex-col px-6 py-6 sm:px-10 sm:py-10"
                >
                  <div className="flex items-center justify-between text-[11px] tracking-[0.35em] text-white/60 uppercase">
                    <span>Simulation Mode</span>
                    <span>{scenarioNarratives[focusedScenario].title}</span>
                  </div>

                  {/* Ghost history */}
                  <div className="mt-6 flex min-h-[110px] flex-col items-center justify-start space-y-3 text-center">
                    {ghostHistory.length === 0 ? (
                      <p className="text-xs text-white/30">
                        History will appear here as each card ascends.
                      </p>
                    ) : (
                      ghostHistory.slice(-2).map((item) => (
                        <div
                          key={item.id}
                          className={`w-full max-w-sm rounded-2xl border border-white/10 px-4 py-2 text-left text-xs font-medium ${
                            item.tone === 'pass'
                              ? 'bg-emerald-400/5 text-emerald-100/70'
                              : 'bg-rose-400/5 text-rose-100/70'
                          }`}
                          style={{ opacity: 0.25, transform: 'scale(0.88)' }}
                        >
                          <p className="text-[10px] tracking-[0.2em] uppercase">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[11px] text-white/70">
                            {item.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Vertical Stream */}
                  <motion.div
                    animate={{ y: streamViewportOffsets[pipelinePhase] }}
                    transition={pipelineSpring}
                    className="relative mt-4 flex flex-1 flex-col items-center overflow-visible py-8 pb-32"
                  >
                    <motion.div
                      layoutId="vertical-stream"
                      className="absolute top-0 z-0 w-1 rounded-full"
                      initial={{
                        height: pipeHeights.idle,
                        backgroundColor: pipeColor,
                      }}
                      animate={{
                        height: pipeHeights[pipelinePhase],
                        backgroundColor: pipeColor,
                        boxShadow:
                          pipelinePhase === 'logic'
                            ? '0 0 25px rgba(199,180,254,0.45)'
                            : pipelinePhase === 'result'
                              ? `0 0 25px ${focusedScenario === 'pass' ? 'rgba(52,211,153,0.45)' : 'rgba(248,113,113,0.45)'}`
                              : '0 0 15px rgba(226,232,240,0.25)',
                      }}
                      transition={pipelineSpring}
                      style={{ minHeight: 120 }}
                    />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`lead-${focusedScenario}`}
                        layoutId="lead-card"
                        initial={{ y: 120, opacity: 0, scale: 0.9 }}
                        animate={{
                          y:
                            pipelinePhase === 'result'
                              ? -140
                              : pipelinePhase === 'logic'
                                ? -60
                                : 0,
                          opacity: pipelinePhase === 'idle' ? 1 : 0.85,
                          scale: pipelinePhase === 'lead' ? 1 : 0.9,
                        }}
                        exit={{ y: -220, opacity: 0.4, scale: 0.8 }}
                        transition={pipelineSpring}
                        className="relative z-20 w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-2xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-lg font-semibold uppercase">
                            {leadInitials}
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] tracking-[0.3em] text-white/60 uppercase">
                              Lead
                            </p>
                            <p className="text-lg font-semibold">
                              {scenarioNarratives[focusedScenario].lead.name ||
                                'Test Lead'}
                            </p>
                            <p className="text-xs text-white/70">
                              {scenarioNarratives[focusedScenario].lead.email ||
                                'lead@example.com'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] tracking-[0.3em] text-white/50 uppercase">
                              {
                                scenarioNarratives[focusedScenario]
                                  .variableLabel
                              }
                            </p>
                            <p className="text-xl font-semibold">
                              {
                                scenarioNarratives[focusedScenario]
                                  .variableValue
                              }
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <AnimatePresence>
                      {pipelinePhase !== 'idle' && (
                        <motion.div
                          key={`logic-${focusedScenario}`}
                          layoutId="logic-card"
                          initial={{ y: 160, opacity: 0, scale: 0.9 }}
                          animate={{
                            y:
                              pipelinePhase === 'result'
                                ? -30
                                : pipelinePhase === 'logic'
                                  ? 40
                                  : 120,
                            opacity: pipelinePhase === 'lead' ? 0.4 : 0.95,
                            scale: pipelinePhase === 'logic' ? 1 : 0.95,
                          }}
                          exit={{ y: -160, opacity: 0 }}
                          transition={pipelineSpring}
                          className="relative z-10 mt-10 w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-white shadow-xl backdrop-blur-xl"
                        >
                          <div className="flex items-center justify-between text-[11px] tracking-[0.35em] text-white/50 uppercase">
                            <span>Logic Node</span>
                            <span>Checking Budget...</span>
                          </div>
                          <p className="mt-4 text-sm text-white/80">
                            Waiting {followUpDelayDays} day
                            {followUpDelayDays === 1 ? '' : 's'} before the
                            follow-up tether fires.
                          </p>
                          <motion.div
                            className="pointer-events-none absolute inset-x-0 top-1/2 h-10 rounded-full bg-linear-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-40%', '40%'] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: 'mirror',
                              ease: 'easeInOut',
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="relative mt-12 flex w-full max-w-md flex-col items-center">
                      <AnimatePresence>
                        {pipelinePhase === 'result' && (
                          <motion.div
                            key={`result-${focusedScenario}`}
                            layoutId="result-card"
                            initial={{ y: 160, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -120, opacity: 0 }}
                            transition={pipelineSpring}
                            className="relative z-20 w-full rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-2xl"
                          >
                            <p className="text-[11px] tracking-[0.35em] text-slate-500 uppercase">
                              Result
                            </p>
                            <p className="mt-2 text-lg font-semibold">
                              {scenarioNarratives[focusedScenario].summary}
                            </p>
                            <ul className="mt-4 space-y-1 text-sm text-slate-600">
                              {scenarioNarratives[
                                focusedScenario
                              ].resultBullets.map((bullet) => (
                                <li key={bullet}>• {bullet}</li>
                              ))}
                            </ul>
                            {focusedScenario === 'fail' && (
                              <div className="mt-4 rounded-2xl bg-slate-900/5 p-3 text-xs font-semibold text-slate-700">
                                Next email queued in {followUpDelayDays} day
                                {followUpDelayDays === 1 ? '' : 's'} · Lead
                                marks as failed after {bookingDeadlineDays} day
                                {bookingDeadlineDays === 1 ? '' : 's'} with no
                                booking.
                              </div>
                            )}
                            <AnimatePresence>
                              <motion.div
                                key="confetti"
                                className="pointer-events-none absolute -inset-4 rounded-[36px] border border-dashed border-white/30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              />
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {pipelinePhase !== 'result' && (
                        <div className="w-full rounded-3xl border border-dashed border-white/20 px-6 py-4 text-center text-xs tracking-[0.2em] text-white/40 uppercase">
                          Result Bin · Waiting to enter
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <div className="relative z-10 flex flex-col gap-4 border-t border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
                <div className="text-xs text-white/70">
                  <p>
                    Follow-up delay:{' '}
                    <span className="font-semibold text-white">
                      {followUpDelayDays} day
                      {followUpDelayDays === 1 ? '' : 's'}
                    </span>
                  </p>
                  <p>
                    Fail window:{' '}
                    <span className="font-semibold text-white">
                      {bookingDeadlineDays} day
                      {bookingDeadlineDays === 1 ? '' : 's'}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    className="text-white/80"
                    onClick={() => cycleScenario('prev')}
                  >
                    ◀ Prev
                  </Button>
                  <div className="flex items-center rounded-full bg-white/10 p-1 text-xs tracking-[0.2em] uppercase">
                    {(['pass', 'fail'] as ScenarioType[]).map((scenario) => (
                      <button
                        key={scenario}
                        onClick={() => handleScenarioFocus(scenario)}
                        className={`rounded-full px-4 py-1 transition ${
                          focusedScenario === scenario
                            ? 'bg-white text-slate-900'
                            : 'text-white/60'
                        }`}
                      >
                        {scenario === 'pass' ? 'Scenario 1' : 'Scenario 2'}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="text-white/80"
                    onClick={() => cycleScenario('next')}
                  >
                    Next ▶
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Run Simulation Controls */}
          <div className="flex items-center justify-center">
            {simulationPhase === 'complete' ? (
              <Button
                onClick={handleRunSimulation}
                variant="outline"
                size="sm"
                disabled={isSimulating}
                className="rounded-full border-white/20 text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Run Again
              </Button>
            ) : (
              simulationPhase === 'idle' && (
                <Button
                  onClick={handleRunSimulation}
                  size="lg"
                  className="h-12 rounded-full px-8 text-base font-semibold shadow-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Run Simulation
                </Button>
              )
            )}
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
          disabled={isActivating}
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
