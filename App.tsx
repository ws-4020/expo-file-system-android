import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {useCallback, useState} from "react";
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';

export default function App() {
  const [dir, setDir] = useState('Measurement');
  const requestDirectoryPermissions = useCallback(async () => {
    try {
      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync('/Documents');
      if (permissions.granted) {
        // Gets SAF URI from response
        const uri = permissions.directoryUri;
        console.log(`granted uri: ${uri}`);
      }
    } catch (e) {
      console.log(e);
    }
  }, [])

  const makeDocumentsDir = useCallback(async () => {
    try {
      await StorageAccessFramework.makeDirectoryAsync('content://com.android.externalstorage.documents/tree/primary%3ADocuments', dir)
    } catch (e) {
      console.log(e);
    }
  }, [])

  const makeDocumentsDirWithRequestPermission = useCallback(async () => {
    try {
      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync('/Documents');
      if (permissions.granted) {
        // Gets SAF URI from response
        const uri = permissions.directoryUri;
        // await FileSystem.makeDirectoryAsync(`${uri}/Measurement`);
        await StorageAccessFramework.makeDirectoryAsync(uri, dir);
      }
    } catch (e) {
      console.log(e);
    }
  }, [])

  return (
    <View style={styles.container}>
      <TextInput onChangeText={text => setDir(text)} value={dir}/>
      <Button title={'Request dir permission'} onPress={requestDirectoryPermissions}/>
      <Button title={'Make dir'} onPress={makeDocumentsDir}/>
      <Button title={'Make dir with request dir permission'} onPress={makeDocumentsDirWithRequestPermission}/>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
