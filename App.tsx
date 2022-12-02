import {Button, NativeModules, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {useCallback, useState} from "react";
import * as FileSystem from 'expo-file-system';
import {StorageAccessFramework} from 'expo-file-system';
import {Dirs} from "react-native-file-access";

const { ManagePermission } = NativeModules;

export default function App() {
  const [fileName, setFileName] = useState('');
  const [dirName, setDirName] = useState('');
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

  const removeInDocuments = useCallback(async () => {
    try {
      const result = await StorageAccessFramework.deleteAsync(`content://com.android.externalstorage.documents/tree/primary%3ADocuments%2F${dirName}`);
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
      const result = await StorageAccessFramework.createFileAsync(`content://com.android.externalstorage.documents/tree/primary%3ADocuments%2F${dirName}`, fileName, 'text/plain')
      console.log(result)
      await StorageAccessFramework.writeAsStringAsync(result, `info ${Date.now()}`)
    } catch (e) {
      console.log(e);
    }
  }, [fileName, dirName])

  const createMoviesFile = useCallback(async () => {
    try {
      const result = await StorageAccessFramework.createFileAsync(`content://com.android.externalstorage.documents/tree/primary%3AMovies%2F${dirName}`, fileName, 'video/mp4')
      await StorageAccessFramework.writeAsStringAsync(result, `info ${Date.now()}`)
    } catch (e) {
      console.log(e);
    }
  }, [fileName, dirName])

  const writeDocumentsFile = useCallback(async () => {
    try {
      await StorageAccessFramework.writeAsStringAsync(`content://com.android.externalstorage.documents/tree/primary%3ADocuments%2FMeasurement/document/primary%3ADocuments%2FMeasurement%2${fileName}`, `error error ${Date.now()}`)
    } catch (e) {
      console.log(e);
    }
  }, [fileName, dirName])

  const getSDCardDir = useCallback(() => {
    console.log(Dirs.SDCardDir)
  }, [])

  const createDirInDocumentsWithFileSystem = useCallback(async () => {
    try {
      const result = await FileSystem.makeDirectoryAsync(`file:///sdcard/Documents/${dirName}`);
    } catch (e) {
      console.log(e)
    }
  }, [dirName])

  const writeFileInDocumentsWithFileSystem = useCallback(async () => {
    try {
      const result = await FileSystem.writeAsStringAsync(`file:///sdcard/Documents/${dirName}/${fileName}`, 'aaaa', {append: true});
    } catch (e) {
      console.log(e)
    }
  }, [dirName, fileName])

  const getManageStoragePermission = useCallback(async () => {
    try {
      const result = await ManagePermission.getManageStoragePermission()
    } catch (e) {
      console.log(e)
    }
  }, [])

  const requestManageStoragePermission = useCallback(async () => {
    try {
      const result = await ManagePermission.requestManageStoragePermission();
    } catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <ScrollView style={styles.container}>
      <TextInput onChangeText={text => setFileName(text)} value={fileName} placeholder={'please file name'}/>
      <TextInput onChangeText={text => setDirName(text)} value={dirName} placeholder={'please dir name'}/>

      <View style={{height: 1, width: '100%', backgroundColor: 'grey'}}/>
      <View style={{alignItems: 'flex-start'}}>
        <Text>SAF</Text>
      </View>
      <View style={{height: 20}}/>
      <Button title={'Request dirName permission'} onPress={requestDirectoryPermissions}/>
      <View style={{height: 20}}/>
      <Button title={'Create dir in /Documents'} onPress={createDirInDocuments}/>
      <Button title={'Create file in /Documents'} onPress={createDocumentsFile}/>
      <Button title={'Remove in /Documents'} onPress={removeInDocuments}/>
      <Button title={'Write file in /Documents'} onPress={writeDocumentsFile}/>
      <View style={{height: 20}}/>
      <Button title={'Create dir in /Movies'} onPress={createDirInMovies}/>
      <Button title={'Create file in /Movies'} onPress={createMoviesFile}/>
      <View style={{height: 20}}/>
      <View style={{height: 1, width: '100%', backgroundColor: 'grey'}}/>
      <View style={{alignItems: 'flex-start'}}>
        <Text>Non SAF</Text>
      </View>
      <View style={{height: 20}}/>
      <Button title={'Create dir in /Documents non saf'} onPress={createDirInDocumentsWithFileSystem}/>
      <Button title={'write file in /Documents non saf'} onPress={writeFileInDocumentsWithFileSystem}/>
      <Button title={'get manage permission'} onPress={getManageStoragePermission}/>
      <Button title={'request manage permission'} onPress={requestManageStoragePermission}/>
      <Button title={'Get sdcard dir'} onPress={getSDCardDir}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
});
