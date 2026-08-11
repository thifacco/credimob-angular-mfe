import { resolveActiveStep, StepCompletionStatus, TrackingStep } from './step-completion-status';

function statusWith(overrides: Partial<StepCompletionStatus>): StepCompletionStatus {
  return {
    simulationCompleted: false,
    formsCompleted: false,
    uploadsCompleted: false,
    proposalCompleted: false,
    ...overrides,
  };
}

describe('resolveActiveStep', () => {
  it('cenário 1 - primeiro acesso: nenhuma etapa concluída abre a Simulação', () => {
    const status = statusWith({});

    expect(resolveActiveStep(status)).toBe(TrackingStep.Simulation);
  });

  it('cenário 2 - simulação concluída abre os Formulários', () => {
    const status = statusWith({ simulationCompleted: true });

    expect(resolveActiveStep(status)).toBe(TrackingStep.Forms);
  });

  it('cenário 3 - formulários concluídos abre os Documentos', () => {
    const status = statusWith({ simulationCompleted: true, formsCompleted: true });

    expect(resolveActiveStep(status)).toBe(TrackingStep.Uploads);
  });

  it('cenário 4 - documentos enviados abre a Proposta', () => {
    const status = statusWith({
      simulationCompleted: true,
      formsCompleted: true,
      uploadsCompleted: true,
    });

    expect(resolveActiveStep(status)).toBe(TrackingStep.Proposal);
  });

  it('jornada concluída permanece na Proposta', () => {
    const status = statusWith({
      simulationCompleted: true,
      formsCompleted: true,
      uploadsCompleted: true,
      proposalCompleted: true,
    });

    expect(resolveActiveStep(status)).toBe(TrackingStep.Proposal);
  });
});
