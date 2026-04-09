import type { FieldBinding } from '../bindings';
import type { TreeNode } from '../tree';
import type { PrefillDataSource } from './types';

function globalLeaf(namespace: string, fieldKey: string): TreeNode {
  const binding: FieldBinding = {
    kind: 'global',
    namespace,
    fieldKey,
  };
  return {
    type: 'field',
    id: `global:${namespace}:${fieldKey}`,
    label: fieldKey,
    binding,
  };
}

/**
 * Stand-in for Action / Client organisation properties from the real product.
 * Replace the static field lists with API-backed trees when integrating.
 */
export const globalPropertiesSource: PrefillDataSource = {
  id: 'global_properties',
  getSections(): TreeNode[] {
    return [
      {
        type: 'group',
        id: 'global:action_properties',
        label: 'Action Properties',
        children: [
          globalLeaf('action', 'completed_at'),
          globalLeaf('action', 'status'),
          globalLeaf('action', 'owner_id'),
        ],
      },
      {
        type: 'group',
        id: 'global:client_org',
        label: 'Client Organisation Properties',
        children: [
          globalLeaf('client_org', 'display_name'),
          globalLeaf('client_org', 'external_id'),
          globalLeaf('client_org', 'region'),
        ],
      },
    ];
  },
};
