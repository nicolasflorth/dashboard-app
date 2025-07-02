export {};

declare global {
  interface ImportMetaEnv {
    readonly MODE: string;
    readonly VITE_API_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
