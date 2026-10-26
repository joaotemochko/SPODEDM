// AULA 4: medir, ETag, paginação e adaptação à conexão.
import NetInfo from '@react-native-community/netinfo';
import { getApi } from '../config';
import { lerCache, salvarCache } from './cache';
import { buscarComTimeout, ErroHttp, requisitar } from './http';

export type Medicao = { rotulo: string; status: number; caracteres: number; ms: number };

export async function medir(rotulo: string, caminho: string): Promise<Medicao> {
  const inicio = Date.now();
  const r = await requisitar(`${getApi()}${caminho}`);
  return { rotulo, status: r.status, caracteres: r.texto.length, ms: Date.now() - inicio };
}

export type Produto = { id: number; nome: string; preco: number };

export async function buscarPagina(pagina: number, limite = 20) {
  const url = `${getApi()}/produtos?pagina=${pagina}&limite=${limite}&campos=id,nome,preco`;
  return buscarComTimeout<{ itens: Produto[] }>(url);
}

// Cache HTTP manual: envia If-None-Match e reaproveita o cache em caso de 304.
export async function buscarComEtag(caminho: string) {
  const url = `${getApi()}${caminho}`;
  const cache = await lerCache<unknown>(url);
  const headers: Record<string, string> = cache?.etag ? { 'If-None-Match': cache.etag } : {};
  const inicio = Date.now();
  const r = await requisitar(url, { headers });
  const ms = Date.now() - inicio;
  if (r.status === 304 && cache) return { dados: cache.dados, status: 304, caracteres: 0, ms };
  if (!r.ok) throw new ErroHttp(r.status);
  const dados = r.json();
  await salvarCache(url, dados, { etag: r.headers.get('ETag') });
  return { dados, status: r.status, caracteres: r.texto.length, ms };
}

// Downloads grandes: só no Wi-Fi sem franquia, se o usuário pedir.
export async function podeBaixar(apenasWifi: boolean): Promise<{ pode: boolean; motivo: string }> {
  const e = await NetInfo.fetch();
  if (!e.isConnected) return { pode: false, motivo: 'sem conexão' };
  if (!apenasWifi) return { pode: true, motivo: 'qualquer rede permitida' };
  const caro = e.details && 'isConnectionExpensive' in e.details ? e.details.isConnectionExpensive : false;
  if (e.type === 'wifi' && !caro) return { pode: true, motivo: 'Wi-Fi sem franquia' };
  return { pode: false, motivo: e.type === 'wifi' ? 'Wi-Fi tarifado' : `rede ${e.type}` };
}
