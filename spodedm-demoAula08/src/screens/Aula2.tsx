// AULA 2 · Resiliência e dados offline: cache primeiro, retry com backoff e fila de pendências.
import { useCallback, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import * as Crypto from 'expo-crypto';
import { getApi } from '../config';
import { idadeEmMinutos, lerCache, salvarCache } from '../lib/cache';
import { enfileirar, lerFila, Operacao, processarFila } from '../lib/fila';
import { buscarComTimeout, comRetry, ErroHttp, requisitar } from '../lib/http';
import { useOnline } from '../hooks/useOnline';
import { Botao, Cartao, Etiqueta, Log, cores, hora } from '../components/ui';

type Tarefa = { id: string; titulo: string };

export default function Aula2() {
  const online = useOnline();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [pendentes, setPendentes] = useState<Operacao[]>([]);
  const [status, setStatus] = useState('');
  const [titulo, setTitulo] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback((l: string) => setLog(x => [...x, `${hora()}  ${l}`]), []);

  // 1. mostra o cache; 2. atualiza com a rede (com retry); 3. cai no cache se falhar.
  const carregar = useCallback(async () => {
    const cache = await lerCache<Tarefa[]>('tarefas');
    if (cache) {
      setTarefas(cache.dados);
      setStatus(`cache de ${idadeEmMinutos(cache)} min atrás`);
    }
    try {
      const resp = await comRetry(
        () => buscarComTimeout<{ itens: Tarefa[] }>(`${getApi()}/tarefas`, 4000),
        { aoTentar: (n, ms) => add(`tentativa ${n} falhou; nova em ${ms} ms`) },
      );
      const lista = resp.itens.filter((t: any) => !t.excluido);
      setTarefas(lista);
      await salvarCache('tarefas', lista);
      setStatus('atualizado agora');
    } catch {
      setStatus(cache ? `offline: exibindo cache de ${idadeEmMinutos(cache)} min atrás` : 'erro: sem cache e sem rede');
    }
    setPendentes(await lerFila());
  }, [add]);

  const enviar = async (op: Operacao) => {
    const r = await requisitar(`${getApi()}/tarefas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': op.id },
      body: JSON.stringify(op.dados),
    }, 4000);
    if (!r.ok) throw new ErroHttp(r.status);
  };

  const esvaziar = useCallback(async () => {
    const { enviadas, restantes } = await processarFila(enviar);
    if (enviadas || restantes) add(`fila: ${enviadas} enviada(s), ${restantes} pendente(s)`);
    await carregar();
  }, [add, carregar]);

  async function criar() {
    if (!titulo.trim()) return;
    await enfileirar({ id: Crypto.randomUUID(), tipo: 'criar-tarefa', dados: { titulo: titulo.trim() } });
    setTitulo('');
    setPendentes(await lerFila());
    add('tarefa guardada na fila (a interface não espera a rede)');
    if (online) await esvaziar();
  }

  useEffect(() => { carregar(); }, [carregar]);
  // Quando a rede volta, esvazia a fila.
  useEffect(() => { if (online) esvaziar(); }, [online, esvaziar]);

  return (
    <View>
      <Cartao titulo="Tarefas (cache primeiro)">
        <Text style={{ color: cores.texto, marginBottom: 6 }}>{status}</Text>
        {tarefas.map(t => <Text key={t.id} style={{ paddingVertical: 2, color: cores.tinta }}>• {t.titulo}</Text>)}
        {pendentes.map(p => (
          <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 2 }}>
            <Text style={{ color: cores.tinta, marginRight: 6 }}>• {p.dados.titulo}</Text>
            <Etiqueta texto="pendente" cor={cores.amarelo} />
          </View>
        ))}
        <Botao titulo="Atualizar" onPress={carregar} secundario />
      </Cartao>

      <Cartao titulo="Nova tarefa (vai para a fila de pendências)">
        <TextInput value={titulo} onChangeText={setTitulo} placeholder="Título da tarefa"
          style={{ borderWidth: 1, borderColor: cores.borda, borderRadius: 8, padding: 8 }} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Botao titulo="Criar" onPress={criar} />
          <Botao titulo={`Enviar fila (${pendentes.length})`} onPress={esvaziar} secundario />
        </View>
        <Text style={{ color: cores.texto, fontSize: 12, marginTop: 6 }}>
          Teste: modo avião → crie 3 tarefas → desligue o modo avião. Suba o servidor com FALHA=0.3 para ver retry e idempotência.
        </Text>
        <Log linhas={log} />
      </Cartao>
    </View>
  );
}
