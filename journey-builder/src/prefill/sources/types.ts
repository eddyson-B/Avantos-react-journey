import type { ActionBlueprintGraph } from '../../types/graph';
import type { TreeNode } from '../tree';

export type PrefillSourceContext = {
  graph: ActionBlueprintGraph;
  targetNodeId: string;
};

/**
 * A pluggable provider of sidebar sections for the mapping modal.
 * Register instances in `defaultPrefillSources` (or pass a custom list) —
 * the UI merges all sections without knowing specifics.
 */
export interface PrefillDataSource {
  readonly id: string;
  getSections(context: PrefillSourceContext): TreeNode[];
}
