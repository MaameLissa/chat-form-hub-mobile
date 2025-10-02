import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  BackHandler,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { SafeAssets, getSafeAsset } from '../utils/AssetUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: any;
  unreadCount?: number;
  isOnline?: boolean;
  isNew?: boolean;
}

type ChatListScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ChatListScreen = () => {
  const navigation = useNavigation<ChatListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    loadChats();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadChats();
    });
    return unsubscribe;
  }, [navigation]);
  const loadChats = async () => {
    try {
      const stored = await AsyncStorage.getItem('chats');
      if (stored) {
        setChats(JSON.parse(stored));
      } else {
        const seed: Chat[] = [
          { id: '1', name: 'Enchanté Lissa', lastMessage: '', timestamp: '9/22/25', avatar: getSafeAsset('meta-logo'), isOnline: true },
          { id: '2', name: 'Unc Danny', lastMessage: "You're welcomeee", timestamp: '9/15/25', avatar: SafeAssets.icon },
          { id: '3', name: 'King', lastMessage: 'Before you join Follow this acct hooo', timestamp: '8/15/25', avatar: SafeAssets.favicon },
          { id: '4', name: 'Dad', lastMessage: '📷 Photo', timestamp: '8/7/25', avatar: SafeAssets.adaptiveIcon },
        ];
        setChats(seed);
        await AsyncStorage.setItem('chats', JSON.stringify(seed));
      }
    } catch (e) { console.log('loadChats error', e); }
  };
  const upsertChat = async (id: string, name: string) => {
    setChats(prev => {
      const exists = prev.find(c => c.id === id);
      if (exists) return prev;
      const newChat: Chat = {
        id,
        name,
        lastMessage: '',
        timestamp: new Date().toLocaleDateString(),
        avatar: SafeAssets.icon,
        isNew: true,
      };
      const next = [newChat, ...prev];
      AsyncStorage.setItem('chats', JSON.stringify(next)).catch(()=>{});
      return next;
    });
  };
  // expose via navigation params
  useEffect(() => {
    const params: any = (navigation as any).getState?.();
  }, [chats]);

  const tabs = ['All', 'Unread', 'Favorites', 'Groups'];

  const handleChatPress = (chat: Chat) => {
    navigation.navigate('ChatConversation', { chatId: chat.id, chatName: chat.name });
  };

  const handleAddPress = () => {
    navigation.navigate('SelectContact');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const getInitials = (name: string) => {
    if (!name || name.trim() === '') return 'NA';
    const cleanName = name.replace(/[~_@👑🔥💯♻️🏃🏽🤚🏽🙏🏽|>•حفيد كتييد الحمدانله]/g, '').trim();
    const nameParts = cleanName.split(' ').filter(part => part.length > 0);
    if (nameParts.length === 0) return 'NA';
    return nameParts.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (id: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#A8E6CF', '#FFD93D', '#6BCF7F', '#4D94FF', '#FF6B9D'];
    const numericId = id ? Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) : 0;
    return colors[numericId % colors.length];
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    console.log('Rendering chat item:', item.name, 'ID:', item.id, 'Initials:', getInitials(item.name), 'Color:', getAvatarColor(item.id));
    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
        <View style={styles.avatarContainer}>
          {item.id === '1' ? (
            <Image source={item.avatar} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={[styles.avatarInitials, { backgroundColor: getAvatarColor(item.id) }]}>
              <Text style={styles.avatarInitialsText}>{getInitials(item.name)}</Text>
            </View>
          )}
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabButton = (tab: string) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tab, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {tab}
      </Text>
      {tab === 'New' && <View style={styles.newBadge} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WhatsApp</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="camera-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map(renderTabButton)}
        <TouchableOpacity style={[styles.tab, styles.newTab]}>
          <Text style={[styles.tabText, styles.newTabText]}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <View style={styles.chatListContainer}>
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
        
        {/* Bottom Instruction - Under last chat */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>Tap and hold on a chat for more options</Text>
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fabCamera}>
        <Image source={getSafeAsset('meta-ai')} style={styles.fabMetaIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.fabAdd} onPress={handleAddPress}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.bottomTab}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#25D366" />
          <Text style={[styles.bottomTabText, styles.activeBottomTabText]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Calls')}>
          <Ionicons name="call" size={24} color="#8E8E93" />
          <Text style={styles.bottomTabText}>Calls</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Updates')}>
          <Image source={SafeAssets.updates} style={styles.updatesIcon} />
          <Text style={styles.bottomTabText}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Tools')}>
          <Image source={SafeAssets.tools} style={styles.toolsIcon} />
          <Text style={styles.bottomTabText}>Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={handleSettingsPress}>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  newTab: {
    backgroundColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196F3',
  },
  newTabText: {
    color: '#fff',
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
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
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 18,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
  },
  fabCamera: {
    position: 'absolute',
    bottom: 180,
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
  fabAdd: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
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
  instructionContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  instructionText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  whatsappIcon: {
    width: 24,
    height: 24,
    tintColor: '#8E8E93',
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
  chatListContainer: {
    flex: 1,
  },
  metaIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
  fabMetaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default ChatListScreen;
