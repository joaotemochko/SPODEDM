// AULA 1 · Conectividade não persistente
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { getApi } from '../config';
import { buscarComTimeout, classificarErro } from '../lib/http';
import { Botao, Cartao, Linha, Log, cores, hora } from '../components/ui';

export default function Aula1() {
  const rede = useNetInfo();
  const [log, setLog] = useState<string[]>([]);
  const add = (l: string) => setLog(x => [...x, `${hora()}  ${l}`]);

  async function testar(rotulo: string, caminho: string, ms = 8000) {
    add(`→ ${rotulo}`);
    const inicio = Date.now();
    try {
      await buscarComTimeout(`${getApi()}${caminho}`, ms);
      add(`✓ ok em ${Date.now() - inicio} ms`);
    } catch (e) {
      const c = classificarErro(e);
      add(`✗ ${c.tipo} (${c.repetivel ? 'repetir' : 'não repetir'}) em ${Date.now() - inicio} ms`);
      add(`  ${c.explicacao}`);
    }
  }

  const detalhes: any = rede.details ?? {};
  const alcancavel = rede.isInternetReachable;

  return (
    <View>
      <Cartao titulo="Estado da rede (NetInfo)">
        <Linha rotulo="type" valor={String(rede.type)} />
        <Linha rotulo="isConnected" valor={String(rede.isConnected)} />
        <Linha rotulo="isInternetReachable" valor={String(alcancavel)}
          cor={alcancavel === false ? cores.vermelho : undefined} />
        <Linha rotulo="cellularGeneration" valor={String(detalhes.cellularGeneration ?? '-')} />
        <Linha rotulo="isConnectionExpensive" valor={String(detalhes.isConnectionExpensive ?? '-')} />
        <Text style={{ color: cores.texto, marginTop: 6, fontSize: 12 }}>
          Ligue o modo avião ou use um Wi-Fi sem saída e observe isConnected × isInternetReachable.
        </Text>
      </Cartao>

      <Cartao titulo="Requisições e classificação de erros">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Botao titulo="Servidor OK" onPress={() => testar('GET /health', '/health')} />
          <Botao titulo="Lento: timeout 3 s" onPress={() => testar('GET /lento?ms=10000 (timeout 3 s)', '/lento?ms=10000', 3000)} />
          <Botao titulo="404" onPress={() => testar('GET /erro/404', '/erro/404')} secundario />
          <Botao titulo="429" onPress={() => testar('GET /erro/429', '/erro/429')} secundario />
          <Botao titulo="503" onPress={() => testar('GET /erro/503', '/erro/503')} secundario />
        </View>
        <Log linhas={log} />
      </Cartao>
    </View>
  );
}
