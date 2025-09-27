import { FormConfig } from './index';

export const customFormFields = [
  {
    id: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Enter a title for your submission',
    required: true,
  },
  {
    id: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Provide detailed description...',
    required: true,
  },
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    placeholder: 'Select a category...',
    required: true,
    options: [
      'General Inquiry',
      'Technical Support',
      'Business Proposal',
      'Collaboration',
      'Feedback',
      'Other'
    ]
  },
  {
    id: 'priority',
    label: 'Priority Level',
    type: 'select',
    placeholder: 'Select priority level...',
    required: false,
    options: [
      'Low',
      'Medium',
      'High',
      'Urgent'
    ]
  },
  {
    id: 'contact_name',
    label: 'Your Name',
    type: 'text',
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    id: 'contact_email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email address',
    required: true,
  },
  {
    id: 'contact_phone',
    label: 'Phone Number',
    type: 'phone',
    placeholder: '+233 XXX XXX XXX',
    required: false,
  },
  {
    id: 'preferred_contact_date',
    label: 'Preferred Contact Date',
    type: 'date',
    placeholder: 'Select preferred date for contact',
    required: false,
  },
  {
    id: 'attachments',
    label: 'Supporting Documents',
    type: 'file',
    placeholder: 'Upload any supporting files',
    required: false,
  },
  {
    id: 'additional_notes',
    label: 'Additional Notes',
    type: 'textarea',
    placeholder: 'Any additional information or special requirements...',
    required: false,
  }
];

export const customFormConfig: FormConfig = {
  title: 'Custom Form',
  subtitle: 'Create a flexible submission with your own custom fields',
  fields: customFormFields,
};