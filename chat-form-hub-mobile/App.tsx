import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import FormScreen from './screens/FormScreen';
import SubmittedFormsScreen from './screens/SubmittedFormsScreen';
import { RootStackParamList } from './types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const theme = {
  colors: {
    primary: '#25D366', // WhatsApp green
    accent: '#075E54', // WhatsApp dark green
    background: '#f0f0f0',
    surface: '#ffffff',
    text: '#000000',
    placeholder: '#757575',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Form" 
              component={FormScreen} 
              options={{ title: 'Fill Form' }}
            />
            <Stack.Screen 
              name="SubmittedForms" 
              component={SubmittedFormsScreen} 
              options={{ title: 'Form Responses' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
