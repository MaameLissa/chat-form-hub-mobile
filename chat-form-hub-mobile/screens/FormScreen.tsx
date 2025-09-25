import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, FormField } from '../types/navigation';
import LocationPicker from '../components/LocationPicker';

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
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{latitude: number; longitude: number} | null>(null);
  const [showSavedTemplates, setShowSavedTemplates] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);
  const [savedTemplates] = useState([
    {
      id: '1',
      name: 'Regular Customer - Clothing',
      createdDate: '23/09/25',
      data: {
        name: 'John Smith',
        phone: '+233 024 567 890',
        items: 'T-shirts, Jeans, Sneakers',
        delivery_address: '123 Osu Street, Accra, Ghana',
        additional_instructions: 'Call before delivery'
      }
    },
    {
      id: '2', 
      name: 'Express Delivery Order',
      createdDate: '25/09/25',
      data: {
        name: 'Sarah Johnson',
        phone: '+233 055 123 456',
        items: 'Electronics, Headphones',
        delivery_address: '456 East Legon, Accra, Ghana',
        additional_instructions: 'Urgent delivery needed'
      }
    }
  ]);

  // Form templates for customer details matching the design
  const getFormFields = (templateId: string) => {
    const templates = {
      'customer-details': [
        { id: 'name', label: 'Full Name', type: 'text' as const, required: true, placeholder: 'Enter your full name' },
        { id: 'phone', label: 'Phone Number', type: 'phone' as const, required: true, placeholder: '+233 045 677 898' },
        { id: 'items', label: 'Item(s) to Order', type: 'textarea' as const, required: true, placeholder: 'List the items you want to order...' },
        { id: 'delivery_address', label: 'Delivery Address', type: 'address' as const, required: true, placeholder: 'Full delivery address' },
        { id: 'additional_instructions', label: 'Additional Instructions', type: 'textarea' as const, required: false, placeholder: 'Any additional requirement or notes...' },
        { id: 'product_images', label: 'Product Images/References', type: 'file' as const, required: false, placeholder: 'Click to upload file' }
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

  const handleLocationSelect = (address: string, coordinates: { latitude: number; longitude: number }) => {
    setFormData(prev => ({ ...prev, delivery_address: address }));
    setSelectedCoordinates(coordinates);
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

  const renderField = (field: any) => {
    switch (field.type) {
      case 'textarea':
        return (
          <View key={field.id} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              value={formData[field.id] || ''}
              onChangeText={(value) => handleInputChange(field.id, value)}
              placeholder={field.placeholder}
              multiline
              numberOfLines={4}
              style={[styles.textInput, styles.textAreaInput]}
              placeholderTextColor="#9ca3af"
            />
          </View>
        );
      
      case 'address':
        return (
          <View key={field.id} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <View style={styles.addressInputContainer}>
              <TextInput
                value={formData[field.id] || ''}
                onChangeText={(value) => handleInputChange(field.id, value)}
                placeholder={field.placeholder}
                style={[styles.textInput, styles.addressInput]}
                placeholderTextColor="#9ca3af"
                multiline
              />
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={() => {
                  console.log('Location button pressed');
                  setShowLocationPicker(true);
                }}
              >
                <Ionicons name="location-outline" size={20} color="#10b981" />
              </TouchableOpacity>
            </View>
          </View>
        );
      
      case 'select':
        return (
          <View key={field.id} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowDropdown(showDropdown === field.id ? null : field.id)}
            >
              <Text style={[
                styles.dropdownButtonText, 
                !formData[field.id] && styles.dropdownPlaceholderText
              ]}>
                {formData[field.id] || 'Select an option...'}
              </Text>
              <Ionicons 
                name={showDropdown === field.id ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#6b7280" 
              />
            </TouchableOpacity>
            {showDropdown === field.id && (
              <View style={styles.dropdownList}>
                {field.options?.map((option: string) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      handleInputChange(field.id, option);
                      setShowDropdown(null);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );

      case 'file':
        return (
          <View key={field.id} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TouchableOpacity 
              style={styles.fileUploadButton}
              onPress={() => handleFileSelect(field.id)}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#9ca3af" />
              <Text style={styles.fileUploadText}>
                {fileData[field.id] ? fileData[field.id].name : field.placeholder}
              </Text>
              <Text style={styles.fileFormatText}>JPG, PNG, PDF, DOCX formats, up to 10 MB</Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        // Handle date fields specifically
        if (field.id === 'preferred_date' || field.label.toLowerCase().includes('date')) {
          return (
            <View key={field.id} style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowDatePicker(field.id)}
              >
                <Text style={[
                  styles.dateButtonText,
                  !formData[field.id] && styles.datePlaceholderText
                ]}>
                  {formData[field.id] || field.placeholder}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
              {showDatePicker === field.id && (
                <DateTimePicker
                  value={formData[field.id] ? new Date(formData[field.id]) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event: any, selectedDate?: Date) => {
                    setShowDatePicker(null);
                    if (selectedDate) {
                      const formattedDate = selectedDate.toLocaleDateString('en-US');
                      handleInputChange(field.id, formattedDate);
                    }
                  }}
                />
              )}
            </View>
          );
        }
        
        // Default text input for other fields
        return (
          <View key={field.id} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              value={formData[field.id] || ''}
              onChangeText={(value) => handleInputChange(field.id, value)}
              placeholder={field.placeholder}
              keyboardType={field.type === 'email' ? 'email-address' : field.type === 'phone' ? 'phone-pad' : 'default'}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
            />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{templateName}</Text>
          <Text style={styles.subtitle}>
            {templateId === 'service-booking' ? 'Schedule Appointments' : 
             templateId === 'feedback' ? 'Share Your Experience' :
             templateId === 'contact-form' ? 'Get In Touch' :
             'Complete customer and order information'}
          </Text>
          
          {/* Saved Templates Section */}
          <View style={styles.savedTemplatesSection}>
            <Text style={styles.savedTemplatesText}>Saved Templates</Text>
            <TouchableOpacity 
              style={styles.showButton}
              onPress={() => setShowSavedTemplates(!showSavedTemplates)}
            >
              <Ionicons name="bookmark-outline" size={16} color="#6b7280" />
              <Text style={styles.showButtonText}>{showSavedTemplates ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          {/* Saved Templates List */}
          {showSavedTemplates && (
            <View style={styles.savedTemplatesList}>
              {savedTemplates.map((template) => (
                <View key={template.id} style={styles.templateCard}>
                  <View style={styles.templateInfo}>
                    <Text style={styles.templateName}>{template.name}</Text>
                    <Text style={styles.templateDate}>Created {template.createdDate}</Text>
                  </View>
                  <View style={styles.templateActions}>
                    <TouchableOpacity 
                      style={styles.loadButton}
                      onPress={() => {
                        setFormData(template.data);
                        setShowSavedTemplates(false);
                      }}
                    >
                      <Text style={styles.loadButtonText}>Load</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton}>
                      <Ionicons name="trash-outline" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {fields.map(field => renderField(field))}
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveTemplateButton}>
            <Text style={styles.saveTemplateButtonText}>Save Template</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  savedTemplatesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  savedTemplatesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  showButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  showButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  savedTemplatesList: {
    marginTop: 16,
    gap: 12,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  templateDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  templateActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  loadButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  formContainer: {
    paddingHorizontal: 24,
    gap: 20,
    paddingBottom: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  textAreaInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  addressInput: {
    flex: 1,
    borderWidth: 0,
    margin: 0,
  },
  locationButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  fileUploadButton: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    gap: 8,
  },
  fileUploadText: {
    fontSize: 14,
    color: '#6b7280',
  },
  fileFormatText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#1f2937',
  },
  dropdownPlaceholderText: {
    color: '#9ca3af',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1f2937',
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  saveTemplateButton: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    flex: 1,
    justifyContent: 'center',
  },
  saveTemplateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#10b981',
    flex: 1,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  datePlaceholderText: {
    color: '#9ca3af',
  },
});

export default FormScreen;