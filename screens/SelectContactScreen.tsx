import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Contact {
  id: string;
  name: string;
  subtitle: string;
  avatar?: any;
  type: 'option' | 'contact';
}

type SelectContactScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SelectContactScreen = () => {
  const navigation = useNavigation<SelectContactScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const contacts: Contact[] = [
    {
      id: 'new-group',
      name: 'New group',
      subtitle: '',
      type: 'option',
    },
    {
      id: 'new-contact',
      name: 'New contact',
      subtitle: '',
      type: 'option',
    },
    {
      id: 'muse-corp',
      name: 'Muse Corp (You)',
      subtitle: 'Message yourself',
      type: 'contact',
    },
    {
      id: 'roland',
      name: '_ROLAND OPPONG👑_',
      subtitle: 'WHAT IS WRITTEN IS WRITTEN🤚🏽 🏃🏽 👑',
      type: 'contact',
    },
    {
      id: 'phone-number',
      name: '+233 50 007 9470',
      subtitle: '',
      type: 'contact',
    },
    {
      id: 'thomas',
      name: '||>@M_THOMAS🏃🏽♻️•||',
      subtitle: '',
      type: 'contact',
    },
    {
      id: 'ally',
      name: '~Ally',
      subtitle: '',
      type: 'contact',
    },
    {
      id: 'grandson',
      name: '~Grandson',
      subtitle: 'On Mama 💯 🔥',
      type: 'contact',
    },
    {
      id: 'hameedv',
      name: '~Hameedv حفيد',
      subtitle: '🙏🏽 🙏🏽 كتييد الحمدانله كتييد',
      type: 'contact',
    },
    {
      id: 'kobby',
      name: '~Kobby',
      subtitle: 'Available',
      type: 'contact',
    },
    {
      id: 'robin',
      name: '~Robin',
      subtitle: 'DIFFERENT BREED 🌹',
      type: 'contact',
    },
  ];

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const handleContactPress = async (contact: Contact) => {
    if (contact.type === 'option') {
      // Handle option selection (New group, New contact)
      console.log('Selected option:', contact.name);
    } else {
      try {
        const stored = await AsyncStorage.getItem('chats');
        let chats: any[] = stored ? JSON.parse(stored) : [];
        if (!chats.find(c => c.id === contact.id)) {
          const newChat = {
            id: contact.id,
            name: contact.name.replace(/[~_👑🔥💯♻️]/g, '').trim(),
            lastMessage: '',
            timestamp: new Date().toLocaleDateString(),
            avatar: null,
          };
          chats = [newChat, ...chats];
          await AsyncStorage.setItem('chats', JSON.stringify(chats));
        }
      } catch (e) { console.log('persist chat error', e); }
      navigation.navigate('ChatConversation', { 
        chatId: contact.id, 
        chatName: contact.name.replace(/[~_👑🔥💯♻️]/g, '').trim()
      });
    }
  };

  const getInitials = (name: string) => {
    const cleanName = name.replace(/[~_@👑🔥💯♻️🏃🏽🤚🏽🙏🏽|>•حفيد كتييد الحمدانله]/g, '').trim();
    return cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (id: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    return colors[Math.abs(id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.contactItem} onPress={() => handleContactPress(item)}>
      <View style={styles.avatarContainer}>
        {item.type === 'option' ? (
          <View style={styles.optionIcon}>
            <Ionicons 
              name={item.id === 'new-group' ? 'people' : 'person-add'} 
              size={24} 
              color="#fff" 
            />
          </View>
        ) : item.id === 'muse-corp' ? (
          <View style={[styles.avatarInitials, { backgroundColor: '#007AFF' }]}>
            <Text style={styles.avatarInitialsText}>MC</Text>
          </View>
        ) : item.id === 'phone-number' ? (
          <View style={[styles.avatarInitials, { backgroundColor: '#FF69B4' }]}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
        ) : (
          <View style={[styles.avatarInitials, { backgroundColor: getAvatarColor(item.id) }]}>
            <Text style={styles.avatarInitialsText}>{getInitials(item.name)}</Text>
          </View>
        )}
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactName}>{item.name}</Text>
        {item.subtitle ? (
          <Text style={styles.contactSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        ) : null}
      </View>
      {item.id === 'new-contact' && (
        <TouchableOpacity style={styles.qrButton}>
          <Ionicons name="qr-code" size={20} color="#007AFF" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderSectionHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>Contacts on WhatsApp</Text>
    </View>
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const optionContacts = filteredContacts.filter(contact => contact.type === 'option');
  const regularContacts = filteredContacts.filter(contact => contact.type === 'contact');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Select contact</Text>
          <Text style={styles.headerSubtitle}>401 contacts</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={[...optionContacts, ...regularContacts]}
        renderItem={renderContactItem}
        keyExtractor={item => item.id}
        style={styles.contactsList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={optionContacts.length > 0 && regularContacts.length > 0 ? renderSectionHeader : null}
        ListHeaderComponentStyle={styles.listHeader}
      />
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 5,
    marginLeft: 15,
  },
  contactsList: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
  },
  sectionHeaderText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listHeader: {
    marginTop: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatarContainer: {
    marginRight: 16,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
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
  contactContent: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  qrButton: {
    padding: 8,
  },
});

export default SelectContactScreen;
