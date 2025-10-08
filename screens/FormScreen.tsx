import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking, Text, TextInput, TouchableOpacity, Platform, Modal, KeyboardAvoidingView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, FormField } from '../types/navigation';
import LocationPicker from '../components/LocationPicker';
import { getFormConfig } from '../components/forms';
import { useFormContext } from '../context/FormContext';

type FormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Form'>;
type FormScreenRouteProp = RouteProp<RootStackParamList, 'Form'>;

interface Props {
  navigation: FormScreenNavigationProp;
  route: FormScreenRouteProp;
}

const FormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { templateId, templateName, customConfig } = route.params || {};
  const chatId = (route.params as any)?.chatId;
  const chatName = (route.params as any)?.chatName;
  const { addSubmittedForm } = useFormContext();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fileData, setFileData] = useState<Record<string, any>>({});
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{latitude: number; longitude: number} | null>(null);
  const [showSavedTemplates, setShowSavedTemplates] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastTitle, setToastTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateNameInput, setTemplateNameInput] = useState('');
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState(false);
  const [showCustomFormNameModal, setShowCustomFormNameModal] = useState(false);
  const [customFormName, setCustomFormName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Load saved templates from AsyncStorage on component mount
  useEffect(() => {
    const loadSavedTemplates = async () => {
      try {
        const storedTemplates = await AsyncStorage.getItem(`saved-templates-${templateId}`);
        if (storedTemplates) {
          setSavedTemplates(JSON.parse(storedTemplates));
        } else {
          // Set default templates if none exist
          const defaultTemplates = getDefaultTemplates();
          setSavedTemplates(defaultTemplates);
          if (defaultTemplates.length > 0) {
            await AsyncStorage.setItem(`saved-templates-${templateId}`, JSON.stringify(defaultTemplates));
          }
        }
      } catch (error) {
        console.error('Error loading saved templates:', error);
        setSavedTemplates(getDefaultTemplates());
      }
    };

    const getDefaultTemplates = () => {
      // Service Booking templates
      if (templateId === 'service-booking') {
        return [
          {
            id: '1',
            name: 'Installation Service',
            createdDate: '23/09/25',
            data: {
              name: 'Michael Brown',
              phone: '+233 024 567 890',
              service_type: 'Installation',
              preferred_date: '10/15/2025',
              description: 'Air conditioning unit installation for residential property'
            }
          },
          {
            id: '2', 
            name: 'Monthly Maintenance',
            createdDate: '25/09/25',
            data: {
              name: 'Jennifer Wilson',
              phone: '+233 055 123 456',
              service_type: 'Maintenance',
              preferred_date: '10/20/2025',
              description: 'Regular monthly maintenance check for HVAC system'
            }
          }
        ];
      }
      
      // Customer Details templates (original templates)
      if (templateId === 'customer-details') {
        return [
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
        ];
      }
      
      // Default empty array for other forms
      return [];
    };

    loadSavedTemplates();
  }, [templateId]);

  // Get form configuration from separate files or use custom config
  const { formConfig, fields, formTitle, formSubtitle } = useMemo(() => {
    const config = customConfig || getFormConfig(templateId);
    return {
      formConfig: config,
      fields: config?.fields || [],
      formTitle: config?.title || templateName,
      formSubtitle: config?.subtitle || 'Complete the form below'
    };
  }, [customConfig, templateId, templateName]);

  // Debug logging (removed for production)

  const handleInputChange = useCallback((fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[fieldId]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  }, [fieldErrors]);

  const [currentAddressFieldId, setCurrentAddressFieldId] = useState<string>('');

  const handleLocationSelect = useCallback((address: string, coordinates: { latitude: number; longitude: number }) => {
    if (currentAddressFieldId) {
      setFormData(prev => ({ ...prev, [currentAddressFieldId]: address }));
    } else {
      // Fallback to legacy field name
      setFormData(prev => ({ ...prev, delivery_address: address }));
    }
    setSelectedCoordinates(coordinates);
  }, [currentAddressFieldId]);

  const handleFileSelect = async (fieldId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        
        // Validate file size (10MB limit)
        if (selectedFile.size && selectedFile.size > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a file smaller than 10MB.');
          return;
        }
        
        console.log('File selected:', {
          name: selectedFile.name,
          uri: selectedFile.uri,
          type: selectedFile.mimeType,
          size: selectedFile.size
        });
        
        setFileData(prev => {
          const updated = { ...prev, [fieldId]: selectedFile };
          console.log('Updated fileData state:', updated);
          return updated;
        });
        
        // Show success feedback
        Alert.alert('File Selected', `${selectedFile.name} has been selected successfully.`);
      }
    } catch (err) {
      console.error('File selection error:', err);
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  const validateForm = useCallback((): boolean => {
    const missingFields = fields
      .filter(field => field.required && field.type !== 'file' && !formData[field.id])
      .map(field => field.label);

    if (missingFields.length > 0) {
      Alert.alert(
        'Missing Required Fields',
        `Please fill in the following fields:\n\n• ${missingFields.join('\n• ')}`,
        [{ text: 'OK', style: 'default' }]
      );
      return false;
    }

    // Validate email format
    const emailFields = fields.filter(field => field.type === 'email');
    for (const field of emailFields) {
      const email = formData[field.id];
      if (email && !/\S+@\S+\.\S+/.test(email)) {
        Alert.alert(
          'Invalid Email',
          `Please enter a valid email address for ${field.label}.`
        );
        return false;
      }
    }

    // Validate phone format
    const phoneFields = fields.filter(field => field.type === 'phone');
    for (const field of phoneFields) {
      const phone = formData[field.id];
      if (phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
        Alert.alert(
          'Invalid Phone Number',
          `Please enter a valid phone number for ${field.label}.`
        );
        return false;
      }
    }

    return true;
  }, [fields, formData]);

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

  const handleSubmit = useCallback(() => {
    if (isSubmitting || !validateForm()) {
      return;
    }

    // If it's a custom form, show naming modal first
    if (customConfig) {
      setShowCustomFormNameModal(true);
      return;
    }

    // For predefined forms, submit directly
    performSubmit(templateName);
  }, [isSubmitting, validateForm, customConfig, templateName]);

  const performSubmit = useCallback(async (finalFormName: string) => {
    setIsSubmitting(true);
    
    try {
      // DEBUG: Log file data before processing
      console.log('DEBUG performSubmit - fileData:', fileData);
      console.log('DEBUG performSubmit - fileData keys:', Object.keys(fileData || {}));
      
      // Create uploaded files array if there are any files
      const uploadedFiles = Object.keys(fileData).length > 0 
        ? Object.keys(fileData).map(fieldId => ({
            name: fileData[fieldId].name || 'Uploaded File',
            type: fileData[fieldId].mimeType || 'file',
            uri: fileData[fieldId].uri || ''
          }))
        : undefined;
        
      console.log('DEBUG performSubmit - uploadedFiles:', uploadedFiles);

      // Determine form type based on templateId and customConfig
      let formType: 'Customer Details' | 'Service Booking' | 'Feedback' | 'Contact' | 'Custom Form';
      
      // Priority check: if customConfig exists, it's always a custom form
      if (customConfig) {
        formType = 'Custom Form';
      } else {
        switch (templateId) {
          case 'customer-details':
            formType = 'Customer Details';
            break;
          case 'service-booking':
            formType = 'Service Booking';
            break;
          case 'feedback':
            formType = 'Feedback';
            break;
          case 'contact-form':
            formType = 'Contact';
            break;
          case 'custom-form':
          case 'dynamic-custom-form':
            formType = 'Custom Form';
            break;
          default:
            formType = 'Customer Details';
        }
      }

      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // Add the form to the global context
      addSubmittedForm({
        type: formType,
        templateName: finalFormName,
        data: { ...formData },
        uploadedFiles,
      });

      // If we have a chatId, persist the form message directly to chat
      if (chatId) {
        await persistFormToChat(finalFormName, chatId);
      }

      // Show success modal
      setShowSubmitSuccessModal(true);
    } catch (error) {
      Alert.alert(
        'Submission Error',
        'Failed to submit form. Please check your connection and try again.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [fileData, customConfig, templateId, formData, addSubmittedForm]);

  const handleCustomFormNameConfirm = () => {
    const finalName = customFormName.trim() || 'Custom Form';
    setShowCustomFormNameModal(false);
    performSubmit(finalName);
    setCustomFormName('');
  };

  const handleSubmitAnother = () => {
    setShowSubmitSuccessModal(false);
    // Clear form data for new submission - but keep a backup of files for debugging
    console.log('DEBUG: Clearing form data. Current fileData:', fileData);
    setFormData({});
    setFileData({});
  };

  // Function to persist form message directly to chat storage
  const persistFormToChat = async (finalFormName: string, chatId: string) => {
    try {
      // Format form data into a readable message
      let formText = `📋 ${finalFormName} Submitted:\n\n`;
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

      // Build attachments array - DEBUG VERSION
      const attachments: Array<{ name: string; uri: string; type: string }> = [];
      console.log('DEBUG persistFormToChat - fileData:', fileData);
      console.log('DEBUG persistFormToChat - fileData keys:', Object.keys(fileData || {}));
      
      if (fileData && Object.keys(fileData).length > 0) {
        Object.keys(fileData).forEach(fieldId => {
          const file = fileData[fieldId];
          console.log('DEBUG persistFormToChat - processing file:', fieldId, file);
          if (file && file.uri) {
            const attachment = {
              name: file.name || 'Uploaded File',
              uri: file.uri,
              type: file.mimeType || 'file'
            };
            console.log('DEBUG persistFormToChat - adding attachment:', attachment);
            attachments.push(attachment);
          }
        });
      }
      console.log('DEBUG persistFormToChat - final attachments:', attachments);

      // Create the message object
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formMessage = {
        id: Date.now().toString(),
        text: formText.trim(),
        timestamp: timestamp,
        isBot: false,
        delivered: true,
        read: true,
        attachments: attachments.length ? attachments : undefined,
      };
      
      console.log('DEBUG persistFormToChat - final message object:', formMessage);

      // Load existing messages
      const savedMessages = await AsyncStorage.getItem(`messages_${chatId}`);
      const messages = savedMessages ? JSON.parse(savedMessages) : [];
      
      // Add new form message
      const updatedMessages = [...messages, formMessage];
      await AsyncStorage.setItem(`messages_${chatId}`, JSON.stringify(updatedMessages));

      // Update chat list last message
      const storedChats = await AsyncStorage.getItem('chats');
      if (storedChats) {
        const chats = JSON.parse(storedChats);
        const updatedChats = chats.map((chat: any) => 
          chat.id === chatId 
            ? { ...chat, lastMessage: `📋 ${finalFormName} submitted`, timestamp: timestamp }
            : chat
        );
        await AsyncStorage.setItem('chats', JSON.stringify(updatedChats));
      }

      return true;
    } catch (error) {
      console.error('Error persisting form to chat:', error);
      return false;
    }
  };

  const handleGoHome = () => {
    setShowSubmitSuccessModal(false);
    // Navigate to the main WhatsApp chat list screen
    navigation.navigate('Chat');
  };

  const handleViewInChat = () => {
    setShowSubmitSuccessModal(false);
    if (chatId && chatName) {
      navigation.navigate('ChatConversation', {
        chatId: chatId,
        chatName: chatName,
      });
    }
  };

  const handleSendToChat = () => {
    setShowSubmitSuccessModal(false);
    // Navigate to contact selection with form data
    navigation.navigate('SelectContact', {
      forwardData: [{
        id: Date.now().toString(),
        type: customConfig ? 'Custom Form' : (templateName as 'Customer Details' | 'Service Booking' | 'Feedback' | 'Contact' | 'Custom Form') || 'Custom Form',
        templateName: customFormName || templateName || 'Form',
        submittedAt: new Date().toLocaleString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
        data: { ...formData },
        uploadedFiles: Object.keys(fileData).length > 0 
          ? Object.keys(fileData).map(fieldId => ({
              name: fileData[fieldId].name || 'Uploaded File',
              type: fileData[fieldId].mimeType || 'file',
              uri: fileData[fieldId].uri || ''
            }))
          : undefined,
      }],
      fromForm: true
    });
  };

  const handleSaveTemplate = () => {
    // Check if form has data
    const hasData = Object.keys(formData).some(key => formData[key]?.trim());
    
    if (!hasData) {
      Alert.alert(
        'No Data to Save',
        'Please fill in some form fields before saving as a template.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    setTemplateNameInput('');
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    if (templateNameInput.trim()) {
      const newTemplate = {
        id: Date.now().toString(),
        name: templateNameInput.trim(),
        createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '/'),
        data: { ...formData }
      };
      
      const updatedTemplates = [...savedTemplates, newTemplate];
      setSavedTemplates(updatedTemplates);
      
      // Save to AsyncStorage
      try {
        await AsyncStorage.setItem(`saved-templates-${templateId}`, JSON.stringify(updatedTemplates));
      } catch (error) {
        console.error('Error saving template:', error);
      }
      
      // Show success toast
      setToastTitle('Template Saved!');
      setToastMessage(`Template "${templateNameInput.trim()}" has been saved.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      setShowSaveModal(false);
      setTemplateNameInput('');
    }
  };

  const renderField = useCallback((field: FormField) => {
    
    switch (field.type) {
      case 'textarea':
        return (
          <View style={styles.fieldGroup}>
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
          <View style={styles.fieldGroup}>
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
                  setCurrentAddressFieldId(field.id);
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
          <View style={styles.fieldGroup}>
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
        const hasFile = fileData[field.id];
        return (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TouchableOpacity 
              style={[
                styles.fileUploadButton,
                hasFile && styles.fileUploadButtonSelected
              ]}
              onPress={() => handleFileSelect(field.id)}
            >
              <Ionicons 
                name={hasFile ? "checkmark-circle" : "cloud-upload-outline"} 
                size={24} 
                color={hasFile ? "#10b981" : "#9ca3af"} 
              />
              <Text style={[
                styles.fileUploadText,
                hasFile && styles.fileUploadTextSelected
              ]}>
                {hasFile ? hasFile.name : field.placeholder}
              </Text>
              {hasFile ? (
                <Text style={styles.fileSelectedText}>✓ File selected - Tap to change</Text>
              ) : (
                <Text style={styles.fileFormatText}>JPG, PNG, PDF, DOCX formats, up to 10 MB</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      
      case 'date':
        return (
          <View style={styles.fieldGroup}>
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

      default:
        // Handle date fields specifically for legacy forms
        if (field.id === 'preferred_date' || field.label.toLowerCase().includes('date')) {
          return (
            <View style={styles.fieldGroup}>
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
          <View style={styles.fieldGroup}>
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
  }, [formData, fileData, showDropdown, showDatePicker, handleInputChange, handleFileSelect, setCurrentAddressFieldId, setShowLocationPicker]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        enabled={true}
      >
        {/* Custom Toast Notification */}
        {showToast && (
          <View style={styles.toastContainer}>
            <View style={styles.toast}>
              <Text style={styles.toastTitle}>{toastTitle}</Text>
              <Text style={styles.toastMessage}>{toastMessage}</Text>
            </View>
          </View>
        )}
        
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(300, keyboardHeight + 50) }
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{formTitle}</Text>
          <Text style={styles.subtitle}>{formSubtitle}</Text>
          
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
                        setToastTitle('Template Loaded!');
                        setToastMessage(`Template "${template.name}" has been loaded.`);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                    >
                      <Text style={styles.loadButtonText}>Load</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => {
                        Alert.alert(
                          'Delete Template',
                          `Are you sure you want to delete "${template.name}"?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: async () => {
                                const updatedTemplates = savedTemplates.filter((t: any) => t.id !== template.id);
                                setSavedTemplates(updatedTemplates);
                                
                                // Update AsyncStorage
                                try {
                                  await AsyncStorage.setItem(`saved-templates-${templateId}`, JSON.stringify(updatedTemplates));
                                } catch (error) {
                                  console.error('Error deleting template:', error);
                                }
                                
                                setToastTitle('Template Deleted!');
                                setToastMessage(`Template "${template.name}" has been deleted.`);
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 3000);
                              }
                            }
                          ]
                        );
                      }}
                    >
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
          {fields.map((field, index) => (
            <View key={`${field.id}-${index}`}>
              {renderField(field)}
            </View>
          ))}
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              // Navigate back to the previous screen in the navigation stack
              navigation.goBack();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveTemplateButton} 
            onPress={handleSaveTemplate}
            activeOpacity={0.7}
          >
            <Text style={styles.saveTemplateButtonText}>Save Template</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Submitting...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
      />

      {/* Save Template Modal */}
      <Modal
        visible={showSaveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Save Template</Text>
            <Text style={styles.modalSubtitle}>Enter a name for this template:</Text>
            
            <TextInput
              style={styles.modalInput}
              value={templateNameInput}
              onChangeText={setTemplateNameInput}
              placeholder="Template name"
              placeholderTextColor="#9ca3af"
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowSaveModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleConfirmSave}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Form Name Modal */}
      <Modal
        visible={showCustomFormNameModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          console.log('Modal close requested');
          setShowCustomFormNameModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Name Your Form</Text>
            <Text style={styles.modalSubtitle}>Give your custom form a memorable name:</Text>
            
            <TextInput
              style={styles.modalInput}
              value={customFormName}
              onChangeText={setCustomFormName}
              placeholder="e.g., Registration Form, Survey, etc."
              placeholderTextColor="#9ca3af"
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCustomFormNameModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleCustomFormNameConfirm}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveText}>Submit Form</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Submit Success Modal */}
      <Modal
        visible={showSubmitSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSubmitSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={32} color="#ffffff" />
            </View>
            
            <Text style={styles.successTitle}>Form Submitted!</Text>
            <Text style={styles.successMessage}>
              Thank you! Your form has been submitted successfully and saved to your dashboard.
              {chatId && ' The form has been added to your chat conversation.'}
            </Text>
            
            <View style={styles.successButtons}>
              {chatId && chatName ? (
                <>
                  <TouchableOpacity
                    style={styles.homeButton}
                    onPress={handleViewInChat}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.homeButtonText}>View in Chat</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.submitAnotherButton}
                    onPress={handleSubmitAnother}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.submitAnotherButtonText}>Submit Another</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.homeButton}
                    onPress={handleSendToChat}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.homeButtonText}>Send to Chat</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.submitAnotherButton}
                    onPress={handleSubmitAnother}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.submitAnotherButtonText}>Submit Another</Text>
                  </TouchableOpacity>
                </>
              )}
              
              <TouchableOpacity
                style={styles.homeButton}
                onPress={handleGoHome}
                activeOpacity={0.8}
              >
                <Text style={styles.homeButtonText}>Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    flexGrow: 1,
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
  fileUploadButtonSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  fileUploadTextSelected: {
    color: '#10b981',
    fontWeight: '600',
  },
  fileSelectedText: {
    fontSize: 12,
    color: '#10b981',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
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
    minHeight: 48,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 80,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#495057',
  },
  saveTemplateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    flex: 1,
  },
  saveTemplateButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#495057',
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#10b981',
    flex: 1,
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
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
  toastContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
    alignItems: 'center',
  },
  toast: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 280,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  toastMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 32,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  // Success Modal Styles
  successModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 40,
    marginHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    maxWidth: 400,
    width: '100%',
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  successButtons: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    marginTop: 16,
  },
  homeButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  submitAnotherButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitAnotherButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default FormScreen;