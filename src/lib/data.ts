import axesRaw from '../data/axes/axes.v0.01.json';
import questionsRaw from '../data/questions/questions.v0.01.json';
import type { AxisDefinition, QuestionDefinition, SupportedLanguage } from '../types/ideosphere';
import type { QuestionDefinitionRaw } from '../types/question';

export const axes = axesRaw as AxisDefinition[];

const englishFallback = (text: Partial<Record<SupportedLanguage, string>>) => text.en ?? '';

const toDirection = (axis: AxisDefinition, branch: string): -1 | 1 => {
  const [leftBranch, rightBranch] = axis.branches;
  return branch === leftBranch ? -1 : rightBranch === branch ? 1 : 1;
};

const normalizedQuestions = (questionsRaw as QuestionDefinitionRaw[]).map<QuestionDefinition>((question) => {
  const impacts = question.axisImpacts.flatMap((impact) => {
    const axis = axes.find((candidate) => candidate.id === impact.axis);
    if (!axis) return [];

    return [{
      axisId: axis.id,
      direction: toDirection(axis, impact.branch),
      weight: impact.weight,
    }];
  });

  return {
    id: question.id,
    family: question.family,
    text: {
      en: englishFallback(question.text),
      es: question.text.es ?? englishFallback(question.text),
    },
    layer: question.layer,
    abstractionLevel: question.abstractionLevel,
    visibleTags: question.visibleTags,
    axisImpacts: impacts,
  };
});

const questionPrimaryAxis = (question: QuestionDefinition): string =>
  question.axisImpacts.reduce<{ axisId: string; weight: number }>((best, impact) => {
    if (impact.weight > best.weight) {
      return { axisId: impact.axisId, weight: impact.weight };
    }
    return best;
  }, { axisId: 'unknown', weight: -1 }).axisId;

export const questions = (() => {
  const queue = [...normalizedQuestions];
  const mixed: QuestionDefinition[] = [];

  while (queue.length > 0) {
    const previous = mixed[mixed.length - 1];
    const previousAxis = previous ? questionPrimaryAxis(previous) : '';

    let bestIndex = 0;
    let bestScore = Number.NEGATIVE_INFINITY;

    queue.forEach((candidate, index) => {
      const candidateAxis = questionPrimaryAxis(candidate);
      let score = 0;

      if (candidateAxis !== previousAxis) score += 3;
      if (!previous || candidate.layer !== previous.layer) score += 2;
      if (!previous || candidate.abstractionLevel !== previous.abstractionLevel) score += 1;
      if (!previous || candidate.family !== previous.family) score += 1;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    mixed.push(queue.splice(bestIndex, 1)[0]);
  }

  return mixed;
})();
