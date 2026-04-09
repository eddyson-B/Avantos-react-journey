import type { GraphNode } from '../types/graph';
import type { FieldBinding } from './bindings';

export function formatBindingLabel(
  binding: FieldBinding,
  nodesById: Map<string, GraphNode>,
): string {
  if (binding.kind === 'form_field') {
    const node = nodesById.get(binding.sourceNodeId);
    const formName = node?.data.name ?? binding.sourceNodeId;
    return `${formName}.${binding.sourceFieldKey}`;
  }
  return `${binding.namespace}.${binding.fieldKey}`;
}

export function formatPrefillRowLabel(
  fieldKey: string,
  binding: FieldBinding | undefined,
  nodesById: Map<string, GraphNode>,
): string {
  if (!binding) return fieldKey;
  return `${fieldKey}: ${formatBindingLabel(binding, nodesById)}`;
}
