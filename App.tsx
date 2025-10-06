import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator as createNativeStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import FormScreen from './screens/FormScreen';
import SubmittedFormsScreen from './screens/SubmittedFormsScreen';
import DashboardScreen from './screens/DashboardScreen';
import CustomFormBuilderScreen from './screens/CustomFormBuilderScreen';
import WhatsAppSplashScreen from './screens/WhatsAppSplashScreen';
import WhatsAppWelcomeScreen from './screens/WhatsAppWelcomeScreen';
import PhoneNumberScreen from './screens/PhoneNumberScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatConversationScreen from './screens/ChatConversationScreen';
import SettingsScreen from './screens/SettingsScreen';
import SelectContactScreen from './screens/SelectContactScreen';
import CallsScreen from './screens/CallsScreen';
import UpdatesScreen from './screens/UpdatesScreen';
import ToolsScreen from './screens/ToolsScreen';
import MetaAIScreen from './screens/MetaAIScreen';
import { RootStackParamList } from './types/navigation';
import { FormProvider } from './context/FormContext';
import ErrorBoundary from './components/ErrorBoundary';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
    <ErrorBoundary>
      <SafeAreaProvider>
        <FormProvider>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Stack.Navigator
              initialRouteName="WhatsAppSplash"
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
                options={{ 
                  title: 'Fill Form',
                  headerStyle: {
                    backgroundColor: '#25d366',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                    color: '#fff',
                  },
                }}
              />
              <Stack.Screen 
                name="SubmittedForms" 
                component={SubmittedFormsScreen} 
                options={{ title: 'Form Responses' }}
              />
              <Stack.Screen 
                name="Dashboard" 
                component={DashboardScreen} 
                options={{ 
                  title: 'Dashboard',
                  headerStyle: {
                    backgroundColor: '#25d366',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                    color: '#fff',
                  },
                }}
              />
              <Stack.Screen 
                name="CustomFormBuilder" 
                component={CustomFormBuilderScreen} 
                options={{ 
                  title: 'Form Builder',
                  headerStyle: {
                    backgroundColor: '#25d366',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                    color: '#fff',
                  },
                }}
              />
              <Stack.Screen 
                name="WhatsAppSplash" 
                component={WhatsAppSplashScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="WhatsAppWelcome" 
                component={WhatsAppWelcomeScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="PhoneNumber" 
                component={PhoneNumberScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="EditProfile" 
                component={EditProfileScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Chat" 
                component={ChatListScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="ChatConversation" 
                component={ChatConversationScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="SelectContact" 
                component={SelectContactScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Calls" 
                component={CallsScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Updates" 
                component={UpdatesScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Tools" 
                component={ToolsScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="MetaAI" 
                component={MetaAIScreen} 
                options={{ 
                  title: 'Meta AI',
                  headerStyle: { backgroundColor: '#25d366' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: '600', fontSize: 18, color: '#fff' },
                }}
              />
            </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </FormProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
