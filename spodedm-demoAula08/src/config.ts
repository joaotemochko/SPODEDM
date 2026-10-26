import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = 'servidor-url';

// Emulador Android enxerga o computador em 10.0.2.2. Em aparelho físico,
// informe o IP do computador na tela do app (ex.: http://192.168.0.10:3000).
export const URL_PADRAO =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');

let urlAtual = URL_PADRAO;

export const getApi = () => urlAtual;

export async function carregarApi(): Promise<string> {
  const salvo = await AsyncStorage.getItem(CHAVE);
  if (salvo) urlAtual = salvo;
  return urlAtual;
}

export async function definirApi(url: string): Promise<void> {
  urlAtual = url.trim().replace(/\/$/, '');
  await AsyncStorage.setItem(CHAVE, urlAtual);
}
