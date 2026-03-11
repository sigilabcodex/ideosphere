import type { AnswerRecord, LayerProfile, LikertValue } from '../types/ideosphere';
import type { SerializedProfile } from '../types/profile';

export const PROFILE_STORAGE_KEY = 'ideosphere_profile_v1';
const APP_VERSION = '0.02';

export interface PersistenceResult {
  profile?: SerializedProfile;
  error?: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isLikertValue = (value: unknown): value is LikertValue =>
  typeof value === 'number' && Number.isInteger(value) && value >= -2 && value <= 2;

const isLayerProfile = (value: unknown): value is LayerProfile => {
  if (!isObject(value)) return false;

  if (typeof value.layer !== 'string' || typeof value.coverage !== 'number' || typeof value.uncertainty !== 'number') {
    return false;
  }

  if (!Array.isArray(value.axisScores)) {
    return false;
  }

  return value.axisScores.every((score) =>
    isObject(score)
    && typeof score.axisId === 'string'
    && typeof score.value === 'number'
    && typeof score.confidence === 'number',
  );
};

export const isSerializedProfile = (value: unknown): value is SerializedProfile => {
  if (!isObject(value)) return false;
  if (value.schemaVersion !== 1 || value.version !== APP_VERSION || typeof value.created !== 'string') {
    return false;
  }

  if (!isObject(value.answers) || !Object.values(value.answers).every(isLikertValue)) {
    return false;
  }

  if (!isObject(value.profiles)) {
    return false;
  }

  return Object.values(value.profiles).every(isLayerProfile);
};

export function answerRecordsToSerializedAnswers(answers: Record<string, AnswerRecord>): Record<string, LikertValue> {
  return Object.values(answers).reduce<Record<string, LikertValue>>((acc, answer) => {
    acc[answer.questionId] = answer.value;
    return acc;
  }, {});
}

export function serializedAnswersToAnswerRecords(answers: Record<string, LikertValue>): Record<string, AnswerRecord> {
  return Object.entries(answers).reduce<Record<string, AnswerRecord>>((acc, [questionId, value]) => {
    acc[questionId] = { questionId, value };
    return acc;
  }, {});
}

export function createSerializedProfile(
  answers: Record<string, AnswerRecord>,
  profiles: SerializedProfile['profiles'],
): SerializedProfile {
  return {
    schemaVersion: 1,
    version: APP_VERSION,
    created: new Date().toISOString(),
    answers: answerRecordsToSerializedAnswers(answers),
    profiles,
  };
}

export function saveProfileToStorage(profile: SerializedProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Best-effort persistence only.
  }
}

export function loadProfileFromStorage(): PersistenceResult {
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isSerializedProfile(parsed)) {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      return { error: 'Stored profile is invalid or from an incompatible version and was cleared.' };
    }

    return { profile: parsed };
  } catch {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    return { error: 'Stored profile is malformed and was cleared.' };
  }
}

export function clearStoredProfile(): void {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
}

const pad2 = (value: number): string => value.toString().padStart(2, '0');

export function getProfileFilename(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  return `ideosphere-profile-${yyyy}${mm}${dd}.json`;
}

export function downloadProfile(profile: SerializedProfile): void {
  const file = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(file);

  const link = document.createElement('a');
  link.href = url;
  link.download = getProfileFilename(new Date(profile.created));
  link.click();

  URL.revokeObjectURL(url);
}
