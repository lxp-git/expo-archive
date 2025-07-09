import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoArchiveViewProps } from './ExpoArchive.types';

const NativeView: React.ComponentType<ExpoArchiveViewProps> =
  requireNativeView('ExpoArchive');

export default function ExpoArchiveView(props: ExpoArchiveViewProps) {
  return <NativeView {...props} />;
}
