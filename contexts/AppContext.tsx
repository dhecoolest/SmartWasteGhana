import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pickup, UserProfile, mockUser, mockPickups } from '../services/mockData';
import { APP_CONFIG } from '../constants/config';

interface AppState {
  user: UserProfile;
  pickups: Pickup[];
  activePickup: Pickup | null;
  addPickup: (pickup: Omit<Pickup, 'id' | 'status' | 'createdAt'>) => void;
  cancelPickup: (id: string) => void;
  getPickupsByStatus: (status: Pickup['status']) => Pickup[];
  totalSpent: number;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [pickups, setPickups] = useState<Pickup[]>(mockPickups);

  useEffect(() => {
    AsyncStorage.getItem('smartwaste_pickups').then((data) => {
      if (data) {
        setPickups(JSON.parse(data));
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('smartwaste_pickups', JSON.stringify(pickups));
  }, [pickups]);

  const activePickup = pickups.find(
    (p) => p.status === 'in_progress' || p.status === 'confirmed' || p.status === 'pending'
  ) || null;

  const addPickup = useCallback((pickupData: Omit<Pickup, 'id' | 'status' | 'createdAt'>) => {
    const newPickup: Pickup = {
      ...pickupData,
      id: `p${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setPickups((prev) => [newPickup, ...prev]);
    setUser((prev) => ({ ...prev, totalPickups: prev.totalPickups + 1, ecoPoints: prev.ecoPoints + 50 }));
  }, []);

  const cancelPickup = useCallback((id: string) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'cancelled' as const } : p))
    );
  }, []);

  const getPickupsByStatus = useCallback(
    (status: Pickup['status']) => pickups.filter((p) => p.status === status),
    [pickups]
  );

  const totalSpent = pickups
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AppContext.Provider
      value={{ user, pickups, activePickup, addPickup, cancelPickup, getPickupsByStatus, totalSpent }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
