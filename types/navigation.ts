export type RootStackParamList = {
  Home: undefined;
  Form: {
    templateId: string;
    templateName: string;
  };
  SubmittedForms: undefined;
};

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'file' | 'address';
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
  templateName: string;
  data: Record<string, string>;
  files?: Record<string, any>;
  timestamp: Date;
}