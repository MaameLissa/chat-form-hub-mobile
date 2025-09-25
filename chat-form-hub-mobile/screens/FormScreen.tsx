import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { TextInput, Button, Text, Card, Title, Paragraph } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { RootStackParamList, FormField } from '../types/navigation';

type FormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Form'>;
type FormScreenRouteProp = RouteProp<RootStackParamList, 'Form'>;

interface Props {
  navigation: FormScreenNavigationProp;
  route: FormScreenRouteProp;
}

const FormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { templateId, templateName } = route.params;
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fileData, setFileData] = useState<Record<string, any>>({});

  // Form templates (same as in HomeScreen - in a real app, this would be shared)
  const getFormFields = (templateId: string): FormField[] => {
    const templates = {
      'customer-details': [
        { id: 'name', label: 'Full Name', type: 'text' as const, required: true, placeholder: 'Enter your full name' },
        { id: 'phone', label: 'Phone Number', type: 'phone' as const, required: true, placeholder: '+1 (555) 123-4567' },
        { id: 'email', label: 'Email Address', type: 'email' as const, required: true, placeholder: 'john@example.com' },
        { id: 'items', label: 'Items Ordered', type: 'textarea' as const, required: true, placeholder: 'List the items you want to order...' },
        { id: 'delivery_address', label: 'Delivery Address', type: 'textarea' as const, required: true, placeholder: 'Enter your complete delivery address...' },
        { id: 'special_instructions', label: 'Special Instructions', type: 'textarea' as const, required: false, placeholder: 'Any special delivery instructions...' }
      ],
      'service-booking': [
        { id: 'name', label: 'Full Name', type: 'text' as const, required: true, placeholder: 'Enter your full name' },
        { id: 'phone', label: 'Phone Number', type: 'phone' as const, required: true, placeholder: '+1 (555) 123-4567' },
        { id: 'service_type', label: 'Service Type', type: 'select' as const, required: true, options: ['Installation', 'Repair', 'Maintenance', 'Consultation'] },
        { id: 'preferred_date', label: 'Preferred Date', type: 'text' as const, required: true, placeholder: 'MM/DD/YYYY' },
        { id: 'description', label: 'Service Description', type: 'textarea' as const, required: true, placeholder: 'Describe the service you need...' }
      ],
      'feedback': [
        { id: 'name', label: 'Your Name', type: 'text' as const, required: true, placeholder: 'Enter your name' },
        { id: 'email', label: 'Email Address', type: 'email' as const, required: true, placeholder: 'your@email.com' },
        { id: 'rating', label: 'Rating', type: 'select' as const, required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
        { id: 'feedback', label: 'Your Feedback', type: 'textarea' as const, required: true, placeholder: 'Tell us about your experience...' },
        { id: 'suggestions', label: 'Suggestions', type: 'textarea' as const, required: false, placeholder: 'Any suggestions for improvement...' }
      ],
      'contact-form': [
        { id: 'name', label: 'Full Name', type: 'text' as const, required: true, placeholder: 'Enter your full name' },
        { id: 'phone', label: 'Phone Number', type: 'phone' as const, required: true, placeholder: '+1 (555) 123-4567' },
        { id: 'email', label: 'Email Address', type: 'email' as const, required: true, placeholder: 'your@email.com' },
        { id: 'subject', label: 'Subject', type: 'text' as const, required: true, placeholder: 'What is this about?' },
        { id: 'message', label: 'Message', type: 'textarea' as const, required: true, placeholder: 'Your message...' }
      ]
    };
    return templates[templateId as keyof typeof templates] || [];
  };

  const fields = getFormFields(templateId);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFileSelect = async (fieldId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFileData(prev => ({ ...prev, [fieldId]: result.assets[0] }));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const validateForm = (): boolean => {
    const missingFields = fields
      .filter(field => field.required && field.type !== 'file' && !formData[field.id])
      .map(field => field.label);

    if (missingFields.length > 0) {
      Alert.alert(
        'Missing Required Fields',
        `Please fill in the following fields: ${missingFields.join(', ')}`
      );
      return false;
    }
    return true;
  };

  const generateWhatsAppMessage = (): string => {
    let message = `*${templateName} Form Submission*\n\n`;
    
    fields.forEach(field => {
      const value = formData[field.id];
      if (value) {
        message += `*${field.label}:* ${value}\n`;
      }
    });

    // Add file information if any
    const fileFields = Object.keys(fileData);
    if (fileFields.length > 0) {
      message += '\n*Attached Files:*\n';
      fileFields.forEach(fieldId => {
        const field = fields.find(f => f.id === fieldId);
        const file = fileData[fieldId];
        if (field && file) {
          message += `- ${field.label}: ${file.name}\n`;
        }
      });
    }

    message += `\n_Submitted via WhatsApp Forms Mobile App_`;
    return encodeURIComponent(message);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const whatsappMessage = generateWhatsAppMessage();
    const whatsappUrl = `whatsapp://send?text=${whatsappMessage}`;

    Alert.alert(
      'Send via WhatsApp',
      'This will open WhatsApp with your form data. You can then send it to the desired contact.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open WhatsApp', 
          onPress: () => {
            Linking.openURL(whatsappUrl).catch(() => {
              Alert.alert('Error', 'Could not open WhatsApp. Please make sure WhatsApp is installed.');
            });
          }
        }
      ]
    );
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <TextInput
            key={field.id}
            label={field.label + (field.required ? ' *' : '')}
            value={formData[field.id] || ''}
            onChangeText={(value) => handleInputChange(field.id, value)}
            placeholder={field.placeholder}
            multiline
            numberOfLines={4}
            style={styles.input}
            mode="outlined"
          />
        );
      
      case 'select':
        return (
          <View key={field.id} style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>
              {field.label}{field.required ? ' *' : ''}
            </Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={formData[field.id] || ''}
                onValueChange={(value: string) => handleInputChange(field.id, value)}
              >
                <Picker.Item label="Select an option..." value="" />
                {field.options?.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>
        );
      
      case 'file':
        return (
          <View key={field.id} style={styles.fileContainer}>
            <Text style={styles.fileLabel}>
              {field.label}{field.required ? ' *' : ''}
            </Text>
            <Button
              mode="outlined"
              onPress={() => handleFileSelect(field.id)}
              style={styles.fileButton}
            >
              {fileData[field.id] ? fileData[field.id].name : 'Select File'}
            </Button>
          </View>
        );
      
      default:
        return (
          <TextInput
            key={field.id}
            label={field.label + (field.required ? ' *' : '')}
            value={formData[field.id] || ''}
            onChangeText={(value) => handleInputChange(field.id, value)}
            placeholder={field.placeholder}
            keyboardType={field.type === 'email' ? 'email-address' : field.type === 'phone' ? 'phone-pad' : 'default'}
            style={styles.input}
            mode="outlined"
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Card style={styles.headerCard}>
            <Card.Content>
              <Title style={styles.formTitle}>{templateName}</Title>
              <Paragraph style={styles.formDescription}>
                Fill out the form below and submit via WhatsApp
              </Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.formCard}>
            <Card.Content>
              {fields.map(field => (
                <View key={field.id} style={styles.fieldContainer}>
                  {renderField(field)}
                </View>
              ))}

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                contentStyle={styles.submitButtonContent}
                labelStyle={styles.submitButtonLabel}
              >
                Send via WhatsApp
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#075E54',
    textAlign: 'center',
  },
  formDescription: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  formCard: {
    elevation: 4,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
  },
  pickerContainer: {
    marginBottom: 8,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: 'white',
  },
  fileContainer: {
    marginBottom: 8,
  },
  fileLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  fileButton: {
    borderColor: '#25D366',
  },
  submitButton: {
    backgroundColor: '#25D366',
    marginTop: 20,
    paddingVertical: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  submitButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FormScreen;