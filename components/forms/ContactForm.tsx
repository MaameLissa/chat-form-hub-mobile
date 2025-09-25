import React from 'react';
import { FormField } from '../../types/navigation';

export const contactFormFields: FormField[] = [
  { 
    id: 'name', 
    label: 'Full Name', 
    type: 'text', 
    required: true, 
    placeholder: 'Enter your full name' 
  },
  { 
    id: 'phone', 
    label: 'Phone Number', 
    type: 'phone', 
    required: true, 
    placeholder: '+1 (555) 123-4567' 
  },
  { 
    id: 'email', 
    label: 'Email Address', 
    type: 'email', 
    required: true, 
    placeholder: 'your@email.com' 
  },
  { 
    id: 'subject', 
    label: 'Subject', 
    type: 'text', 
    required: true, 
    placeholder: 'What is this about?' 
  },
  { 
    id: 'message', 
    label: 'Message', 
    type: 'textarea', 
    required: true, 
    placeholder: 'Your message...' 
  }
];

export const contactFormConfig = {
  title: 'Contact Form',
  subtitle: 'Get In Touch',
  fields: contactFormFields
};