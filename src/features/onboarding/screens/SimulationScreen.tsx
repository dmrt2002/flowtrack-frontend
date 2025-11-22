'use client';

import { useEffect, useState } from 'react';
import { useOnboardingStore } from '../store/onboardingStore';
import { useSimulationMutation } from '../hooks/useSimulationMutation';
import { useActivateWorkflowMutation } from '../hooks/useActivateWorkflowMutation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SimulationPhase = 'loading' | 'running' | 'complete';

export function SimulationScreen() {
  const { selectedStrategy, configurationId, simulationData } =
    useOnboardingStore();
  const { mutate: runSimulation, isPending: isSimulating } =
    useSimulationMutation();
  const { mutate: activateWorkflow, isPending: isActivating } =
    useActivateWorkflowMutation();

  const [simulationPhase, setSimulationPhase] =
    useState<SimulationPhase>('loading');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (selectedStrategy.id && configurationId && !simulationData) {
      runSimulation(
        {
          strategyId: selectedStrategy.id,
          configurationId,
        },
        {
          onSuccess: () => {
            setSimulationPhase('running');
            // Simulate animation steps
            const steps = [1, 2, 3, 4];
            let stepIndex = 0;
            const interval = setInterval(() => {
              if (stepIndex < steps.length) {
                setCurrentStep(steps[stepIndex]);
                stepIndex++;
              } else {
                clearInterval(interval);
                setSimulationPhase('complete');
              }
            }, 2000);
          },
        }
      );
    } else if (simulationData) {
      setSimulationPhase('complete');
    }
  }, [selectedStrategy.id, configurationId, simulationData, runSimulation]);

  const handleActivate = () => {
    if (selectedStrategy.id && configurationId) {
      activateWorkflow({
        strategyId: selectedStrategy.id,
        configurationId,
      });
    }
  };

  const simulationSteps = [
    { order: 1, action: 'Monitoring contact form...', status: 'running' },
    { order: 2, action: 'Waiting 5 minutes...', status: 'running' },
    { order: 3, action: 'Sending personalized emails...', status: 'running' },
    { order: 4, action: 'Adding to CRM...', status: 'running' },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-10 py-16">
      <div className="space-y-8">
        <div>
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            See your automation in action
          </h1>
          <p className="text-muted-foreground">
            Watch how your automation will process leads
          </p>
        </div>

        {simulationPhase === 'loading' && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {isSimulating
                  ? 'Generating simulation...'
                  : 'Preparing simulation...'}
              </p>
            </CardContent>
          </Card>
        )}

        {simulationPhase === 'running' && (
          <Card>
            <CardHeader>
              <CardTitle>Simulation Running</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {simulationSteps.map((step, index) => (
                <div
                  key={step.order}
                  className={`flex items-center gap-3 rounded-lg p-4 ${
                    index < currentStep
                      ? 'bg-muted'
                      : index === currentStep
                        ? 'bg-primary/10'
                        : 'bg-background'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      index < currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentStep ? '✓' : step.order}
                  </div>
                  <p className="text-sm">{step.action}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {simulationPhase === 'complete' && simulationData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-foreground text-2xl font-bold">
                      {simulationData.metrics.leadsProcessed}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Leads Processed
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground text-2xl font-bold">
                      {simulationData.metrics.emailsSent}
                    </p>
                    <p className="text-muted-foreground text-sm">Emails Sent</p>
                  </div>
                  <div>
                    <p className="text-foreground text-2xl font-bold">
                      {simulationData.metrics.timeSaved}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Min/Week Saved
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground text-2xl font-bold">
                      {simulationData.metrics.estimatedConversions}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Est. Conversions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={handleActivate}
                disabled={isActivating}
                className="h-12 flex-1 text-base font-semibold"
              >
                {isActivating ? 'Activating...' : 'Activate Automation'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
