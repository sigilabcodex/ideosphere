import type {
  ActiveLayer,
  AnswerRecord,
  AxisScore,
  CloudParameters,
  LayerProfile,
  QuestionDefinition,
} from '../types/ideosphere';

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function buildLayerProfile(
  layer: ActiveLayer,
  questions: QuestionDefinition[],
  answers: Record<string, AnswerRecord>,
  axisIds: string[],
): LayerProfile {
  const relevant = questions.filter((q) => q.layer === layer);
  const answered = relevant.filter((q) => answers[q.id]);

  const axisScores: AxisScore[] = axisIds.map((axisId) => {
    let weightedSum = 0;
    let possibleMagnitude = 0;

    for (const q of relevant) {
      const answer = answers[q.id];
      const impact = q.axisImpacts.find((entry) => entry.axisId === axisId);
      if (!impact) continue;

      possibleMagnitude += Math.abs(impact.weight * 2);
      if (answer) {
        weightedSum += answer.value * impact.direction * impact.weight;
      }
    }

    const value = possibleMagnitude === 0 ? 0 : clamp(weightedSum / possibleMagnitude, -1, 1);
    const confidence = possibleMagnitude === 0 ? 0 : clamp(Math.abs(weightedSum) / possibleMagnitude, 0, 1);

    return { axisId, value, confidence };
  });

  const coverage = relevant.length === 0 ? 0 : answered.length / relevant.length;
  const uncertainty = 1 - coverage;

  return { layer, coverage, uncertainty, axisScores };
}

const axisToVector: [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
  [0.71, 0.71, 0],
  [0, 0.71, 0.71],
];

export function deriveCloudParameters(profile: LayerProfile): CloudParameters {
  const centroid = profile.axisScores.reduce<[number, number, number]>(
    (acc, score, index) => {
      const vector = axisToVector[index % axisToVector.length];
      return [
        acc[0] + vector[0] * score.value,
        acc[1] + vector[1] * score.value,
        acc[2] + vector[2] * score.value,
      ];
    },
    [0, 0, 0],
  );

  const norm = Math.max(profile.axisScores.length, 1);
  const normalized: [number, number, number] = [centroid[0] / norm, centroid[1] / norm, centroid[2] / norm];

  return {
    centroid: normalized,
    spread: clamp(0.25 + profile.uncertainty * 0.65, 0.18, 0.9),
    density: clamp(0.35 + profile.coverage * 0.65, 0.3, 1),
    jitter: clamp(0.08 + profile.uncertainty * 0.25, 0.08, 0.35),
  };
}
