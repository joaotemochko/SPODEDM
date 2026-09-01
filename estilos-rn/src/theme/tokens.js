import { Platform } from 'react-native';

/**
 * DESIGN TOKENS
 * -----------------------------------------------------------
 * Ideia central da aula: nenhum valor visual "solto" no código.
 * Cor, espaco, raio e tipografia vivem aqui e sao consumidos
 * pelos componentes. Trocar o visual do app inteiro = editar
 * este arquivo, nao 40 telas.
 */

// Escala de espacamento baseada em multiplos de 4 (padrao Material / HIG).
// Usar a escala evita o "16, 15, 18, 17" espalhado pelo projeto.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999, // valor alto = capsula, independente da altura
};

// Escala tipografica. lineHeight explicito porque o default do RN
// varia entre plataformas e quebra o ritmo vertical.
export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 21, lineHeight: 28, fontWeight: '700', letterSpacing: -0.2 },
  subtitle: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.3 },
  mono: {
    fontSize: 13,
    lineHeight: 20,
    // Fontes monoespacadas tem nomes diferentes em cada SO.
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
};

// Paleta bruta: nomes descrevem a COR, nao o uso.
const palette = {
  ink900: '#12141C',
  ink800: '#1C1F2B',
  ink700: '#2A2E3D',
  ink600: '#3C4256',
  slate400: '#8B93A7',
  slate200: '#C9CEDA',
  slate100: '#E6E9F0',
  white: '#FFFFFF',
  coral: '#FF6B5B',
  coralDark: '#E04B3B',
  mint: '#2BB9A3',
  amber: '#F2A93B',
  red: '#E5484D',
};

// Tokens semanticos: nomes descrevem o USO, nao a cor.
// Por isso "surface" pode ser branco no claro e cinza-escuro no escuro
// sem que nenhum componente precise saber disso.
export const lightColors = {
  background: palette.slate100,
  surface: palette.white,
  surfaceAlt: '#F4F6FA',
  border: '#DEE3EC',
  text: palette.ink900,
  textMuted: '#5D667C',
  textInverse: palette.white,
  primary: palette.coral,
  primaryPressed: palette.coralDark,
  success: palette.mint,
  warning: palette.amber,
  danger: palette.red,
  overlay: 'rgba(18, 20, 28, 0.45)',
};

export const darkColors = {
  background: palette.ink900,
  surface: palette.ink800,
  surfaceAlt: palette.ink700,
  border: palette.ink600,
  text: '#F2F4F8',
  textMuted: palette.slate400,
  textInverse: palette.ink900,
  primary: palette.coral,
  primaryPressed: palette.coralDark,
  success: palette.mint,
  warning: palette.amber,
  danger: '#FF6369',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

/**
 * Sombra multiplataforma.
 * iOS usa shadowColor/Offset/Opacity/Radius; Android usa elevation.
 * No dark mode a sombra preta some no fundo escuro, entao reforcamos
 * o contorno via borda no componente Card.
 */
export function shadow(level = 1) {
  if (level <= 0) return {};
  return Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: level * 2 },
      shadowOpacity: 0.06 + level * 0.03,
      shadowRadius: level * 3,
    },
    android: {
      elevation: level * 2,
    },
    default: {
      // Web (Expo Web) e a Nova Arquitetura aceitam boxShadow.
      boxShadow: `0px ${level * 2}px ${level * 4}px rgba(0,0,0,0.15)`,
    },
  });
}
