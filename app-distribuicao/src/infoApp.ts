import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';

export type Linha = { rotulo: string; valor: string };

function ondeEstaRodando(): string {
  switch (Constants.executionEnvironment) {
    case ExecutionEnvironment.StoreClient:
      return 'Expo Go';
    case ExecutionEnvironment.Standalone:
      return 'Build próprio (preview ou produção)';
    default:
      return 'Development build';
  }
}

/** Reúne os dados que mudam de acordo com o caminho de distribuição usado. */
export function coletarInfo(): Linha[] {
  return [
    { rotulo: 'Plataforma', valor: `${Platform.OS} ${Platform.Version}` },
    { rotulo: 'Rodando em', valor: ondeEstaRodando() },
    { rotulo: 'ID do app', valor: Application.applicationId ?? '—' },
    { rotulo: 'Versão (app.json)', valor: Constants.expoConfig?.version ?? '—' },
    { rotulo: 'Versão instalada', valor: Application.nativeApplicationVersion ?? '—' },
    { rotulo: 'Build (buildNumber / versionCode)', valor: Application.nativeBuildVersion ?? '—' },
    { rotulo: 'Canal do EAS Update', valor: Updates.channel ?? 'nenhum' },
    { rotulo: 'runtimeVersion', valor: Updates.runtimeVersion ?? 'nenhuma' },
    { rotulo: 'Código em execução', valor: Updates.isEmbeddedLaunch ? 'Embutido no app' : 'Update OTA' },
    { rotulo: 'ID do update', valor: Updates.updateId ?? '—' },
    { rotulo: 'Ambiente (.env)', valor: process.env.EXPO_PUBLIC_APP_ENV ?? 'não definido' },
    { rotulo: 'API (.env)', valor: process.env.EXPO_PUBLIC_API_URL ?? 'não definida' },
  ];
}
