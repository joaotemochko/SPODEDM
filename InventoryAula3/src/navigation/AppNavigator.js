import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import Dashboard from '../screens/Dashboard';
import Inventory from '../screens/Inventory';
import NewItem from '../screens/NewItem';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function InventoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="InventoryList" component={Inventory} options={{ title: 'Lista de Peças' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Dashboard') iconName = 'home';
        else if (route.name === 'Inventário') iconName = 'list';
        else if (route.name === 'Novo Item') iconName = 'add-circle';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Inventário" component={InventoryStack} options={{ headerShown: false }} />
      <Tab.Screen name="Novo Item" component={NewItem} />
    </Tab.Navigator>
  );
}