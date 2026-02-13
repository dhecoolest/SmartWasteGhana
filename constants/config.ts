export const APP_CONFIG = {
  name: 'SmartWaste Ghana',
  tagline: 'Clean City, Green Future',
  version: '1.0.0',
  currency: 'GHS',
  currencySymbol: '₵',
  paymentMethods: [
    { id: 'mtn', name: 'MTN MoMo', color: '#FFCC00', icon: 'phone-android' },
    { id: 'vodafone', name: 'Vodafone Cash', color: '#E60000', icon: 'phone-android' },
    { id: 'airteltigo', name: 'AirtelTigo Money', color: '#0033A0', icon: 'phone-android' },
  ],
  timeSlots: [
    { id: '1', label: '6:00 AM - 8:00 AM', value: '06:00-08:00' },
    { id: '2', label: '8:00 AM - 10:00 AM', value: '08:00-10:00' },
    { id: '3', label: '10:00 AM - 12:00 PM', value: '10:00-12:00' },
    { id: '4', label: '12:00 PM - 2:00 PM', value: '12:00-14:00' },
    { id: '5', label: '2:00 PM - 4:00 PM', value: '14:00-16:00' },
    { id: '6', label: '4:00 PM - 6:00 PM', value: '16:00-18:00' },
  ],
  wastePricing: {
    general: 25,
    recyclable: 15,
    organic: 20,
    ewaste: 40,
    hazardous: 60,
    medical: 55,
  } as Record<string, number>,
};
