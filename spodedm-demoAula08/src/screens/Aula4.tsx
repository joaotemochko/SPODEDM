// AULA 4 · Consumo de dados: medir, reduzir, paginar, ETag e adaptar à conexão.
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { getApi } from '../config';
import { buscarComEtag, buscarPagina, Medicao, medir, podeBaixar, Produto } from '../lib/dados';
import { Botao, Cartao, Linha, Log, cores, hora } from '../components/ui';

export default function Aula4() {
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [itens, setItens] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [fim, setFim] = useState(false);
  const [apenasWifi, setApenasWifi] = useState(true);
  const [log, setLog] = useState<string[]>([]);
  const add = (l: string) => setLog(x => [...x, `${hora()}  ${l}`]);

  async function rodar(rotulo: string, caminho: string) {
    try {
      const m = await medir(rotulo, caminho);
      setMedicoes(x => [...x, m]);
    } catch { add(`falha ao medir ${rotulo}`); }
  }

  async function carregarMais() {
    if (carregando || fim) return;
    setCarregando(true);
    try {
      const lote = await buscarPagina(pagina);
      setItens(atual => [...atual, ...lote.itens]);
      setPagina(p => p + 1);
      setFim(lote.itens.length < 20);
    } catch { add('falha ao carregar a página'); }
    finally { setCarregando(false); }
  }

  async function etag() {
    try {
      const r = await buscarComEtag('/produtos?campos=id,nome,preco');
      add(`ETag: status ${r.status}, ${r.caracteres} caracteres, ${r.ms} ms${r.status === 304 ? ' (veio do cache)' : ''}`);
    } catch { add('falha na chamada com ETag'); }
  }

  async function baixar() {
    const d = await podeBaixar(apenasWifi);
    add(d.pode ? `download liberado (${d.motivo})` : `download adiado (${d.motivo})`);
    if (d.pode) await rodar('Catálogo completo', '/produtos');
  }

  return (
    <View>
      <Cartao titulo="Medir antes de otimizar">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Botao titulo="Completo" onPress={() => rodar('Completo', '/produtos')} />
          <Botao titulo="Só campos" onPress={() => rodar('Só campos', '/produtos?campos=id,nome,preco')} />
          <Botao titulo="Limpar" onPress={() => setMedicoes([])} secundario />
        </View>
        {medicoes.map((m, i) => (
          <Linha key={i} rotulo={`${m.rotulo} (${m.status})`} valor={`${m.caracteres} car · ${m.ms} ms`} />
        ))}
        <Text style={{ color: cores.texto, fontSize: 12, marginTop: 6 }}>
          Reinicie o servidor com COMPRIMIR=1 e meça os bytes trafegados com curl (no app a descompressão é transparente).
        </Text>
      </Cartao>

      <Cartao titulo="Cache HTTP com ETag">
        <Text style={{ color: cores.texto, marginBottom: 4 }}>Toque duas vezes: 1ª = 200, 2ª = 304 (sem corpo).</Text>
        <Botao titulo="GET com If-None-Match" onPress={etag} />
      </Cartao>

      <Cartao titulo={`Paginação (${itens.length} itens carregados)`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Botao titulo={carregando ? 'Carregando…' : fim ? 'Fim da lista' : 'Carregar mais 20'} onPress={carregarMais} desabilitado={carregando || fim} />
          <Botao titulo="Reiniciar" onPress={() => { setItens([]); setPagina(1); setFim(false); }} secundario />
        </View>
        {itens.slice(-5).map(p => <Text key={p.id} style={{ color: cores.tinta, paddingVertical: 1 }}>#{p.id} {p.nome} · R$ {p.preco}</Text>)}
        <Text style={{ color: cores.texto, fontSize: 12, marginTop: 4 }}>
          Em um app real use FlatList com onEndReached; aqui o botão deixa a demonstração previsível.
        </Text>
      </Cartao>

      <Cartao titulo="Adaptar à conexão">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: cores.tinta }}>Baixar apenas no Wi-Fi</Text>
          <Switch value={apenasWifi} onValueChange={setApenasWifi} trackColor={{ true: cores.verde }} />
        </View>
        <Botao titulo="Baixar catálogo completo" onPress={baixar} />
        <Log linhas={log} />
        <Text style={{ color: cores.texto, fontSize: 11, marginTop: 6 }}>Servidor: {getApi()}</Text>
      </Cartao>
    </View>
  );
}
