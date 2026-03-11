import type { QuestionLayer } from '../types/ideosphere';

interface Props {
  activeLayer: QuestionLayer;
  onChange: (layer: QuestionLayer) => void;
}

export function LayerToggle({ activeLayer, onChange }: Props) {
  return (
    <div className="layer-toggle">
      {(['descriptive', 'pragmatic', 'prescriptive'] as const).map((layer) => (
        <button
          key={layer}
          type="button"
          className={activeLayer === layer ? 'active' : ''}
          onClick={() => onChange(layer)}
        >
          {layer}
        </button>
      ))}
    </div>
  );
}
