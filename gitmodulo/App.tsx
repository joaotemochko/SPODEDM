import { SafeAreaView, StyleSheet } from 'react-native';
import { SearchScreen } from './src/screens/SearchScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <SearchScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 }
});
