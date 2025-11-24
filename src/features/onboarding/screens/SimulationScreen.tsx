'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Mail,
  Zap,
  Edit2,
  Play,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '../store/onboardingStore';
import { useSimulationMutation } from '../hooks/useSimulationMutation';
import { useActivateWorkflowMutation } from '../hooks/useActivateWorkflowMutation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { StrategyId } from '../types';

type SimulationPhase = 'idle' | 'loading' | 'running' | 'complete';
type ScenarioType = 'pass' | 'fail';

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
}

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
  configuration?: Record<string, any>
): { fail?: TestLead; pass?: TestLead; single?: TestLead } {
  if (!strategyId) {
    return {
      fail: { name: 'Test Lead', email: 'test@example.com' },
    };
  }

  switch (strategyId) {
    case 'gatekeeper': {
      const budgetThreshold =
        (configuration?.budgetThreshold as number) || 2000;
      return {
        fail: {
          name: 'John Doe',
          email: 'john@example.com',
          budget: Math.floor(budgetThreshold * 0.25),
        },
        pass: {
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          budget: Math.floor(budgetThreshold * 2.5),
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
  const { configurationId, simulationData, configuration } =
    useOnboardingStore();
  const { mutate: runSimulation, isPending: isSimulating } =
    useSimulationMutation();
  const { mutate: activateWorkflow, isPending: isActivating } =
    useActivateWorkflowMutation();

  const [simulationPhase, setSimulationPhase] =
    useState<SimulationPhase>('idle');
  const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(
    null
  );
  const [activeLogicStep, setActiveLogicStep] = useState<number>(-1);
  const [showResults, setShowResults] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Use unified strategy for all workflows
  const strategyId: StrategyId = 'gatekeeper'; // Default to gatekeeper for unified workflow
  const budgetThreshold = (configuration?.budgetThreshold as number) || 2000;

  // Initialize test leads based on strategy
  const initialTestLeads = getTestLeadsForStrategy(strategyId, configuration);
  const [testLeadFail, setTestLeadFail] = useState<TestLead>(
    initialTestLeads.fail || { name: '', email: '' }
  );
  const [testLeadPass, setTestLeadPass] = useState<TestLead>(
    initialTestLeads.pass || { name: '', email: '' }
  );
  const [testLeadSingle, setTestLeadSingle] = useState<TestLead>(
    initialTestLeads.single || { name: '', email: '' }
  );

  // Initialize logic steps based on strategy
  const initialLogicSteps = getLogicStepsForStrategy(strategyId, configuration);
  const [logicSteps, setLogicSteps] = useState<LogicStep[]>(initialLogicSteps);

  const [scenarioResults, setScenarioResults] = useState<{
    fail: ScenarioResult | null;
    pass: ScenarioResult | null;
  }>({
    fail: null,
    pass: null,
  });

  const handleRunSimulation = () => {
    if (configurationId) {
      setSimulationPhase('loading');
      setIsEditing(false);

      // Run simulation for both scenarios
      runSimulation(
        {
          configurationId,
        },
        {
          onSuccess: () => {
            setSimulationPhase('running');
            runDualScenarioSimulation();
          },
        }
      );
    } else if (simulationData) {
      setSimulationPhase('complete');
      runDualScenarioSimulation();
    }
  };

  const runDualScenarioSimulation = useCallback(() => {
    // Reset logic steps based on strategy
    const steps = getLogicStepsForStrategy(strategyId, configuration);
    setLogicSteps(steps);
    const totalSteps = steps.length;

    // Strategy-specific simulation flow
    if (strategyId === 'gatekeeper') {
      // Gatekeeper: Run fail then pass scenario
      setActiveScenario('fail');
      simulateScenario('fail', testLeadFail, 0);
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
    testLeadFail,
    testLeadSingle,
    simulateNurturerScenario,
    simulateCloserScenario,
  ]);

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
              message: passed
                ? 'Lead qualified! Booking link will be sent.'
                : 'Lead rejected. Decline email will be sent.',
              emailSent: true,
            };

            setScenarioResults((prev) => ({
              ...prev,
              [scenarioType]: result,
            }));

            // If we just finished fail scenario, run pass scenario
            if (scenarioType === 'fail') {
              setTimeout(() => {
                setActiveScenario('pass');
                const steps = getLogicStepsForStrategy(
                  strategyId,
                  configuration
                );
                setLogicSteps(steps);
                simulateScenario('pass', testLeadPass, 0);
              }, 2000);
            } else {
              // Both scenarios complete
              setShowResults(true);
              setSimulationPhase('complete');
              setActiveScenario(null);
              toast.success('Simulation complete! Both scenarios verified.');
            }
          }
        }, 1500);
      }, delay);
    },
    [strategyId, budgetThreshold, configuration, testLeadPass]
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

            setShowResults(true);
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

            setShowResults(true);
            setSimulationPhase('complete');
            setActiveScenario(null);
            toast.success('Simulation complete! Booking flow verified.');
          }
        }, 1200);
      }, delay);
    },
    []
  );

  const handleGoLive = () => {
    if (configurationId) {
      activateWorkflow({
        configurationId,
      });
    }
  };

  const handleBack = () => {
    router.push('/onboarding/configure');
  };

  const handleUpdateTestLead = (
    type: ScenarioType,
    field: keyof TestLead,
    value: string | number
  ) => {
    if (type === 'fail') {
      setTestLeadFail((prev) => ({ ...prev, [field]: value }));
    } else {
      setTestLeadPass((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Auto-run simulation on mount if conditions are met
  useEffect(() => {
    if (configurationId && simulationPhase === 'idle' && !simulationData) {
      // Don't auto-run, wait for user to click "Run Simulation"
    } else if (simulationData && simulationPhase === 'idle') {
      setSimulationPhase('complete');
      runDualScenarioSimulation();
    }
  }, [
    configurationId,
    simulationData,
    simulationPhase,
    runDualScenarioSimulation,
  ]);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24 md:pb-28 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
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
                See your automation in action
              </h1>
              <p className="text-muted-foreground max-w-[600px] text-sm sm:text-base">
                {strategyId === 'gatekeeper'
                  ? 'Watch how your automation processes leads with different budgets'
                  : strategyId === 'nurturer'
                    ? 'Watch how your automation sends a 5-email sequence over time'
                    : strategyId === 'closer'
                      ? 'Watch how your automation sends booking links instantly'
                      : 'Watch how your automation processes leads'}
              </p>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Test Lead Data */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Test Lead Data</CardTitle>
                  {simulationPhase === 'idle' ||
                  simulationPhase === 'complete' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="h-8"
                    >
                      <Edit2 className="mr-2 h-3 w-3" />
                      {isEditing ? 'Done' : 'Edit'}
                    </Button>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {strategyId === 'gatekeeper' ? (
                  <>
                    {/* Fail Scenario Lead */}
                    <div className="space-y-3 rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-900 dark:bg-red-950/20">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                          Scenario 1: Budget Below Threshold
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-muted-foreground mb-1 block text-xs">
                            Name
                          </label>
                          {isEditing ? (
                            <Input
                              value={testLeadFail.name}
                              onChange={(e) =>
                                handleUpdateTestLead(
                                  'fail',
                                  'name',
                                  e.target.value
                                )
                              }
                              className="h-9 text-sm"
                              disabled={simulationPhase === 'running'}
                            />
                          ) : (
                            <p className="text-foreground text-sm font-medium">
                              {testLeadFail.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-muted-foreground mb-1 block text-xs">
                            Email
                          </label>
                          {isEditing ? (
                            <Input
                              value={testLeadFail.email}
                              onChange={(e) =>
                                handleUpdateTestLead(
                                  'fail',
                                  'email',
                                  e.target.value
                                )
                              }
                              className="h-9 text-sm"
                              disabled={simulationPhase === 'running'}
                            />
                          ) : (
                            <p className="text-foreground text-sm font-medium">
                              {testLeadFail.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-muted-foreground mb-1 block text-xs">
                            Budget
                          </label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={testLeadFail.budget || 0}
                              onChange={(e) =>
                                handleUpdateTestLead(
                                  'fail',
                                  'budget',
                                  Number(e.target.value)
                                )
                              }
                              className="h-9 text-sm"
                              disabled={simulationPhase === 'running'}
                            />
                          ) : (
                            <p className="text-foreground text-sm font-semibold">
                              ${(testLeadFail.budget || 0).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-2 text-xs italic">
                          Will be rejected ($
                          {(testLeadFail.budget || 0).toLocaleString()} &lt; $
                          {budgetThreshold.toLocaleString()})
                        </p>
                      </div>
                    </div>

                    {/* Pass Scenario Lead */}
                    <div className="space-y-3 rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-900 dark:bg-green-950/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                          Scenario 2: Budget Above Threshold
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-muted-foreground mb-1 block text-xs">
                            Name
                          </label>
                          {isEditing ? (
                            <Input
                              value={testLeadPass.name}
                              onChange={(e) =>
                                handleUpdateTestLead(
                                  'pass',
                                  'name',
                                  e.target.value
                                )
                              }
                              className="h-9 text-sm"
                              disabled={simulationPhase === 'running'}
                            />
                          ) : (
                            <p className="text-foreground text-sm font-medium">
                              {testLeadPass.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-muted-foreground mb-1 block text-xs">
                            Email
                          </label>
                          {isEditing ? (
                            <Input
                              value={testLeadPass.email}
                              onChange={(e) =>
                                handleUpdateTestLead(
                                  'pass',
                                  'email',
                                  e.target.value
                                )
                              }
                              className="h-9 text-sm"
                              disabled={simulationPhase === 'running'}
                            />
                          ) : (
                            <p className="text-foreground text-sm font-medium">
                              {testLeadPass.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-muted-foreground mb-1 block text-xs">
                            Budget
                          </label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={testLeadPass.budget || 0}
                              onChange={(e) =>
                                handleUpdateTestLead(
                                  'pass',
                                  'budget',
                                  Number(e.target.value)
                                )
                              }
                              className="h-9 text-sm"
                              disabled={simulationPhase === 'running'}
                            />
                          ) : (
                            <p className="text-foreground text-sm font-semibold">
                              ${(testLeadPass.budget || 0).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-2 text-xs italic">
                          Will be qualified ($
                          {(testLeadPass.budget || 0).toLocaleString()} &gt;= $
                          {budgetThreshold.toLocaleString()})
                        </p>
                      </div>
                    </div>

                    {/* Budget Threshold Info */}
                    <div className="border-t pt-4">
                      <div className="bg-muted/50 rounded-md p-3">
                        <p className="text-muted-foreground mb-1 text-xs font-medium">
                          Budget Threshold
                        </p>
                        <p className="text-foreground text-sm font-semibold">
                          ${budgetThreshold.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Leads below this amount will be rejected
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Single Test Lead for Nurturer/Closer */}
                    <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                          Test Lead
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-muted-foreground mb-1 block text-xs">
                            Name
                          </label>
                          {isEditing ? (
                            <Input
                              value={testLeadSingle.name}
                              onChange={(e) =>
                                setTestLeadSingle((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="h-9 text-sm"
                              disabled={simulationPhase === 'running'}
                            />
                          ) : (
                            <p className="text-foreground text-sm font-medium">
                              {testLeadSingle.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-muted-foreground mb-1 block text-xs">
                            Email
                          </label>
                          {isEditing ? (
                            <Input
                              value={testLeadSingle.email}
                              onChange={(e) =>
                                setTestLeadSingle((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              className="h-9 text-sm"
                              disabled={simulationPhase === 'running'}
                            />
                          ) : (
                            <p className="text-foreground text-sm font-medium">
                              {testLeadSingle.email}
                            </p>
                          )}
                        </div>
                        {testLeadSingle.company && (
                          <div>
                            <label className="text-muted-foreground mb-1 block text-xs">
                              Company
                            </label>
                            {isEditing ? (
                              <Input
                                value={testLeadSingle.company}
                                onChange={(e) =>
                                  setTestLeadSingle((prev) => ({
                                    ...prev,
                                    company: e.target.value,
                                  }))
                                }
                                className="h-9 text-sm"
                                disabled={simulationPhase === 'running'}
                              />
                            ) : (
                              <p className="text-foreground text-sm font-medium">
                                {testLeadSingle.company}
                              </p>
                            )}
                          </div>
                        )}
                        <p className="text-muted-foreground mt-2 text-xs italic">
                          {strategyId === 'nurturer'
                            ? 'Will receive 5 emails over 15 days'
                            : strategyId === 'closer'
                              ? 'Will receive booking link immediately'
                              : 'Test lead for simulation'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Center: Logic Path */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Logic Path</CardTitle>
                {activeScenario && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    Running{' '}
                    {activeScenario === 'fail' ? 'Scenario 1' : 'Scenario 2'}...
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-6 py-4">
                  {logicSteps.map((step, index) => {
                    const isActive = activeLogicStep === index;
                    const isPassed = step.status === 'passed';
                    const isFailed = step.status === 'failed';

                    // Determine if this step should show pass or fail based on active scenario
                    const showFail =
                      step.id === 'check' &&
                      isFailed &&
                      activeScenario === 'fail';
                    const showPass =
                      step.id === 'check' &&
                      isPassed &&
                      !isFailed &&
                      activeScenario === 'pass';

                    return (
                      <div key={step.id} className="relative">
                        {/* Step Node */}
                        <div
                          className={`flex items-center gap-3 ${
                            isActive
                              ? 'scale-105 transition-transform duration-300'
                              : ''
                          }`}
                        >
                          {/* Step Icon/Indicator */}
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                              isActive
                                ? 'border-primary bg-primary text-primary-foreground shadow-primary/50 shadow-lg'
                                : isFailed
                                  ? 'border-red-500 bg-red-500 text-white'
                                  : isPassed
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-muted bg-muted text-muted-foreground'
                            }`}
                          >
                            {isFailed ? (
                              <XCircle className="h-5 w-5" />
                            ) : isPassed ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : step.type === 'trigger' ? (
                              <Zap className="h-5 w-5" />
                            ) : step.type === 'condition' ? (
                              <div className="h-5 w-5 rotate-45 border-2" />
                            ) : step.type === 'delay' ? (
                              <div className="h-5 w-5 rounded-full border-2 border-dashed" />
                            ) : (
                              <Mail className="h-5 w-5" />
                            )}
                          </div>

                          {/* Step Label */}
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                isActive
                                  ? 'text-foreground'
                                  : isPassed || isFailed
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                              }`}
                            >
                              {step.label}
                            </p>
                            {step.id === 'check' && (showFail || showPass) && (
                              <p
                                className={`mt-1 text-xs ${
                                  showFail ? 'text-red-500' : 'text-green-500'
                                }`}
                              >
                                {showFail
                                  ? `❌ $${(testLeadFail.budget || 0).toLocaleString()} is < $${budgetThreshold.toLocaleString()}`
                                  : `✓ $${(testLeadPass.budget || 0).toLocaleString()} is >= $${budgetThreshold.toLocaleString()}`}
                              </p>
                            )}
                            {step.type === 'delay' && step.delayDays && (
                              <p className="text-muted-foreground mt-1 text-xs">
                                Waiting {step.delayDays} day
                                {step.delayDays > 1 ? 's' : ''}...
                              </p>
                            )}
                            {step.type === 'action' && step.emailNumber && (
                              <p className="text-muted-foreground mt-1 text-xs">
                                Email {step.emailNumber} of 5
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Connector Line */}
                        {index < logicSteps.length - 1 && (
                          <div
                            className={`ml-5 h-6 w-0.5 transition-colors ${
                              isFailed
                                ? 'bg-red-500'
                                : isPassed
                                  ? 'bg-green-500'
                                  : isActive
                                    ? 'bg-primary'
                                    : 'bg-muted'
                            }`}
                          />
                        )}

                        {/* Animated Glowing Dot */}
                        {isActive && (
                          <div className="absolute top-10 left-5 animate-pulse">
                            <div className="bg-primary shadow-primary/50 h-2 w-2 rounded-full shadow-lg" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Right: Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Results</CardTitle>
              </CardHeader>
              <CardContent>
                {simulationPhase === 'idle' && (
                  <div className="py-8 text-center">
                    <Sparkles className="text-muted-foreground mx-auto mb-3 h-12 w-12 opacity-50" />
                    <p className="text-muted-foreground text-sm">
                      {strategyId === 'gatekeeper'
                        ? 'Click "Run Simulation" to see how your automation processes both scenarios'
                        : strategyId === 'nurturer'
                          ? 'Click "Run Simulation" to see how your automation sends a 5-email sequence'
                          : strategyId === 'closer'
                            ? 'Click "Run Simulation" to see how your automation sends booking links'
                            : 'Click "Run Simulation" to see how your automation processes leads'}
                    </p>
                  </div>
                )}

                {simulationPhase === 'loading' && (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">
                      {isSimulating
                        ? 'Generating simulation...'
                        : 'Preparing simulation...'}
                    </p>
                  </div>
                )}

                {simulationPhase === 'running' && (
                  <div className="space-y-4 py-4">
                    {activeScenario === 'fail' && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                            Running Scenario 1...
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {strategyId === 'gatekeeper'
                            ? 'Testing lead with budget below threshold'
                            : 'Running simulation...'}
                        </p>
                      </div>
                    )}
                    {activeScenario === 'pass' && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                          <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                            {strategyId === 'gatekeeper'
                              ? 'Running Scenario 2...'
                              : 'Running Simulation...'}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {strategyId === 'gatekeeper'
                            ? 'Testing lead with budget above threshold'
                            : strategyId === 'nurturer'
                              ? 'Simulating 5-email sequence over time'
                              : strategyId === 'closer'
                                ? 'Simulating instant booking flow'
                                : 'Running simulation...'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {simulationPhase === 'complete' && showResults && (
                  <div className="space-y-4 py-4">
                    {/* Fail Scenario Result */}
                    {scenarioResults.fail && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                        <div className="mb-2 flex items-center gap-2">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="font-semibold text-red-700 dark:text-red-400">
                            Scenario 1: Lead Rejected
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2 text-sm">
                          {scenarioResults.fail.message}
                        </p>
                        {strategyId === 'gatekeeper' && (
                          <div className="bg-background rounded-md border border-red-200 p-2 dark:border-red-800">
                            <p className="text-muted-foreground text-xs">
                              Budget: $
                              {(testLeadFail.budget || 0).toLocaleString()}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Threshold: ${budgetThreshold.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pass Scenario Result */}
                    {scenarioResults.pass && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                        <div className="mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="font-semibold text-green-700 dark:text-green-400">
                            Scenario 2: Lead Qualified
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2 text-sm">
                          {scenarioResults.pass.message}
                        </p>
                        {strategyId === 'gatekeeper' ? (
                          <div className="bg-background rounded-md border border-green-200 p-2 dark:border-green-800">
                            <p className="text-muted-foreground text-xs">
                              Budget: $
                              {(testLeadPass.budget || 0).toLocaleString()}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Threshold: ${budgetThreshold.toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-background rounded-md border border-green-200 p-2 dark:border-green-800">
                            <p className="text-muted-foreground text-xs">
                              Lead: {testLeadSingle.name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Email: {testLeadSingle.email}
                            </p>
                            {testLeadSingle.company && (
                              <p className="text-muted-foreground text-xs">
                                Company: {testLeadSingle.company}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Summary Metrics */}
                    {simulationData && (
                      <div className="bg-muted/50 space-y-2 rounded-lg border p-4">
                        <p className="text-muted-foreground text-xs font-medium uppercase">
                          Simulation Summary
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-foreground text-lg font-bold">
                              {simulationData.metrics.leadsProcessed || 2}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Leads Tested
                            </p>
                          </div>
                          <div>
                            <p className="text-foreground text-lg font-bold">
                              {simulationData.metrics.emailsSent || 2}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Emails Sent
                            </p>
                          </div>
                        </div>
                        {strategyId === 'gatekeeper' && (
                          <div className="border-t pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs">
                                Qualified
                              </span>
                              <span className="text-foreground text-sm font-semibold">
                                1
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs">
                                Rejected
                              </span>
                              <span className="text-foreground text-sm font-semibold">
                                1
                              </span>
                            </div>
                          </div>
                        )}
                        {strategyId === 'nurturer' && (
                          <div className="border-t pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs">
                                Emails in Sequence
                              </span>
                              <span className="text-foreground text-sm font-semibold">
                                5
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs">
                                Total Duration
                              </span>
                              <span className="text-foreground text-sm font-semibold">
                                15 days
                              </span>
                            </div>
                          </div>
                        )}
                        {strategyId === 'closer' && (
                          <div className="border-t pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs">
                                Booking Link Sent
                              </span>
                              <span className="text-foreground text-sm font-semibold">
                                Immediately
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs">
                                Reminder Sent
                              </span>
                              <span className="text-foreground text-sm font-semibold">
                                1 day later
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Success Message */}
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/20">
                      <p className="text-muted-foreground text-xs">
                        {strategyId === 'gatekeeper'
                          ? '✓ Both scenarios verified. Your automation is ready to go live!'
                          : '✓ Simulation complete. Your automation is ready to go live!'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Run Simulation Button - Centered below cards */}
          {simulationPhase === 'idle' && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleRunSimulation}
                size="lg"
                className="h-12 px-8 text-base font-semibold shadow-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Run Simulation
              </Button>
            </div>
          )}

          {/* Re-run Simulation Button */}
          {simulationPhase === 'complete' && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleRunSimulation}
                variant="outline"
                size="sm"
                disabled={isSimulating}
              >
                <Play className="mr-2 h-4 w-4" />
                Run Again
              </Button>
            </div>
          )}
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
        {simulationPhase === 'complete' && (
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
        )}
        {simulationPhase === 'loading' && (
          <Button
            disabled
            className="w-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] font-semibold text-white opacity-50 sm:w-auto"
          >
            Running Simulation...
          </Button>
        )}
      </div>
    </div>
  );
}
