export interface Pickup {
  id: string;
  wasteType: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  timeSlot: string;
  location: string;
  address: string;
  amount: number;
  paymentMethod: string;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  notes?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehiclePlate: string;
  lat: number;
  lng: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  totalPickups: number;
  wasteRecycled: number;
  ecoPoints: number;
}

export const mockUser: UserProfile = {
  id: 'u1',
  name: 'Kwame Asante',
  phone: '+233 24 123 4567',
  email: 'kwame.asante@gmail.com',
  address: '15 Independence Ave',
  area: 'East Legon, Accra',
  totalPickups: 47,
  wasteRecycled: 128,
  ecoPoints: 2340,
};

export const mockDriver: Driver = {
  id: 'd1',
  name: 'Kofi Mensah',
  phone: '+233 20 987 6543',
  rating: 4.8,
  vehiclePlate: 'GR-1234-22',
  lat: 5.6037,
  lng: -0.1870,
};

export const mockPickups: Pickup[] = [
  {
    id: 'p1',
    wasteType: 'recyclable',
    status: 'in_progress',
    scheduledDate: '2025-01-15',
    timeSlot: '8:00 AM - 10:00 AM',
    location: 'East Legon',
    address: '15 Independence Ave, East Legon',
    amount: 15,
    paymentMethod: 'MTN MoMo',
    driverName: 'Kofi Mensah',
    driverPhone: '+233 20 987 6543',
    driverRating: 4.8,
    createdAt: '2025-01-14T10:30:00Z',
  },
  {
    id: 'p2',
    wasteType: 'general',
    status: 'confirmed',
    scheduledDate: '2025-01-16',
    timeSlot: '10:00 AM - 12:00 PM',
    location: 'Airport Residential',
    address: '32 Airport Bypass Road',
    amount: 25,
    paymentMethod: 'Vodafone Cash',
    driverName: 'Ama Darko',
    driverPhone: '+233 27 555 1234',
    driverRating: 4.6,
    createdAt: '2025-01-14T14:00:00Z',
  },
  {
    id: 'p3',
    wasteType: 'organic',
    status: 'completed',
    scheduledDate: '2025-01-12',
    timeSlot: '6:00 AM - 8:00 AM',
    location: 'Osu',
    address: '7 Oxford Street, Osu',
    amount: 20,
    paymentMethod: 'MTN MoMo',
    driverName: 'Yaw Boateng',
    driverRating: 4.9,
    notes: 'Garden waste and food scraps',
    createdAt: '2025-01-11T08:00:00Z',
  },
  {
    id: 'p4',
    wasteType: 'ewaste',
    status: 'completed',
    scheduledDate: '2025-01-10',
    timeSlot: '2:00 PM - 4:00 PM',
    location: 'Cantonments',
    address: '19 Cantonments Road',
    amount: 40,
    paymentMethod: 'AirtelTigo Money',
    driverName: 'Abena Serwah',
    driverRating: 4.7,
    notes: 'Old monitors and keyboards',
    createdAt: '2025-01-09T16:30:00Z',
  },
  {
    id: 'p5',
    wasteType: 'hazardous',
    status: 'completed',
    scheduledDate: '2025-01-08',
    timeSlot: '10:00 AM - 12:00 PM',
    location: 'Labone',
    address: '5 Labone Crescent',
    amount: 60,
    paymentMethod: 'MTN MoMo',
    driverName: 'Kofi Mensah',
    driverRating: 4.8,
    notes: 'Paint cans and batteries',
    createdAt: '2025-01-07T09:00:00Z',
  },
  {
    id: 'p6',
    wasteType: 'recyclable',
    status: 'completed',
    scheduledDate: '2025-01-06',
    timeSlot: '8:00 AM - 10:00 AM',
    location: 'East Legon',
    address: '15 Independence Ave, East Legon',
    amount: 15,
    paymentMethod: 'MTN MoMo',
    driverName: 'Yaw Boateng',
    driverRating: 4.9,
    createdAt: '2025-01-05T11:00:00Z',
  },
  {
    id: 'p7',
    wasteType: 'general',
    status: 'completed',
    scheduledDate: '2025-01-04',
    timeSlot: '6:00 AM - 8:00 AM',
    location: 'East Legon',
    address: '15 Independence Ave, East Legon',
    amount: 25,
    paymentMethod: 'Vodafone Cash',
    createdAt: '2025-01-03T07:00:00Z',
  },
  {
    id: 'p8',
    wasteType: 'medical',
    status: 'completed',
    scheduledDate: '2025-01-02',
    timeSlot: '4:00 PM - 6:00 PM',
    location: 'Ridge',
    address: '10 Ridge Hospital Road',
    amount: 55,
    paymentMethod: 'MTN MoMo',
    driverName: 'Ama Darko',
    driverRating: 4.6,
    notes: 'Expired medicines',
    createdAt: '2025-01-01T17:00:00Z',
  },
  {
    id: 'p9',
    wasteType: 'organic',
    status: 'completed',
    scheduledDate: '2024-12-30',
    timeSlot: '8:00 AM - 10:00 AM',
    location: 'Dzorwulu',
    address: '22 Dzorwulu Road',
    amount: 20,
    paymentMethod: 'AirtelTigo Money',
    createdAt: '2024-12-29T10:00:00Z',
  },
  {
    id: 'p10',
    wasteType: 'recyclable',
    status: 'completed',
    scheduledDate: '2024-12-28',
    timeSlot: '10:00 AM - 12:00 PM',
    location: 'East Legon',
    address: '15 Independence Ave, East Legon',
    amount: 15,
    paymentMethod: 'MTN MoMo',
    createdAt: '2024-12-27T12:00:00Z',
  },
  {
    id: 'p11',
    wasteType: 'general',
    status: 'completed',
    scheduledDate: '2024-12-26',
    timeSlot: '6:00 AM - 8:00 AM',
    location: 'Adabraka',
    address: '8 Adabraka Lane',
    amount: 25,
    paymentMethod: 'Vodafone Cash',
    createdAt: '2024-12-25T07:30:00Z',
  },
  {
    id: 'p12',
    wasteType: 'ewaste',
    status: 'completed',
    scheduledDate: '2024-12-22',
    timeSlot: '2:00 PM - 4:00 PM',
    location: 'Spintex',
    address: '45 Spintex Road',
    amount: 40,
    paymentMethod: 'MTN MoMo',
    notes: 'Old printer and cables',
    createdAt: '2024-12-21T15:00:00Z',
  },
  {
    id: 'p13',
    wasteType: 'organic',
    status: 'completed',
    scheduledDate: '2024-12-20',
    timeSlot: '8:00 AM - 10:00 AM',
    location: 'Roman Ridge',
    address: '3 Roman Ridge Crescent',
    amount: 20,
    paymentMethod: 'AirtelTigo Money',
    createdAt: '2024-12-19T09:00:00Z',
  },
  {
    id: 'p14',
    wasteType: 'recyclable',
    status: 'cancelled',
    scheduledDate: '2024-12-18',
    timeSlot: '10:00 AM - 12:00 PM',
    location: 'East Legon',
    address: '15 Independence Ave, East Legon',
    amount: 15,
    paymentMethod: 'MTN MoMo',
    createdAt: '2024-12-17T11:00:00Z',
  },
  {
    id: 'p15',
    wasteType: 'hazardous',
    status: 'completed',
    scheduledDate: '2024-12-15',
    timeSlot: '12:00 PM - 2:00 PM',
    location: 'Tema',
    address: '18 Community 1, Tema',
    amount: 60,
    paymentMethod: 'Vodafone Cash',
    notes: 'Chemical containers',
    createdAt: '2024-12-14T13:00:00Z',
  },
  {
    id: 'p16',
    wasteType: 'general',
    status: 'completed',
    scheduledDate: '2024-12-12',
    timeSlot: '6:00 AM - 8:00 AM',
    location: 'Madina',
    address: '56 Madina Market Road',
    amount: 25,
    paymentMethod: 'MTN MoMo',
    createdAt: '2024-12-11T06:30:00Z',
  },
  {
    id: 'p17',
    wasteType: 'recyclable',
    status: 'completed',
    scheduledDate: '2024-12-10',
    timeSlot: '8:00 AM - 10:00 AM',
    location: 'Achimota',
    address: '12 Achimota Road',
    amount: 15,
    paymentMethod: 'AirtelTigo Money',
    createdAt: '2024-12-09T08:30:00Z',
  },
  {
    id: 'p18',
    wasteType: 'medical',
    status: 'completed',
    scheduledDate: '2024-12-08',
    timeSlot: '4:00 PM - 6:00 PM',
    location: 'Korle Bu',
    address: '2 Korle Bu Teaching Hospital Area',
    amount: 55,
    paymentMethod: 'MTN MoMo',
    notes: 'Syringes and bandages',
    createdAt: '2024-12-07T17:00:00Z',
  },
  {
    id: 'p19',
    wasteType: 'ewaste',
    status: 'completed',
    scheduledDate: '2024-12-05',
    timeSlot: '10:00 AM - 12:00 PM',
    location: 'Nima',
    address: '30 Nima Highway',
    amount: 40,
    paymentMethod: 'Vodafone Cash',
    notes: 'Broken phone screens',
    createdAt: '2024-12-04T10:30:00Z',
  },
  {
    id: 'p20',
    wasteType: 'organic',
    status: 'completed',
    scheduledDate: '2024-12-02',
    timeSlot: '6:00 AM - 8:00 AM',
    location: 'Dansoman',
    address: '14 Dansoman Estate',
    amount: 20,
    paymentMethod: 'MTN MoMo',
    createdAt: '2024-12-01T07:00:00Z',
  },
];

export const mockNotifications = [
  { id: 'n1', title: 'Pickup Confirmed', message: 'Your recyclable waste pickup for Jan 16 has been confirmed.', time: '2 hours ago', read: false },
  { id: 'n2', title: 'Driver En Route', message: 'Kofi Mensah is on the way to collect your waste.', time: '5 hours ago', read: false },
  { id: 'n3', title: 'Payment Successful', message: '₵20.00 paid via MTN MoMo for organic pickup.', time: '3 days ago', read: true },
  { id: 'n4', title: 'Eco Points Earned', message: 'You earned 50 eco points for recycling!', time: '5 days ago', read: true },
  { id: 'n5', title: 'Rate Your Driver', message: 'How was your experience with Yaw Boateng?', time: '1 week ago', read: true },
];
