import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

export default function Home() {
  const [tarefas, setTarefas] = useState([]); // Array vazio inicialmente
  const [novaTarefa, setNovaTarefa] = useState('');

  function adicionarTarefa() {
    if (novaTarefa === '') return;
    // Adiciona a nova tarefa criando um objeto com id único
    setTarefas([...tarefas, { id: String(Date.now()), texto: novaTarefa }]);
    setNovaTarefa(''); // Limpa o input
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minhas Tarefas</Text>
      
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="O que preciso fazer?" 
          value={novaTarefa} 
          onChangeText={setNovaTarefa} 
        />
        <TouchableOpacity style={styles.botao} onPress={adicionarTarefa}>
          <Text style={styles.textoBotao}>+</Text>
        </TouchableOpacity>
      </View>
        <FlatList
            data={tarefas}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
            <View style={styles.tarefaItem}>
                <Text style={styles.tarefaTexto}>{item.texto}</Text>
                <TouchableOpacity onPress={() => removerTarefa(item.id)}>
                <Text style={styles.botaoRemover}>X</Text>
                </TouchableOpacity>
            </View>
            )}
        />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#121214' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  form: { flexDirection: 'row', marginBottom: 24 },
  input: { flex: 1, backgroundColor: '#202024', color: '#FFF', padding: 16, borderRadius: 8 },
  botao: { backgroundColor: '#22C55E', padding: 16, borderRadius: 8, marginLeft: 12 },
  tarefaItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#202024', borderRadius: 8, marginBottom: 12 }
});