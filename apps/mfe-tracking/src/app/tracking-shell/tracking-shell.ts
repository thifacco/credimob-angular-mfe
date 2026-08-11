import { Component, computed, signal } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';

import { resolveActiveStep, StepCompletionStatus, TrackingStep } from './step-completion-status';

@Component({
  selector: 'trk-tracking-shell',
  imports: [MatStepperModule],
  templateUrl: './tracking-shell.html',
  styleUrl: './tracking-shell.scss',
})
export class TrackingShell {
  protected readonly TrackingStep = TrackingStep;

  private readonly stepCompletionStatus = signal<StepCompletionStatus>({
    simulationCompleted: false,
    formsCompleted: false,
    uploadsCompleted: false,
    proposalCompleted: false,
  });

  protected readonly activeStep = computed(() => resolveActiveStep(this.stepCompletionStatus()));

  protected readonly isSimulationCompleted = computed(
    () => this.stepCompletionStatus().simulationCompleted,
  );
  protected readonly isFormsCompleted = computed(() => this.stepCompletionStatus().formsCompleted);
  protected readonly isUploadsCompleted = computed(
    () => this.stepCompletionStatus().uploadsCompleted,
  );
  protected readonly isProposalCompleted = computed(
    () => this.stepCompletionStatus().proposalCompleted,
  );
}
