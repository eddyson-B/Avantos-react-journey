import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchBlueprintGraph } from './api/fetchBlueprintGraph';
import { FormList } from './components/FormList';
import { PrefillPanel } from './components/PrefillPanel';
import { nodesById } from './lib/dag';
import { initialPrefillFromNodes } from './prefill/state';
import type { PrefillConfig } from './prefill/bindings';
import type { ActionBlueprintGraph } from './types/graph';
import './App.css';

export function App() {
  const [graph, setGraph] = useState<ActionBlueprintGraph | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prefillByNode, setPrefillByNode] = useState<Record<string, PrefillConfig>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBlueprintGraph()
      .then((g) => {
        if (cancelled) return;
        setGraph(g);
        setPrefillByNode(initialPrefillFromNodes(g.nodes));
        const forms = g.nodes.filter((n) => n.type === 'form');
        setSelectedId(forms[0]?.id ?? null);
        setError(null);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load graph');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const formNodes = useMemo(
    () =>
      graph
        ? graph.nodes.filter((n) => n.type === 'form').slice().sort((a, b) => 
            a.data.name.localeCompare(b.data.name),
          )
        : [],
    [graph],
  );

  const selectedNode = useMemo(() => {
    if (!graph || !selectedId) return null;
    return nodesById(graph.nodes).get(selectedId) ?? null;
  }, [graph, selectedId]);

  const updatePrefill = useCallback(
    (nodeId: string, next: PrefillConfig) => {
      setPrefillByNode((prev) => ({ ...prev, [nodeId]: next }));
    },
    [],
  );

  if (loading) {
    return (
      <div className="app app--center">
        <p>Loading blueprint graph…</p>
      </div>
    );
  }

  if (error || !graph) {
    return (
      <div className="app app--center">
        <p className="error">{error ?? 'Unknown error'}</p>
        <p className="muted small">
          Start the mock server (port 3000) and use the Vite dev server so{' '}
          <code>/api</code> proxies correctly.
        </p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__banner">
        <h1>{graph.name}</h1>
        <p className="muted small">{graph.description}</p>
      </header>
      <main className="app__main">
        <FormList forms={formNodes} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="app__detail">
          {selectedNode ? (
            <PrefillPanel
              graph={graph}
              node={selectedNode}
              config={prefillByNode[selectedNode.id] ?? { enabled: true, fields: {} }}
              onChange={(next) => updatePrefill(selectedNode.id, next)}
            />
          ) : (
            <p className="muted">Select a form from the list.</p>
          )}
        </div>
      </main>
    </div>
  );
}
