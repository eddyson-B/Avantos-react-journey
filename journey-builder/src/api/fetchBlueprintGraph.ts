import type { ActionBlueprintGraph } from '../types/graph';

/**
 * Path matches OpenAPI: GET /api/v1/{tenant_id}/actions/blueprints/{action_blueprint_id}/{blueprint_version_id}/graph
 * Example IDs align with docs samples (tenant 123, bp_456, bpv_123).
 */
const DEFAULT_PATH =
  '/api/v1/123/actions/blueprints/bp_456/bpv_123/graph';

export function resolveGraphUrl(): string {
  const fromEnv = import.meta.env.VITE_GRAPH_URL;
  if (finalUrl(fromEnv)) return fromEnv.trim();
  return DEFAULT_PATH;
}

function finalUrl(s: string | undefined): s is string {
  return typeof s === 'string' && s.length > 0;
}

export async function fetchBlueprintGraph(
  url: string = resolveGraphUrl(),
): Promise<ActionBlueprintGraph> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Graph request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<ActionBlueprintGraph>;
}
