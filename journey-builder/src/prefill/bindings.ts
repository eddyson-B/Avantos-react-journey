/**
 * Serializable prefill reference. Add new variants here and handle them in
 * `formatBindingLabel` + modal sources — no component changes required.
 */
export type FieldBinding =
  | { kind: 'form_field'; sourceNodeId: string; sourceFieldKey: string }
  | { kind: 'global'; namespace: string; fieldKey: string };

export type PrefillFieldMap = Record<string, FieldBinding | undefined>;

export type PrefillConfig = {
  enabled: boolean;
  fields: PrefillFieldMap;
};
