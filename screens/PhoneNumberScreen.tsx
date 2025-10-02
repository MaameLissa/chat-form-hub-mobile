import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';

interface Country {
  name: string;
  code: string;
  flag: string;
}

type PhoneNumberScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const PhoneNumberScreen = () => {
  const navigation = useNavigation<PhoneNumberScreenNavigationProp>();
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Ghana');
  const [countryCode, setCountryCode] = useState('+233');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const countries: Country[] = [
    { name: 'Ghana', code: '+233', flag: '🇬🇭' },
    { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'South Africa', code: '+27', flag: '🇿🇦' },
    { name: 'Kenya', code: '+254', flag: '🇰🇪' },
    { name: 'Egypt', code: '+20', flag: '🇪🇬' },
    { name: 'Morocco', code: '+212', flag: '🇲🇦' },
    { name: 'India', code: '+91', flag: '🇮🇳' },
  ];

  const handleCountrySelect = (selectedCountry: Country) => {
    setCountry(selectedCountry.name);
    setCountryCode(selectedCountry.code);
    setShowCountryPicker(false);
  };

  const handleDone = async () => {
    if (phone.trim()) {
      try {
        const fullPhoneNumber = `${countryCode} ${phone}`;
        await AsyncStorage.setItem('userPhoneNumber', fullPhoneNumber);
        navigation.navigate('EditProfile');
      } catch (error) {
        console.log('Error saving phone number:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f7f5fa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Enter Your Phone Number</Text>
        <Text style={styles.infoText}>
          WhatsApp will need to verify your phone number{`\n`}(carrier charges may apply).
        </Text>
        <View style={styles.inputCard}>
          <TouchableOpacity style={styles.countryRow} onPress={() => setShowCountryPicker(true)}>
            <Text style={styles.countryText}>
              {countries.find(c => c.name === country)?.flag} {country}
            </Text>
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
        
        {/* Done Button moved below */}
        <TouchableOpacity 
          style={[styles.doneButton, !phone.trim() && styles.doneButtonDisabled]} 
          onPress={handleDone}
          disabled={!phone.trim()}
        >
          <Text style={[styles.doneButtonText, !phone.trim() && styles.doneButtonTextDisabled]}>
            Done
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.ageText}>
          You must be <Text style={styles.link}>at least 16 years old</Text> to register. Learn how WhatsApp works with the <Text style={styles.link}>Facebook Companies</Text>.
        </Text>
      </View>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose a country</Text>
            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={countries}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.countryItem}
                onPress={() => handleCountrySelect(item)}
              >
                <Text style={styles.countryItemText}>
                  {item.flag} {item.name}
                </Text>
                <Text style={styles.countryCodeText}>{item.code}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
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
  doneButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 40,
  },
  doneButtonDisabled: {
    backgroundColor: '#ccc',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneButtonTextDisabled: {
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#007AFF',
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryItemText: {
    fontSize: 16,
    color: '#000',
  },
  countryCodeText: {
    fontSize: 14,
    color: '#666',
  },
});

export default PhoneNumberScreen;
