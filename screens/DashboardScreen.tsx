import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Alert,
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { useFormContext } from '../context/FormContext';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

interface FormResponse {
  id: string;
  type: 'Customer Details' | 'Service Booking' | 'Feedback' | 'Contact' | 'Custom Form';
  templateName: string;
  submittedAt: string;
  data: Record<string, any>;
  uploadedFiles?: {
    name: string;
    type: string;
    uri: string;
  }[];
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { submittedForms, deleteSubmittedForm } = useFormContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{uri: string, name: string} | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
  
  // Filter states
  const [dateFilter, setDateFilter] = useState('Last 3 Months');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [formTypeFilter, setFormTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Use submitted forms from context
  const formResponses = submittedForms;

  const filteredResponses = formResponses.filter(response => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const data = response.data;
      
      // Search through all data fields
      const searchableText = Object.values(data)
        .filter(value => typeof value === 'string')
        .join(' ')
        .toLowerCase();
      
      const matchesSearch = (
        searchableText.includes(query) ||
        response.type.toLowerCase().includes(query) ||
        response.templateName.toLowerCase().includes(query)
      );
      
      if (!matchesSearch) return false;
    }
    
    // Form type filter
    if (formTypeFilter !== 'All') {
      if (formTypeFilter === 'Customer Details' && response.type !== 'Customer Details') return false;
      if (formTypeFilter === 'Service Booking' && response.type !== 'Service Booking') return false;
      if (formTypeFilter === 'Feedback' && response.type !== 'Feedback') return false;
      if (formTypeFilter === 'Contact' && response.type !== 'Contact') return false;
      if (formTypeFilter === 'Custom Form' && response.type !== 'Custom Form') return false;
    }
    
    // Status filter (mock logic - all responses are "Submitted" for now)
    if (statusFilter !== 'All') {
      // In a real app, you'd check response.status
      if (statusFilter !== 'Submitted') return false;
    }
    
    return true;
  });

  const handleExportCSV = () => {
    Alert.alert(
      'Export CSV',
      'This feature would export all form responses to a CSV file.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleResetFilters = () => {
    setDateFilter('Last 3 Months');
    setCustomStartDate('');
    setCustomEndDate('');
    setFormTypeFilter('All');
    setStatusFilter('All');
  };

  const handleImagePress = (file: {name: string, type: string, uri: string}) => {
    if (file.type && file.type.includes('image')) {
      console.log('Opening image:', file.uri, 'Name:', file.name);
      setSelectedImage({ uri: file.uri, name: file.name });
    } else {
      Alert.alert('File Type', 'This file type is not supported for preview.');
    }
  };

  const handleDeleteResponse = (responseId: string, responseName: string, responseType: string) => {
    Alert.alert(
      'Delete Form Response',
      `Are you sure you want to delete this ${responseType} response from "${responseName}"?\n\nThis action cannot be undone and will permanently remove all data and uploaded files associated with this submission.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSubmittedForm(responseId);
            // Show success feedback
            Alert.alert(
              'Response Deleted',
              'The form response has been successfully deleted.',
              [{ text: 'OK', style: 'default' }]
            );
          },
        },
      ]
    );
  };

  const toggleMultiSelect = () => {
    setMultiSelectMode(!multiSelectMode);
    setSelectedResponses([]);
  };

  const toggleResponseSelection = (responseId: string) => {
    setSelectedResponses(prev => 
      prev.includes(responseId) 
        ? prev.filter(id => id !== responseId)
        : [...prev, responseId]
    );
  };

  const selectAllResponses = () => {
    if (selectedResponses.length === filteredResponses.length) {
      setSelectedResponses([]);
    } else {
      setSelectedResponses(filteredResponses.map(r => r.id));
    }
  };

  const handleForwardResponses = () => {
    if (selectedResponses.length === 0) {
      Alert.alert('No Selection', 'Please select at least one response to forward.');
      return;
    }

    const selectedData = formResponses.filter(r => selectedResponses.includes(r.id));
    
    Alert.alert(
      'Forward Responses',
      `Forward ${selectedResponses.length} selected response(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Forward', 
          onPress: () => {
            // Navigate to contact selection for forwarding
            navigation.navigate('SelectContact', {
              forwardData: selectedData,
              fromDashboard: true
            });
            setMultiSelectMode(false);
            setSelectedResponses([]);
          }
        }
      ]
    );
  };

  const handleSendToChat = () => {
    if (selectedResponses.length === 0) {
      Alert.alert('No Selection', 'Please select at least one response to send.');
      return;
    }

    Alert.alert(
      'Send to Current Chat',
      'Which chat would you like to send the selected responses to?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Enchanté Lissa', 
          onPress: () => sendResponsesToChat('1', 'Enchanté Lissa')
        },
        { 
          text: 'Choose Chat', 
          onPress: () => {
            // Navigate to chat selection
            navigation.navigate('Chat');
          }
        }
      ]
    );
  };

  const sendResponsesToChat = (chatId: string, chatName: string) => {
    const selectedData = formResponses.filter(r => selectedResponses.includes(r.id));
    
    // Format the data for chat - ensure it matches SubmittedForm interface
    const formattedData = selectedData.map(response => ({
      id: response.id,
      type: response.type,
      templateName: response.templateName,
      data: response.data,
      uploadedFiles: response.uploadedFiles,
      submittedAt: response.submittedAt
    }));

    navigation.navigate('ChatConversation', {
      chatId,
      chatName,
      formData: formattedData[0]?.data, // Send first response data
      fileData: formattedData[0]?.uploadedFiles, // Send first response files
      formType: `Dashboard Export (${selectedResponses.length} responses)`,
      dashboardResponses: formattedData // Send all responses
    });

    setMultiSelectMode(false);
    setSelectedResponses([]);
  };

  const renderFilterButton = (label: string, isSelected: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={[
        styles.filterOptionButton,
        isSelected && styles.filterOptionButtonSelected
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterOptionText,
        isSelected && styles.filterOptionTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderFormResponse = (response: FormResponse) => {
    const isServiceBooking = response.type === 'Service Booking';
    const isFeedback = response.type === 'Feedback';
    const isContact = response.type === 'Contact';
    const isCustomForm = response.type === 'Custom Form';
    const isSelected = selectedResponses.includes(response.id);
    
    return (
      <View key={response.id} style={[styles.responseCard, isSelected && styles.selectedCard]}>
        <View style={styles.responseHeader}>
          {multiSelectMode && (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => toggleResponseSelection(response.id)}
            >
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>
          )}
          <View style={styles.responseHeaderLeft}>
            <Text style={[
              styles.responseType,
              isServiceBooking ? styles.serviceBookingType : styles.customerDetailsType
            ]}>
              {response.type}
            </Text>
            <Text style={styles.responseTime}>{response.submittedAt}</Text>
          </View>
          {!multiSelectMode && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteResponse(response.id, response.data.name || 'Unknown', response.type)}
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.responseContent}>
          {/* Common fields */}
          {response.data.name && (
            <View style={styles.responseField}>
              <Text style={styles.fieldLabel}>Name:</Text>
              <Text style={styles.fieldValue}>{response.data.name}</Text>
            </View>
          )}

          {response.data.phone && (
            <View style={styles.responseField}>
              <Text style={styles.fieldLabel}>Phone:</Text>
              <Text style={styles.fieldValue}>{response.data.phone}</Text>
            </View>
          )}

          {response.data.email && (
            <View style={styles.responseField}>
              <Text style={styles.fieldLabel}>Email:</Text>
              <Text style={styles.fieldValue}>{response.data.email}</Text>
            </View>
          )}

          {/* Service Booking specific fields */}
          {isServiceBooking && (
            <>
              {response.data.service_type && (
                <View style={styles.responseField}>
                  <Text style={styles.fieldLabel}>Service Type:</Text>
                  <Text style={styles.fieldValue}>{response.data.service_type}</Text>
                </View>
              )}

              {response.data.preferred_date && (
                <View style={styles.responseField}>
                  <Text style={styles.fieldLabel}>Preferred Date:</Text>
                  <Text style={styles.fieldValue}>{response.data.preferred_date}</Text>
                </View>
              )}

              {response.data.description && (
                <View style={styles.responseField}>
                  <Text style={styles.fieldLabel}>Description:</Text>
                  <Text style={styles.fieldValue}>{response.data.description}</Text>
                </View>
              )}
            </>
          )}

          {/* Customer Details specific fields */}
          {!isServiceBooking && !isFeedback && !isContact && !isCustomForm && (
            <>
              {response.data.items && (
                <View style={styles.responseField}>
                  <Text style={styles.fieldLabel}>Items:</Text>
                  <Text style={styles.fieldValue}>{response.data.items}</Text>
                </View>
              )}

              {response.data.delivery_address && (
                <View style={styles.responseField}>
                  <Text style={styles.fieldLabel}>Delivery Address:</Text>
                  <Text style={styles.fieldValue}>{response.data.delivery_address}</Text>
                </View>
              )}

              {response.data.additional_instructions && (
                <View style={styles.responseField}>
                  <Text style={styles.fieldLabel}>Additional Instructions:</Text>
                  <Text style={styles.fieldValue}>{response.data.additional_instructions}</Text>
                </View>
              )}
            </>
          )}

          {/* Feedback specific fields */}
          {isFeedback && (
            <>
              {response.data.rating && (
                <View style={styles.responseField}>
                  <Text style={styles.fieldLabel}>Rating:</Text>
                  <Text style={styles.fieldValue}>{response.data.rating}</Text>
                </View>
              )}

              {response.data.feedback && (
                <View style={styles.responseField}>
                  <Text style={styles.fieldLabel}>Feedback:</Text>
                  <Text style={styles.fieldValue}>{response.data.feedback}</Text>
                </View>
              )}

              {response.data.suggestions && (
                <View style={styles.responseField}>
                  <Text style={styles.fieldLabel}>Suggestions:</Text>
                  <Text style={styles.fieldValue}>{response.data.suggestions}</Text>
                </View>
              )}
            </>
          )}

          {/* Contact form specific fields */}
          {isContact && (
            <>
              {response.data.subject && (
                <View style={styles.responseField}>
                  <Text style={styles.fieldLabel}>Subject:</Text>
                  <Text style={styles.fieldValue}>{response.data.subject}</Text>
                </View>
              )}

              {response.data.message && (
                <View style={styles.responseField}>
                  <Text style={styles.fieldLabel}>Message:</Text>
                  <Text style={styles.fieldValue}>{response.data.message}</Text>
                </View>
              )}
            </>
          )}

          {/* Custom form specific fields - Dynamic rendering */}
          {isCustomForm && (
            <>
              {Object.entries(response.data)
                .filter(([key, value]) => value && String(value).trim() !== '')
                .map(([key, value]) => {
                  // Format the field label
                  const label = key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
                  
                  return (
                    <View key={key} style={styles.responseField}>
                      <Text style={styles.fieldLabel}>{label}:</Text>
                      <Text style={styles.fieldValue}>{String(value)}</Text>
                    </View>
                  );
                })}
            </>
          )}

          {/* Uploaded files */}
          {response.uploadedFiles && response.uploadedFiles.length > 0 && (
            <View style={styles.uploadedFilesSection}>
              <Text style={styles.fieldLabel}>Uploaded Files:</Text>
              <View style={styles.filesGrid}>
                {response.uploadedFiles.map((file, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.fileImageContainer}
                    onPress={() => handleImagePress(file)}
                  >
                    {file.type && file.type.includes('image') ? (
                      <Image 
                        source={{ uri: file.uri }} 
                        style={styles.uploadedImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.fileImagePlaceholder}>
                        <Ionicons 
                          name="document-outline" 
                          size={32} 
                          color="#9ca3af" 
                        />
                      </View>
                    )}
                    <Text style={styles.fileName} numberOfLines={2}>
                      {file.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    );
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
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>View all submitted form responses</Text>
        </View>

        {/* Search and Filter Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search-outline" size={20} color="#9ca3af" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, phone, or type..."
                value={searchQuery}
                onChangeText={(text) => {
                  console.log('Search query changed:', text);
                  setSearchQuery(text);
                }}
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
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
          </View>
        </View>

        {/* Form Responses Header */}
        <View style={styles.responsesHeader}>
          <Text style={styles.responsesTitle}>
            Form Responses ({filteredResponses.length})
          </Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Form Responses List */}
        <View style={styles.responsesList}>
          {filteredResponses.length > 0 ? (
            filteredResponses.map(response => renderFormResponse(response))
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={48} color="#9ca3af" />
              <Text style={styles.noResultsTitle}>No results found</Text>
              <Text style={styles.noResultsText}>
                {searchQuery.trim() 
                  ? `No form responses match "${searchQuery}"`
                  : 'No form responses available'
                }
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionSection}>
          {!multiSelectMode ? (
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity 
                style={styles.exportButton}
                onPress={handleExportCSV}
              >
                <Ionicons name="download-outline" size={20} color="#10b981" />
                <Text style={styles.exportButtonText}>Export CSV</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={toggleMultiSelect}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#25D366" />
                <Text style={styles.selectButtonText}>Select Multiple</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.multiSelectControls}>
              <View style={styles.selectionInfo}>
                <Text style={styles.selectionCount}>
                  {selectedResponses.length} of {filteredResponses.length} selected
                </Text>
                <TouchableOpacity onPress={selectAllResponses}>
                  <Text style={styles.selectAllText}>
                    {selectedResponses.length === filteredResponses.length ? 'Deselect All' : 'Select All'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.multiSelectActions}>
                <TouchableOpacity 
                  style={styles.forwardButton}
                  onPress={handleForwardResponses}
                  disabled={selectedResponses.length === 0}
                >
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                  <Text style={styles.forwardButtonText}>Forward</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.sendToChatButton}
                  onPress={handleSendToChat}
                  disabled={selectedResponses.length === 0}
                >
                  <Ionicons name="chatbubble" size={20} color="#fff" />
                  <Text style={styles.sendToChatButtonText}>Send to Chat</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelSelectButton}
                  onPress={toggleMultiSelect}
                >
                  <Ionicons name="close" size={20} color="#ef4444" />
                  <Text style={styles.cancelSelectButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View style={styles.filterModalContainer}>
            {/* Filter Header */}
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter</Text>
              <TouchableOpacity 
                style={styles.filterCloseButton}
                onPress={() => setShowFilters(false)}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Filter by Date Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Filter by Date Range</Text>
                <View style={styles.filterOptionsRow}>
                  {renderFilterButton('Last 30 Days', dateFilter === 'Last 30 Days', () => setDateFilter('Last 30 Days'))}
                  {renderFilterButton('Last 3 Months', dateFilter === 'Last 3 Months', () => setDateFilter('Last 3 Months'))}
                </View>

                <Text style={[styles.filterSectionTitle, { marginTop: 20, marginBottom: 16 }]}>Custom Date Range</Text>
                <View style={styles.customDateRow}>
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateInputLabel}>Start Date</Text>
                    <TextInput
                      style={styles.dateInput}
                      placeholder="DD/MM/YYYY"
                      value={customStartDate}
                      onChangeText={setCustomStartDate}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateInputLabel}>End Date</Text>
                    <TextInput
                      style={styles.dateInput}
                      placeholder="DD/MM/YYYY"
                      value={customEndDate}
                      onChangeText={setCustomEndDate}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>
              </View>

              {/* Filter by Form Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Filter by Form Type</Text>
                <View style={styles.filterOptionsRow}>
                  {renderFilterButton('All', formTypeFilter === 'All', () => setFormTypeFilter('All'))}
                  {renderFilterButton('Customer Details', formTypeFilter === 'Customer Details', () => setFormTypeFilter('Customer Details'))}
                </View>
                <View style={styles.filterOptionsRow}>
                  {renderFilterButton('Service Booking', formTypeFilter === 'Service Booking', () => setFormTypeFilter('Service Booking'))}
                  {renderFilterButton('Feedback', formTypeFilter === 'Feedback', () => setFormTypeFilter('Feedback'))}
                </View>
                <View style={styles.filterOptionsRow}>
                  {renderFilterButton('Contact', formTypeFilter === 'Contact', () => setFormTypeFilter('Contact'))}
                  {renderFilterButton('Custom Form', formTypeFilter === 'Custom Form', () => setFormTypeFilter('Custom Form'))}
                </View>
              </View>

              {/* Filter by Status */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Filter by Status</Text>
                <View style={styles.filterOptionsRow}>
                  {renderFilterButton('All', statusFilter === 'All', () => setStatusFilter('All'))}
                  {renderFilterButton('Submitted', statusFilter === 'Submitted', () => setStatusFilter('Submitted'))}
                </View>
                <View style={styles.filterOptionsRow}>
                  {renderFilterButton('Pending', statusFilter === 'Pending', () => setStatusFilter('Pending'))}
                  {renderFilterButton('Completed', statusFilter === 'Completed', () => setStatusFilter('Completed'))}
                </View>
              </View>

              {/* Reset Filters */}
              <TouchableOpacity 
                style={styles.resetFiltersButton}
                onPress={handleResetFilters}
              >
                <Text style={styles.resetFiltersText}>Reset all Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Image Viewer Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
        statusBarTranslucent={true}
      >
        <View style={styles.imageModalOverlay}>
          {/* Header */}
          <View style={styles.imageModalHeader}>
            <Text style={styles.imageModalTitle} numberOfLines={1}>
              {selectedImage?.name || 'Image'}
            </Text>
            <TouchableOpacity 
              style={styles.imageModalCloseButton}
              onPress={() => {
                setSelectedImage(null);
                setImageLoading(false);
              }}
            >
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Main Image Area */}
          <View style={styles.imageViewArea}>
            {selectedImage && (
              <>
                {imageLoading && (
                  <View style={styles.imageLoadingContainer}>
                    <Text style={styles.imageLoadingText}>Loading...</Text>
                  </View>
                )}
                <Image 
                  source={{ uri: selectedImage.uri }} 
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                  onLoadStart={() => setImageLoading(true)}
                  onLoad={() => setImageLoading(false)}
                  onError={(error) => {
                    console.log('Image load error:', error);
                    setImageLoading(false);
                    Alert.alert('Error', 'Cannot load image');
                    setSelectedImage(null);
                  }}
                />
              </>
            )}
          </View>

          {/* Tap to close overlay */}
          <TouchableOpacity 
            style={styles.closeOverlay}
            activeOpacity={1}
            onPress={() => {
              setSelectedImage(null);
              setImageLoading(false);
            }}
          />
        </View>
      </Modal>
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
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  backButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  responsesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  responsesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  responsesList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  responseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  responseHeaderLeft: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
    minHeight: 36,
    shadowColor: '#ef4444',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  responseType: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  customerDetailsType: {
    color: '#10b981',
  },
  serviceBookingType: {
    color: '#10b981',
  },
  responseTime: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  responseContent: {
    gap: 12,
  },
  responseField: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  fieldValue: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  uploadedFilesSection: {
    marginTop: 8,
    gap: 8,
  },
  filesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filesGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  fileImageContainer: {
    width: 100,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: 80,
  },
  fileImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileItem: {
    flexDirection: 'row',
    gap: 4,
  },
  fileIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 10,
    color: '#6b7280',
    padding: 4,
    textAlign: 'center',
    lineHeight: 12,
  },

  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#10b981',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Filter Modal Styles
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  filterCloseButton: {
    padding: 4,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  filterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  filterOptionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  filterOptionButtonSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#10b981',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#10b981',
  },
  customDateRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateInputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  resetFiltersButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  resetFiltersText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  // Image Modal Styles
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  imageModalHeader: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  imageModalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 16,
  },
  imageModalCloseButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  imageViewArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  imageLoadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
  closeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  selectedCard: {
    borderColor: '#25D366',
    borderWidth: 2,
    backgroundColor: '#f0f9f0',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
  actionSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#25D366',
    flex: 1,
    justifyContent: 'center',
  },
  selectButtonText: {
    color: '#25D366',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  multiSelectControls: {
    gap: 16,
  },
  selectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectionCount: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  selectAllText: {
    fontSize: 14,
    color: '#25D366',
    fontWeight: '600',
  },
  multiSelectActions: {
    flexDirection: 'row',
    gap: 12,
  },
  forwardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  forwardButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  sendToChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  sendToChatButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  cancelSelectButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DashboardScreen;