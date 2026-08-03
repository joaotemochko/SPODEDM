// Importamos os componentes essenciais de navegação do React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos a tela que vamos construir nos próximos passos
import Home from './src/screens/Home';

// Instanciamos o navegador do tipo "Stack" (Pilha)
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Registrando a tela Home na pilha e definindo o título do cabeçalho */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Meu App de Tarefas' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
