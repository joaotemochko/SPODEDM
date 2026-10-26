// AULA 2: fila de operações pendentes (outbox), persistida no aparelho.
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Operacao = { id: string; tipo: 'criar-tarefa'; dados: { titulo: string } };

const CHAVE = 'fila';

export async function lerFila(): Promise<Operacao[]> {
  const texto = await AsyncStorage.getItem(CHAVE);
  return texto ? (JSON.parse(texto) as Operacao[]) : [];
}

const salvarFila = (f: Operacao[]) => AsyncStorage.setItem(CHAVE, JSON.stringify(f));

export async function enfileirar(op: Operacao) {
  const fila = await lerFila();
  fila.push(op);
  await salvarFila(fila);
}

// Para no primeiro erro para manter a ordem; só sai da fila o que o servidor confirmou.
export async function processarFila(enviar: (op: Operacao) => Promise<void>) {
  const fila = await lerFila();
  let i = 0;
  for (; i < fila.length; i++) {
    try {
      await enviar(fila[i]);
    } catch {
      break;
    }
  }
  await salvarFila(fila.slice(i));
  return { enviadas: i, restantes: fila.length - i };
}
