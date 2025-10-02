import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type CustomFormBuilderNavigationProp = StackNavigationProp<RootStackParamList, 'CustomFormBuilder'>;

interface Props {
  navigation: CustomFormBuilderNavigationProp;
}

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Dropdown' },
  { value: 'address', label: 'Address' },
  { value: 'file', label: 'File Upload' },
  { value: 'date', label: 'Date' },
];

const CustomFormBuilderScreen: React.FC<Props> = ({ navigation }) => {
  const [fields, setFields] = useState<FormField[]>([
    {
      id: '1',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
    }
  ]);
  const [showTypeDropdown, setShowTypeDropdown] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'New Field',
      type: 'text',
      placeholder: 'Enter placeholder text',
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => {
      if (field.id === fieldId) {
        const updatedField = { ...field, ...updates };
        
        // If changing to select type and no options exist, add default options
        if (updates.type === 'select' && !updatedField.options) {
          updatedField.options = ['Option 1', 'Option 2', 'Option 3'];
          updatedField.placeholder = 'Select an option...';
        }
        
        // If changing away from select type, remove options
        if (updates.type && updates.type !== 'select' && field.type === 'select') {
          delete updatedField.options;
        }
        
        return updatedField;
      }
      return field;
    }));
  };  const deleteField = (fieldId: string) => {
    if (fields.length === 1) {
      Alert.alert('Cannot Delete', 'You must have at least one field in your form.');
      return;
    }
    setFields(fields.filter(field => field.id !== fieldId));
  };

  const toggleRequired = (fieldId: string) => {
    setFields(fields.map(field =>
      field.id === fieldId ? { ...field, required: !field.required } : field
    ));
  };

  const handleUseForm = () => {
    // Validate that we have at least one field
    if (fields.length === 0) {
      Alert.alert('No Fields', 'Please add at least one field to your form.');
      return;
    }

    // Create a dynamic form configuration
    const formConfig = {
      title: 'Custom Form',
      subtitle: 'Fill out your custom form',
      fields: fields.map(field => ({
        id: field.label.toLowerCase().replace(/\s+/g, '_'),
        label: field.label,
        type: field.type as 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'file' | 'address' | 'date',
        placeholder: field.placeholder,
        required: field.required,
        options: field.options,
      }))
    };



    // Store the form configuration and navigate
    navigation.navigate('Form', {
      templateId: 'dynamic-custom-form',
      templateName: 'Custom Form',
      customConfig: formConfig,
    });
  };

  const renderFieldEditor = (field: FormField) => (
    <View key={field.id} style={styles.fieldCard}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldTitle}>Field {fields.indexOf(field) + 1}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteField(field.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Label Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Label</Text>
        <TextInput
          style={styles.textInput}
          value={field.label}
          onChangeText={(text) => updateField(field.id, { label: text })}
          placeholder="Field label"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Type Dropdown */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Type</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowTypeDropdown(showTypeDropdown === field.id ? null : field.id)}
        >
          <Text style={styles.dropdownText}>
            {fieldTypes.find(type => type.value === field.type)?.label || 'Text'}
          </Text>
          <Ionicons 
            name={showTypeDropdown === field.id ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#6b7280" 
          />
        </TouchableOpacity>
        
        {showTypeDropdown === field.id && (
          <View style={styles.dropdownList}>
            {fieldTypes.map((type, index) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.dropdownItem,
                  field.type === type.value && styles.dropdownItemSelected,
                  index === fieldTypes.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => {
                  updateField(field.id, { type: type.value });
                  setShowTypeDropdown(null);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  field.type === type.value && styles.dropdownItemTextSelected
                ]}>
                  {type.label}
                </Text>
                {field.type === type.value && (
                  <Ionicons name="checkmark" size={16} color="#10b981" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Placeholder Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Placeholder</Text>
        <TextInput
          style={styles.textInput}
          value={field.placeholder}
          onChangeText={(text) => updateField(field.id, { placeholder: text })}
          placeholder="Placeholder text"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Options Input - Only show for select fields */}
      {field.type === 'select' && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Options (one per line)</Text>
          <TextInput
            style={[styles.textInput, styles.optionsTextArea]}
            value={field.options?.join('\n') || ''}
            onChangeText={(text) => {
              const options = text.split('\n').filter(option => option.trim() !== '');
              updateField(field.id, { options });
            }}
            placeholder="Option 1&#10;Option 2&#10;Option 3"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
          />
        </View>
      )}

      {/* Required Toggle */}
      <TouchableOpacity
        style={styles.requiredToggle}
        onPress={() => toggleRequired(field.id)}
      >
        <View style={[
          styles.checkbox,
          field.required && styles.checkboxChecked
        ]}>
          {field.required && (
            <Ionicons name="checkmark" size={12} color="#ffffff" />
          )}
        </View>
        <Text style={styles.requiredText}>Required field</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Custom Form Builder</Text>
          <Text style={styles.subtitle}>Create your own custom form by adding and configuring fields</Text>
        </View>

        {/* Form Fields Section */}
        <View style={styles.fieldsSection}>
          <View style={styles.fieldsSectionHeader}>
            <Text style={styles.sectionTitle}>Form Fields</Text>
            <TouchableOpacity style={styles.addButton} onPress={addField}>
              <Ionicons name="add" size={16} color="#10b981" />
              <Text style={styles.addButtonText}>Add Field</Text>
            </TouchableOpacity>
          </View>

          {fields.map(field => renderFieldEditor(field))}
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Home');
            }
          }}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.useFormButton}
          onPress={handleUseForm}
        >
          <Text style={styles.useFormButtonText}>Use This Form</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  fieldsSection: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  fieldsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  fieldCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  deleteButton: {
    padding: 4,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  optionsTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    minHeight: 44,
  },
  dropdownText: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  dropdownList: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemSelected: {
    backgroundColor: '#f0fdf4',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1f2937',
  },
  dropdownItemTextSelected: {
    color: '#10b981',
    fontWeight: '500',
  },
  requiredToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  requiredText: {
    fontSize: 14,
    color: '#374151',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 12,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    flex: 1,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  useFormButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    flex: 2,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  useFormButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default CustomFormBuilderScreen;