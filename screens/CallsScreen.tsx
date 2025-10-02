import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { SafeAssets, getSafeAsset } from '../utils/AssetUtils';

interface CallItem {
  id: string;
  name: string;
  time: string;
  type: 'incoming' | 'outgoing' | 'missed' | 'video';
  avatar?: any;
}

type CallsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CallsScreen = () => {
  const navigation = useNavigation<CallsScreenNavigationProp>();

  const calls: CallItem[] = [
    {
      id: '1',
      name: 'Queenson',
      time: 'September 20,11:29AM',
      type: 'missed',
      avatar: getSafeAsset('leo'),
    },
    {
      id: '2',
      name: 'Ralph@Presido',
      time: 'August 23,9:06 PM',
      type: 'missed',
      avatar: getSafeAsset('sharp-zee'),
    },
    {
      id: '3',
      name: 'Gid',
      time: 'August 23,3:52PM',
      type: 'outgoing',
      avatar: getSafeAsset('bob'),
    },
    {
      id: '4',
      name: 'Nathan 👣',
      time: 'August 187:36₉ PM',
      type: 'outgoing',
      avatar: getSafeAsset('dwayne'),
    },
    {
      id: '5',
      name: 'Fabrice 🇧🇪🇧🇫',
      time: 'August 15,11:14AM',
      type: 'missed',
      avatar: getSafeAsset('jordan'),
    },
    {
      id: '6',
      name: 'Nathan 👣',
      time: 'August 15,11:14AM',
      type: 'outgoing',
      avatar: getSafeAsset('leo'),
    },
    {
      id: '7',
      name: 'Gid',
      time: 'August15,11:11AM',
      type: 'missed',
      avatar: getSafeAsset('sharp-zee'),
    },
    {
      id: '8',
      name: 'Abigail D 🔥 (2)',
      time: 'August 7,8:10 AM',
      type: 'outgoing',
      avatar: getSafeAsset('bob'),
    },
    {
      id: '9',
      name: 'Gid',
      time: 'August 7,8:10 AM',
      type: 'missed',
      avatar: getSafeAsset('dwayne'),
    },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (id: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#A8E6CF', '#FFD93D', '#6BCF7F', '#4D94FF', '#FF6B9D'];
    return colors[parseInt(id) % colors.length];
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return { name: 'call-received', color: '#25D366', rotation: '↙' };
      case 'outgoing':
        return { name: 'call-made', color: '#25D366', rotation: '↗' };
      case 'missed':
        return { name: 'call-received', color: '#FF3B30', rotation: '↙' };
      case 'video':
        return { name: 'videocam', color: '#25D366', rotation: '' };
      default:
        return { name: 'call', color: '#8E8E93', rotation: '' };
    }
  };

  const renderCallItem = ({ item }: { item: CallItem }) => {
    const callIcon = getCallIcon(item.type);
    
    return (
      <TouchableOpacity style={styles.callItem}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={item.avatar} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={[styles.avatarInitials, { backgroundColor: getAvatarColor(item.id) }]}>
              <Text style={styles.avatarInitialsText}>{getInitials(item.name)}</Text>
            </View>
          )}
        </View>
        <View style={styles.callContent}>
          <Text style={[styles.callerName, item.type === 'missed' && styles.missedCall]}>
            {item.name}
          </Text>
          <View style={styles.callInfo}>
            <Text style={[styles.callArrow, { color: callIcon.color }]}>
              {item.type === 'outgoing' ? '↗' : '↙'}
            </Text>
            <Text style={styles.callTime}>{item.time}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton}>
          {item.id === '2' ? (
            <Ionicons name="videocam" size={24} color="#25D366" />
          ) : (
            <Ionicons name="call" size={24} color="#25D366" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Favorites Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          <TouchableOpacity style={styles.favoriteItem}>
            <View style={styles.favoriteIcon}>
              <Ionicons name="heart" size={24} color="#fff" />
            </View>
            <Text style={styles.favoriteText}>Add favorite</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent</Text>
          {calls.map((item) => (
            <View key={item.id}>
              {renderCallItem({ item })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#8E8E93" />
          <Text style={styles.bottomTabText}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab}>
          <Ionicons name="call" size={24} color="#25D366" />
          <Text style={[styles.bottomTabText, styles.activeBottomTabText]}>Calls</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Updates')}>
          <Image source={SafeAssets.updates} style={styles.updatesIcon} />
          <Text style={styles.bottomTabText}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Tools')}>
          <Image source={SafeAssets.tools} style={styles.toolsIcon} />
          <Text style={styles.bottomTabText}>Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#8E8E93" />
          <Text style={styles.bottomTabText}>Settings</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 20,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  favoriteIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  favoriteText: {
    fontSize: 16,
    color: '#000',
  },
  callsList: {
    flex: 1,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  avatarInitials: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  avatarInitialsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  callContent: {
    flex: 1,
  },
  callerName: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000',
    marginBottom: 2,
  },
  missedCall: {
    color: '#FF3B30',
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callTypeIcon: {
    marginRight: 8,
  },
  callArrow: {
    fontSize: 16,
    marginRight: 6,
    fontWeight: 'bold',
  },
  callTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  callButton: {
    padding: 8,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    paddingVertical: 8,
    paddingHorizontal: 16,
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

export default CallsScreen;
