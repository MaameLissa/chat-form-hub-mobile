export interface FormConfig {
  title: string;
  subtitle: string;
  fields: FormField[];
}

export type RootStackParamList = {
  Home: {
    chatId?: string;
    chatName?: string;
  } | undefined;
  Form: {
    templateId: string;
    templateName: string;
    customConfig?: FormConfig;
    chatId?: string;
    chatName?: string;
  };
  SubmittedForms: undefined;
  Dashboard: undefined;
  CustomFormBuilder: undefined;
  WhatsAppSplash: undefined;
  WhatsAppWelcome: undefined;
  PhoneNumber: undefined;
  EditProfile: undefined;
  Chat: undefined;
  ChatConversation: {
    chatId: string;
    chatName: string;
    formData?: Record<string, any>;
    fileData?: Record<string, any>;
    formType?: string;
    dashboardResponses?: SubmittedForm[];
  };
  Settings: undefined;
  SelectContact: {
    forwardData?: SubmittedForm[];
    fromDashboard?: boolean;
    fromForm?: boolean;
  } | undefined;
  Calls: undefined;
  Updates: undefined;
  Tools: undefined;
  ChatStack?: undefined;
  MetaAI: undefined; // added
};

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'file' | 'address' | 'date';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  icon: string;
}

export interface SubmittedForm {
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