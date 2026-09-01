import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeProvider';

/**
 * AREA SEGURA — a versao correta.
 *
 * A primeira versao deste arquivo calculava o inset superior na mao com
 * StatusBar.currentHeight. Funcionava para a barra de cima e quebrava
 * embaixo: no Android moderno o app desenha edge-to-edge, ou seja,
 * ATRAS da barra de navegacao do sistema. Nao existe API no core do
 * React Native que informe a altura dessa barra.
 *
 * useSafeAreaInsets() devolve os quatro lados de uma vez e cobre notch,
 * ilha dinamica, barra de gestos e os tres botoes do Android.
 * Este e o motivo pelo qual react-native-safe-area-context e a unica
 * dependencia extra do projeto.
 */
export default function Screen({ title, description, children }) {
  const { colors, spacing, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Com edge-to-edge o backgroundColor da StatusBar e ignorado:
          o fundo passa a ser o do proprio conteudo. */}
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          // left/right importam em paisagem: o notch vira inset lateral.
          paddingLeft: spacing.md + insets.left,
          paddingRight: spacing.md + insets.right,
          paddingBottom: spacing.xxl,
          gap: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: spacing.xs }}>
          <AppText variant="display">{title}</AppText>
          {description ? (
            <AppText variant="body" tone="muted">
              {description}
            </AppText>
          ) : null}
        </View>
        {children}
      </ScrollView>
    </View>
  );
}
