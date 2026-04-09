import type { GraphNode } from '../types/graph';

/** Map node id → node for quick lookup */
export function nodesById(nodes: GraphNode[]): Map<string, GraphNode> {
  return new Map(nodes.map((n) => [n.id, n]));
}

/**
 * All ancestor node ids for `targetId` (transitive), using `data.prerequisites`
 * as incoming edges (a node depends on its prerequisites).
 * Direct parents appear before deeper ancestors (breadth-like ordering).
 */
export function getAncestorNodeIds(
  byId: Map<string, GraphNode>,
  targetId: string,
): string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();
  const frontier: string[] = [...(byId.get(targetId)?.data.prerequisites ?? [])];

  while (frontier.length) {
    const id = frontier.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    ordered.push(id);
    const parent = byId.get(id);
    if (parent) frontier.push(...parent.data.prerequisites);
  }
  return ordered;
}
