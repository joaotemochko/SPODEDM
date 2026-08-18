import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { InventoryContext } from '../contexts/InventoryContext';

export default function NewItem({ navigation }) {
  const { adicionarPeca } = useContext(InventoryContext);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [serial, setSerial] = useState('');

  const salvar = () => {
    if (!nome || !categoria) {
      Alert.alert('Erro', 'Preencha o nome e a categoria.');
      return;
    }
    adicionarPeca(nome, categoria, parseInt(quantidade), serial, '');
    Alert.alert('Sucesso', 'Componente registado com sucesso!');
    setNome(''); setCategoria(''); setQuantidade('1'); setSerial('');
    navigation.navigate('Inventário');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome do Componente</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Placa de Vídeo" />

      <Text style={styles.label}>Categoria</Text>
      <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Ex: Sucata / Reparo" />

      <Text style={styles.label}>Quantidade</Text>
      <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />

      <Text style={styles.label}>Número de Série</Text>
      <TextInput style={styles.input} value={serial} onChangeText={setSerial} placeholder="SN-XXXXX" />

      <TouchableOpacity style={styles.btn} onPress={salvar}>
        <Text style={styles.btnText}>Salvar Componente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  btn: { backgroundColor: '#27ae60', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});