import type { AxisDefinition, LayerProfile } from '../types/ideosphere';

interface Props {
  axes: AxisDefinition[];
  profile: LayerProfile;
}

export function AxisSummary({ axes, profile }: Props) {
  return (
    <div className="axis-summary">
      {axes.map((axis) => {
        const score = profile.axisScores.find((entry) => entry.axisId === axis.id);
        const value = score?.value ?? 0;
        const confidence = score?.confidence ?? 0;

        return (
          <article key={axis.id} className="axis-item">
            <header>
              <h4>{axis.name}</h4>
              <span>{Math.round(value * 100)}</span>
            </header>
            <div className="bar-track">
              <span className="bar-fill" style={{ width: `${Math.abs(value) * 100}%` }} />
            </div>
            <p>{axis.branches[0]} ↔ {axis.branches[1]}</p>
            <small>confidence {Math.round(confidence * 100)}%</small>
          </article>
        );
      })}
    </div>
  );
}
