import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
  StatusBar,
  Pressable,
  Modal,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../types/navigation';
import * as Clipboard from 'expo-clipboard';
import { Audio } from 'expo-av';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isBot: boolean;
  isLink?: boolean;
  delivered?: boolean;
  read?: boolean;
  imageUri?: string;
  isVoice?: boolean;
  audioUri?: string;
  durationSeconds?: number;
  starred?: boolean;
  attachments?: Array<{
    name: string;
    uri: string;
    type: string;
  }>;
}

type ChatConversationScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ChatConversationScreen = ({ route }: any) => {
  const navigation = useNavigation<ChatConversationScreenNavigationProp>();
  const [message, setMessage] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [actionSheetMessage, setActionSheetMessage] = useState<Message | null>(null);
  const [soundObj, setSoundObj] = useState<Audio.Sound | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [viewingImageLoading, setViewingImageLoading] = useState(false);
  
  const { chatId, chatName, formData, fileData, formType, dashboardResponses } = route?.params || { chatId: '1', chatName: 'Enchanté Lissa' };
  const displayName = chatName || 'Unknown Contact';
  
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
  
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  useEffect(() => {
    // Only add form message if it came from route params and wasn't already persisted
    if (formData && formType && !messages.some(msg => 
      msg.text.includes(`📋 ${formType}`) && 
      msg.timestamp === new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    )) {
      // Create a form message when form data is received
      addFormMessage(formData, formType, fileData);
    }
    
    // Handle multiple dashboard responses
    if (dashboardResponses && dashboardResponses.length > 0) {
      dashboardResponses.forEach((response: any, index: number) => {
        setTimeout(() => {
          addFormMessage(
            response.data, 
            response.type, 
            response.uploadedFiles
          );
        }, index * 500); // Stagger the messages by 500ms
      });
    }
  }, [formData, formType, fileData, dashboardResponses, messages]);

  useEffect(() => {
    return () => {
      if (soundObj) {
        soundObj.unloadAsync();
      }
      if (recording) {
        recording.stopAndUnloadAsync().catch(()=>{});
      }
    };
  }, [soundObj, recording]);

  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(`messages_${chatId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Load default messages for first time
        const defaultMessages = getMessagesForChat(chatId);
        setMessages(defaultMessages);
        await AsyncStorage.setItem(`messages_${chatId}`, JSON.stringify(defaultMessages));
      }
    } catch (error) {
      console.log('Error loading messages:', error);
      setMessages(getMessagesForChat(chatId));
    }
  };

  const saveMessages = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(`messages_${chatId}`, JSON.stringify(newMessages));
    } catch (error) {
      console.log('Error saving messages:', error);
    }
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

  const addFormMessage = async (formData: any, formType: string, fileData?: any) => {
    // Format form data into a readable message
    let formText = `📋 ${formType} Submitted:\n\n`;
    Object.keys(formData || {}).forEach(key => {
      const value = formData[key];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        const fieldName = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/_/g, ' ')
          .replace(/^./, str => str.toUpperCase());
        formText += `${fieldName}: ${value}\n`;
      }
    });

    // Build attachments array (supports array or object input)
    const attachments: Array<{ name: string; uri: string; type: string }> = [];
    if (fileData) {
      if (Array.isArray(fileData)) {
        fileData.forEach(f => {
          if (f && (f.uri || f.url)) {
            attachments.push({
              name: f.name || 'file',
              uri: f.uri || f.url || '',
              type: f.type || f.mimeType || 'file'
            });
          }
        });
      } else if (typeof fileData === 'object') {
        Object.keys(fileData).forEach(key => {
          const f = fileData[key];
            if (f && (f.uri || f.url)) {
              attachments.push({
                name: f.name || key,
                uri: f.uri || f.url || '',
                type: f.type || f.mimeType || 'file'
              });
            }
        });
      }
    }

    // Do NOT set imageUri for form submissions; show all files as attachments below text
    const formMessage: Message = {
      id: Date.now().toString(),
      text: formText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBot: false,
      delivered: true,
      read: true,
      attachments: attachments.length ? attachments : undefined,
    };

    const updatedMessages = [...messages, formMessage];
    setMessages(updatedMessages);
    await saveMessages(updatedMessages);
    
    // Update the chat list with the form message
    await updateChatLastMessage(`📋 ${formType} submitted`, formMessage.timestamp);
  };

  const updateChatLastMessage = async (messageText: string, timestamp: string) => {
    try {
      const storedChats = await AsyncStorage.getItem('chats');
      if (storedChats) {
        const chats = JSON.parse(storedChats);
        const updatedChats = chats.map((chat: any) => 
          chat.id === chatId 
            ? { ...chat, lastMessage: messageText, timestamp: timestamp }
            : chat
        );
        await AsyncStorage.setItem('chats', JSON.stringify(updatedChats));
      }
    } catch (error) {
      console.log('Error updating chat list:', error);
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        timestamp: timestamp,
        isBot: false,
        delivered: true,
        read: true,
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      await saveMessages(updatedMessages);
      
      // Update the chat list with the latest message
      await updateChatLastMessage(message.trim(), timestamp);
      
      setMessage('');
    }
  };

  const handleAttachment = () => {
    setShowQuickActions(!showQuickActions);
  };

  const handleCamera = () => {
    Alert.alert(
      'Select Media',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => takePhoto() },
        { text: 'Choose from Gallery', onPress: () => chooseFromGallery() },
        { text: 'Record Video', onPress: () => recordVideo() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos. Please enable it in settings.');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage: Message = {
          id: Date.now().toString(),
          text: 'Photo',
          timestamp: timestamp,
          isBot: false,
          delivered: true,
          read: true,
          imageUri: imageUri,
        };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        await saveMessages(updatedMessages);
        await updateChatLastMessage('📷 Photo', timestamp);
      }
    } catch (error) {
      console.error('Photo capture error:', error);
      Alert.alert('Camera Error', 'Failed to take photo. Please check your camera and try again.');
    }
  };

  const chooseFromGallery = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Gallery permission is required to select photos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const mediaUri = result.assets[0].uri;
        const mediaType = result.assets[0].type || 'image';
        const messageText = mediaType.startsWith('video') ? 'Video' : 'Photo';
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage: Message = {
          id: Date.now().toString(),
          text: messageText,
          timestamp: timestamp,
          isBot: false,
          delivered: true,
          read: true,
          imageUri: mediaUri,
        };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        await saveMessages(updatedMessages);
        await updateChatLastMessage(mediaType.startsWith('video') ? '🎬 Video' : '📷 Photo', timestamp);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select media from gallery');
    }
  };

  const recordVideo = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to record videos');
        return;
      }

      // Launch camera for video
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 30, // 30 seconds max
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage: Message = {
          id: Date.now().toString(),
          text: 'Video',
          timestamp: timestamp,
          isBot: false,
          delivered: true,
          read: true,
          imageUri: videoUri, // Using imageUri for videos too for simplicity
        };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        await saveMessages(updatedMessages);
        await updateChatLastMessage('🎬 Video', timestamp);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to record video');
    }
  };

  const handleVoice = () => {
    if (recording) {
      sendVoiceMessage();
    } else {
      startVoiceRecording();
    }
  };

  const startVoiceRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Microphone access is required to record voice messages');
        return;
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      
      await rec.startAsync();
      setRecording(rec);
      
      Alert.alert(
        'Recording Voice Message',
        'Recording... Tap the mic button again to stop and send.',
        [{ text: 'Cancel', onPress: () => stopRecording(), style: 'cancel' }]
      );
    } catch (e) {
      console.log('Recording error:', e);
      Alert.alert('Error', 'Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      } catch (e) {
        console.log('Stop recording error:', e);
      }
    }
  };

  const sendVoiceMessage = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const status = await recording.getStatusAsync();
      const duration = (status as any).durationMillis ? Math.round((status as any).durationMillis / 1000) : undefined;
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage: Message = {
        id: Date.now().toString(),
        text: 'Voice message',
        timestamp: timestamp,
        isBot: false,
        delivered: true,
        read: true,
        isVoice: true,
        audioUri: uri || undefined,
        durationSeconds: duration,
      };
      const updated = [...messages, newMessage];
      setMessages(updated);
      await saveMessages(updated);
      await updateChatLastMessage('🎤 Voice message', timestamp);
      setRecording(null);
    } catch (e) {
      Alert.alert('Error','Failed to save voice message');
    }
  };

  const togglePlayVoice = async (m: Message) => {
    try {
      if (!m.audioUri) return;
      if (playingId === m.id) {
        // stop
        if (soundObj) {
          await soundObj.stopAsync();
          await soundObj.unloadAsync();
          setSoundObj(null);
        }
        setPlayingId(null);
        return;
      }
      if (soundObj) {
        await soundObj.stopAsync();
        await soundObj.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync({ uri: m.audioUri }, { shouldPlay: true });
      setSoundObj(sound);
      setPlayingId(m.id);
      sound.setOnPlaybackStatusUpdate((st: any) => {
        if (st.didJustFinish) {
          setPlayingId(null);
          sound.unloadAsync();
          setSoundObj(null);
        }
      });
    } catch (e) {
      Alert.alert('Error','Playback failed');
    }
  };

  const onLongPressMessage = (m: Message) => {
    setActionSheetMessage(m);
  };

  const copyMessage = async () => {
    if (actionSheetMessage) {
      await Clipboard.setStringAsync(actionSheetMessage.text);
      Alert.alert('Copied','Message copied to clipboard');
      setActionSheetMessage(null);
    }
  };

  const toggleStar = async () => {
    if (!actionSheetMessage) return;
    const updated = messages.map(msg => msg.id === actionSheetMessage.id ? { ...msg, starred: !msg.starred } : msg);
    setMessages(updated);
    await saveMessages(updated);
    setActionSheetMessage(null);
  };

  const deleteMessage = async () => {
    if (!actionSheetMessage) return;
    const updated = messages.filter(msg => msg.id !== actionSheetMessage.id);
    setMessages(updated);
    await saveMessages(updated);
    setActionSheetMessage(null);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <Pressable onLongPress={() => onLongPressMessage(item)} style={[
      styles.messageContainer,
      item.isBot ? styles.botMessage : styles.userMessage,
      item.starred && { borderWidth:1, borderColor:'#FFD700' }
    ]}>
      {item.imageUri && !item.text.startsWith('📋') ? (
        <TouchableOpacity onPress={() => {
          console.log('Opening main image:', item.imageUri);
          setViewingImage(item.imageUri!);
        }}>
          <View style={styles.mediaMessage}>
            <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
            {item.text ? (
              <View style={styles.mediaCaption}>
                <Text style={styles.mediaCaptionText}>{item.text}</Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      ) : item.isVoice ? (
        <View style={styles.voiceMessage}>
          <TouchableOpacity onPress={() => togglePlayVoice(item)}>
            <Ionicons name={playingId === item.id ? 'pause-circle' : 'play-circle'} size={24} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.voiceWaveform}>
            <View style={styles.waveformBars}>
              {[...Array(8)].map((_, i) => (
                <View key={i} style={[styles.waveformBar, { height: Math.random() * 20 + 5 }]} />
              ))}
            </View>
          </View>
          <Text style={styles.voiceDuration}>{item.durationSeconds ?? 0}s</Text>
        </View>
      ) : (
        <>
          {!!item.text && (
            <Text style={[
              styles.messageText,
              item.isLink && styles.linkText
            ]}>
              {item.text}
            </Text>
          )}
          {item.attachments && item.attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {item.attachments.map((attachment, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.attachmentItem}
                  onPress={() => {
                    if (attachment.type.startsWith('image/') && attachment.uri) {
                      console.log('Opening image:', attachment.uri);
                      setViewingImage(attachment.uri);
                    } else if (attachment.uri) {
                      Linking.openURL(attachment.uri).catch(() => {
                        Alert.alert('Error', `Cannot open ${attachment.name}`);
                      });
                    } else {
                      Alert.alert('Error', 'File not available');
                    }
                  }}
                >
                  {attachment.type.startsWith('image/') && attachment.uri ? (
                    <View style={styles.attachmentImageContainer}>
                      <Image 
                        source={{ uri: attachment.uri }} 
                        style={styles.attachmentThumbnail}
                        resizeMode="cover"
                      />
                      <View style={styles.attachmentImageOverlay}>
                        <Ionicons name="expand" size={16} color="#fff" />
                      </View>
                    </View>
                  ) : (
                    <Ionicons 
                      name="document" 
                      size={20} 
                      color="#007AFF" 
                    />
                  )}
                  <Text style={styles.attachmentName}>{attachment.name}</Text>
                  <Ionicons name={attachment.type.startsWith('image/') ? 'eye' : 'download'} size={16} color="#007AFF" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}
      <View style={styles.messageFooter}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        {!item.isBot && (
          <View style={styles.ticksContainer}>
            <Ionicons 
              name="checkmark-done" 
              size={16} 
              color={item.read ? "#4FC3F7" : "#8E8E93"} 
            />
          </View>
        )}
      </View>
    </Pressable>
  );

  const handleQuickAction = (action: string) => {
    console.log(`${action} pressed`);
    setShowQuickActions(false); // Hide the panel after selection
    
    if (action === 'Form') {
      // Navigate to Home screen (WhatsApp Business Form Page) to choose form
      navigation.navigate('Home', {
        chatId: chatId,
        chatName: displayName,
      });
    }
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Document')}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="document-text" size={28} color="#007AFF" />
          </View>
          <Text style={styles.quickActionText}>Document</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Camera')}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="camera" size={28} color="#FF3B30" />
          </View>
          <Text style={styles.quickActionText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Gallery')}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E8' }]}>
            <Ionicons name="images" size={28} color="#34C759" />
          </View>
          <Text style={styles.quickActionText}>Gallery</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Audio')}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="headset" size={28} color="#FF9500" />
          </View>
          <Text style={styles.quickActionText}>Audio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Catalog')}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#F5F5F5' }]}>
            <Ionicons name="grid" size={28} color="#8E8E93" />
          </View>
          <Text style={styles.quickActionText}>Catalog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Quick Reply')}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#FFFDE7' }]}>
            <Ionicons name="flash" size={28} color="#FFCC02" />
          </View>
          <Text style={styles.quickActionText}>Quick Reply</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Location')}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E8' }]}>
            <Ionicons name="location" size={28} color="#10DC60" />
          </View>
          <Text style={styles.quickActionText}>Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Contact')}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="person" size={28} color="#007AFF" />
          </View>
          <Text style={styles.quickActionText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Poll')}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="bar-chart" size={28} color="#FF9500" />
          </View>
          <Text style={styles.quickActionText}>Poll</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Event')}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="calendar" size={28} color="#FF3B30" />
          </View>
          <Text style={styles.quickActionText}>Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('Form')}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E8' }]}>
            <Ionicons name="clipboard" size={28} color="#10DC60" />
          </View>
          <Text style={styles.quickActionText}>Form</Text>
        </TouchableOpacity>
        <View style={styles.quickAction}>
          {/* Empty space for better alignment */}
        </View>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor="#25D366" barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Chat')}
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
                <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{displayName}</Text>
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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      />

      {/* Quick Actions - Only show when attachment button is pressed */}
      {showQuickActions && renderQuickActions()}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        style={styles.keyboardAvoidingView}
        enabled={true}
      >
        <View style={styles.inputContainer}>
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
            <TouchableOpacity style={[styles.voiceButton, recording && styles.recordingButton]} onPress={handleVoice}>
              <Ionicons name={recording ? "stop" : "mic"} size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        </View>
      </KeyboardAvoidingView>

      {/* Image Viewer Modal */}
      <Modal
        visible={viewingImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setViewingImage(null)}
        statusBarTranslucent={true}
        onShow={() => console.log('Modal shown, viewing image:', viewingImage)}
      >
        <View style={styles.imageViewerOverlay}>
          <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
          <TouchableOpacity 
            style={styles.imageViewerClose} 
            onPress={() => setViewingImage(null)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          <View style={styles.imageViewerContainer}>
            {viewingImage && (
              <>
                {viewingImageLoading && (
                  <View style={styles.imageViewerLoadingWrapper}>
                    <Text style={styles.imageViewerLoadingText}>Loading...</Text>
                  </View>
                )}
                <Image
                  source={{ uri: viewingImage }}
                  style={styles.imageViewerImage}
                  resizeMode="contain"
                  onLoadStart={() => setViewingImageLoading(true)}
                  onLoad={() => setViewingImageLoading(false)}
                  onError={(e) => {
                    console.log('Image load error:', e);
                    setViewingImageLoading(false);
                    Alert.alert('Error','Failed to load image');
                    setViewingImage(null);
                  }}
                />
              </>
            )}
          </View>
        </View>
      </Modal>

      {actionSheetMessage && (
        <View style={styles.actionSheetOverlay}>
          <View style={styles.actionSheet}>
            <Text style={styles.actionSheetTitle}>Message actions</Text>
            <TouchableOpacity style={styles.actionSheetBtn} onPress={copyMessage}><Ionicons name="copy" size={18} color="#007AFF" /><Text style={styles.actionSheetBtnText}>Copy</Text></TouchableOpacity>
            <TouchableOpacity style={styles.actionSheetBtn} onPress={toggleStar}><Ionicons name={actionSheetMessage.starred ? 'star' : 'star-outline'} size={18} color="#FFB300" /><Text style={styles.actionSheetBtnText}>{actionSheetMessage.starred ? 'Unstar' : 'Star'}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.actionSheetBtn} onPress={deleteMessage}><Ionicons name="trash" size={18} color="#FF3B30" /><Text style={[styles.actionSheetBtnText,{color:'#FF3B30'}]}>Delete</Text></TouchableOpacity>
            <TouchableOpacity style={styles.actionSheetCancel} onPress={()=>setActionSheetMessage(null)}><Text style={styles.actionSheetCancelText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5DDD5',
    margin: 0,
    padding: 0,
  },
  header: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flexShrink: 1,
  },
  userStatus: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
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
    lineHeight: 20,
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 11,
    color: '#8E8E93',
    marginRight: 4,
  },
  ticksContainer: {
    marginLeft: 2,
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
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
  },
  keyboardAvoidingView: {
    backgroundColor: 'transparent',
  },
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    minHeight: Platform.OS === 'ios' ? 80 : 60,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 8,
    minHeight: 44,
  },
  attachButton: {
    marginRight: 8,
    padding: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    minHeight: 36,
    maxHeight: 80,
  },
  textInput: {
    fontSize: 14,
    color: '#000',
    minHeight: 24,
    paddingVertical: 0,
  },
  cameraButton: {
    marginRight: 8,
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#25D366',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButton: {
    backgroundColor: '#25D366',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mediaMessage: {
    borderRadius: 12,
    overflow: 'hidden',
    maxWidth: 200,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  mediaCaption: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  mediaCaptionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 150,
  },
  voiceWaveform: {
    flex: 1,
    marginHorizontal: 8,
  },
  waveformBars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
  },
  waveformBar: {
    width: 2,
    backgroundColor: '#007AFF',
    borderRadius: 1,
  },
  voiceDuration: {
    fontSize: 12,
    color: '#8E8E93',
    minWidth: 25,
    textAlign: 'right',
  },
  attachmentsContainer: {
    marginTop: 8,
    gap: 6,
  },
  attachmentsTitle: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    marginBottom: 4,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  attachmentImageContainer: {
    position: 'relative',
  },
  attachmentThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  attachmentImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSheetOverlay:{
    position:'absolute',
    top:0,left:0,right:0,bottom:0,
    backgroundColor:'rgba(0,0,0,0.4)',
    justifyContent:'flex-end'
  },
  actionSheet:{
    backgroundColor:'#fff',
    padding:20,
    paddingBottom:30,
    borderTopLeftRadius:16,
    borderTopRightRadius:16,
    minHeight:200,
  },
  actionSheetTitle:{
    fontSize:18,
    fontWeight:'600',
    marginBottom:20,
    textAlign:'center',
    color:'#000'
  },
  actionSheetBtn:{
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:15,
    paddingHorizontal:5,
    gap:12,
    minHeight:50,
  },
  actionSheetBtnText:{
    fontSize:16,
    color:'#000',
    fontWeight:'500',
  },
  actionSheetCancel:{
    marginTop:15,
    paddingVertical:15,
    alignItems:'center',
    borderTopWidth:1,
    borderTopColor:'#E5E5EA'
  },
  actionSheetCancelText:{
    fontSize:16,
    color:'#007AFF',
    fontWeight:'600'
  },
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  imageViewerClose: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
  },
  imageViewerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  imageViewerImage: {
    width: '100%',
    height: '85%',
  },
  imageViewerLoadingWrapper: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  imageViewerLoadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ChatConversationScreen;
