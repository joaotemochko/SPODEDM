import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Screen from './src/components/Screen';
import TabBar from './src/components/TabBar';
import ComponentesScreen from './src/screens/ComponentesScreen';
import FlexboxScreen from './src/screens/FlexboxScreen';
import FundamentosScreen from './src/screens/FundamentosScreen';
import ResponsivoScreen from './src/screens/ResponsivoScreen';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';

const TABS = [
  {
    key: 'fundamentos',
    label: 'Fundamentos',
    title: 'Fundamentos',
    description: 'Unidades, box model, StyleSheet e sombras.',
    Component: FundamentosScreen,
  },
  {
    key: 'flexbox',
    label: 'Flexbox',
    title: 'Flexbox ao vivo',
    description: 'Mude as propriedades e observe o container reagir.',
    Component: FlexboxScreen,
  },
  {
    key: 'componentes',
    label: 'Componentes',
    title: 'Design system',
    description: 'Tokens virando tipografia, cor e componentes.',
    Component: ComponentesScreen,
  },
  {
    key: 'responsivo',
    label: 'Responsivo',
    title: 'Responsividade',
    description: 'Breakpoints, orientacao e diferencas de plataforma.',
    Component: ResponsivoScreen,
  },
];

function Root() {
  const [active, setActive] = useState('fundamentos');
  const { colors } = useTheme();
  const tab = TABS.find((t) => t.key === active);
  const Content = tab.Component;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title={tab.title} description={tab.description}>
        <Content />
      </Screen>
      <TabBar tabs={TABS} active={active} onChange={setActive} />
    </View>
  );
}

export default function App() {
  // SafeAreaProvider precisa envolver TODA a arvore: e ele quem mede os
  // insets do sistema e os publica para o useSafeAreaInsets() dos filhos.
  // Sem ele, o hook lanca erro (ou devolve zeros, dependendo da versao).
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
