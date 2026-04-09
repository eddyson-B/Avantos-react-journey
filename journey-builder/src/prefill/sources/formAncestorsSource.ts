import { getAncestorNodeIds, nodesById } from '../../lib/dag';
import { formByComponentId, listFieldKeys } from '../../lib/fieldSchema';
import type { FieldBinding } from '../bindings';
import type { TreeNode } from '../tree';
import type { PrefillDataSource, PrefillSourceContext } from './types';

function formFieldLeaf(
  sourceNodeId: string,
  sourceFieldKey: string,
): TreeNode {
  const binding: FieldBinding = {
    kind: 'form_field',
    sourceNodeId,
    sourceFieldKey,
  };
  return {
    type: 'field',
    id: `form_field:${sourceNodeId}:${sourceFieldKey}`,
    label: sourceFieldKey,
    binding,
  };
}

/** Exposes fields for every transitive ancestor form in the blueprint DAG. */
export const formAncestorsSource: PrefillDataSource = {
  id: 'form_ancestors',
  getSections(ctx: PrefillSourceContext): TreeNode[] {
    const byId = nodesById(ctx.graph.nodes);
    const ancestorIds = getAncestorNodeIds(byId, ctx.targetNodeId);
    const roots: TreeNode[] = [];

    for (const nodeId of ancestorIds) {
      const node = byId.get(nodeId);
      if (!node || node.type !== 'form') continue;
      const def = formByComponentId(ctx.graph.forms, node.data.component_id);
      if (!def) continue;
      const keys = listFieldKeys(def.field_schema);
      roots.push({
        type: 'group',
        id: `ancestor_form:${nodeId}`,
        label: node.data.name,
        children: keys.map((k) => formFieldLeaf(nodeId, k)),
      });
    }

    return roots;
  },
};
