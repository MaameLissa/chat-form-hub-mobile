import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = () => {
  // @ts-ignore
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleDone = () => {
    // Save profile logic here
    // @ts-ignore
    navigation.navigate('Home');
  };

  const handlePickImage = async () => {
    // Ask for permission first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f7f5fa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Edit profile</Text>
        <Text style={styles.subText}>Enter your name and add an optional profile picture</Text>
        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Image
              source={avatar ? { uri: avatar } : require('../assets/splash-icon.png')}
              style={styles.avatarImg}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity onPress={handlePickImage}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor="#bbb"
        />
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
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
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    color: '#888',
    fontSize: 15,
    marginBottom: 24,
    textAlign: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImg: {
    width: 40,
    height: 40,
  },
  editText: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 15,
  },
  nameInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    fontSize: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
    color: '#222',
    borderWidth: 1,
    borderColor: '#eee',
  },
  doneButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  doneButtonText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default EditProfileScreen;
