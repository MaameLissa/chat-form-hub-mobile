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

const HomeScreen: React.FC<Props> = ({ navigation }) => {
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
      id: 'view-dashboard',
      name: 'View Dashboard',
      description: 'View form submissions',
      icon: 'bar-chart-outline',
      color: '#f59e0b',
    }
  ];

  const handleTemplateSelect = (templateId: string, templateName: string) => {
    if (templateId === 'view-dashboard') {
      navigation.navigate('SubmittedForms');
    } else {
      navigation.navigate('Form', {
        templateId,
        templateName,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="logo-whatsapp" size={48} color="white" />
          </View>
          <Text style={styles.title}>WhatsApp Business Form</Text>
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
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#25d366',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#25d366',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  formsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  formCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  formContent: {
    flex: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  formDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default HomeScreen;