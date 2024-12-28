/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SCHEDULED_ID?: string;
  readonly VITE_STAGING_ID?: string;
  readonly VITE_LIVE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
