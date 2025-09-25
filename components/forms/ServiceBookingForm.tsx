import React from 'react';
import { FormField } from '../../types/navigation';

export const serviceBookingFields: FormField[] = [
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
    id: 'service_type', 
    label: 'Service Type', 
    type: 'select', 
    required: true, 
    options: ['Installation', 'Repair', 'Maintenance', 'Consultation'] 
  },
  { 
    id: 'preferred_date', 
    label: 'Preferred Date', 
    type: 'text', 
    required: true, 
    placeholder: 'MM/DD/YYYY' 
  },
  { 
    id: 'description', 
    label: 'Service Description', 
    type: 'textarea', 
    required: true, 
    placeholder: 'Describe the service you need...' 
  }
];

export const serviceBookingConfig = {
  title: 'Service Booking',
  subtitle: 'Schedule Appointments',
  fields: serviceBookingFields
};