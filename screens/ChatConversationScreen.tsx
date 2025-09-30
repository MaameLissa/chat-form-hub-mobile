import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isBot: boolean;
  isLink?: boolean;
}

const ChatConversationScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const { chatId, chatName } = route?.params || { chatId: '1', chatName: 'Enchanté Lissa' };
  
  const getMessagesForChat = (id: string): Message[] => {
    switch (id) {
      case '1': // Enchanté Lissa
        return [
          {
            id: '1',
            text: 'Can you accept my invitation so that I can get a GH¢52.60 free gift?',
            timestamp: '8:00 PM',
            isBot: true,
          },
          {
            id: '2',
            text: 'https://temu.com/u/cSmJN8M7921fwsfm',
            timestamp: '8:00 PM',
            isBot: true,
            isLink: true,
          },
          {
            id: '3',
            text: 'Accept my invite & Get freebies!',
            timestamp: '1:32 PM',
            isBot: false,
          },
          {
            id: '4',
            text: 'Click here and accept my invitation on Temu app! 🎁',
            timestamp: '1:32 PM',
            isBot: false,
          },
          {
            id: '5',
            text: 'temu.com',
            timestamp: '1:32 PM',
            isBot: false,
          },
          {
            id: '6',
            text: 'Accept my invite & Get freebies!',
            timestamp: '1:32 PM',
            isBot: false,
          },
          {
            id: '7',
            text: 'https://temu.com/u/lFzZqPSAxIzSSIv3',
            timestamp: '1:32 PM',
            isBot: false,
            isLink: true,
          },
        ];
      case '2': // Unc Danny
        return [
          {
            id: '1',
            text: 'Hey there! How are you doing?',
            timestamp: '9:15 AM',
            isBot: true,
          },
          {
            id: '2',
            text: "You're welcomeee",
            timestamp: '9:15 AM',
            isBot: true,
          },
        ];
      case '3': // King
        return [
          {
            id: '1',
            text: 'Before you join Follow this acct hooo',
            timestamp: '8:15 AM',
            isBot: true,
          },
        ];
      case '4': // Dad
        return [
          {
            id: '1',
            text: '📷 Photo',
            timestamp: '8:07 AM',
            isBot: true,
          },
        ];
      default:
        return [];
    }
  };
  
  const [messages, setMessages] = useState<Message[]>(getMessagesForChat(chatId));

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (id: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    return colors[parseInt(id) % colors.length];
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isBot: false,
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleAttachment = () => {
    setShowQuickActions(!showQuickActions);
  };

  const handleCamera = () => {
    // Handle camera logic
    console.log('Camera pressed');
  };

  const handleVoice = () => {
    // Handle voice message logic
    console.log('Voice pressed');
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isBot ? styles.botMessage : styles.userMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isLink && styles.linkText
      ]}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  const handleQuickAction = (action: string) => {
    console.log(`${action} pressed`);
    setShowQuickActions(false); // Hide the panel after selection
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Document')}>
          <Ionicons name="document-text" size={24} color="#007AFF" />
          <Text style={styles.quickActionText}>Document</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Camera')}>
          <Ionicons name="camera" size={24} color="#FF3B30" />
          <Text style={styles.quickActionText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Gallery')}>
          <Ionicons name="images" size={24} color="#34C759" />
          <Text style={styles.quickActionText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Audio')}>
          <Ionicons name="headset" size={24} color="#FF9500" />
          <Text style={styles.quickActionText}>Audio</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Catalog')}>
          <Ionicons name="grid" size={24} color="#8E8E93" />
          <Text style={styles.quickActionText}>Catalog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Quick Reply')}>
          <Ionicons name="flash" size={24} color="#FFCC02" />
          <Text style={styles.quickActionText}>Quick Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Location')}>
          <Ionicons name="location" size={24} color="#10DC60" />
          <Text style={styles.quickActionText}>Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Contact')}>
          <Ionicons name="person" size={24} color="#007AFF" />
          <Text style={styles.quickActionText}>Contact</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Poll')}>
          <Ionicons name="bar-chart" size={24} color="#FF9500" />
          <Text style={styles.quickActionText}>Poll</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Event')}>
          <Ionicons name="calendar" size={24} color="#FF3B30" />
          <Text style={styles.quickActionText}>Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Form')}>
          <Ionicons name="clipboard" size={24} color="#10DC60" />
          <Text style={styles.quickActionText}>Form</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.avatar}>
            {chatId === '1' ? (
              <Image
                source={require('../assets/meta-logo.jpeg')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.avatarCircle, { backgroundColor: getAvatarColor(chatId) }]}>
                <Text style={styles.avatarText}>{getInitials(chatName)}</Text>
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{chatName}</Text>
            <Text style={styles.userStatus}>online</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="videocam" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Quick Actions - Only show when attachment button is pressed */}
      {showQuickActions && renderQuickActions()}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton} onPress={handleAttachment}>
            <Ionicons name="attach" size={24} color="#8E8E93" />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Message"
              placeholderTextColor="#8E8E93"
              multiline
            />
          </View>
          <TouchableOpacity style={styles.cameraButton} onPress={handleCamera}>
            <Ionicons name="camera" size={24} color="#8E8E93" />
          </TouchableOpacity>
          {message.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.voiceButton} onPress={handleVoice}>
              <Ionicons name="mic" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5DDD5',
  },
  header: {
    backgroundColor: '#075E54',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  userStatus: {
    color: '#B3E5FC',
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 20,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    alignSelf: 'flex-end',
  },
  quickActionsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  attachButton: {
    marginRight: 8,
    padding: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  textInput: {
    fontSize: 16,
    color: '#000',
    minHeight: 20,
  },
  cameraButton: {
    marginRight: 8,
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#075E54',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButton: {
    backgroundColor: '#075E54',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatConversationScreen;
