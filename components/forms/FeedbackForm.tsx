import React from 'react';
import { FormField } from '../../types/navigation';

export const feedbackFields: FormField[] = [
  { 
    id: 'name', 
    label: 'Your Name', 
    type: 'text', 
    required: true, 
    placeholder: 'Enter your name' 
  },
  { 
    id: 'email', 
    label: 'Email Address', 
    type: 'email', 
    required: true, 
    placeholder: 'your@email.com' 
  },
  { 
    id: 'rating', 
    label: 'Rating', 
    type: 'select', 
    required: true, 
    options: ['Excellent', 'Good', 'Average', 'Poor'] 
  },
  { 
    id: 'feedback', 
    label: 'Your Feedback', 
    type: 'textarea', 
    required: true, 
    placeholder: 'Tell us about your experience...' 
  },
  { 
    id: 'suggestions', 
    label: 'Suggestions', 
    type: 'textarea', 
    required: false, 
    placeholder: 'Any suggestions for improvement...' 
  }
];

export const feedbackConfig = {
  title: 'Feedback Form',
  subtitle: 'Share Your Experience',
  fields: feedbackFields
};