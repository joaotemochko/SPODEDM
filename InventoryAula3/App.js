import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { InventoryProvider } from './src/contexts/InventoryContext';

export default function App() {
  return (
    <InventoryProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </InventoryProvider>
  );
}