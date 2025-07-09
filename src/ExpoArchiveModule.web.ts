import { registerWebModule, NativeModule } from 'expo';

import { ExpoArchiveModuleEvents } from './ExpoArchive.types';

class ExpoArchiveModule extends NativeModule<ExpoArchiveModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoArchiveModule, 'ExpoArchiveModule');
