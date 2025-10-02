import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation, route }: any) => {
  const { chatId, chatName } = route?.params || {};
  const formTemplates = [
    {
      id: 'customer-details',
      name: 'Customer Details',
      description: 'Collect basic customer and order information',
      icon: 'person-outline',
      color: '#10b981',
    },
    {
      id: 'service-booking',
      name: 'Service Booking',
      description: 'Schedule appointments',
      icon: 'construct-outline',
      color: '#6366f1',
    },
    {
      id: 'custom-form',
      name: 'Custom Form',
      description: 'Create your own form fields',
      icon: 'create-outline',
      color: '#8b5cf6',
    },
    {
      id: 'view-dashboard',
      name: 'View Dashboard',
      description: 'View form submissions',
      icon: 'bar-chart-outline',
      color: '#f59e0b',
    }
  ];

  const handleTemplateSelect = (templateId: string, templateName: string) => {
    if (templateId === 'view-dashboard') {
      navigation.navigate('Dashboard');
    } else if (templateId === 'custom-form') {
      navigation.navigate('CustomFormBuilder');
    } else {
      if (chatId && chatName) {
        // If we have chat context, reset the stack to go directly to form
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Form',
              params: {
                templateId,
                templateName,
                chatId,
                chatName,
              }
            }
          ],
        });
      } else {
        navigation.navigate('Form', {
          templateId,
          templateName,
          chatId,
          chatName,
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                if (chatId && chatName) {
                  // If we came from a chat, go directly back to that chat
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'ChatConversation',
                        params: {
                          chatId: chatId,
                          chatName: chatName,
                        }
                      }
                    ],
                  });
                } else if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  console.log('Already at home screen');
                }
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>WhatsApp Business Form</Text>
          </View>
          <Text style={styles.subtitle}>Choose a form to get started</Text>
        </View>

        {/* Form Options */}
        <View style={styles.formsContainer}>
          {formTemplates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.formCard}
              onPress={() => handleTemplateSelect(template.id, template.name)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: template.color }]}>
                <Ionicons name={template.icon as any} size={24} color="white" />
              </View>
              <View style={styles.formContent}>
                <Text style={styles.formTitle}>{template.name}</Text>
                <Text style={styles.formDescription}>{template.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    paddingHorizontal: 48, // Align with the title text
  },
  formsContainer: {
    paddingHorizontal: 20,
    gap: 0,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  formCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  formContent: {
    flex: 1,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  formDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
});

export default HomeScreen;