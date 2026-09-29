import { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { fetchGitHubUser } from '../services/api';

export function SearchScreen() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch() {
    if (!username) return;
    
    setLoading(true);
    setError('');
    setUserData(null);

    try {
      const data = await fetchGitHubUser(username.trim());
      setUserData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Digite o @ do GitHub" 
        value={username} 
        onChangeText={setUsername} 
        autoCapitalize="none"
      />
      <Button title="Buscar Desenvolvedor" onPress={handleSearch} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {userData && !loading && (
        <View style={styles.card}>
          <Image source={{ uri: userData.avatar_url }} style={styles.avatar} />
          <Text style={styles.name}>{userData.name || userData.login}</Text>
          <Text>Repositórios públicos: {userData.public_repos}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 8, borderColor: '#ccc' },
  loader: { marginTop: 20 },
  errorText: { color: 'red', marginTop: 20, textAlign: 'center', fontWeight: 'bold' },
  card: { marginTop: 30, alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9', borderRadius: 8, elevation: 2 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 }
});
