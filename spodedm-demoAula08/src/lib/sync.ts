// AULA 3: sincronização incremental, tombstones e controle de versão.
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { getApi } from '../config';
import { buscarComTimeout, comRetry, ErroHttp, requisitar } from './http';

export type Tarefa = {
  id: string;
  titulo: string;
  concluida: boolean;
  versao: number;
  excluido?: boolean;
  sincronizado: boolean; // false = alteração local ainda não enviada
  conflito?: Tarefa; // versão do servidor, quando há conflito
};

type TarefaServidor = Omit<Tarefa, 'sincronizado' | 'conflito'>;

const CHAVE_TAREFAS = 'tarefas-sync';
const CHAVE_MARCADOR = 'ultimo-sync';

export async function lerTarefas(): Promise<Tarefa[]> {
  const t = await AsyncStorage.getItem(CHAVE_TAREFAS);
  return t ? (JSON.parse(t) as Tarefa[]) : [];
}
export const salvarTarefas = (l: Tarefa[]) => AsyncStorage.setItem(CHAVE_TAREFAS, JSON.stringify(l));
export const lerMarcador = async () => (await AsyncStorage.getItem(CHAVE_MARCADOR)) ?? '';
export const limparLocal = () => AsyncStorage.multiRemove([CHAVE_TAREFAS, CHAVE_MARCADOR]);

export function novaTarefaLocal(titulo: string): Tarefa {
  return { id: `local-${Crypto.randomUUID()}`, titulo, concluida: false, versao: 0, sincronizado: false };
}

// Aplica as mudanças vindas do servidor (idempotente: repetir não causa dano).
export function aplicarMudancas(locais: Tarefa[], itens: TarefaServidor[]): Tarefa[] {
  const mapa = new Map(locais.map(t => [t.id, t]));
  for (const item of itens) {
    const atual = mapa.get(item.id);
    if (atual && !atual.sincronizado) {
      mapa.set(item.id, { ...atual, conflito: { ...item, sincronizado: true } }); // não sobrescreve
    } else if (item.excluido) {
      mapa.delete(item.id); // tombstone
    } else {
      mapa.set(item.id, { ...item, sincronizado: true });
    }
  }
  return [...mapa.values()];
}

export async function sincronizarPull(): Promise<number> {
  const marcador = await lerMarcador();
  const url = `${getApi()}/tarefas?since=${encodeURIComponent(marcador)}`;
  const resp = await comRetry(() => buscarComTimeout<{ itens: TarefaServidor[]; agora: string }>(url));
  const novas = aplicarMudancas(await lerTarefas(), resp.itens);
  await salvarTarefas(novas);
  await AsyncStorage.setItem(CHAVE_MARCADOR, resp.agora); // só depois de aplicar
  return resp.itens.length;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// Envia as alterações locais pendentes. Em caso de 409, guarda a versão do servidor.
export async function sincronizarPush(): Promise<{ enviadas: number; conflitos: number }> {
  let locais = await lerTarefas();
  let enviadas = 0;
  let conflitos = 0;
  for (const t of locais) {
    if (t.sincronizado || t.conflito) continue;
    const url = `${getApi()}/tarefas`;
    try {
      if (t.id.startsWith('local-')) {
        if (t.excluido) {
          locais = locais.filter(x => x.id !== t.id); // criada e apagada offline: nada a enviar
          continue;
        }
        const r = await requisitar(url, {
          method: 'POST',
          headers: { ...JSON_HEADERS, 'Idempotency-Key': t.id },
          body: JSON.stringify({ titulo: t.titulo }),
        });
        if (!r.ok) throw new ErroHttp(r.status);
        const criada = r.json<TarefaServidor>();
        locais = locais.map(x => (x.id === t.id ? { ...criada, sincronizado: true } : x));
      } else if (t.excluido) {
        const r = await requisitar(`${url}/${t.id}`, { method: 'DELETE' });
        if (!r.ok && r.status !== 404) throw new ErroHttp(r.status);
        locais = locais.filter(x => x.id !== t.id);
      } else {
        const r = await requisitar(`${url}/${t.id}`, {
          method: 'PUT',
          headers: JSON_HEADERS,
          body: JSON.stringify({ titulo: t.titulo, concluida: t.concluida, versao: t.versao }),
        });
        if (r.status === 409) {
          const servidor = r.json<TarefaServidor>();
          locais = locais.map(x => (x.id === t.id ? { ...x, conflito: { ...servidor, sincronizado: true } } : x));
          conflitos++;
          continue;
        }
        if (!r.ok) throw new ErroHttp(r.status);
        const atual = r.json<TarefaServidor>();
        locais = locais.map(x => (x.id === t.id ? { ...atual, sincronizado: true } : x));
      }
      enviadas++;
    } catch {
      break; // sem rede ou erro: mantém o restante pendente para a próxima vez
    }
  }
  await salvarTarefas(locais);
  return { enviadas, conflitos };
}

export async function sincronizar() {
  const push = await sincronizarPush();
  const recebidas = await sincronizarPull();
  return { ...push, recebidas };
}

// Decisão do usuário diante de um conflito.
export async function resolverConflito(id: string, escolha: 'minha' | 'servidor') {
  const locais = await lerTarefas();
  const novas = locais.map(t => {
    if (t.id !== id || !t.conflito) return t;
    if (escolha === 'servidor') return { ...t.conflito, sincronizado: true };
    return { ...t, versao: t.conflito.versao, conflito: undefined, sincronizado: false }; // reenvia com a versão atual
  });
  await salvarTarefas(novas);
}
