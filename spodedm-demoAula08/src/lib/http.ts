// AULA 1 e 2: timeout, classificação de erros e retry com backoff.

export class ErroHttp extends Error {
  status: number;
  constructor(status: number) {
    super(`HTTP ${status}`);
    this.name = 'ErroHttp';
    this.status = status;
  }
}

export type Resposta = {
  status: number;
  ok: boolean;
  headers: Headers;
  texto: string;
  json: <T = any>() => T;
};

// O fetch não tem timeout próprio: AbortController cancela a requisição.
// O timer cobre também a leitura do corpo da resposta.
export async function requisitar(url: string, init: RequestInit = {}, ms = 8000): Promise<Resposta> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const resp = await fetch(url, { ...init, signal: ctrl.signal });
    const texto = await resp.text();
    return {
      status: resp.status,
      ok: resp.ok,
      headers: resp.headers,
      texto,
      json: <T = any>() => (texto ? JSON.parse(texto) : null) as T,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function buscarComTimeout<T = any>(url: string, ms = 8000): Promise<T> {
  const resp = await requisitar(url, {}, ms);
  if (!resp.ok) throw new ErroHttp(resp.status);
  return resp.json<T>();
}

export type Classificacao = { tipo: string; repetivel: boolean; explicacao: string };

// Tabela da aula 1: nem todo erro é igual.
export function classificarErro(e: unknown): Classificacao {
  if (e instanceof ErroHttp) {
    if (e.status === 429) return { tipo: '429', repetivel: true, explicacao: 'Limite de requisições: esperar e tentar de novo' };
    if (e.status >= 500) return { tipo: `${e.status}`, repetivel: true, explicacao: 'Falha no servidor: tentar de novo com cautela' };
    if (e.status === 401) return { tipo: '401', repetivel: false, explicacao: 'Sessão inválida: reautenticar' };
    return { tipo: `${e.status}`, repetivel: false, explicacao: 'Erro no pedido: não repetir' };
  }
  if (e instanceof Error && e.name === 'AbortError') {
    return { tipo: 'Timeout', repetivel: true, explicacao: 'Rede lenta ou travada: tentar de novo com espera crescente' };
  }
  if (e instanceof TypeError) {
    return { tipo: 'Rede', repetivel: true, explicacao: 'Sem rede, DNS ou servidor inacessível' };
  }
  return { tipo: 'Desconhecido', repetivel: false, explicacao: String(e) };
}

export const ehRepetivel = (e: unknown) => classificarErro(e).repetivel;

const esperar = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

type OpcoesRetry = {
  max?: number;
  base?: number;
  teto?: number;
  aoTentar?: (tentativa: number, atrasoMs: number, erro: unknown) => void;
};

// Backoff exponencial com jitter: 0,5 s, 1 s, 2 s, 4 s... até o teto.
export async function comRetry<T>(tarefa: () => Promise<T>, op: OpcoesRetry = {}): Promise<T> {
  const { max = 4, base = 500, teto = 8000, aoTentar } = op;
  for (let i = 0; ; i++) {
    try {
      return await tarefa();
    } catch (e) {
      if (i >= max || !ehRepetivel(e)) throw e;
      const atraso = Math.min(teto, base * 2 ** i) + Math.random() * 300;
      aoTentar?.(i + 1, Math.round(atraso), e);
      await esperar(atraso);
    }
  }
}
