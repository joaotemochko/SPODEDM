// AULA 2: cache local com carimbo de data e hora.
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RegistroCache<T> = { dados: T; salvoEm: number; etag?: string | null };

export async function salvarCache<T>(chave: string, dados: T, extra: { etag?: string | null } = {}) {
  const registro: RegistroCache<T> = { dados, salvoEm: Date.now(), ...extra };
  await AsyncStorage.setItem(chave, JSON.stringify(registro));
}

export async function lerCache<T>(chave: string): Promise<RegistroCache<T> | null> {
  const texto = await AsyncStorage.getItem(chave);
  return texto ? (JSON.parse(texto) as RegistroCache<T>) : null;
}

export const idadeEmMinutos = (r: { salvoEm: number }) => Math.round((Date.now() - r.salvoEm) / 60000);
