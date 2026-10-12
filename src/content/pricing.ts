export type VeilModelId = 'core' | 'reason';

export type VeilModelPricing = {
  id: VeilModelId;
  name: string;
  character: string;
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
  contextTokens: number;
  maxOutputTokens: number;
};

// Pricing reference: Latens pricing documentation, verified 2026-10-12.
// VEIL maps Latens Small to Core and Latens Large to Reason as product design specs.
// These values are intentionally static; the frontend does not fetch pricing at runtime.
export const VEIL_MODEL_PRICING: readonly VeilModelPricing[] = [
  {
    id: 'core',
    name: 'VEIL Core',
    character: 'Quick, curious, everyday.',
    inputUsdPerMillion: 0.765,
    outputUsdPerMillion: 1.275,
    contextTokens: 262_144,
    maxOutputTokens: 32_768,
  },
  {
    id: 'reason',
    name: 'VEIL Reason',
    character: 'Patient, careful, considered.',
    inputUsdPerMillion: 1.275,
    outputUsdPerMillion: 2.295,
    contextTokens: 262_144,
    maxOutputTokens: 32_768,
  },
] as const;

export const getModelPricing = (modelId: VeilModelId) =>
  VEIL_MODEL_PRICING.find((model) => model.id === modelId) ?? VEIL_MODEL_PRICING[0];

export const estimateUsageCost = (
  modelId: VeilModelId,
  inputTokens: number,
  outputTokens: number,
) => {
  const model = getModelPricing(modelId);
  return (
    (inputTokens * model.inputUsdPerMillion +
      outputTokens * model.outputUsdPerMillion) /
    1_000_000
  );
};
