import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: any;
  unreadCount?: number;
  isOnline?: boolean;
}

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Enchanté Lissa',
      lastMessage: '',
      timestamp: '9/22/25',
      avatar: require('../assets/meta-logo.jpeg'),
      isOnline: true,
    },
    {
      id: '2',
      name: 'Unc Danny',
      lastMessage: "You're welcomeee",
      timestamp: '9/15/25',
      avatar: require('../assets/icon.png'),
    },
    {
      id: '3',
      name: 'King',
      lastMessage: 'Before you join Follow this acct hooo',
      timestamp: '8/15/25',
      avatar: require('../assets/favicon.png'),
    },
    {
      id: '4',
      name: 'Dad',
      lastMessage: '📷 Photo',
      timestamp: '8/7/25',
      avatar: require('../assets/adaptive-icon.png'),
    },
  ];

  const tabs = ['All', 'Unread', 'Favorites', 'Groups'];

  const handleChatPress = (chat: Chat) => {
    // Navigate to individual chat conversation
    // @ts-ignore
    navigation.navigate('ChatConversation', { chatId: chat.id, chatName: chat.name });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (id: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    return colors[parseInt(id) % colors.length];
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
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
        <Image source={require('../assets/meta-ai.jpg')} style={styles.fabMetaIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.fabAdd}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.bottomTab}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#075E54" />
          <Text style={[styles.bottomTabText, styles.activeBottomTabText]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab}>
          <Ionicons name="call" size={24} color="#8E8E93" />
          <Text style={styles.bottomTabText}>Calls</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab}>
          <Image source={require('../assets/updates.png')} style={styles.updatesIcon} />
          <Text style={styles.bottomTabText}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab}>
          <Image source={require('../assets/tools.png')} style={styles.toolsIcon} />
          <Text style={styles.bottomTabText}>Tools</Text>
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
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
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
    marginRight: 16,
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
    backgroundColor: '#075E54',
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
    color: '#075E54',
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
