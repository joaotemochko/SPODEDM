import React from 'react';
import { PixelRatio, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import AppText from '../components/AppText';
import Badge from '../components/Badge';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';

export default function FundamentosScreen() {
  const { colors, spacing, radius, shadow } = useTheme();
  const { width, height } = useWindowDimensions();

  return (
    <>
      <Card title="Unidades: dp, nao pixel" subtitle="densidade">
        <AppText variant="body" tone="muted">
          Todo numero em um estilo do React Native e um pixel independente de
          densidade (dp). O sistema multiplica pelo fator do aparelho.
        </AppText>
        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs }}>
          <Metric label="Tela (dp)" value={`${Math.round(width)} x ${Math.round(height)}`} />
          <Metric label="PixelRatio" value={`${PixelRatio.get()}x`} />
          <Metric label="Pixels reais" value={`${PixelRatio.getPixelSizeForLayoutSize(width)}px`} />
        </View>
        <AppText variant="caption" tone="muted">
          Uma borda de 1dp em um aparelho 3x ocupa 3 pixels fisicos. Para a
          linha mais fina possivel use StyleSheet.hairlineWidth.
        </AppText>
      </Card>

      <Card title="Box model" subtitle="sem surpresas da web">
        <AppText variant="body" tone="muted">
          border-box e o unico modo: width ja inclui padding e borda. Margens
          verticais nunca colapsam. Nao existe display block/inline.
        </AppText>
        <View
          style={{
            backgroundColor: colors.warning + '25',
            padding: spacing.md,
            borderRadius: radius.md,
            marginTop: spacing.xs,
          }}
        >
          <AppText variant="caption" tone="muted">MARGIN</AppText>
          <View
            style={{
              borderWidth: 3,
              borderColor: colors.primary,
              borderRadius: radius.sm,
              padding: spacing.md,
              marginTop: spacing.xs,
            }}
          >
            <AppText variant="caption" tone="muted">BORDER + PADDING</AppText>
            <View
              style={{
                backgroundColor: colors.success + '30',
                padding: spacing.sm,
                borderRadius: radius.sm,
                marginTop: spacing.xs,
              }}
            >
              <AppText variant="caption">CONTENT</AppText>
            </View>
          </View>
        </View>
      </Card>

      <Card title="StyleSheet vs objeto inline" subtitle="performance">
        <AppText variant="body" tone="muted">
          Os dois quadrados abaixo sao identicos na tela. A diferenca esta em
          quantas vezes o objeto de estilo e recriado.
        </AppText>
        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs }}>
          <View style={styles.swatch}>
            <AppText variant="caption" tone="inverse">StyleSheet</AppText>
          </View>
          {/* Anti-padrao proposital: objeto novo a cada render. */}
          <View
            style={{
              width: 110,
              height: 64,
              borderRadius: 12,
              backgroundColor: '#8B93A7',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="caption" tone="inverse">inline</AppText>
          </View>
        </View>
        <Badge label="Regra pratica" tone="warning" />
        <AppText variant="caption" tone="muted">
          Estilo estatico vai para StyleSheet.create. Objeto inline so para o
          que depende de estado ou props. Em listas longas isso e o que separa
          60fps de scroll travado.
        </AppText>
      </Card>

      <Card title="Sombra: iOS e Android divergem" subtitle="plataforma">
        <View style={{ flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' }}>
          {[1, 2, 4].map((level) => (
            <View
              key={level}
              style={[
                {
                  width: 88,
                  height: 72,
                  borderRadius: radius.md,
                  backgroundColor: colors.surfaceAlt,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                shadow(level),
              ]}
            >
              <AppText variant="caption">nivel {level}</AppText>
            </View>
          ))}
        </View>
        <AppText variant="caption" tone="muted">
          iOS: shadowColor/Offset/Opacity/Radius. Android: apenas elevation
          (que tambem altera a ordem de empilhamento). Rodando agora em{' '}
          {Platform.OS.toUpperCase()}.
        </AppText>
      </Card>
    </>
  );
}

function Metric({ label, value }) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surfaceAlt,
        borderRadius: radius.md,
        padding: spacing.sm,
        gap: 2,
      }}
    >
      <AppText variant="caption" tone="muted">{label}</AppText>
      <AppText variant="subtitle" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  swatch: {
    width: 110,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#8B93A7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
