import type { GraphNode } from '../types/graph';
import type { FieldBinding, PrefillConfig, PrefillFieldMap } from './bindings';

/** Best-effort parse when the API starts returning `input_mapping` payloads. */
export function bindingFromUnknown(raw: unknown): FieldBinding | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const o = raw as Record<string, unknown>;
  if (o.kind === 'form_field' && typeof o.sourceNodeId === 'string')
    return {
      kind: 'form_field',
      sourceNodeId: o.sourceNodeId,
      sourceFieldKey: String(o.sourceFieldKey ?? ''),
    };
  if (o.kind === 'global' && typeof o.namespace === 'string')
    return {
      kind: 'global',
      namespace: o.namespace,
      fieldKey: String(o.fieldKey ?? ''),
    };
  if (typeof o.sourceNodeId === 'string' && typeof o.sourceFieldKey === 'string')
    return {
      kind: 'form_field',
      sourceNodeId: o.sourceNodeId,
      sourceFieldKey: o.sourceFieldKey,
    };
  return undefined;
}

export function initialPrefillFromNodes(nodes: GraphNode[]): Record<string, PrefillConfig> {
  const out: Record<string, PrefillConfig> = {};
  for (const n of nodes) {
    if (n.type !== 'form') continue;
    const fields: PrefillFieldMap = {};
    const im = n.data.input_mapping;
    if (im && typeof im === 'object') {
      for (const [k, v] of Object.entries(im)) {
        const b = bindingFromUnknown(v);
        if (b) fields[k] = b;
      }
    }
    out[n.id] = { enabled: true, fields };
  }
  return out;
}
