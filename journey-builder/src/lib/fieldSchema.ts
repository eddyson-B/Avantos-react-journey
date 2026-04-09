import type { FormDefinition, JsonSchemaObject } from '../types/graph';

export function listFieldKeys(schema: JsonSchemaObject): string[] {
  const props = schema.properties;
  if (!props || typeof props !== 'object') return [];
  return Object.keys(props);
}

export function formByComponentId(
  forms: FormDefinition[],
  componentId: string,
): FormDefinition | undefined {
  return forms.find((f) => f.id === componentId);
}
