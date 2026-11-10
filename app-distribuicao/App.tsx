import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';

import { coletarInfo } from './src/infoApp';
import { COR_DESTAQUE, MENSAGEM } from './src/mensagem';

export default function App() {
  const [status, setStatus] = useState('');
  const linhas = coletarInfo();

  async function verificarAtualizacao() {
    if (!Updates.isEnabled) {
      setStatus('Atualizações OTA desativadas: Expo Go ou EAS Update ainda não configurado.');
      return;
    }
    try {
      setStatus('Procurando atualização...');
      const resultado = await Updates.checkForUpdateAsync();
      if (!resultado.isAvailable) {
        setStatus('Você já está na versão mais recente.');
        return;
      }
      setStatus('Baixando atualização...');
      await Updates.fetchUpdateAsync();
      setStatus('Atualização baixada. Reiniciando...');
      await Updates.reloadAsync();
    } catch (e) {
      setStatus('Erro: ' + (e instanceof Error ? e.message : String(e)));
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.conteudo} style={styles.tela}>
      <Text style={styles.titulo}>App Distribuição</Text>

      <View style={[styles.mensagem, { borderColor: COR_DESTAQUE }]}>
        <Text style={[styles.mensagemTexto, { color: COR_DESTAQUE }]}>{MENSAGEM}</Text>
      </View>

      <View style={styles.cartao}>
        {linhas.map((l) => (
          <View key={l.rotulo} style={styles.linha}>
            <Text style={styles.rotulo}>{l.rotulo}</Text>
            <Text style={styles.valor}>{l.valor}</Text>
          </View>
        ))}
      </View>

      <Pressable style={[styles.botao, { backgroundColor: COR_DESTAQUE }]} onPress={verificarAtualizacao}>
        <Text style={styles.botaoTexto}>Verificar atualização (EAS Update)</Text>
      </Pressable>
      {status !== '' && <Text style={styles.status}>{status}</Text>}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#fff' },
  conteudo: { paddingHorizontal: 20, paddingTop: 64, paddingBottom: 40 },
  titulo: { fontSize: 26, fontWeight: '700', marginBottom: 16 },
  mensagem: { borderWidth: 2, borderRadius: 10, padding: 14, marginBottom: 16 },
  mensagemTexto: { fontSize: 17, fontWeight: '600' },
  cartao: { backgroundColor: '#f2f2f2', borderRadius: 10, padding: 12, marginBottom: 16 },
  linha: { paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#cfcfcf' },
  rotulo: { fontSize: 12, color: '#666' },
  valor: { fontSize: 15, color: '#111' },
  botao: { borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  status: { marginTop: 12, fontSize: 14, color: '#333' },
});
