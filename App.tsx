import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useCallback} from "react";
import * as FileSystem from 'expo-file-system';

export default function App() {
  const makeDocumentsDir = useCallback(async () => {
    try {
      await FileSystem.makeDirectoryAsync('Documents/Measurement');
    } catch (e) {
      console.log(e);
    }
  }, [])

  return (
    <View style={styles.container}>
      <Button title={'Make dir'} onPress={makeDocumentsDir}/>
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
