import { ImageSourcePropType } from 'react-native';

// Define asset mappings with safe imports
const ASSET_MAP = {
  'banana': require('../assets/banana.jpg'),
  'belle': require('../assets/belle.jpg'),
  'bob': require('../assets/Bob .jpg'),
  'boyy': require('../assets/boyy.jpeg'),
  'coat2': require('../assets/coat2.jpg'),
  'didas': require('../assets/didas.jpg'),
  'dwayne': require('../assets/Dwayne .jpg'),
  'fantome': require('../assets/fantome.jpeg'),
  'jordan': require('../assets/Jordan .jpg'),
  'leo': require('../assets/leo.jpg'),
  'logo': require('../assets/logo.png'),
  'metaai': require('../assets/meta-ai.jpg'),
  'metalogo': require('../assets/meta-logo.jpeg'),
  'nails': require('../assets/nails.jpg'),
  'ouuu': require('../assets/ouuu.jpeg'),
  'sharpzee': require('../assets/sharp-zee.jpg'),
  'starbgirl': require('../assets/starbgirl.jpeg'),
  'tools': require('../assets/tools.png'),
  'updates': require('../assets/updates.png'),
  'whatsapplogo': require('../assets/whatsapp-logo.png'),
  'whatsappwelcome': require('../assets/whatsapp-welcome-illustration.png'),
  'updateswebp': require('../assets/updates.webp'),
} as const;

// Default fallback images
const defaultAvatar = require('../assets/adaptive-icon.png');
const defaultIcon = require('../assets/icon.png');

export const getSafeAsset = (assetKey: string): ImageSourcePropType => {
  try {
    const normalizedKey = assetKey.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')
      .replace(/\.(jpg|jpeg|png|webp)$/i, '');
    
    // Try exact match first
    if (ASSET_MAP[normalizedKey as keyof typeof ASSET_MAP]) {
      return ASSET_MAP[normalizedKey as keyof typeof ASSET_MAP];
    }
    
    // Try partial match
    const partialMatch = Object.keys(ASSET_MAP).find(key => 
      key.includes(normalizedKey) || normalizedKey.includes(key)
    );
    
    if (partialMatch) {
      return ASSET_MAP[partialMatch as keyof typeof ASSET_MAP];
    }
    
    // Return default fallback
    return defaultAvatar;
  } catch (error) {
    console.warn(`Asset loading failed for "${assetKey}":`, error);
    return defaultAvatar;
  }
};

// Removed dynamic require functions - use getSafeAsset() instead
// These functions used dynamic requires which don't work with React Native bundler

export const getAssetWithFallback = (assetKey: string): ImageSourcePropType => {
  console.warn('getAssetWithFallback is deprecated, use getSafeAsset instead');
  return getSafeAsset(assetKey);
};

export const getAvatarWithFallback = (assetKey: string): ImageSourcePropType => {
  console.warn('getAvatarWithFallback is deprecated, use getSafeAsset instead');
  return getSafeAsset(assetKey);
};

export const getIconWithFallback = (assetKey: string): ImageSourcePropType => {
  console.warn('getIconWithFallback is deprecated, use SafeAssets instead');
  return defaultIcon;
};

export const getRandomChatAvatar = (): ImageSourcePropType => {
  const avatars = ['belle', 'bob', 'boyy', 'dwayne', 'jordan', 'leo', 'sharpzee', 'starbgirl'];
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return getSafeAsset(avatars[randomIndex]);
};

export const validateImageUri = (uri: string): boolean => {
  try {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(uri) || uri.startsWith('data:image/');
  } catch {
    return false;
  }
};

// Safe asset paths - confirmed to exist
export const SafeAssets = {
  adaptiveIcon: require('../assets/adaptive-icon.png'),
  icon: require('../assets/icon.png'),
  favicon: require('../assets/favicon.png'),
  splashIcon: require('../assets/splash-icon.png'),
  logo: require('../assets/logo.png'),
  tools: require('../assets/tools.png'),
  updates: require('../assets/updates.png'),
  whatsappLogo: require('../assets/whatsapp-logo.png'),
  whatsappWelcome: require('../assets/whatsapp-welcome-illustration.png'),
};

export default SafeAssets;
