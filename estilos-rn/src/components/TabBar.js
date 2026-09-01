import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Barra de navegacao feita a mao de proposito: em uma aula sobre estilo,
 * ate a navegacao vira exercicio de layout.
 *
 * O padding inferior vem de insets.bottom, NAO de um numero fixo.
 * No Android com tres botoes esse valor e ~48dp; com gestos, ~16dp;
 * no iOS com barra de gestos, ~34dp; e 0 em aparelho antigo.
 * Chutar qualquer um desses valores quebra em todos os outros casos.
 */
export default function TabBar({ tabs, active, onChange }) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom + spacing.sm,
          paddingTop: spacing.sm,
          paddingLeft: spacing.sm + insets.left,
          paddingRight: spacing.sm + insets.right,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={({ pressed }) => [
              styles.tab,
              {
                borderRadius: radius.md,
                paddingVertical: spacing.xs + 2,
                backgroundColor: isActive
                  ? colors.primary + '1F'
                  : pressed
                  ? colors.surfaceAlt
                  : 'transparent',
              },
            ]}
          >
            <AppText
              variant="caption"
              style={{
                color: isActive ? colors.primary : colors.textMuted,
                textAlign: 'center',
              }}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', // lembrete: o default do RN e 'column'
    borderTopWidth: StyleSheet.hairlineWidth, // 1 pixel fisico, nao 1dp
  },
  tab: {
    flex: 1, // cada aba ocupa a mesma fracao do espaco livre
    justifyContent: 'center',
  },
});
