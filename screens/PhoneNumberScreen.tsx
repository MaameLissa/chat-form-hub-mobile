import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PhoneNumberScreen = () => {
  // @ts-ignore
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Ghana');
  const [countryCode, setCountryCode] = useState('+233');

  const handleDone = () => {
    // Add phone validation if needed
    // @ts-ignore
    navigation.navigate('EditProfile');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f7f5fa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Enter Your Phone Number</Text>
          <TouchableOpacity onPress={handleDone}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.infoText}>
          WhatsApp will need to verify your phone number{`\n`}(carrier charges may apply).
        </Text>
        <View style={styles.inputCard}>
          <TouchableOpacity style={styles.countryRow}>
            <Text style={styles.countryText}>{country}</Text>
            <Text style={styles.chevron}>{'>'}</Text>
          </TouchableOpacity>
          <View style={styles.phoneRow}>
            <Text style={styles.countryCode}>{countryCode}</Text>
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="284 123456"
              placeholderTextColor="#bbb"
              maxLength={12}
            />
          </View>
        </View>
        <Text style={styles.ageText}>
          You must be <Text style={styles.link}>at least 16 years old</Text> to register. Learn how WhatsApp works with the <Text style={styles.link}>Facebook Companies</Text>.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f7f5fa',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  doneText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  infoText: {
    color: '#888',
    fontSize: 15,
    marginBottom: 24,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
    marginBottom: 12,
  },
  countryText: {
    fontSize: 17,
    color: '#222',
    flex: 1,
  },
  chevron: {
    fontSize: 18,
    color: '#bbb',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  countryCode: {
    fontSize: 20,
    color: '#222',
    marginRight: 12,
    fontWeight: '500',
  },
  phoneInput: {
    fontSize: 20,
    color: '#222',
    flex: 1,
    letterSpacing: 2,
  },
  ageText: {
    color: '#888',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 8,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default PhoneNumberScreen;
