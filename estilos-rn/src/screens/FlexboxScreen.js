import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';

const OPTIONS = {
  flexDirection: ['column', 'row', 'row-reverse', 'column-reverse'],
  justifyContent: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
  alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
};

/**
 * Playground de Flexbox.
 * O objetivo didatico e o aluno perceber que justifyContent age no EIXO
 * PRINCIPAL e alignItems no EIXO CRUZADO -- e que trocar flexDirection
 * inverte quem e quem.
 */
export default function FlexboxScreen() {
  const { colors, spacing, radius } = useTheme();
  const [cfg, setCfg] = useState({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  const eixoPrincipal = cfg.flexDirection.startsWith('row') ? 'horizontal' : 'vertical';

  return (
    <>
      <Card title="Eixo principal e eixo cruzado" subtitle={`principal: ${eixoPrincipal}`}>
        <AppText variant="body" tone="muted">
          No React Native o default de flexDirection e column (na web e row).
          alignContent comeca em flex-start e flexShrink em 0. Sao os tres
          desvios que mais confundem quem vem do CSS.
        </AppText>
      </Card>

      {Object.keys(OPTIONS).map((prop) => (
        <View key={prop} style={{ gap: spacing.xs }}>
          <AppText variant="caption" tone="muted">{prop.toUpperCase()}</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
            {OPTIONS[prop].map((value) => {
              const selected = cfg[prop] === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => setCfg((prev) => ({ ...prev, [prop]: value }))}
                  style={{
                    paddingVertical: spacing.xs + 2,
                    paddingHorizontal: spacing.sm + 2,
                    borderRadius: radius.pill,
                    borderWidth: 1,
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected ? colors.primary + '1F' : colors.surface,
                  }}
                >
                  <AppText
                    variant="caption"
                    style={{ color: selected ? colors.primary : colors.textMuted }}
                  >
                    {value}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      {/* Container observado */}
      <View
        style={{
          height: 220,
          borderRadius: radius.lg,
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: colors.border,
          backgroundColor: colors.surfaceAlt,
          padding: spacing.sm,
          gap: spacing.sm,
          ...cfg,
        }}
      >
        {[1, 2, 3].map((n) => (
          <View
            key={n}
            style={{
              // Sem width/height fixos: assim alignItems: 'stretch' fica visivel.
              minWidth: 56,
              minHeight: 48,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.md,
              backgroundColor: n === 2 ? colors.primary : colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="subtitle" style={{ color: n === 2 ? '#FFF' : colors.text }}>
              {n}
            </AppText>
          </View>
        ))}
      </View>

      <Card title="Codigo equivalente" subtitle="copie e cole">
        <AppText variant="mono" tone="muted">
          {`container: {\n  flexDirection: '${cfg.flexDirection}',\n  justifyContent: '${cfg.justifyContent}',\n  alignItems: '${cfg.alignItems}',\n  gap: 8,\n}`}
        </AppText>
      </Card>
    </>
  );
}
