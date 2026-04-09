import { describe, expect, it } from 'vitest';
import { formatBindingLabel } from './display';
import { nodesById } from '../lib/dag';
import type { GraphNode } from '../types/graph';

const nodes: GraphNode[] = [
  {
    id: 'n1',
    type: 'form',
    position: { x: 0, y: 0 },
    data: {
      id: '1',
      component_key: 'k',
      component_type: 'form',
      component_id: 'f',
      name: 'Form A',
      prerequisites: [],
      permitted_roles: [],
      input_mapping: {},
    },
  },
];

describe('formatBindingLabel', () => {
  it('uses form display name for form_field bindings', () => {
    const byId = nodesById(nodes);
    expect(
      formatBindingLabel(
        { kind: 'form_field', sourceNodeId: 'n1', sourceFieldKey: 'email' },
        byId,
      ),
    ).toBe('Form A.email');
  });

  it('uses namespace for global bindings', () => {
    expect(
      formatBindingLabel(
        { kind: 'global', namespace: 'client_org', fieldKey: 'display-name' },
        new Map(),
      ),
    ).toBe('client_org.display-name');
  });
});
