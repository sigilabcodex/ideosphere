import type { ActiveLayer } from '../types/ideosphere';

interface Props {
  activeLayer: ActiveLayer;
  onChange: (layer: ActiveLayer) => void;
}

export function LayerToggle({ activeLayer, onChange }: Props) {
  return (
    <div className="layer-toggle">
      {(['descriptive', 'aspirational'] as const).map((layer) => (
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
