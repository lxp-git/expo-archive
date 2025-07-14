import { useEvent } from 'expo';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import ExpoArchive from 'expo-archive';
import { useState, useCallback, useEffect } from 'react';
import { Button, SafeAreaView, ScrollView, Text, View, Alert, ActivityIndicator } from 'react-native';

export default function App() {
  const [isUnzipping, setIsUnzipping] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [unzipProgress, setUnzipProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [extractedFiles, setExtractedFiles] = useState<string[]>([]);

  const onUnzipProgress = useEvent(ExpoArchive, 'onUnzipProgress');
  const onZipProgress = useEvent(ExpoArchive, 'onZipProgress');

  const extractArchive = useCallback(async () => {
    try {
      setIsUnzipping(true);
      setUnzipProgress(0);
      setCurrentFile('');
      setExtractedFiles([]);

      const extractPath = `${FileSystem.documentDirectory}extracted/`;

      // Create extraction directory
      if ((await FileSystem.getInfoAsync(extractPath)).exists) {
        await FileSystem.deleteAsync(extractPath, { idempotent: true });
      }
      await FileSystem.makeDirectoryAsync(extractPath);
      // const testZipPath = `${FileSystem.documentDirectory}Ace 5 Super Flasher COS 821.zip`;
      const testZipPath = `${FileSystem.documentDirectory}Archive.zip`;
      const info = await FileSystem.getInfoAsync(testZipPath);
      console.log('Zip file info:', info);
      // Extract the archive
      const result = await ExpoArchive.unzipAsync(testZipPath, extractPath, {
        overwrite: true,
        createIntermediateDirectories: true
      });

      console.log('Extraction completed:', result);
    } catch (error) {
      setIsUnzipping(false);
      Alert.alert('Error', 'Failed to extract archive: ' + error);
    }
  }, []);

  const readExtractedFile = useCallback(async (fileName: string) => {
    try {
      const filePath = `${FileSystem.documentDirectory}extracted/test-files/${fileName}`;
      const exists = (await FileSystem.getInfoAsync(filePath)).exists;

      if (exists) {
        const content = await FileSystem.readAsStringAsync(filePath);
        Alert.alert(`Content of ${fileName}`, content);
      } else {
        Alert.alert('Error', 'File not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to read file: ' + error);
    }
  }, []);

  const createArchive = useCallback(async () => {
    try {
      setIsZipping(true);

      // Create some test files first
      const testDir = `${FileSystem.documentDirectory}test-files/`;

      // Create test directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(testDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(testDir, { intermediates: true });

        // Create some test files
        await FileSystem.writeAsStringAsync(`${testDir}file1.txt`, 'This is test file 1 content');
        await FileSystem.writeAsStringAsync(`${testDir}file2.txt`, 'This is test file 2 content');
        await FileSystem.writeAsStringAsync(`${testDir}document.txt`, 'This is a document with some content');
      }

      const zipPath = `${FileSystem.documentDirectory}created-archive.zip`;

      // Remove existing zip file if it exists
      const zipInfo = await FileSystem.getInfoAsync(zipPath);
      if (zipInfo.exists) {
        await FileSystem.deleteAsync(zipPath);
      }

      // Create the archive
      const result = await ExpoArchive.zipAsync(testDir, zipPath, {
        shouldKeepParent: false,
        compressionMethod: 'deflate'
      });

      console.log('Archive created:', result);
    } catch (error) {
      setIsZipping(false);
      Alert.alert('Error', 'Failed to create archive: ' + error);
    }
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Expo Archive Example</Text>

        <Group name="Archive Operations">
          <View style={styles.spacing} />
          <Button
            title={isZipping ? "Creating Archive..." : "Create Archive"}
            onPress={createArchive}
            disabled={isUnzipping || isZipping}
          />
          <Button
            title={isUnzipping ? "Extracting..." : "Extract Archive"}
            onPress={extractArchive}
            disabled={isUnzipping || isZipping}
          />

          {isZipping && (
            <View style={styles.progressContainer}>
              <ActivityIndicator size="small" color="#ff6600" />
              <Text style={styles.progressText}>
                Creating Archive: {Math.round(zipProgress * 100)}%
              </Text>
            </View>
          )}

          {isUnzipping && (
            <View style={styles.progressContainer}>
              <ActivityIndicator size="small" color="#0000ff" />
              <Text style={styles.progressText}>
                Progress: {Math.round((onUnzipProgress?.progress || 0) * 100)}%
              </Text>
              {currentFile && (
                <Text style={styles.currentFileText}>
                  Extracting: {currentFile}
                </Text>
              )}
            </View>
          )}
        </Group>

        {extractedFiles.length > 0 && (
          <Group name="Extracted Files">
            <Text style={styles.subHeader}>Tap to read file content:</Text>
            {extractedFiles.map((file, index) => (
              <Button
                key={index}
                title={file}
                onPress={() => readExtractedFile(file)}
              />
            ))}
          </Group>
        )}
        <Group name="Events">
          <Text>{onUnzipProgress?.progress}</Text>
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginBottom: 10,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
  spacing: {
    height: 10,
  },
  progressContainer: {
    marginTop: 15,
    alignItems: 'center' as const,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  currentFileText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    textAlign: 'center' as const,
  },
  fileItem: {
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
};
