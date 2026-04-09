import type { FieldBinding } from './bindings';

export type TreeNode =
  | {
      type: 'group';
      id: string;
      label: string;
      children: TreeNode[];
    }
  | {
      type: 'field';
      id: string;
      label: string;
      binding: FieldBinding;
    };

export function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;

  const filterNode = (node: TreeNode): TreeNode | null => {
    if (node.type === 'field') {
      return node.label.toLowerCase().includes(q) ? node : null;
    }
    const children = node.children
      .map(filterNode)
      .filter((c): c is TreeNode => c !== null);
    const selfMatch = node.label.toLowerCase().includes(q);
    if (selfMatch) return node;
    if (children.length === 0) return null;
    return { ...node, children };
  };

  return nodes.map(filterNode).filter((c): c is TreeNode => c !== null);
}
