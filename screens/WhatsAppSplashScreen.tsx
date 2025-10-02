import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type WhatsAppSplashScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const WhatsAppSplashScreen = () => {
  const navigation = useNavigation<WhatsAppSplashScreenNavigationProp>();

  useEffect(() => {
    // Always show the setup flow on app launch
    const timer = setTimeout(() => {
      navigation.navigate('WhatsAppWelcome');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <Ionicons name="logo-whatsapp" size={72} color="#25D366" />
        </View>
      </View>
      <View style={styles.metaContainer}>
        <Text style={styles.fromText}>from</Text>
        <View style={styles.metaRow}>
          <Image
            source={require('../assets/meta-logo.jpeg')}
            style={styles.metaLogo}
            resizeMode="contain"
          />
          <Text style={styles.metaText}>Meta</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f5fa',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  fromText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLogo: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  metaText: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WhatsAppSplashScreen;
