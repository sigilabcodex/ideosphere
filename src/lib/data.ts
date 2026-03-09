import axesRaw from '../data/axes/axes.v0.01.json';
import questionsRaw from '../data/questions/questions.v0.01.json';
import type { AxisDefinition, QuestionDefinition } from '../types/ideosphere';

export const axes = axesRaw as AxisDefinition[];
export const questions = questionsRaw as QuestionDefinition[];
