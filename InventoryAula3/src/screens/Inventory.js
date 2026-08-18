import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { InventoryContext } from '../contexts/InventoryContext';

export default function Inventory() {
  const { pecas, removerPeca } = useContext(InventoryContext);
  const [busca, setBusca] = useState('');

  const pecasFiltradas = pecas.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar componente..."
        value={busca}
        onChangeText={setBusca}
      />
      <FlatList
        data={pecasFiltradas}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.categoria}>{item.categoria} - Qtd: {item.quantidade}</Text>
              <Text style={styles.serial}>Serial: {item.serial}</Text>
            </View>
            <TouchableOpacity style={styles.btnDelete} onPress={() => removerPeca(item.id)}>
              <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  item: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  nome: { fontSize: 18, fontWeight: 'bold' },
  categoria: { color: '#666', marginTop: 4 },
  serial: { color: '#999', fontSize: 12, marginTop: 4 },
  btnDelete: { backgroundColor: '#e74c3c', padding: 8, borderRadius: 5 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});