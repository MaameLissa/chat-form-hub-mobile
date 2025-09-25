# WhatsApp Forms Mobile App

A React Native mobile app for creating and submitting forms via WhatsApp.

## Features

- 📱 Native mobile experience for iOS and Android
- 📝 Multiple form templates (Customer Details, Service Booking, Feedback, Contact)
- 📎 File attachment support
- 📊 View submitted form responses
- 🔗 Direct WhatsApp integration
- 🎨 WhatsApp-themed UI design

## Form Templates

### 1. Customer Details
- Customer information collection
- Order details and delivery address
- Special instructions

### 2. Service Booking
- Service appointment scheduling
- Service type selection
- Preferred date and description

### 3. Feedback Form
- Customer feedback collection
- Rating system
- Suggestions for improvement

### 4. Contact Us
- General contact form
- Subject and message fields
- Phone and email collection

## How to Use

1. **Select a Template**: Choose from available form templates on the home screen
2. **Fill the Form**: Complete all required fields in the form
3. **Submit via WhatsApp**: Tap "Send via WhatsApp" to open WhatsApp with your form data
4. **Send to Contact**: Select the recipient and send the formatted message

## Installation & Development

### Prerequisites
- Node.js (v20+)
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Setup
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

### Building for Production
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios
```

## App Structure

```
├── App.tsx                 # Main app component with navigation
├── screens/
│   ├── HomeScreen.tsx      # Form template selection
│   ├── FormScreen.tsx      # Form filling interface
│   └── SubmittedFormsScreen.tsx # View form responses
├── types/
│   └── navigation.ts       # TypeScript type definitions
└── components/             # Reusable UI components
```

## Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Screen navigation
- **React Native Paper**: Material Design components
- **React Native Vector Icons**: Icon library
- **Document Picker**: File selection functionality

## WhatsApp Integration

The app formats form data into a structured WhatsApp message that includes:
- Form template name
- All field values with labels
- File attachment information
- App attribution

## Customization

### Adding New Form Templates

1. Add template definition in `HomeScreen.tsx`
2. Add corresponding fields in `FormScreen.tsx`
3. Update form icon mapping in `SubmittedFormsScreen.tsx`

### Styling

The app uses a WhatsApp-inspired color scheme:
- Primary: `#25D366` (WhatsApp Green)
- Accent: `#075E54` (WhatsApp Dark Green)
- Background: `#f0f0f0`

## License

This project is licensed under the MIT License.