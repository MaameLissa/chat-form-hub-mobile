import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Text, Chip, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { SubmittedForm } from '../types/navigation';

const SubmittedFormsScreen: React.FC = () => {
  const [submittedForms, setSubmittedForms] = useState<SubmittedForm[]>([
    {
      id: '1',
      type: 'Customer Details',
      templateName: 'Customer Details',
      data: {
        name: 'John Smith',
        phone: '+1 (555) 123-4567',
        email: 'john@example.com',
        items: 'iPhone 15 Pro Max, AirPods Pro',
        delivery_address: '123 Main St, New York, NY 10001',
        special_instructions: 'Please call before delivery'
      },
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: '2',
      type: 'Service Booking',
      templateName: 'Service Booking',
      data: {
        name: 'Sarah Johnson',
        phone: '+1 (555) 987-6543',
        service_type: 'Installation',
        preferred_date: '12/20/2024',
        description: 'Need to install new security system'
      },
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      id: '3',
      type: 'Feedback',
      templateName: 'Feedback Form',
      data: {
        name: 'Michael Chen',
        email: 'michael@example.com',
        rating: 'Excellent',
        feedback: 'Great service and very professional team!',
        suggestions: 'Maybe add more payment options'
      },
      submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
    },
    {
      id: '4',
      type: 'Contact',
      templateName: 'Contact Us',
      data: {
        name: 'Emma Davis',
        phone: '+1 (555) 321-0987',
        email: 'emma@example.com',
        subject: 'Product Inquiry',
        message: 'I would like to know more about your latest products and pricing.'
      },
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    }
  ]);

  const formatTimestamp = (submittedAt: string): string => {
    const now = new Date();
    const timestamp = new Date(submittedAt);
    const diff = now.getTime() - timestamp.getTime();
    const hours = diff / (1000 * 60 * 60);
    const days = hours / 24;

    if (hours < 1) {
      return 'Just now';
    } else if (hours < 24) {
      return `${Math.floor(hours)} hours ago`;
    } else if (days < 7) {
      return `${Math.floor(days)} days ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const getFormIcon = (templateName: string): string => {
    switch (templateName.toLowerCase()) {
      case 'customer details':
        return 'person';
      case 'service booking':
        return 'build';
      case 'feedback form':
        return 'feedback';
      case 'contact us':
        return 'contact-mail';
      default:
        return 'description';
    }
  };

  const getStatusColor = (submittedAt: string): string => {
    const timestamp = new Date(submittedAt);
    const hours = (new Date().getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    if (hours < 24) return '#4CAF50'; // Green for recent
    if (hours < 48) return '#FF9800'; // Orange for yesterday
    return '#9E9E9E'; // Gray for older
  };

  const handleDeleteForm = (formId: string) => {
    Alert.alert(
      'Delete Form Response',
      'Are you sure you want to delete this form response? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSubmittedForms(prev => prev.filter(form => form.id !== formId));
          },
        },
      ]
    );
  };

  const renderFormItem = ({ item }: { item: SubmittedForm }) => (
    <Card style={styles.formCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Icon 
              name={getFormIcon(item.templateName)} 
              size={32} 
              color="#25D366" 
            />
          </View>
          <View style={styles.headerText}>
            <Title style={styles.formTitle}>{item.templateName}</Title>
            <View style={styles.statusRow}>
              <Chip 
                mode="outlined" 
                style={[styles.statusChip, { borderColor: getStatusColor(item.submittedAt) }]}
                textStyle={{ color: getStatusColor(item.submittedAt) }}
              >
                {formatTimestamp(item.submittedAt)}
              </Chip>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => handleDeleteForm(item.id)}
          >
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.formData}>
          {Object.entries(item.data).map(([key, value], index) => (
            <View key={key} style={styles.dataRow}>
              <Text style={styles.dataLabel}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
              </Text>
              <Text style={styles.dataValue}>{value}</Text>
              {index < Object.entries(item.data).length - 1 && (
                <Divider style={styles.dataDivider} />
              )}
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {submittedForms.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="inbox" size={80} color="#ccc" />
            <Title style={styles.emptyTitle}>No Form Responses Yet</Title>
            <Paragraph style={styles.emptyText}>
              Form responses will appear here once users submit forms via WhatsApp.
            </Paragraph>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Title style={styles.headerTitle}>Form Responses</Title>
              <Paragraph style={styles.headerSubtitle}>
                {submittedForms.length} response{submittedForms.length !== 1 ? 's' : ''} received
              </Paragraph>
            </View>
            
            <FlatList
              data={submittedForms}
              renderItem={renderFormItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#075E54',
  },
  headerSubtitle: {
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  formCard: {
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075E54',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
  },
  statusChip: {
    backgroundColor: 'transparent',
  },
  divider: {
    marginBottom: 12,
  },
  formData: {
    marginTop: 8,
  },
  dataRow: {
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  dataDivider: {
    marginTop: 8,
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    lineHeight: 22,
  },
});

export default SubmittedFormsScreen;