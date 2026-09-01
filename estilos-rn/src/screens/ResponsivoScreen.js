import React from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import AppText from '../components/AppText';
import Badge from '../components/Badge';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';

const ITENS = ['Perfil', 'Notas', 'Turmas', 'Agenda', 'Ajustes', 'Sair'];

/**
 * Responsividade em mobile nao e so celular vs tablet: e retrato vs
 * paisagem, fonte do sistema aumentada, teclado aberto e tela dobravel.
 *
 * useWindowDimensions e reativo (re-renderiza na rotacao).
 * Dimensions.get('window') e um snapshot -- nao use para layout.
 */
export default function ResponsivoScreen() {
  const { colors, spacing, radius } = useTheme();
  const { width, height } = useWindowDimensions();

  const paisagem = width > height;
  const breakpoint = width < 480 ? 'compacto' : width < 900 ? 'medio' : 'expandido';
  const colunas = breakpoint === 'compacto' ? 2 : breakpoint === 'medio' ? 3 : 4;

  // Largura do item calculada a partir das colunas e do gap.
  const gap = spacing.sm;
  // 32 = padding horizontal da Screen (16 de cada lado) + 32 do padding do Card
  const larguraDisponivel = width - spacing.md * 2 - spacing.md * 2;
  const larguraItem = (larguraDisponivel - gap * (colunas - 1)) / colunas;

  return (
    <>
      <Card title="Estado atual da janela" subtitle="reativo">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <Badge label={`${Math.round(width)} x ${Math.round(height)} dp`} tone="neutral" />
          <Badge label={paisagem ? 'paisagem' : 'retrato'} tone="primary" />
          <Badge label={breakpoint} tone="success" />
          <Badge label={Platform.OS} tone="warning" />
        </View>
        <AppText variant="caption" tone="muted">
          Gire o aparelho (ou redimensione a janela no Expo Web): os valores e
          o numero de colunas abaixo mudam sozinhos.
        </AppText>
      </Card>

      <Card title={`Grade adaptativa (${colunas} colunas)`} subtitle="flexWrap + calculo">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
          {ITENS.map((item, i) => (
            <View
              key={item}
              style={{
                width: larguraItem,
                height: 76,
                borderRadius: radius.md,
                backgroundColor: i % 2 === 0 ? colors.surfaceAlt : colors.primary + '18',
                alignItems: 'center',
                justifyContent: 'center',
                padding: spacing.xs,
              }}
            >
              <AppText variant="caption" numberOfLines={1}>
                {item}
              </AppText>
            </View>
          ))}
        </View>
        <AppText variant="caption" tone="muted">
          Alternativa sem calculo: flexBasis com percentual. O calculo explicito
          e preferivel quando existe gap, porque percentual + gap estoura a linha.
        </AppText>
      </Card>

      <Card title="Platform.select" subtitle="uma api, dois sistemas">
        <View
          style={[
            {
              padding: spacing.md,
              borderRadius: radius.md,
              backgroundColor: colors.surfaceAlt,
            },
            Platform.select({
              ios: { borderLeftWidth: 0, borderTopWidth: 3, borderTopColor: colors.primary },
              android: { borderTopWidth: 0, borderBottomWidth: 3, borderBottomColor: colors.success },
              default: { borderWidth: 1, borderColor: colors.border },
            }),
          ]}
        >
          <AppText variant="body">
            Este bloco tem decoracao diferente em cada plataforma.
          </AppText>
          <AppText variant="caption" tone="muted">
            Platform.select devolve o valor do SO atual em tempo de execucao.
            Para divergencias grandes prefira Componente.ios.js / .android.js.
          </AppText>
        </View>
      </Card>

      <Card title="Direcao do layout" subtitle="proporcao da tela">
        <View
          style={{
            // O layout inteiro muda de eixo conforme a orientacao.
            flexDirection: paisagem ? 'row' : 'column',
            gap: spacing.sm,
          }}
        >
          <View
            style={{
              flex: paisagem ? 2 : undefined,
              height: 72,
              borderRadius: radius.md,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              paddingHorizontal: spacing.md,
            }}
          >
            <AppText variant="subtitle" style={{ color: '#FFF' }}>
              Conteudo principal
            </AppText>
          </View>
          <View
            style={{
              flex: paisagem ? 1 : undefined,
              height: 72,
              borderRadius: radius.md,
              backgroundColor: colors.surfaceAlt,
              justifyContent: 'center',
              paddingHorizontal: spacing.md,
            }}
          >
            <AppText variant="subtitle" tone="muted">
              Painel lateral
            </AppText>
          </View>
        </View>
      </Card>
    </>
  );
}
