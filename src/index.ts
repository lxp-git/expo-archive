// Reexport the native module. On web, it will be resolved to ExpoArchiveModule.web.ts
// and on native platforms to ExpoArchiveModule.ts
export { default } from "./ExpoArchiveModule";
export * from "./ExpoArchive.types";
