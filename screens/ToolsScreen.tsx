import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type ToolsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ToolsScreen = () => {
  const navigation = useNavigation<ToolsScreenNavigationProp>();

  const handleToolPress = (toolName: string) => {
    if (toolName === 'Forms') {
      navigation.navigate('Home');
    } else if (toolName === 'Form Builder') {
      navigation.navigate('CustomFormBuilder');
    } else if (toolName === 'Submitted Forms') {
      navigation.navigate('Dashboard');
    } else {
      Alert.alert(toolName, `${toolName} feature coming soon!`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tools</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Performance Stats */}
        <View style={styles.performanceSection}>
          <View style={styles.performanceHeader}>
            <Text style={styles.performanceTitle}>Last 7 days performance</Text>
            <TouchableOpacity>
              <Ionicons name="information-circle-outline" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={40} color="#8E8E93" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Conversations started</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="grid-outline" size={40} color="#8E8E93" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Catalog views</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={40} color="#8E8E93" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Status views</Text>
            </View>
          </View>

          <View style={styles.tradeHistoryItem}>
            <Ionicons name="refresh-outline" size={40} color="#8E8E93" />
            <View style={styles.tradeHistoryContent}>
              <Text style={styles.statNumber}>14</Text>
              <Text style={styles.statLabel}>Trade history</Text>
            </View>
          </View>
        </View>

        {/* For You Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For you</Text>
          
          <View style={styles.adCard}>
            <TouchableOpacity style={styles.adCloseButton}>
              <Ionicons name="close" size={20} color="#8E8E93" />
            </TouchableOpacity>
            <View style={styles.adContent}>
              <Ionicons name="megaphone" size={40} color="#007AFF" />
              <View style={styles.adText}>
                <Text style={styles.adTitle}>Create your first ad from $1.00/day</Text>
                <Text style={styles.adDescription}>
                  Reach potential customers with an ad that starts WhatsApp chats.
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.getStartedButton} onPress={() => handleToolPress('Create Ad')}>
              <Text style={styles.getStartedText}>Get started</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Grow Your Business Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grow your business</Text>
          
          <TouchableOpacity style={styles.toolItem} onPress={() => handleToolPress('Forms')}>
            <Ionicons name="document-outline" size={24} color="#25D366" />
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Forms</Text>
              <Text style={styles.toolDescription}>Create and fill customer forms</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolItem} onPress={() => handleToolPress('Form Builder')}>
            <Ionicons name="create-outline" size={24} color="#6366f1" />
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Form Builder</Text>
              <Text style={styles.toolDescription}>Build custom forms with drag & drop</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolItem} onPress={() => handleToolPress('Submitted Forms')}>
            <Ionicons name="folder-outline" size={24} color="#f59e0b" />
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Submitted Forms</Text>
              <Text style={styles.toolDescription}>View and manage form responses</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolItem} onPress={() => handleToolPress('Catalog')}>
            <Ionicons name="grid-outline" size={24} color="#000" />
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Catalog</Text>
              <Text style={styles.toolDescription}>Show products and services</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolItem} onPress={() => handleToolPress('Advertise')}>
            <Ionicons name="megaphone-outline" size={24} color="#000" />
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Advertise</Text>
              <Text style={styles.toolDescription}>Create ads that lead to WhatsApp</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolItem} onPress={() => handleToolPress('Trade')}>
            <Ionicons name="people-outline" size={24} color="#000" />
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Trade</Text>
              <Text style={styles.toolDescription}>Open P2P trades with customers in a secured way</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolItem} onPress={() => handleToolPress('Orders')}>
            <Ionicons name="document-text-outline" size={24} color="#000" />
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Orders</Text>
              <Text style={styles.toolDescription}>Manage orders and payments</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolItem} onPress={() => handleToolPress('Labels')}>
            <Ionicons name="pricetag-outline" size={24} color="#000" />
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Labels</Text>
              <Text style={styles.toolDescription}>Show products and services</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolItem} onPress={() => handleToolPress('Greeting message')}>
            <Ionicons name="chatbubble-outline" size={24} color="#000" />
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Greeting message</Text>
              <Text style={styles.toolDescription}>Show products and services</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
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
        <TouchableOpacity style={styles.bottomTab}>
          <Ionicons name="build-outline" size={24} color="#25D366" />
          <Text style={[styles.bottomTabText, styles.activeBottomTabText]}>Tools</Text>
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
  performanceSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  tradeHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tradeHistoryContent: {
    marginLeft: 15,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  adCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  adCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  adText: {
    flex: 1,
    marginLeft: 15,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  adDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  getStartedButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  toolContent: {
    flex: 1,
    marginLeft: 15,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  toolDescription: {
    fontSize: 14,
    color: '#8E8E93',
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
});

export default ToolsScreen;
