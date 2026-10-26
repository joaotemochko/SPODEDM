import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { carregarApi, definirApi, getApi } from './src/config';
import { BannerOffline, Botao, cores } from './src/components/ui';
import Aula1 from './src/screens/Aula1';
import Aula2 from './src/screens/Aula2';
import Aula3 from './src/screens/Aula3';
import Aula4 from './src/screens/Aula4';

const ABAS = [
  { chave: 'a1', rotulo: 'Aula 1', sub: 'Conexão', Tela: Aula1 },
  { chave: 'a2', rotulo: 'Aula 2', sub: 'Offline', Tela: Aula2 },
  { chave: 'a3', rotulo: 'Aula 3', sub: 'Sync', Tela: Aula3 },
  { chave: 'a4', rotulo: 'Aula 4', sub: 'Dados', Tela: Aula4 },
];

export default function App() {
  const [aba, setAba] = useState('a1');
  const [pronto, setPronto] = useState(false);
  const [url, setUrl] = useState(getApi());

  useEffect(() => { carregarApi().then(u => { setUrl(u); setPronto(true); }); }, []);

  const Tela = ABAS.find(a => a.chave === aba)!.Tela;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.raiz} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <BannerOffline />
        <View style={s.servidor}>
          <TextInput value={url} onChangeText={setUrl} autoCapitalize="none" autoCorrect={false}
            style={s.entrada} placeholder="http://IP-DO-COMPUTADOR:3000" />
          <Botao titulo="Usar" onPress={() => definirApi(url)} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 12 }} keyboardShouldPersistTaps="handled">
          {pronto ? <Tela key={`${aba}-${getApi()}`} /> : null}
        </ScrollView>
        <View style={s.abas}>
          {ABAS.map(a => (
            <Pressable key={a.chave} onPress={() => setAba(a.chave)} style={s.aba}>
              <Text style={[s.abaTxt, aba === a.chave && s.abaAtiva]}>{a.rotulo}</Text>
              <Text style={[s.abaSub, aba === a.chave && s.abaAtiva]}>{a.sub}</Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#F8FAFC' },
  servidor: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 6 },
  entrada: { flex: 1, borderWidth: 1, borderColor: cores.borda, borderRadius: 8, padding: 8, backgroundColor: '#fff', marginTop: 8 },
  abas: { flexDirection: 'row', borderTopWidth: 1, borderColor: cores.borda, backgroundColor: '#fff' },
  aba: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  abaTxt: { fontWeight: '700', color: '#64748B' },
  abaSub: { fontSize: 11, color: '#64748B' },
  abaAtiva: { color: cores.verde },
});
