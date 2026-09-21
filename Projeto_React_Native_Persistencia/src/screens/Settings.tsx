import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Settings() {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const storedName = await AsyncStorage.getItem('@user_name');
      const storedBudget = await AsyncStorage.getItem('@user_budget');
      if (storedName) setName(storedName);
      if (storedBudget) setBudget(storedBudget);
    }
    loadSettings();
  }, []);

  async function saveSettings() {
    try {
      await AsyncStorage.setItem('@user_name', name);
      await AsyncStorage.setItem('@user_budget', budget);
      Alert.alert('Sucesso', 'Configurações salvas localmente!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações de Perfil (AsyncStorage)</Text>
      
      <Text>Seu Nome:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: João" />

      <Text>Orçamento Mensal Máximo:</Text>
      <TextInput style={styles.input} value={budget} onChangeText={setBudget} placeholder="Ex: 2000" keyboardType="numeric" />

      <Button title="Salvar Configurações" onPress={saveSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 }
});
