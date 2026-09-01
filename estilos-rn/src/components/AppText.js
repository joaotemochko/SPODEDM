import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Estilo de texto NAO e herdado no React Native (diferente da web).
 * Um <View> com fontSize nao afeta os <Text> filhos.
 * Por isso centralizamos a tipografia num componente proprio.
 *
 * variant: display | title | subtitle | body | caption | mono
 * tone:    default  | muted | primary | inverse
 */
export default function AppText({
  variant = 'body',
  tone = 'default',
  style,
  children,
  ...rest
}) {
  const { typography, colors } = useTheme();

  const toneColor = {
    default: colors.text,
    muted: colors.textMuted,
    primary: colors.primary,
    inverse: colors.textInverse,
  }[tone];

  // Array de estilos: RN mescla da esquerda para a direita.
  // O `style` do chamador vem por ultimo e sempre vence.
  return (
    <Text style={[typography[variant], { color: toneColor }, style]} {...rest}>
      {children}
    </Text>
  );
}
