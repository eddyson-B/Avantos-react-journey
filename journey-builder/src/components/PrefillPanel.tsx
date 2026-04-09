import { useMemo, useState } from 'react';
import { formByComponentId, listFieldKeys } from '../lib/fieldSchema';
import { nodesById } from '../lib/dag';
import { buildModalTree, defaultPrefillSources } from '../prefill/sources';
import type { PrefillDataSource } from '../prefill/sources/types';
import type { FieldBinding, PrefillConfig } from '../prefill/bindings';
import { formatPrefillRowLabel } from '../prefill/display';
import type { ActionBlueprintGraph, GraphNode } from '../types/graph';
import { DataSourceModal } from './DataSourceModal';

type Props = {
  graph: ActionBlueprintGraph;
  node: GraphNode;
  config: PrefillConfig;
  onChange: (next: PrefillConfig) => void;
  sources?: PrefillDataSource[];
};

export function PrefillPanel({
  graph,
  node,
  config,
  onChange,
  sources = defaultPrefillSources,
}: Props) {
  const [modalField, setModalField] = useState<string | null>(null);
  const byId = useMemo(() => nodesById(graph.nodes), [graph.nodes]);

  const def = formByComponentId(graph.forms, node.data.component_id);
  const fieldKeys = def ? listFieldKeys(def.field_schema) : [];

  const modalTree = useMemo(
    () =>
      buildModalTree(sources, {
        graph,
        targetNodeId: node.id,
      }),
    [sources, graph, node.id],
  );

  const setEnabled = (enabled: boolean) => {
    onChange({ ...config, enabled });
  };

  const setFieldBinding = (fieldKey: string, binding: FieldBinding | undefined) => {
    const fields = { ...config.fields, [fieldKey]: binding };
    onChange({ ...config, fields });
  };

  return (
    <section className="prefill">
      <header className="prefill__header">
        <div>
          <h3 className="prefill__title">Prefill</h3>
          <p className="prefill__subtitle">Prefill fields for this form</p>
        </div>
        <label className="prefill__toggle">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <span className="prefill__toggle-ui" aria-hidden />
        </label>
      </header>

      {fieldKeys.length === 0 ? (
        <p className="muted">No field schema found for this form.</p>
      ) : (
        <ul className="prefill__list">
          {fieldKeys.map((fk) => {
            const binding = config.fields[fk];
            const configured = Boolean(binding);
            return (
              <li key={fk}>
                <div
                  className={`prefill__row ${configured ? 'prefill__row--ok' : 'prefill__row--empty'}`}
                >
                  <button
                    type="button"
                    className="prefill__row-main"
                    disabled={!config.enabled}
                    onClick={() => config.enabled && setModalField(fk)}
                  >
                    <span className="prefill__icon" aria-hidden>
                      ⧉
                    </span>
                    <span className="prefill__label">
                      {formatPrefillRowLabel(fk, binding, byId)}
                    </span>
                  </button>
                  {configured ? (
                    <button
                      type="button"
                      className="prefill__clear"
                      title="Clear mapping"
                      disabled={!config.enabled}
                      onClick={() => config.enabled && setFieldBinding(fk, undefined)}
                    >
                      ×
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <DataSourceModal
        open={modalField !== null}
        title="Select data element to map"
        tree={modalTree}
        onCancel={() => setModalField(null)}
        onSelect={(binding) => {
          if (modalField) setFieldBinding(modalField, binding);
          setModalField(null);
        }}
      />
    </section>
  );
}
