// Export all form configurations
export { customerDetailsConfig, customerDetailsFields } from './CustomerDetailsForm';
export { serviceBookingConfig, serviceBookingFields } from './ServiceBookingForm';
export { feedbackConfig, feedbackFields } from './FeedbackForm';
export { contactFormConfig, contactFormFields } from './ContactForm';

// Form configuration type
export interface FormConfig {
  title: string;
  subtitle: string;
  fields: any[];
}

// Main form configurations object
import { customerDetailsConfig } from './CustomerDetailsForm';
import { serviceBookingConfig } from './ServiceBookingForm';
import { feedbackConfig } from './FeedbackForm';
import { contactFormConfig } from './ContactForm';

export const formConfigurations = {
  'customer-details': customerDetailsConfig,
  'service-booking': serviceBookingConfig,
  'feedback': feedbackConfig,
  'contact-form': contactFormConfig
};

// Helper function to get form configuration
export const getFormConfig = (templateId: string): FormConfig | null => {
  return formConfigurations[templateId as keyof typeof formConfigurations] || null;
};