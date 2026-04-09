import type { GraphNode } from '../types/graph';

type Props = {
  forms: GraphNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function FormList({ forms, selectedId, onSelect }: Props) {
  return (
    <aside className="form-list">
      <h2 className="form-list__title">Forms</h2>
      <p className="form-list__hint muted">Open a form to edit prefill mappings.</p>
      <ul>
        {forms.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              className={`form-list__item ${selectedId === n.id ? 'form-list__item--active' : ''}`}
              onClick={() => onSelect(n.id)}
            >
              <span className="form-list__badge">Form</span>
              <span className="form-list__name">{n.data.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
