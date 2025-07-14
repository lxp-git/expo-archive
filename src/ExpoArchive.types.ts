import type { StyleProp, ViewStyle } from "react-native";

export type OnLoadEventPayload = {
  url: string;
};

export type ExpoArchiveModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
  onUnzipProgress: (params: UnzipProgressEventPayload) => void;
  onZipProgress: (params: ZipProgressEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type UnzipProgressEventPayload = {
  progress: number;
  currentFile: string;
  totalFiles: number;
  processedFiles: number;
};

export type UnzipOptions = {
  overwrite?: boolean;
  password?: string;
  createIntermediateDirectories?: boolean;
  skipCRC32?: boolean;
  allowUncontainedSymlinks?: boolean;
};

export type ExpoArchiveViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};

export type ZipProgressEventPayload = {
  progress: number;
};

export type ZipOptions = {
  compressionMethod?: "deflate" | "none";
  shouldKeepParent?: boolean;
};
