import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useOnline } from '../hooks/useOnline';

export const cores = {
  verde: '#309830', tinta: '#212121', texto: '#434343', cinza: '#EEEEEE',
  borda: '#E2E8F0', vermelho: '#B00020', amarelo: '#8A6D00', azul: '#0050A0',
};

export function Botao({ titulo, onPress, desabilitado, secundario }:
  { titulo: string; onPress: () => void; desabilitado?: boolean; secundario?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={desabilitado}
      style={[s.botao, secundario && s.botaoSec, desabilitado && { opacity: 0.4 }]}>
      <Text style={[s.botaoTxt, secundario && { color: cores.verde }]}>{titulo}</Text>
    </Pressable>
  );
}

export function Cartao({ titulo, children }: { titulo?: string; children: ReactNode }) {
  return (
    <View style={s.cartao}>
      {titulo ? <Text style={s.cartaoTitulo}>{titulo}</Text> : null}
      {children}
    </View>
  );
}

export function Linha({ rotulo, valor, cor }: { rotulo: string; valor: string; cor?: string }) {
  return (
    <View style={s.linha}>
      <Text style={s.rotulo}>{rotulo}</Text>
      <Text style={[s.valor, cor ? { color: cor } : null]}>{valor}</Text>
    </View>
  );
}

export function Etiqueta({ texto, cor }: { texto: string; cor: string }) {
  return <Text style={[s.etiqueta, { color: cor, borderColor: cor }]}>{texto}</Text>;
}

export function Log({ linhas }: { linhas: string[] }) {
  if (!linhas.length) return null;
  return (
    <View style={s.log}>
      {linhas.slice(-8).map((l, i) => <Text key={i} style={s.logTxt}>{l}</Text>)}
    </View>
  );
}

// AULA 1: banner de offline (retorna null quando há internet).
export function BannerOffline() {
  const online = useOnline();
  if (online) return null;
  return (
    <View style={s.banner}>
      <Text style={s.bannerTxt}>Você está offline. Exibindo dados salvos.</Text>
    </View>
  );
}

export const hora = () => new Date().toLocaleTimeString('pt-BR');

const s = StyleSheet.create({
  botao: { backgroundColor: cores.verde, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginRight: 8, marginTop: 8 },
  botaoSec: { backgroundColor: '#fff', borderWidth: 1, borderColor: cores.verde },
  botaoTxt: { color: '#fff', fontWeight: '600' },
  cartao: { backgroundColor: '#fff', borderWidth: 1, borderColor: cores.borda, borderRadius: 12, padding: 14, marginBottom: 12 },
  cartaoTitulo: { fontSize: 16, fontWeight: '700', color: cores.tinta, marginBottom: 6 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  rotulo: { color: cores.texto },
  valor: { color: cores.tinta, fontWeight: '600', fontFamily: 'monospace' },
  etiqueta: { fontSize: 11, borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1, overflow: 'hidden' },
  log: { backgroundColor: cores.cinza, borderRadius: 8, padding: 8, marginTop: 8 },
  logTxt: { fontFamily: 'monospace', fontSize: 11, color: cores.tinta },
  banner: { backgroundColor: cores.vermelho, padding: 8 },
  bannerTxt: { color: '#fff', textAlign: 'center' },
});
