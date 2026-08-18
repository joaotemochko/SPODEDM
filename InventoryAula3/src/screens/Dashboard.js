import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InventoryContext } from '../contexts/InventoryContext';

export default function Dashboard() {
  const { pecas } = useContext(InventoryContext);

  const totalPecas = pecas.length;
  const totalItens = pecas.reduce((acc, curr) => acc + curr.quantidade, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Inventário</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Registos Diferentes:</Text>
        <Text style={styles.value}>{totalPecas}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Total de Componentes:</Text>
        <Text style={styles.value}>{totalItens}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 15, elevation: 3 },
  label: { fontSize: 16, color: '#666' },
  value: { fontSize: 32, fontWeight: 'bold', color: '#2980b9', marginTop: 5 }
});