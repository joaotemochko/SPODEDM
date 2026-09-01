import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, radius, shadow, spacing, typography } from './tokens';

const ThemeContext = createContext(null);

/**
 * Envolve o app e distribui o tema por Context.
 * mode: 'system' | 'light' | 'dark'
 * - 'system' segue o useColorScheme() do SO (o comportamento esperado hoje)
 * - o override manual existe porque usuario quer poder discordar do SO
 */
export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setMode] = useState('system');

  const value = useMemo(() => {
    const effective = mode === 'system' ? systemScheme ?? 'light' : mode;
    const isDark = effective === 'dark';

    return {
      mode,
      setMode,
      isDark,
      scheme: effective,
      colors: isDark ? darkColors : lightColors,
      spacing,
      radius,
      typography,
      shadow,
    };
    // useMemo evita recriar o objeto a cada render: sem isso, TODO
    // consumidor do Context re-renderiza em qualquer atualizacao.
  }, [mode, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme precisa estar dentro de <ThemeProvider>.');
  }
  return ctx;
}
