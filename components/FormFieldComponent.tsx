import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { FormField as FormFieldType } from '../types/navigation';

interface Props {
  field: FormFieldType;
  value: string;
  onChangeText: (value: string) => void;
  onFileSelect?: () => void;
  selectedFileName?: string;
}

const FormFieldComponent: React.FC<Props> = ({
  field,
  value,
  onChangeText,
  onFileSelect,
  selectedFileName,
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <TextInput
            label={field.label + (field.required ? ' *' : '')}
            value={value}
            onChangeText={onChangeText}
            placeholder={field.placeholder}
            multiline
            numberOfLines={4}
            style={styles.input}
            mode="outlined"
          />
        );
      
      case 'select':
        return (
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>
              {field.label}{field.required ? ' *' : ''}
            </Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue: string) => onChangeText(itemValue)}
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
          <View style={styles.fileContainer}>
            <Text style={styles.fileLabel}>
              {field.label}{field.required ? ' *' : ''}
            </Text>
            <Button
              mode="outlined"
              onPress={onFileSelect}
              style={styles.fileButton}
            >
              {selectedFileName || 'Select File'}
            </Button>
          </View>
        );
      
      default:
        return (
          <TextInput
            label={field.label + (field.required ? ' *' : '')}
            value={value}
            onChangeText={onChangeText}
            placeholder={field.placeholder}
            keyboardType={
              field.type === 'email' 
                ? 'email-address' 
                : field.type === 'phone' 
                ? 'phone-pad' 
                : 'default'
            }
            style={styles.input}
            mode="outlined"
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderField()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default FormFieldComponent;