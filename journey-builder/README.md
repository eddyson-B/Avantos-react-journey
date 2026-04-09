# Journey Builder (React challenge)

Small React + TypeScript app that loads an **action blueprint graph** from the mock server, lists **forms**, and lets you **view and edit prefill mappings** per form (including a modal to pick from ancestor forms and global properties).

## Run locally

1. **Mock API** — in [`frontendchallengeserver`](../frontendchallengeserver):

   ```bash
   npm start
   ```

   Serves the graph at `http://localhost:3000` (see that repo’s README).

2. **This app**:

   ```bash
   cd journey-builder
   npm install
   npm run dev
   ```

   Vite proxies `/api/*` to `http://localhost:3000`, so the default graph URL works without CORS setup.

3. Open the printed local URL (e.g. `http://localhost:5173`).

Optional: copy `.env.example` to `.env` and set `VITE_GRAPH_URL`. The default path follows the documented API:
`GET /api/v1/{tenant_id}/actions/blueprints/{action_blueprint_id}/{blueprint_version_id}/graph` (see `src/api/fetchBlueprintGraph.ts`). The local mock only checks this path shape, not real auth/ETag behavior.

## Tests

```bash
npm test
```

## Extending data sources for the mapping modal

Prefill options are **not hard-coded in components**. Each sidebar section comes from a `PrefillDataSource`:

- Interface: `src/prefill/sources/types.ts`
- Examples: `globalPropertiesSource.ts`, `formAncestorsSource.ts`
- Registry: `defaultPrefillSources` in `src/prefill/sources/index.ts`

To add a source:

1. Implement `PrefillDataSource` (return a list of `TreeNode` groups / fields).
2. Append your instance to `defaultPrefillSources`, or pass a custom `sources` array into `PrefillPanel` from `App.tsx`.

New binding kinds belong in `src/prefill/bindings.ts`; add a display branch in `src/prefill/display.ts` and leaves in your source’s tree.

## Stack

- Vite, React 19, TypeScript
- Vitest + Testing Library for unit tests
