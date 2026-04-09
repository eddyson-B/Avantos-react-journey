import { describe, expect, it } from 'vitest';
import { filterTree, type TreeNode } from './tree';

const sample: TreeNode[] = [
  {
    type: 'group',
    id: 'g1',
    label: 'Form B',
    children: [
      {
        type: 'field',
        id: 'f1',
        label: 'email',
        binding: {
          kind: 'form_field',
          sourceNodeId: 'b',
          sourceFieldKey: 'email',
        },
      },
      {
        type: 'field',
        id: 'f2',
        label: 'name',
        binding: {
          kind: 'form_field',
          sourceNodeId: 'b',
          sourceFieldKey: 'name',
        },
      },
    ],
  },
];

describe('filterTree', () => {
  it('returns full tree when query empty/missing', () => {
    expect(filterTree(sample, '')).toEqual(sample);
  });

  it('keeps groups when a child matches', () => {
    const out = filterTree(sample, 'email');
    expect(out).toHaveLength(1);
    expect(out[0].type).toBe('group');
    if (out[0].type === 'group') {
      expect(out[0].children).toHaveLength(1);
      expect(out[0].children[0].label).toBe('email');
    }
  });

  it('keeps full group when group label matches', () => {
    const tree: TreeNode[] = [
      {
        type: 'group',
        id: 'x',
        label: 'Action Properties',
        children: [
          {
            type: 'field',
            id: 'y',
            label: 'status',
            binding: { kind: 'global', namespace: 'action', fieldKey: 'status' },
          },
        ],
      },
    ];
    expect(filterTree(tree, 'action')).toEqual(tree);
  });
});
