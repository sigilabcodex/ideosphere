export type LayerId = 'descriptive' | 'aspirational' | 'pragmatic' | 'strategic';
export type ActiveLayer = 'descriptive' | 'aspirational';
export type AbstractionLevel = 'concrete' | 'institutional' | 'abstract';

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
  text: string;
  layer: ActiveLayer;
  abstractionLevel: AbstractionLevel;
  axisImpacts: AxisImpact[];
  tags?: string[];
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
  layer: ActiveLayer;
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
