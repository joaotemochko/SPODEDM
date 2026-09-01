import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Superficie elevada.
 * Detalhe importante: no tema escuro a sombra preta desaparece contra
 * o fundo escuro. A hierarquia passa a ser feita por BORDA + cor de
 * superficie mais clara que o fundo. E o mesmo componente, decisao
 * tomada em tempo de render.
 */
export default function Card({ title, subtitle, level = 1, style, children }) {
  const { colors, spacing, radius, shadow, isDark } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing.md,
          gap: spacing.sm,
          borderWidth: isDark ? StyleSheet.hairlineWidth : 0,
          borderColor: colors.border,
        },
        isDark ? null : shadow(level),
        style,
      ]}
    >
      {title ? <AppText variant="subtitle">{title}</AppText> : null}
      {subtitle ? (
        <AppText variant="caption" tone="muted">
          {subtitle.toUpperCase()}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    // StyleSheet.create registra o estilo uma unica vez e passa uma
    // referencia entre JS e nativo. Objeto inline recria a cada render.
    overflow: 'visible',
  },
});
