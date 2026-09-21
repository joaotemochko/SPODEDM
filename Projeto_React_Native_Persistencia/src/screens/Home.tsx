import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

type Transaction = { id: number; description: string; amount: number; date: string };

export function Home() {
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  async function loadTransactions() {
    const result = await db.getAllAsync<Transaction>('SELECT * FROM transactions ORDER BY id DESC');
    setTransactions(result);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  async function addTransaction() {
    if (!description || !amount) return;
    
    await db.runAsync(
      'INSERT INTO transactions (description, amount, date) VALUES (?, ?, ?)',
      description,
      parseFloat(amount),
      new Date().toISOString()
    );
    
    setDescription('');
    setAmount('');
    loadTransactions(); 
  }

  async function deleteTransaction(id: number) {
    await db.runAsync('DELETE FROM transactions WHERE id = ?', id);
    loadTransactions();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Despesas (SQLite)</Text>
      
      <View style={styles.form}>
        <TextInput style={[styles.input, { flex: 2 }]} placeholder="Descrição" value={description} onChangeText={setDescription} />
        <TextInput style={[styles.input, { flex: 1, marginLeft: 10 }]} placeholder="Valor" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      </View>
      <Button title="Adicionar Gasto" onPress={addTransaction} />

      <FlatList
        data={transactions}
        keyExtractor={item => String(item.id)}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={{ fontWeight: 'bold' }}>{item.description}</Text>
              <Text style={{ fontSize: 12, color: 'gray' }}>{new Date(item.date).toLocaleDateString('pt-BR')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 15, color: 'red' }}>R$ {item.amount.toFixed(2)}</Text>
              <Button title="X" color="red" onPress={() => deleteTransaction(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f9f9f9' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  form: { flexDirection: 'row', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, backgroundColor: '#fff' },
  card: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 5, elevation: 1 }
});
