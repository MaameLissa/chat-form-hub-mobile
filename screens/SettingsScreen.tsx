import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [profileData, setProfileData] = useState({
    firstName: 'User',
    lastName: '',
    displayName: 'Available',
    avatar: null,
  });
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      const savedPhone = await AsyncStorage.getItem('userPhoneNumber');
      
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setProfileData(profile);
      }
      
      if (savedPhone) {
        setPhoneNumber(savedPhone);
      }
    } catch (error) {
      console.log('Error loading profile data:', error);
    }
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const settingsOptions = [
    {
      id: 'account',
      icon: 'key-outline',
      title: 'Account',
      subtitle: 'Security notifications, change number',
    },
    {
      id: 'privacy',
      icon: 'lock-closed-outline',
      title: 'Privacy',
      subtitle: 'Block contacts, disappearing messages',
    },
    {
      id: 'avatar',
      icon: 'person-outline',
      title: 'Avatar',
      subtitle: 'Create, edit, profile photo',
    },
    {
      id: 'favorites',
      icon: 'heart-outline',
      title: 'Favorites',
      subtitle: 'Add, reorder, remove',
    },
    {
      id: 'chats',
      icon: 'chatbubbles-outline',
      title: 'Chats',
      subtitle: 'Theme, wallpapers, chat history',
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Message, group & call tones',
    },
    {
      id: 'storage',
      icon: 'refresh-outline',
      title: 'Storage and data',
      subtitle: 'Network usage, auto-download',
    },
    {
      id: 'accessibility',
      icon: 'accessibility-outline',
      title: 'Accessibility',
      subtitle: 'Increase contrast, animation',
    },
    {
      id: 'language',
      icon: 'globe-outline',
      title: 'App language',
      subtitle: "English (device's language)",
    },
    {
      id: 'help',
      icon: 'help-circle-outline',
      title: 'Help',
      subtitle: 'Help center, contact us, privacy policy',
    },
    {
      id: 'invite',
      icon: 'person-add-outline',
      title: 'Invite a contact',
      subtitle: '',
    },
  ];

  const renderSettingItem = (option: any) => (
    <TouchableOpacity key={option.id} style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name={option.icon} size={24} color="#666" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{option.title}</Text>
        {option.subtitle ? (
          <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <TouchableOpacity style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {profileData.avatar ? (
              <Image source={{ uri: profileData.avatar }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileInitials}>
                <Text style={styles.profileInitialsText}>
                  {getInitials(profileData.firstName, profileData.lastName || 'U')}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profileData.firstName} {profileData.lastName}
            </Text>
            <Text style={styles.profileStatus}>{profileData.displayName}</Text>
            {phoneNumber ? (
              <Text style={styles.profilePhone}>{phoneNumber}</Text>
            ) : null}
          </View>
          <TouchableOpacity style={styles.qrCodeButton}>
            <Ionicons name="qr-code-outline" size={24} color="#000" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Settings Options */}
        <View style={styles.settingsContainer}>
          {settingsOptions.map(renderSettingItem)}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>from</Text>
          <View style={styles.metaRow}>
            <Image
              source={require('../assets/meta-logo.jpeg')}
              style={styles.metaLogo}
              resizeMode="contain"
            />
            <Text style={styles.metaText}>Meta</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#8E8E93" />
          <Text style={styles.bottomTabText}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Calls')}>
          <Ionicons name="call" size={24} color="#8E8E93" />
          <Text style={styles.bottomTabText}>Calls</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Updates')}>
          <Image source={require('../assets/updates.png')} style={styles.updatesIcon} />
          <Text style={styles.bottomTabText}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Tools')}>
          <Image source={require('../assets/tools.png')} style={styles.toolsIcon} />
          <Text style={styles.bottomTabText}>Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab}>
          <Ionicons name="settings-outline" size={24} color="#25D366" />
          <Text style={[styles.bottomTabText, styles.activeBottomTabText]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  headerButton: {
    padding: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
    marginBottom: 20,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInitials: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitialsText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: '#666',
  },
  profilePhone: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  qrCodeButton: {
    padding: 8,
  },
  settingsContainer: {
    paddingBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  settingIcon: {
    marginRight: 16,
    width: 30,
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLogo: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  metaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    justifyContent: 'space-around',
  },
  bottomTab: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
  },
  bottomTabText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  activeBottomTabText: {
    color: '#25D366',
  },
  updatesIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  toolsIcon: {
    width: 24,
    height: 24,
    tintColor: '#8E8E93',
  },
});

export default SettingsScreen;
