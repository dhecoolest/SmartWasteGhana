import { Platform } from 'react-native';

export const theme = {
  // Primary - Eco Green
  primary: '#10B981',
  primaryLight: '#34D399',
  primaryDark: '#059669',
  primaryBg: '#ECFDF5',

  // Secondary - Trust Blue
  secondary: '#3B82F6',
  secondaryLight: '#60A5FA',
  secondaryDark: '#1D4ED8',
  secondaryBg: '#EFF6FF',

  // Accent Colors
  orange: '#F59E0B',
  orangeLight: '#FCD34D',
  orangeBg: '#FFFBEB',
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  purpleBg: '#F5F3FF',
  pink: '#EC4899',
  pinkLight: '#F472B6',
  pinkBg: '#FDF2F8',
  red: '#EF4444',
  redLight: '#FCA5A5',
  redBg: '#FEF2F2',

  // Neutrals
  background: '#F0FDF4',
  backgroundSecondary: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Shadows
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }),
  shadowElevated: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
    default: {},
  }),

  // Border Radius
  radiusSmall: 8,
  radiusMedium: 12,
  radiusLarge: 16,
  radiusXL: 20,
  radiusFull: 9999,

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const wasteCategories = {
  general: { label: 'General', color: '#6B7280', bgColor: '#F3F4F6', icon: 'delete' as const },
  recyclable: { label: 'Recyclable', color: '#3B82F6', bgColor: '#EFF6FF', icon: 'autorenew' as const },
  organic: { label: 'Organic', color: '#10B981', bgColor: '#ECFDF5', icon: 'eco' as const },
  ewaste: { label: 'E-Waste', color: '#8B5CF6', bgColor: '#F5F3FF', icon: 'devices' as const },
  hazardous: { label: 'Hazardous', color: '#EF4444', bgColor: '#FEF2F2', icon: 'warning' as const },
  medical: { label: 'Medical', color: '#EC4899', bgColor: '#FDF2F8', icon: 'medical-services' as const },
};
