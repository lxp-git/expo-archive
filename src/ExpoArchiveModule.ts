import { NativeModule, requireNativeModule } from "expo";

import {
  ExpoArchiveModuleEvents,
  UnzipOptions,
  ZipOptions,
} from "./ExpoArchive.types";

declare class ExpoArchiveModule extends NativeModule<ExpoArchiveModuleEvents> {
  // Archive/Unzip methods
  zipAsync(
    sourcePath: string,
    zipPath: string,
    options?: ZipOptions
  ): Promise<string>;

  unzipAsync(
    zipPath: string,
    destinationPath: string,
    options?: UnzipOptions
  ): Promise<string>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoArchiveModule>("ExpoArchive");
