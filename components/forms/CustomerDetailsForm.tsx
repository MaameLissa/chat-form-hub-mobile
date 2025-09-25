import React from 'react';
import { FormField } from '../../types/navigation';

export const customerDetailsFields: FormField[] = [
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
    placeholder: '+233 045 677 898' 
  },
  { 
    id: 'items', 
    label: 'Item(s) to Order', 
    type: 'textarea', 
    required: true, 
    placeholder: 'List the items you want to order...' 
  },
  { 
    id: 'delivery_address', 
    label: 'Delivery Address', 
    type: 'address', 
    required: true, 
    placeholder: 'Full delivery address' 
  },
  { 
    id: 'additional_instructions', 
    label: 'Additional Instructions', 
    type: 'textarea', 
    required: false, 
    placeholder: 'Any additional requirement or notes...' 
  },
  { 
    id: 'product_images', 
    label: 'Product Images/References', 
    type: 'file', 
    required: false, 
    placeholder: 'Click to upload file' 
  }
];

export const customerDetailsConfig = {
  title: 'Customer Details',
  subtitle: 'Complete customer and order information',
  fields: customerDetailsFields
};