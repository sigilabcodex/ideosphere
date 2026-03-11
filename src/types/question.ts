import type { AbstractionLevel, QuestionLayer, SupportedLanguage } from './ideosphere';

export interface QuestionAxisImpactRaw {
  axis: string;
  branch: string;
  weight: number;
}

export interface QuestionDefinitionRaw {
  id: string;
  family: string;
  text: Partial<Record<SupportedLanguage, string>>;
  layer: QuestionLayer;
  abstractionLevel: AbstractionLevel;
  visibleTags: string[];
  axisImpacts: QuestionAxisImpactRaw[];
}
