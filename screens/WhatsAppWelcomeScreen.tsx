import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type WhatsAppWelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const WhatsAppWelcomeScreen = () => {
  const navigation = useNavigation<WhatsAppWelcomeScreenNavigationProp>();
  const handleAgree = () => {
    navigation.navigate('PhoneNumber');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Image
          source={require('../assets/whatsapp-welcome-illustration.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to WhatsApp</Text>
        <Text style={styles.description}>
          Family, friends and other people who use our service may have uploaded your number to WhatsApp. If so, they can see you in their contacts after you sign up.{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://faq.whatsapp.com/12345')}>Learn more</Text>
        </Text>
        <Text style={styles.description}>
          Read our <Text style={styles.link} onPress={() => Linking.openURL('https://www.whatsapp.com/legal/privacy-policy')}>Privacy Policy</Text>. Tap “Agree & Continue” to accept the <Text style={styles.link} onPress={() => Linking.openURL('https://www.whatsapp.com/legal/terms-of-service')}>Terms of Service</Text>.
        </Text>
      </View>
      <TouchableOpacity style={styles.agreeButton} onPress={handleAgree}>
        <Text style={styles.agreeButtonText}>Agree & Continue</Text>
      </TouchableOpacity>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 32,
  },
  topContent: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  illustration: {
    width: 180,
    height: 180,
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  agreeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    width: '70%',
    alignSelf: 'center',
  },
  agreeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  metaContainer: {
    alignItems: 'center',
    marginTop: 16,
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

export default WhatsAppWelcomeScreen;
