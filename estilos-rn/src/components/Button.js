import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Pressable > TouchableOpacity.
 * O `style` do Pressable aceita uma FUNCAO que recebe { pressed },
 * o que permite estilo derivado do estado sem guardar nada em useState.
 *
 * variant: primary | secondary | ghost
 */
export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) {
  const { colors, spacing, radius, shadow } = useTheme();

  const skin = {
    primary: { bg: colors.primary, bgPressed: colors.primaryPressed, fg: '#FFFFFF', border: 'transparent' },
    secondary: { bg: colors.surfaceAlt, bgPressed: colors.border, fg: colors.text, border: colors.border },
    ghost: { bg: 'transparent', bgPressed: colors.surfaceAlt, fg: colors.primary, border: 'transparent' },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      // Area de toque minima recomendada: 44dp (iOS) / 48dp (Android).
      // hitSlop amplia o alvo SEM alterar o layout visual.
      hitSlop={8}
      android_ripple={{ color: 'rgba(255,255,255,0.22)', borderless: false }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          paddingVertical: spacing.sm + 4,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: skin.border,
          backgroundColor: pressed ? skin.bgPressed : skin.bg,
          opacity: disabled ? 0.45 : 1,
          // Feedback tatil visual: no iOS encolhe, no Android o ripple ja resolve.
          transform: [{ scale: pressed && Platform.OS === 'ios' ? 0.97 : 1 }],
        },
        variant === 'primary' && !pressed ? shadow(1) : null,
        style,
      ]}
    >
      <AppText variant="subtitle" style={{ color: skin.fg, textAlign: 'center' }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    justifyContent: 'center',
    // overflow: 'hidden' e obrigatorio para o ripple do Android
    // respeitar o borderRadius.
    overflow: 'hidden',
  },
});
