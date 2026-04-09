import type { TreeNode } from '../tree';
import { formAncestorsSource } from './formAncestorsSource';
import { globalPropertiesSource } from './globalPropertiesSource';
import type { PrefillDataSource, PrefillSourceContext } from './types';

/**
 * Default registry — add new `PrefillDataSource` implementations here to expose
 * more data in the modal without changing React components.
 */
export const defaultPrefillSources: PrefillDataSource[] = [
  globalPropertiesSource,
  formAncestorsSource,
];

export function buildModalTree(
  sources: PrefillDataSource[],
  ctx: PrefillSourceContext,
): TreeNode[] {
  return sources.flatMap((s) => s.getSections(ctx));
}
