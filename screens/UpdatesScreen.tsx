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

interface StatusUpdate {
  id: string;
  name: string;
  image: any;
  isViewed?: boolean;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  followers: string;
  icon: any;
  unreadCount?: number;
}

type UpdatesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const UpdatesScreen = () => {
  const navigation = useNavigation<UpdatesScreenNavigationProp>();

  const statusUpdates: StatusUpdate[] = [
    {
      id: '1',
      name: 'My Status',
      image: require('../assets/fantome.jpeg'),
    },
    {
      id: '2',
      name: 'They are attuned to their inner convictions and th Pastor Joe',
      image: require('../assets/ouuu.jpeg'),
    },
    {
      id: '3',
      name: 'Joel',
      image: require('../assets/starbgirl.jpeg'),
    },
    {
      id: '4',
      name: 'Aunty Linda',
      image: require('../assets/boyy.jpeg'),
    },
  ];

  const channels: Channel[] = [
    {
      id: '1',
      name: 'WhatsApp',
      description: 'New Features: Septembero.o',
      followers: '37',
      icon: require('../assets/whatsapp-logo.png'),
      unreadCount: 37,
    },
  ];

  const suggestedChannels: Channel[] = [
    {
      id: '1',
      name: 'STICKERS ملصقات',
      description: '56K followers',
      followers: '56K',
      icon: require('../assets/belle.jpg'),
    },
    {
      id: '2',
      name: 'VIBES TRIBE 🫶❤️',
      description: '186K followers',
      followers: '186K',
      icon: require('../assets/coat2.jpg'),
    },
    {
      id: '3',
      name: 'GOALS',
      description: '56K followers',
      followers: '56K',
      icon: require('../assets/didas.jpg'),
    },
    {
      id: '4',
      name: 'Nails Girls 💅🌹',
      description: '173K followers',
      followers: '173K',
      icon: require('../assets/banana.jpg'),
    },
  ];

  const renderStatusItem = ({ item, index }: { item: StatusUpdate; index: number }) => (
    <TouchableOpacity style={styles.statusItem}>
      <View style={styles.statusImageContainer}>
        <Image source={item.image} style={styles.statusImage} />
        {index === 0 && (
          <View style={styles.addStatusIcon}>
            <Ionicons name="add" size={20} color="#fff" />
          </View>
        )}
      </View>
      <Text style={styles.statusName} numberOfLines={2}>
        {index === 0 ? 'Add status' : item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderChannelItem = ({ item }: { item: Channel }) => (
    <TouchableOpacity style={styles.channelItem}>
      <Image source={item.icon} style={styles.channelIcon} />
      <View style={styles.channelContent}>
        <Text style={styles.channelName}>{item.name}</Text>
        <Text style={styles.channelDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Updates</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="camera-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <FlatList
            data={statusUpdates}
            renderItem={renderStatusItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.statusList}
            contentContainerStyle={styles.statusListContainer}
          />
        </View>

        {/* Channels Section */}
        <View style={styles.section}>
          <View style={styles.channelsHeader}>
            <Text style={styles.sectionTitle}>Channels</Text>
            <TouchableOpacity>
              <Text style={styles.exploreText}>Explore</Text>
            </TouchableOpacity>
          </View>
          
          {/* WhatsApp Channel */}
          <TouchableOpacity style={styles.whatsappChannel}>
            <Image source={require('../assets/whatsapp-logo.png')} style={styles.whatsappIcon} />
            <View style={styles.channelContent}>
              <Text style={styles.channelName}>WhatsApp</Text>
              <Text style={styles.channelDescription}>📰 New Features: Septembero.o</Text>
            </View>
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>37</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.subSectionTitle}>Find channels to follow</Text>
          
          {/* Suggested Channels */}
          {suggestedChannels.map(item => (
            <View key={item.id} style={styles.channelItem}>
              <Image source={item.icon} style={styles.channelIcon} />
              <View style={styles.channelContent}>
                <Text style={styles.channelName}>{item.name}</Text>
                <Text style={styles.channelFollowers}>{item.description}</Text>
              </View>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>

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
        <TouchableOpacity style={styles.bottomTab}>
          <Image source={require('../assets/updates.png')} style={styles.updatesIcon} />
          <Text style={[styles.bottomTabText, styles.activeBottomTabText]}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Tools')}>
          <Image source={require('../assets/tools.png')} style={styles.toolsIcon} />
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
    paddingTop: 50,
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  statusList: {
    paddingLeft: 20,
  },
  statusListContainer: {
    paddingRight: 20,
  },
  statusItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  statusImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  statusImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  addStatusIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusName: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  channelsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  exploreText: {
    fontSize: 16,
    color: '#25D366',
    fontWeight: '500',
  },
  whatsappChannel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
  },
  whatsappIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  subSectionTitle: {
    fontSize: 14,
    color: '#8E8E93',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  channelIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  channelContent: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  channelDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  channelFollowers: {
    fontSize: 14,
    color: '#8E8E93',
  },
  followButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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

export default UpdatesScreen;
