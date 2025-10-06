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
  Pressable,
  Modal,
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
  isFavorite?: boolean; // added earlier
  groupName?: string; // added earlier
}

interface GroupItem {
  id: string; // e.g., group:Dog Lovers
  type: 'group';
  name: string; // group name
  memberIds: string[];
  unreadCount?: number;
  timestamp?: string; // latest among members
}

type ChatListScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ChatListScreen = () => {
  const navigation = useNavigation<ChatListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [chats, setChats] = useState<Chat[]>([]);
  const [actionChat, setActionChat] = useState<Chat | null>(null);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

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

  // Build group aggregates from chats that have a groupName
  const getGroupAggregates = (): GroupItem[] => {
    const map = new Map<string, { memberIds: string[]; unreadCount: number; timestamp?: string }>();
    chats.forEach(c => {
      if (!c.groupName) return;
      const key = c.groupName;
      const prev = map.get(key) || { memberIds: [], unreadCount: 0, timestamp: undefined };
      prev.memberIds.push(c.id);
      prev.unreadCount += c.unreadCount || 0;
      // Use the most recent timestamp string (simple compare or keep first)
      prev.timestamp = prev.timestamp || c.timestamp;
      map.set(key, prev);
    });
    return Array.from(map.entries()).map(([name, v]) => ({
      id: `group:${name}`,
      type: 'group',
      name,
      memberIds: v.memberIds,
      unreadCount: v.unreadCount,
      timestamp: v.timestamp,
    }));
  };

  // Filter items for the current tab and search query
  const groupItems = getGroupAggregates();
  const allChats = chats; // include chats regardless of group membership

  type ListItem = Chat | GroupItem;

  const filteredItems: ListItem[] = (() => {
    const q = searchQuery.toLowerCase();
    const matchName = (s?: string) => (s || '').toLowerCase().includes(q);

    if (activeTab === 'Groups') {
      return groupItems.filter(g => matchName(g.name));
    }

    if (activeTab === 'Favorites') {
      return allChats.filter(c => c.isFavorite && matchName(c.name));
    }

    if (activeTab === 'Unread') {
      const unreadChats = allChats.filter(c => (c.unreadCount || 0) > 0 && matchName(c.name));
      const unreadGroups = groupItems.filter(g => (g.unreadCount || 0) > 0 && matchName(g.name));
      return [...unreadGroups, ...unreadChats];
    }

    // All: include groups and all individual chats
    const items: ListItem[] = [...groupItems, ...allChats];
    return items.filter(it => (it as any).type === 'group' ? matchName((it as GroupItem).name) : matchName((it as Chat).name));
  })();

  const handleChatPress = (chat: Chat) => {
    // If action sheet is open, ignore normal presses
    if (actionChat) return;
    navigation.navigate('ChatConversation', { chatId: chat.id, chatName: chat.name });
  };

  const onLongPressChat = (chat: Chat) => {
    setActionChat(chat);
  };

  const closeChatActionSheet = () => setActionChat(null);

  const openChatFromSheet = () => {
    if (!actionChat) return;
    navigation.navigate('ChatConversation', { chatId: actionChat.id, chatName: actionChat.name });
    closeChatActionSheet();
  };

  const toggleUnreadChat = () => {
    if (!actionChat) return;
    setChats(prev => {
      const next = prev.map(c =>
        c.id === actionChat.id
          ? { ...c, unreadCount: c.unreadCount && c.unreadCount > 0 ? 0 : 1 }
          : c
      );
      AsyncStorage.setItem('chats', JSON.stringify(next)).catch(() => {});
      return next;
    });
    closeChatActionSheet();
  };

  const deleteChat = () => {
    if (!actionChat) return;
    setChats(prev => {
      const next = prev.filter(c => c.id !== actionChat.id);
      AsyncStorage.setItem('chats', JSON.stringify(next)).catch(() => {});
      return next;
    });
    closeChatActionSheet();
  };

  const openGroupModal = () => {
    if (!actionChat) return;
    setGroupName(actionChat.groupName || '');
    setSelectedMemberIds(prev => {
      // Preselect the current chat
      const base = new Set<string>([actionChat.id]);
      // If already in a group, preselect existing group members (same groupName)
      if (actionChat.groupName) {
        chats.filter(c => c.groupName === actionChat.groupName).forEach(c => base.add(c.id));
      }
      return Array.from(base);
    });
    setGroupModalVisible(true);
  };

  const removeFromGroup = () => {
    if (!actionChat) return;
    setChats(prev => {
      const next = prev.map(c => (c.id === actionChat.id ? { ...c, groupName: undefined } : c));
      AsyncStorage.setItem('chats', JSON.stringify(next)).catch(() => {});
      return next;
    });
    closeChatActionSheet();
  };

  const toggleFavoriteChat = () => {
    if (!actionChat) return;
    setChats(prev => {
      const next = prev.map(c =>
        c.id === actionChat.id ? { ...c, isFavorite: !c.isFavorite } : c
      );
      AsyncStorage.setItem('chats', JSON.stringify(next)).catch(() => {});
      return next;
    });
    closeChatActionSheet();
  };

  const toggleSelectMember = (id: string) => {
    setSelectedMemberIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const saveGroup = () => {
    const name = groupName.trim() || 'New Group';
    if (selectedMemberIds.length === 0) {
      Alert.alert('No members selected', 'Select at least one chat to add to the group.');
      return;
    }
    setChats(prev => {
      const next = prev.map(c =>
        selectedMemberIds.includes(c.id) ? { ...c, groupName: name } : c
      );
      AsyncStorage.setItem('chats', JSON.stringify(next)).catch(() => {});
      return next;
    });
    setGroupModalVisible(false);
    closeChatActionSheet();
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

  const renderChatItem = ({ item }: { item: ListItem }) => {
    // Render a group row
    if ((item as any).type === 'group') {
      const g = item as GroupItem;
      return (
        <Pressable style={styles.chatItem} onPress={() => navigation.navigate('ChatConversation', { chatId: g.id, chatName: g.name })}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarInitials, { backgroundColor: '#34C759' }]}>
              <Ionicons name="people" size={22} color="#fff" />
            </View>
          </View>
          <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatName}>{g.name}</Text>
              <Text style={styles.timestamp}>{g.timestamp || ''}</Text>
            </View>
            <Text style={styles.groupSubtitle}>{g.memberIds.length} members</Text>
          </View>
        </Pressable>
      );
    }

    // Render a single chat row
    const c = item as Chat;
    return (
      <Pressable style={styles.chatItem} onPress={() => handleChatPress(c)} onLongPress={() => onLongPressChat(c)} delayLongPress={300}>
        <View style={styles.avatarContainer}>
          {c.id === '1' ? (
            <Image source={c.avatar} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={[styles.avatarInitials, { backgroundColor: getAvatarColor(c.id) }]}>
              <Text style={styles.avatarInitialsText}>{getInitials(c.name)}</Text>
            </View>
          )}
          {c.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{c.name}</Text>
            <Text style={styles.timestamp}>{c.timestamp}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {c.lastMessage}
          </Text>
        </View>
      </Pressable>
    );
  };

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
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
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
        ))}
        <TouchableOpacity style={[styles.tab, styles.newTab]} onPress={() => navigation.navigate('SelectContact')}>
          <Text style={[styles.tabText, styles.newTabText]}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <View style={styles.chatListContainer}>
        <FlatList
          data={filteredItems}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#8E8E93', padding: 16 }}>No chats</Text>}
        />
        
        {/* Bottom Instruction - Under last chat */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>Tap and hold on a chat for more options</Text>
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fabCamera} onPress={() => navigation.navigate('MetaAI')}>
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

      {/* Chat Action Sheet */}
      {actionChat && (
        <Pressable style={styles.chatActionOverlay} onPress={closeChatActionSheet}>
          <View style={styles.chatActionSheet}>
            <Text style={styles.chatActionTitle}>Chat options</Text>
            <TouchableOpacity style={styles.chatActionBtn} onPress={openChatFromSheet}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#007AFF" />
              <Text style={styles.chatActionBtnText}>Open chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatActionBtn} onPress={toggleFavoriteChat}>
              <Ionicons name={actionChat.isFavorite ? 'heart' : 'heart-outline'} size={18} color="#FF2D55" />
              <Text style={styles.chatActionBtnText}>{actionChat.isFavorite ? 'Remove from favorites' : 'Add to favorites'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatActionBtn} onPress={openGroupModal}>
              <Ionicons name="people-outline" size={18} color="#34C759" />
              <Text style={styles.chatActionBtnText}>{actionChat.groupName ? 'Change group…' : 'Add to group…'}</Text>
            </TouchableOpacity>
            {actionChat.groupName && (
              <TouchableOpacity style={styles.chatActionBtn} onPress={removeFromGroup}>
                <Ionicons name="remove-circle-outline" size={18} color="#FF3B30" />
                <Text style={[styles.chatActionBtnText, { color: '#FF3B30' }]}>Remove from group</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.chatActionBtn} onPress={toggleUnreadChat}>
              <Ionicons name={actionChat.unreadCount && actionChat.unreadCount > 0 ? 'mail-open-outline' : 'mail-unread-outline'} size={18} color="#FFB300" />
              <Text style={styles.chatActionBtnText}>{actionChat.unreadCount && actionChat.unreadCount > 0 ? 'Mark as read' : 'Mark as unread'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatActionBtn} onPress={deleteChat}>
              <Ionicons name="trash" size={18} color="#FF3B30" />
              <Text style={[styles.chatActionBtnText, { color: '#FF3B30' }]}>Delete chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatActionCancel} onPress={closeChatActionSheet}>
              <Text style={styles.chatActionCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}

      {/* Group Creation Modal */}
      <Modal
        visible={groupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <View style={styles.groupModalOverlay}>
          <View style={styles.groupModalContainer}>
            <Text style={styles.groupModalTitle}>Create/Update Group</Text>
            <TextInput
              style={styles.groupModalInput}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Group name"
              placeholderTextColor="#9ca3af"
            />
            <Text style={styles.groupModalSubtitle}>Add members</Text>
            <FlatList
              data={chats}
              keyExtractor={item => item.id}
              style={{ maxHeight: 260 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.memberItem} onPress={() => toggleSelectMember(item.id)}>
                  <Ionicons
                    name={selectedMemberIds.includes(item.id) ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={selectedMemberIds.includes(item.id) ? '#25D366' : '#9ca3af'}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.memberName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.groupModalButtons}>
              <TouchableOpacity style={styles.groupCancelBtn} onPress={() => setGroupModalVisible(false)}>
                <Text style={styles.groupCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.groupSaveBtn} onPress={saveGroup}>
                <Text style={styles.groupSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  chatActionOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chatActionSheet: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 18,
  },
  chatActionTitle: {
    fontSize: 14,
    color: '#8E8E93',
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  chatActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  chatActionBtnText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  chatActionCancel: {
    marginTop: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  chatActionCancelText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  groupModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  groupModalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },
  groupModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },
  groupModalSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 10,
    marginBottom: 8,
  },
  groupModalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  memberName: {
    fontSize: 15,
    color: '#111',
  },
  groupModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  groupCancelBtn: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  groupCancelText: {
    color: '#374151',
    fontWeight: '600',
  },
  groupSaveBtn: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  groupSaveText: {
    color: '#fff',
    fontWeight: '700',
  },
  groupSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
  },
});

export default ChatListScreen;
