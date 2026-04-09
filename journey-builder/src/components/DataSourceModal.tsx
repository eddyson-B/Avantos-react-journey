import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { FieldBinding } from '../prefill/bindings';
import { filterTree, type TreeNode } from '../prefill/tree';

type Props = {
  open: boolean;
  title: string;
  tree: TreeNode[];
  onCancel: () => void;
  onSelect: (binding: FieldBinding) => void;
};

export function DataSourceModal({ open, title, tree, onCancel, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [selectedLeafId, setSelectedLeafId] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterTree(tree, search),
    [tree, search],
  );

  const selectedBinding: FieldBinding | null = useMemo(() => {
    if (!selectedLeafId) return null;
    const findLeaf = (nodes: TreeNode[]): TreeNode | undefined => {
      for (const n of nodes) {
        if (n.type === 'field' && n.id === selectedLeafId) return n;
        if (n.type === 'group') {
          const hit = findLeaf(n.children);
          if (hit) return hit;
        }
      }
    };
    const hit = findLeaf(filtered);
    return hit?.type === 'field' ? hit.binding : null;
  }, [filtered, selectedLeafId]);

  useEffect(() => {
    if (!open) {
      setSearch('');
      setSelectedLeafId(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const authed = new Set<string>();
    const markOpen = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        if (n.type === 'group') {
          authed.add(n.id);
          markOpen(n.children);
        }
      }
    };
    markOpen(filtered);
    setExpanded(authed);
  }, [open, filtered]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderNode = (node: TreeNode, depth: number): ReactNode => {
    if (node.type === 'field') {
      const active = selectedLeafId === node.id;
      return (
        <button
          key={node.id}
          type="button"
          className={`ds-modal__row ds-modal__row--field ${active ? 'ds-modal__row--active' : ''}`}
          style={{ paddingLeft: 12 + depth * 14 }}
          onClick={() => setSelectedLeafId(node.id)}
        >
          {node.label}
        </button>
      );
    }
    const isOpen = expanded.has(node.id);
    return (
      <div key={node.id}>
        <button
          type="button"
          className="ds-modal__row ds-modal__row--group"
          style={{ paddingLeft: 12 + depth * 14 }}
          onClick={() => toggle(node.id)}
        >
          <span className="ds-modal__chevron">{isOpen ? '▼' : '▶'}</span>
          {node.label}
        </button>
        {isOpen ? node.children.map((c) => renderNode(c, depth + 1)) : null}
      </div>
    );
  };

  const handleSelect = () => {
    if (selectedBinding) {
      onSelect(selectedBinding);
    }
  };

  if (!open) return null;

  return (
    <div className="ds-modal__backdrop" role="presentation" onClick={onCancel}>
      <div
        className="ds-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ds-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="ds-modal-title" className="ds-modal__title">
          {title}
        </h2>
        <div className="ds-modal__body">
          <aside className="ds-modal__sidebar">
            <p className="ds-modal__subtitle">Available data</p>
            <input
              className="ds-modal__search"
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Filter data sources"
            />
            <nav className="ds-modal__tree">{filtered.map((n) => renderNode(n, 0))}</nav>
          </aside>
          <div className="ds-modal__detail">
            {selectedBinding ? (
              <p className="ds-modal__hint">Selected mapping is ready. Click Select.</p>
            ) : (
              <p className="ds-modal__hint muted">Choose a field from the list.</p>
            )}
          </div>
        </div>
        <div className="ds-modal__footer">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={!selectedBinding}
            onClick={handleSelect}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
