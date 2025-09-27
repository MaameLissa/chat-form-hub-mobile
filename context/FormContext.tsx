import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubmittedForm {
  id: string;
  type: 'Customer Details' | 'Service Booking' | 'Feedback' | 'Contact';
  templateName: string;
  submittedAt: string;
  data: Record<string, any>;
  uploadedFiles?: {
    name: string;
    type: string;
    uri: string;
  }[];
}

interface FormContextType {
  submittedForms: SubmittedForm[];
  addSubmittedForm: (form: Omit<SubmittedForm, 'id' | 'submittedAt'>) => void;
  deleteSubmittedForm: (id: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [submittedForms, setSubmittedForms] = useState<SubmittedForm[]>([
    // Mock data for initial display
    {
      id: '1',
      type: 'Customer Details',
      templateName: 'Customer Details',
      submittedAt: '9/17/2025 1:17:08 AM',
      data: {
        name: 'John Kyei',
        phone: '+233 123 770 67',
        items: 'iPhone 15 Pro Max, AirPods Pro',
        delivery_address: 'Oxford St, Osu Accra',
        additional_instructions: 'Please call before delivery.'
      }
    },
    {
      id: '2',
      type: 'Customer Details',
      templateName: 'Customer Details',
      submittedAt: '9/17/2025 1:17:08 AM',
      data: {
        name: 'Matt Ofosu',
        phone: '+233 123 770 67',
        items: 'T-Shirt, Airforce 1',
        delivery_address: 'Labone, Osu Accra',
        additional_instructions: 'The t-shirt should be the customized version.'
      }
    },
    {
      id: '3',
      type: 'Service Booking',
      templateName: 'Service Booking',
      submittedAt: '9/17/2025 1:17:08 AM',
      data: {
        name: 'Sarah Doku',
        phone: '+233 123 770 67',
        service_type: 'Installation',
        preferred_date: 'Monday 22nd April September 2025',
        description: 'Security system installation for new home'
      }
    },
    {
      id: '4',
      type: 'Customer Details',
      templateName: 'Customer Details',
      submittedAt: '9/17/2025 1:17:08 AM',
      data: {
        name: 'Sarah Johnson',
        phone: '+233 055 123 456',
        items: 'Electronics, Headphones',
        delivery_address: '456 East Legon, Accra, Ghana',
        additional_instructions: 'Urgent delivery needed'
      },
      uploadedFiles: [
        { 
          name: 'high-angle-delicious-waffles.jpg', 
          type: 'image/jpeg',
          uri: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        }
      ]
    },
    {
      id: '5',
      type: 'Customer Details',
      templateName: 'Customer Details',
      submittedAt: '9/17/2025 1:17:08 AM',
      data: {
        name: 'Michael Asante',
        phone: '+233 244 567 890',
        items: 'Gaming Laptop, Wireless Mouse',
        delivery_address: '789 Tema Community 1, Tema',
        additional_instructions: 'Please call before delivery'
      },
      uploadedFiles: [
        { 
          name: 'gaming-setup.jpg', 
          type: 'image/jpeg',
          uri: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        },
        { 
          name: 'laptop-specs.jpg', 
          type: 'image/jpeg',
          uri: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        }
      ]
    }
  ]);

  const addSubmittedForm = (form: Omit<SubmittedForm, 'id' | 'submittedAt'>) => {
    const newForm: SubmittedForm = {
      ...form,
      id: Date.now().toString(),
      submittedAt: new Date().toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
    };
    
    setSubmittedForms(prev => [newForm, ...prev]);
  };

  const deleteSubmittedForm = (id: string) => {
    setSubmittedForms(prev => prev.filter(form => form.id !== id));
  };

  return (
    <FormContext.Provider value={{ submittedForms, addSubmittedForm, deleteSubmittedForm }}>
      {children}
    </FormContext.Provider>
  );
};