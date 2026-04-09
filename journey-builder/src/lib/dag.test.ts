import { describe, expect, it } from 'vitest';
import { getAncestorNodeIds, nodesById } from './dag';
import type { GraphNode } from '../types/graph';

const sampleNodes: GraphNode[] = [
  {
    id: 'a',
    type: 'form',
    position: { x: 0, y: 0 },
    data: {
      id: '1',
      component_key: 'a',
      component_type: 'form',
      component_id: 'f1',
      name: 'Form A',
      prerequisites: [],
      permitted_roles: [],
      input_mapping: {},
    },
  },
  {
    id: 'b',
    type: 'form',
    position: { x: 0, y: 0 },
    data: {
      id: '2',
      component_key: 'b',
      component_type: 'form',
      component_id: 'f1',
      name: 'Form B',
      prerequisites: ['a'],
      permitted_roles: [],
      input_mapping: {},
    },
  },
  {
    id: 'd',
    type: 'form',
    position: { x: 0, y: 0 },
    data: {
      id: '3',
      component_key: 'd',
      component_type: 'form',
      component_id: 'f1',
      name: 'Form D',
      prerequisites: ['b'],
      permitted_roles: [],
      input_mapping: {},
    },
  },
];

describe('getAncestorNodeIds', () => {
  it('lists direct parent before transitive ancestor', () => {
    const byId = nodesById(sampleNodes);
    expect(getAncestorNodeIds(byId, 'd')).toEqual(['b', 'a']);
  });

  it('returns empty for root', () => {
    const byId = nodesById(sampleNodes);
    expect(getAncestorNodeIds(byId, 'a')).toEqual([]);
  });
});
