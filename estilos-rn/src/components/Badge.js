import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Capsula com fundo tingido.
 * Truque: em vez de manter uma cor de fundo separada para cada estado,
 * usamos a cor semantica com baixa opacidade sobre a superficie.
 */
export default function Badge({ label, tone = 'primary' }) {
  const { colors, spacing, radius } = useTheme();

  const base = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    neutral: colors.textMuted,
  }[tone];

  return (
    <View
      style={{
        alignSelf: 'flex-start', // sem isso a capsula estica na largura toda
        backgroundColor: base + '22', // sufixo hex de alpha (~13%)
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs,
      }}
    >
      <AppText variant="caption" style={{ color: base }}>
        {label.toUpperCase()}
      </AppText>
    </View>
  );
}
