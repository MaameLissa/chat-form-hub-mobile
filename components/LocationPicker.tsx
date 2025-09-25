import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (address: string, coordinates: { latitude: number; longitude: number }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ visible, onClose, onLocationSelect }) => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({
    latitude: 5.6037,
    longitude: -0.1870,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      console.log('LocationPicker opened');
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use this feature');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      // Get address from coordinates
      const addressText = await reverseGeocode(location.coords.latitude, location.coords.longitude);
      setAddress(addressText);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your current location');
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const result = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (result.length > 0) {
        const address = result[0];
        const fullAddress = `${address.name || ''} ${address.street || ''} ${address.city || ''} ${address.region || ''} ${address.country || ''}`.trim();
        return fullAddress || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  };

  const handleConfirmLocation = () => {
    console.log('Confirm location pressed:', coordinates);
    onLocationSelect(address, coordinates);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Location</Text>
          <TouchableOpacity onPress={getCurrentLocation} style={styles.myLocationButton}>
            <Ionicons name="locate" size={20} color="#10b981" />
          </TouchableOpacity>
        </View>

        {/* Address Input */}
        <View style={styles.addressContainer}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          <TextInput
            style={styles.addressInput}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your delivery address"
            placeholderTextColor="#9ca3af"
            multiline
          />
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
          )}
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <Text style={styles.instructionText}>
            Tap on the map or drag the marker to select your delivery location
          </Text>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  myLocationButton: {
    padding: 8,
  },
  addressContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  bottomActions: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationPicker;