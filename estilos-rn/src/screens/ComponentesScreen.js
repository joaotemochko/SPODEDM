import React, { useState } from 'react';
import { View } from 'react-native';
import AppText from '../components/AppText';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Vitrine do "design system" minimo do projeto.
 * Mostra que, uma vez definidos os tokens, montar tela vira composicao.
 */
export default function ComponentesScreen() {
  const { colors, spacing, radius, typography, mode, setMode } = useTheme();
  const [cliques, setCliques] = useState(0);

  return (
    <>
      <Card title="Tema" subtitle="claro / escuro / sistema">
        <AppText variant="body" tone="muted">
          As tres opcoes abaixo trocam apenas o objeto `colors` do Context.
          Nenhum componente sabe qual tema esta ativo.
        </AppText>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
          {['system', 'light', 'dark'].map((m) => (
            <Button
              key={m}
              label={m}
              variant={mode === m ? 'primary' : 'secondary'}
              onPress={() => setMode(m)}
              style={{ flex: 1, paddingHorizontal: spacing.sm }}
            />
          ))}
        </View>
      </Card>

      <Card title="Escala tipografica" subtitle="ritmo vertical">
        {['display', 'title', 'subtitle', 'body', 'caption'].map((v) => (
          <View
            key={v}
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: spacing.sm,
            }}
          >
            <AppText variant={v} numberOfLines={1} style={{ flexShrink: 1 }}>
              Aa {v}
            </AppText>
            <AppText variant="caption" tone="muted">
              {typography[v].fontSize}/{typography[v].lineHeight}
            </AppText>
          </View>
        ))}
      </Card>

      <Card title="Cores semanticas" subtitle="uso, nao aparencia">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {['primary', 'success', 'warning', 'danger', 'textMuted', 'border'].map((key) => (
            <View key={key} style={{ alignItems: 'center', gap: 4, width: 78 }}>
              <View
                style={{
                  width: 56,
                  height: 40,
                  borderRadius: radius.md,
                  backgroundColor: colors[key],
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
              <AppText variant="caption" tone="muted" numberOfLines={1}>
                {key}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <Card title="Estados de toque" subtitle="pressable">
        <View style={{ gap: spacing.sm }}>
          <Button label={`Toques registrados: ${cliques}`} onPress={() => setCliques((c) => c + 1)} />
          <Button label="Secundario" variant="secondary" onPress={() => setCliques(0)} />
          <Button label="Fantasma" variant="ghost" onPress={() => {}} />
          <Button label="Desabilitado" disabled onPress={() => {}} />
        </View>
        <AppText variant="caption" tone="muted">
          {'Segure cada botao: a mudanca de cor vem da funcao passada em style={({ pressed }) => [...]}, nao de estado no React.'}
        </AppText>
      </Card>

      <Card title="Badges" subtitle="alpha sobre a superficie">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <Badge label="novo" tone="primary" />
          <Badge label="estavel" tone="success" />
          <Badge label="beta" tone="warning" />
          <Badge label="depreciado" tone="danger" />
          <Badge label="rascunho" tone="neutral" />
        </View>
      </Card>
    </>
  );
}
