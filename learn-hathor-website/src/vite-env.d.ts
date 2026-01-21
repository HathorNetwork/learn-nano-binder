/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BINDERHUB_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
