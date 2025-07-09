import * as React from 'react';

import { ExpoArchiveViewProps } from './ExpoArchive.types';

export default function ExpoArchiveView(props: ExpoArchiveViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
