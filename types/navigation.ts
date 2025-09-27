export interface FormConfig {
  title: string;
  subtitle: string;
  fields: FormField[];
}

export type RootStackParamList = {
  Home: undefined;
  Form: {
    templateId: string;
    templateName: string;
    customConfig?: FormConfig;
  };
  SubmittedForms: undefined;
  Dashboard: undefined;
  CustomFormBuilder: undefined;
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
  templateName: string;
  data: Record<string, string>;
  files?: Record<string, any>;
  timestamp: Date;
}