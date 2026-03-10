import type { ActiveLayer, LayerProfile, LikertValue } from './ideosphere';

export interface SerializedProfile {
  schemaVersion: 1;
  version: '0.02';
  created: string;
  answers: Record<string, LikertValue>;
  profiles: Record<ActiveLayer, LayerProfile>;
}
