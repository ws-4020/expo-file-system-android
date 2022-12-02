import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {useCallback, useState} from "react";
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';
import {Dirs} from "react-native-file-access";
import { NativeModules} from 'react-native'
const { ManagePermission } = NativeModules;

export default function App() {
  const [fileName, setFileName] = useState('');
  const [dirName, setDirName] = useState('Measurement');
  const requestDirectoryPermissions = useCallback(async () => {
    try {
      const safUri = StorageAccessFramework.getUriForDirectoryInRoot('Documents');
      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(safUri);
      if (permissions.granted) {
        // Gets SAF URI from response
        const uri = permissions.directoryUri;
        console.log(`granted uri: ${uri}`);
      }
    } catch (e) {
      console.log(e);
    }
  }, [dirName])

  const createDirInDocuments = useCallback(async () => {
    try {
      const safUri = StorageAccessFramework.getUriForDirectoryInRoot('Documents');
      console.log(safUri)
      const result = await StorageAccessFramework.makeDirectoryAsync(safUri, dirName)
    } catch (e) {
      console.log(e);
    }
  }, [dirName])

  const removeDirInDocuments = useCallback(async () => {
    try {
      const safUri = StorageAccessFramework.getUriForDirectoryInRoot('Documents');
      const result = await StorageAccessFramework.deleteAsync(`${safUri}/${dirName}`);
    } catch (e) {
      console.log(e);
    }
  }, [dirName])

  const createDirInMovies = useCallback(async () => {
    try {
      const safUri = StorageAccessFramework.getUriForDirectoryInRoot('Movies');
      await StorageAccessFramework.makeDirectoryAsync(safUri, dirName)
    } catch (e) {
      console.log(e);
    }
  }, [dirName])

  const createDocumentsFile = useCallback(async () => {
    try {
      const safUri = StorageAccessFramework.getUriForDirectoryInRoot('Documents');
      // const result = await StorageAccessFramework.createFileAsync(`${safUri}/Measurement`, fileName, 'text/plain')
      // content://com.android.externalstorage.documents/tree/primary:Documents/document/primary:Documents
      // content://com.android.externalstorage.documents/tree/primary:Documents/Measurement
      const result = await StorageAccessFramework.createFileAsync(`content://com.android.externalstorage.documents/tree/primary%3ADocuments%2F${dirName}`, fileName, 'text/plain')
      console.log(result)
      await StorageAccessFramework.writeAsStringAsync(result, `info ${Date.now()}`)
    } catch (e) {
      console.log(e);
    }
  }, [fileName, dirName])

  const createMoviesFile = useCallback(async () => {
    try {
      const safUri = StorageAccessFramework.getUriForDirectoryInRoot('Movies');
      console.log(safUri)
      // const result = await StorageAccessFramework.createFileAsync(`${safUri}/Measurement`, fileName, 'text/plain')
      // content://com.android.externalstorage.documents/tree/primary:Documents/document/primary:Documents
      // content://com.android.externalstorage.documents/tree/primary:Documents/Measurement
      const result = await StorageAccessFramework.createFileAsync(`content://com.android.externalstorage.documents/tree/primary%3AMovies%2F${dirName}`, fileName, 'video/mp4')
      await StorageAccessFramework.writeAsStringAsync(result, `info ${Date.now()}`)
    } catch (e) {
      console.log(e);
    }
  }, [fileName, dirName])

  const writeDocumentsFile = useCallback(async () => {
    try {
      // content://com.android.externalstorage.documents/tree/primary%3ADocuments%2FMeasurement/document/primary%3ADocuments%2FMeasurement%2F47.log.txt
      await StorageAccessFramework.writeAsStringAsync(`content://com.android.externalstorage.documents/tree/primary%3ADocuments%2FMeasurement/document/primary%3ADocuments%2FMeasurement%2F47.log.txt`, `error error ${Date.now()}`)
    } catch (e) {
      console.log(e);
    }
  }, [fileName, dirName])

  const getExternalDir = useCallback(() => {
    console.log(Dirs.SDCardDir)
    console.log(Dirs.DocumentDir)
  }, [])

  const createDirInDocumentsWithFileSystem = useCallback(async () => {
    try {
      // await FileSystem.makeDirectoryAsync(`file:///storage/emulated/0/Documents/BBAA`);
      // const result = await FileSystem.getInfoAsync(`file:///storage/emulated/0/Documents`);
      // const result = await FileSystem.writeAsStringAsync('file:///storage/emulated/0/Documents/test1.txt', 'test1');
      // const result = await FileSystem.writeAsStringAsync('file:///storage/emulated/0/Movies/test1.txt', 'test1');
      // const result = await FileSystem.makeDirectoryAsync(`/storage/emulated/0/Documents/BBAA`);
      const result = await FileSystem.makeDirectoryAsync(`file:///sdcard/Documents/GGGG`);
      // const result = await FileSystem.makeDirectoryAsync(`file:///sdcard/Documents/FFFF`);
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }, [getExternalDir])

  const writeFileInDocumentsWithFileSystem = useCallback(async () => {
    try {
      // await FileSystem.makeDirectoryAsync(`file:///storage/emulated/0/Documents/BBAA`);
      // const result = await FileSystem.getInfoAsync(`file:///storage/emulated/0/Documents`);
      // const result = await FileSystem.writeAsStringAsync('file:///storage/emulated/0/Documents/test1.txt', 'test1');
      // const result = await FileSystem.writeAsStringAsync('file:///storage/emulated/0/Movies/test1.txt', 'test1');
      // const result = await FileSystem.makeDirectoryAsync(`/storage/emulated/0/Documents/BBAA`);
      const result = await FileSystem.writeAsStringAsync(`file:///sdcard/Documents/GGGG/text.text`, 'test1');;
      // const result = await FileSystem.makeDirectoryAsync(`file:///sdcard/Documents/FFFF`);
      // console.log(result)
    } catch (e) {
      console.log(e)
    }
  }, [getExternalDir])

  const getManagePermission = useCallback(async () => {
    try {
      const result = await ManagePermission.getManageStoragePermission()
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }, [])



  const requestManageStoragePermission = useCallback(async () => {
    try {
      const result = await ManagePermission.requestManageStoragePermission();
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <View style={styles.container}>
      <TextInput onChangeText={text => setFileName(text)} value={fileName} placeholder={'please file name'}/>
      <TextInput onChangeText={text => setDirName(text)} value={dirName} placeholder={'please dirName name'}/>
      <Button title={'Request dirName permission'} onPress={requestDirectoryPermissions}/>
      <View style={{height: 20}}/>
      <Button title={'Create dir in /Documents'} onPress={createDirInDocuments}/>
      <Button title={'Create file in /Documents'} onPress={createDocumentsFile}/>
      <Button title={'Remove dir in /Documents'} onPress={removeDirInDocuments}/>
      <View style={{height: 20}}/>
      <Button title={'Create dir in /Movies'} onPress={createDirInMovies}/>
      <Button title={'Create file in /Movies'} onPress={createMoviesFile}/>
      <View style={{height: 20}}/>
      <Button title={'Write file'} onPress={writeDocumentsFile}/>
      <Button title={'Get external dir'} onPress={getExternalDir}/>
      <Button title={'Create dir in /Documents with FileSystem'} onPress={createDirInDocumentsWithFileSystem}/>
      <Button title={'get manage permission'} onPress={getManagePermission}/>
      <Button title={'request manage permission'} onPress={requestManageStoragePermission}/>
      <Button title={'write'} onPress={writeFileInDocumentsWithFileSystem}/>
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
