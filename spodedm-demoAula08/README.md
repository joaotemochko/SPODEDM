# SPODEDM · App de demonstração (Expo SDK 57)

Projeto para mostrar em sala os conceitos das 4 aulas: conectividade não persistente,
resiliência e dados offline, sincronização e consumo de dados.

- Expo SDK **57** · React Native **0.86** · React **19.2** · TypeScript
- Bibliotecas: `@react-native-community/netinfo`, `@react-native-async-storage/async-storage`,
  `expo-crypto`, `expo-build-properties`, `react-native-safe-area-context`

## 1. Subir o servidor de testes (no computador)

```bash
cd servidor
npm install
node servidor.js                       # servidor normal
FALHA=0.3 ATRASO=800 node servidor.js  # 30% de erros 503 e 800 ms de atraso
COMPRIMIR=1 node servidor.js           # liga gzip (aula 4)
```

No Windows (PowerShell): `$env:FALHA=0.3; $env:ATRASO=800; node servidor.js`.

## 2. Rodar o app

```bash
npm install
npx expo start
```

Na parte de cima do app há um campo com o endereço do servidor:

| Onde o app roda | Endereço |
|---|---|
| Emulador Android | `http://10.0.2.2:3000` (padrão) |
| Simulador iOS | `http://localhost:3000` (padrão) |
| Aparelho físico | `http://IP-DO-COMPUTADOR:3000` (mesma rede Wi-Fi) |

Se o aparelho não alcançar o servidor, confira o firewall do computador (porta 3000) e se ambos
estão na mesma rede. Também é possível definir `EXPO_PUBLIC_API_URL` antes de `npx expo start`.

### Expo Go ou development build

- A versão do Expo Go nas lojas pode não corresponder ao SDK 57. Se o aplicativo não abrir no Expo Go,
  use um development build: `npx expo run:android` (ou `npx expo run:ios` no macOS).
- O app usa HTTP sem TLS para falar com o servidor local: `app.json` libera isso
  (`usesCleartextTraffic` no Android e `NSAllowsArbitraryLoads` no iOS). **Remova isso em produção.**
- O Expo já lançou versões mais novas (SDK 58). Para atualizar: `npx expo install expo@^58.0.0 --fix`
  e consulte o guia de migração oficial.

## 3. Roteiro de demonstração

| Aula | Arquivo | O que mostrar |
|---|---|---|
| 1 | `src/screens/Aula1.tsx`, `src/hooks/useOnline.ts` | Ligue o modo avião: o banner vermelho aparece e `isConnected`/`isInternetReachable` mudam. Toque em "Lento: timeout 3 s", "404", "429", "503" e compare a classificação do erro. |
| 2 | `src/screens/Aula2.tsx`, `src/lib/cache.ts`, `fila.ts`, `http.ts` | Abra a lista, ative o modo avião e reabra: aparece o cache. Crie 3 tarefas offline (ficam "pendentes"), desligue o modo avião e veja a fila esvaziar. Com `FALHA=0.3` o log mostra o backoff. |
| 3 | `src/screens/Aula3.tsx`, `src/lib/sync.ts` | Siga o roteiro do próprio cartão: provoque um conflito (409) e uma exclusão no servidor com `curl`, depois sincronize. |
| 4 | `src/screens/Aula4.tsx`, `src/lib/dados.ts` | Meça "Completo" × "Só campos"; toque 2x em ETag (200 e depois 304); carregue páginas; alterne "Baixar apenas no Wi-Fi". Para ver o ganho do gzip: `curl -s -o /dev/null -w "%{size_download}" -H "Accept-Encoding: gzip" http://localhost:3000/produtos` com e sem `COMPRIMIR=1`. |

Valores medidos no servidor de testes (200 produtos): completo ≈ 154 KB, só `?campos=id,nome,preco` ≈ 8,5 KB,
com gzip ≈ 3,5 KB.

## 4. Estrutura

```
App.tsx                 abas, endereço do servidor e banner offline
src/config.ts           endereço da API (persistido)
src/lib/http.ts         timeout, classificação de erros, retry com backoff
src/lib/cache.ts        cache com data e hora
src/lib/fila.ts         fila de pendências (outbox)
src/lib/sync.ts         pull incremental, push, tombstones, conflitos
src/lib/dados.ts        medição, ETag, paginação, podeBaixar
src/screens/Aula1..4    uma tela por aula
servidor/servidor.js    servidor de testes (Express)
```
