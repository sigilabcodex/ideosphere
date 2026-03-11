export type LayerId = 'descriptive' | 'pragmatic' | 'prescriptive' | 'strategic';
export type QuestionLayer = 'descriptive' | 'pragmatic' | 'prescriptive';
export type AbstractionLevel = 'concrete' | 'institutional' | 'abstract';
export type SupportedLanguage = 'en' | 'es';

export interface AxisDefinition {
  id: string;
  name: string;
  definition: string;
  branches: [string, string] | string[];
  supportedLayers: LayerId[];
}

export interface AxisImpact {
  axisId: string;
  direction: -1 | 1;
  weight: number;
}

export interface QuestionDefinition {
  id: string;
  family: string;
  text: Record<SupportedLanguage, string>;
  layer: QuestionLayer;
  abstractionLevel: AbstractionLevel;
  visibleTags: string[];
  axisImpacts: AxisImpact[];
}

export type LikertValue = -2 | -1 | 0 | 1 | 2;

export interface AnswerRecord {
  questionId: string;
  value: LikertValue;
}

export interface AxisScore {
  axisId: string;
  value: number;
  confidence: number;
}

export interface LayerProfile {
  layer: string;
  coverage: number;
  uncertainty: number;
  axisScores: AxisScore[];
}

export interface CloudParameters {
  centroid: [number, number, number];
  spread: number;
  density: number;
  jitter: number;
}
