/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPH_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
