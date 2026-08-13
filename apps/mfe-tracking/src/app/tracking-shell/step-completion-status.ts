/**
 * Sinalizadores de conclusão de cada etapa da jornada de aquisição do imóvel.
 * Cada flag reflete um fato de negócio ("a simulação foi concluída"), não uma
 * decisão de UI — a UI deriva o step ativo a partir deles via {@link resolveActiveStep}.
 */
export interface StepCompletionStatus {
  simulationCompleted: boolean;
  formsCompleted: boolean;
  uploadsCompleted: boolean;
  proposalCompleted: boolean;
}

export enum TrackingStep {
  Simulation,
  Forms,
  Uploads,
  Proposal,
}

/**
 * A jornada é sequencial: um step só é alcançável depois que todos os
 * anteriores foram concluídos. Centralizar essa regra aqui evita reproduzi-la
 * (e divergir) no template ou em bindings espalhados pelo componente.
 */
export function resolveActiveStep(status: StepCompletionStatus): TrackingStep {
  if (!status.simulationCompleted) return TrackingStep.Simulation;
  if (!status.formsCompleted) return TrackingStep.Forms;
  if (!status.uploadsCompleted) return TrackingStep.Uploads;
  return TrackingStep.Proposal;
}
