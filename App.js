import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ChessBoard from './ChessBoard';

export default function App() {
  return (
    <View style={styles.container}>
      <ChessBoard></ChessBoard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242529',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
