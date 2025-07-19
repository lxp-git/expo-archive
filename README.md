# Expo Archive

A powerful and easy-to-use Expo module for creating and extracting ZIP archives in React Native applications.

## Features

- ✅ **Create ZIP archives** from files and directories
- ✅ **Extract ZIP archives** with full directory structure

## Installation

```bash
npx expo install expo-archive
```

### Development builds

For development builds, you'll need to rebuild your app after installing the module.

```bash
npx expo run:ios
npx expo run:android
```

## Usage

### Basic Example

```typescript
import ExpoArchive from "expo-archive";
import * as FileSystem from "expo-file-system";

// Create a ZIP archive
const createArchive = async () => {
  try {
    const sourcePath = `${FileSystem.documentDirectory}my-folder/`;
    const zipPath = `${FileSystem.documentDirectory}my-archive.zip`;

    const result = await ExpoArchive.zipAsync(sourcePath, zipPath, {
      shouldKeepParent: false,
      compressionMethod: "deflate",
    });

    console.log("Archive created:", result);
  } catch (error) {
    console.error("Failed to create archive:", error);
  }
};

// Extract a ZIP archive
const extractArchive = async () => {
  try {
    const zipPath = `${FileSystem.documentDirectory}my-archive.zip`;
    const extractPath = `${FileSystem.documentDirectory}extracted/`;

    const result = await ExpoArchive.unzipAsync(zipPath, extractPath, {
      overwrite: true,
      createIntermediateDirectories: true,
    });

    console.log("Archive extracted to:", result);
  } catch (error) {
    console.error("Failed to extract archive:", error);
  }
};
```

### Progress Monitoring

```typescript
import { useEvent } from 'expo';
import ExpoArchive from 'expo-archive';

export default function App() {
  const [zipProgress, setZipProgress] = useState(0);
  const [unzipProgress, setUnzipProgress] = useState(0);

  const onZipProgress = useEvent(ExpoArchive, 'onZipProgress');
  const onUnzipProgress = useEvent(ExpoArchive, 'onUnzipProgress');

  useEffect(() => {
    if (onZipProgress) {
      setZipProgress(onZipProgress.progress);
    }
  }, [onZipProgress]);

  useEffect(() => {
    if (onUnzipProgress) {
      setUnzipProgress(onUnzipProgress.progress);
    }
  }, [onUnzipProgress]);

  return (
    <View>
      <Text>Zip Progress: {Math.round(zipProgress * 100)}%</Text>
      <Text>Unzip Progress: {Math.round(unzipProgress * 100)}%</Text>
    </View>
  );
}
```

### Password-Protected Archives

```typescript
// Extract password-protected archive
const extractProtectedArchive = async () => {
  try {
    const result = await ExpoArchive.unzipAsync(zipPath, extractPath, {
      password: "your-password",
      overwrite: true,
    });
    console.log("Protected archive extracted:", result);
  } catch (error) {
    console.error("Failed to extract protected archive:", error);
  }
};
```

## API Reference

### Methods

#### `zipAsync(sourcePath, zipPath, options?)`

Creates a ZIP archive from the specified source.

**Parameters:**

- `sourcePath` (string): Path to the file or directory to compress
- `zipPath` (string): Path where the ZIP file will be created
- `options` (ZipOptions, optional): Compression options

**Returns:** `Promise<string>` - Path to the created ZIP file

#### `unzipAsync(zipPath, destinationPath, options?)`

Extracts a ZIP archive to the specified destination.

**Parameters:**

- `zipPath` (string): Path to the ZIP file to extract
- `destinationPath` (string): Path where files will be extracted
- `options` (UnzipOptions, optional): Extraction options

**Returns:** `Promise<string>` - Path to the extraction directory

### Options

#### ZipOptions

```typescript
interface ZipOptions {
  compressionMethod?: "deflate" | "none";
  shouldKeepParent?: boolean;
}
```

#### UnzipOptions

```typescript
interface UnzipOptions {
  overwrite?: boolean;
  password?: string;
  createIntermediateDirectories?: boolean;
  skipCRC32?: boolean;
  allowUncontainedSymlinks?: boolean;
}
```

### Events

#### Progress Events

- `onZipProgress`: Fired during ZIP creation
- `onUnzipProgress`: Fired during ZIP extraction

```typescript
interface ProgressEvent {
  progress: number; // 0.0 to 1.0
}
```

#### Completion Events

- `onZipComplete`: Fired when ZIP creation completes
- `onUnzipComplete`: Fired when ZIP extraction completes

#### Error Events

- `onZipError`: Fired when ZIP creation fails
- `onUnzipError`: Fired when ZIP extraction fails

```typescript
interface ErrorEvent {
  error: string;
  code: string;
}
```

## Example App

Check out the example app in the `/example` directory for a complete implementation showing all features.

```bash
cd example
npm install
npx expo run:ios # or npx expo run:android
```

## Platform Support

|     | iOS | Android |
| --- | --- | ------- |
| ZIP | ✅  | ❌      |

## Requirements

- Expo SDK 50+
- iOS 15.1+
- Android API 21+

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-expo-module](https://www.npmjs.com/package/create-expo-module)
