export type JsonSchemaObject = {
  type?: string;
  properties?: Record<string, unknown>;
  required?: string[];
};

export type FormDefinition = {
  id: string;
  name: string;
  description?: string;
  is_reusable?: boolean;
  field_schema: JsonSchemaObject;
  ui_schema?: unknown;
};

export type GraphNodeData = {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles: string[];
  input_mapping: Record<string, unknown>;
  sla_duration?: { number: number; unit: string };
  approval_required?: boolean;
  approval_roles?: string[];
};

export type GraphNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: GraphNodeData;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export type ActionBlueprintGraph = {
  $schema?: string;
  id: string;
  tenant_id?: string;
  name: string;
  description?: string;
  category?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormDefinition[];
};
