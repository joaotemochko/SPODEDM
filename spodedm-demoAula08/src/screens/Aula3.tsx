// AULA 3 · Sincronização: pull incremental, tombstones, controle de versão e conflitos.
import { useCallback, useEffect, useState } from 'react';
import { AppState, Text, TextInput, View } from 'react-native';
import { getApi } from '../config';
import {
  lerMarcador, lerTarefas, limparLocal, novaTarefaLocal, resolverConflito, salvarTarefas,
  sincronizar, Tarefa,
} from '../lib/sync';
import { useOnline } from '../hooks/useOnline';
import { Botao, Cartao, Etiqueta, Log, cores, hora } from '../components/ui';

export default function Aula3() {
  const online = useOnline();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [marcador, setMarcador] = useState('');
  const [titulo, setTitulo] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback((l: string) => setLog(x => [...x, `${hora()}  ${l}`]), []);

  const recarregar = useCallback(async () => {
    setTarefas(await lerTarefas());
    setMarcador(await lerMarcador());
  }, []);

  const sync = useCallback(async () => {
    try {
      const r = await sincronizar();
      add(`sync: ${r.enviadas} enviada(s), ${r.conflitos} conflito(s), ${r.recebidas} recebida(s)`);
    } catch {
      add('sync falhou (offline?): as alterações continuam pendentes');
    }
    await recarregar();
  }, [add, recarregar]);

  // Gatilhos: abrir a tela, voltar ao app e reconectar.
  useEffect(() => { sync(); }, [sync]);
  useEffect(() => {
    const sub = AppState.addEventListener('change', e => { if (e === 'active') sync(); });
    return () => sub.remove();
  }, [sync]);
  useEffect(() => { if (online) sync(); }, [online, sync]);

  async function alterar(id: string, mudanca: Partial<Tarefa>) {
    const novas = (await lerTarefas()).map(t => (t.id === id ? { ...t, ...mudanca, sincronizado: false } : t));
    await salvarTarefas(novas);
    await recarregar();
  }

  async function criar() {
    if (!titulo.trim()) return;
    await salvarTarefas([...(await lerTarefas()), novaTarefaLocal(titulo.trim())]);
    setTitulo('');
    await recarregar();
    if (online) await sync();
  }

  const visiveis = tarefas.filter(t => !t.excluido);
  const api = getApi();

  return (
    <View>
      <Cartao titulo="Tarefas sincronizadas">
        <Text style={{ color: cores.texto, fontSize: 12, marginBottom: 6 }}>
          marcador (since): {marcador || '(vazio: traz tudo)'}
        </Text>
        {visiveis.map(t => (
          <View key={t.id} style={{ borderTopWidth: 1, borderColor: cores.borda, paddingVertical: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput defaultValue={t.titulo} onEndEditing={e => { if (e.nativeEvent.text !== t.titulo) alterar(t.id, { titulo: e.nativeEvent.text }); }}
                style={{ flex: 1, borderWidth: 1, borderColor: cores.borda, borderRadius: 8, padding: 6, marginRight: 6 }} />
              {t.conflito ? <Etiqueta texto="conflito" cor={cores.vermelho} />
                : t.sincronizado ? <Etiqueta texto="sincronizado" cor={cores.verde} />
                : <Etiqueta texto="pendente" cor={cores.amarelo} />}
            </View>
            <Text style={{ fontSize: 11, color: cores.texto }}>v{t.versao} · id {t.id.slice(0, 14)}</Text>
            {t.conflito ? (
              <View>
                <Text style={{ color: cores.vermelho, marginTop: 4 }}>Servidor tem: “{t.conflito.titulo}” (v{t.conflito.versao})</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Botao titulo="Manter a minha" onPress={async () => { await resolverConflito(t.id, 'minha'); await sync(); }} />
                  <Botao titulo="Usar a do servidor" onPress={async () => { await resolverConflito(t.id, 'servidor'); await recarregar(); }} secundario />
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row' }}>
                <Botao titulo="Excluir" onPress={() => alterar(t.id, { excluido: true })} secundario />
              </View>
            )}
          </View>
        ))}
        {!visiveis.length && <Text style={{ color: cores.texto }}>Nenhuma tarefa. Toque em “Sincronizar”.</Text>}
      </Cartao>

      <Cartao titulo="Ações">
        <TextInput value={titulo} onChangeText={setTitulo} placeholder="Nova tarefa (criada localmente)"
          style={{ borderWidth: 1, borderColor: cores.borda, borderRadius: 8, padding: 8 }} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Botao titulo="Criar" onPress={criar} />
          <Botao titulo="Sincronizar" onPress={sync} secundario />
          <Botao titulo="Limpar local" onPress={async () => { await limparLocal(); await recarregar(); add('banco local limpo'); }} secundario />
        </View>
        <Log linhas={log} />
      </Cartao>

      <Cartao titulo="Roteiro para provocar conflito e exclusão">
        <Text style={{ fontFamily: 'monospace', fontSize: 11, color: cores.tinta }}>
          {`1) Ative o modo avião e edite a tarefa 1 no app.\n2) No terminal:\ncurl -X PUT ${api}/tarefas/1 \\\n -H 'Content-Type: application/json' \\\n -d '{"titulo":"Editada no servidor","versao":1}'\n3) Desative o modo avião: aparece o conflito.\n\nExclusão no servidor:\ncurl -X DELETE ${api}/tarefas/2\nToque em Sincronizar: a tarefa some (tombstone).`}
        </Text>
      </Cartao>
    </View>
  );
}
