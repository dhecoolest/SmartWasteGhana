import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { theme, wasteCategories } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

const filters: { id: FilterStatus; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: theme.textPrimary },
  { id: 'pending', label: 'Pending', color: theme.orange },
  { id: 'confirmed', label: 'Confirmed', color: theme.secondary },
  { id: 'in_progress', label: 'In Progress', color: theme.primary },
  { id: 'completed', label: 'Completed', color: '#10B981' },
  { id: 'cancelled', label: 'Cancelled', color: theme.red },
];

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { pickups } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  const filteredPickups =
    activeFilter === 'all' ? pickups : pickups.filter((p) => p.status === activeFilter);

  const totalSpent = pickups
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
        <Text style={styles.headerSubtitle}>{pickups.length} total pickups</Text>
      </Animated.View>

      {/* Stats Summary */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: theme.primaryBg }]}>
          <MaterialIcons name="check-circle" size={20} color={theme.primary} />
          <Text style={[styles.summaryValue, { color: theme.primary }]}>
            {pickups.filter((p) => p.status === 'completed').length}
          </Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.orangeBg }]}>
          <MaterialIcons name="pending" size={20} color={theme.orange} />
          <Text style={[styles.summaryValue, { color: theme.orange }]}>
            {pickups.filter((p) => p.status === 'pending' || p.status === 'confirmed').length}
          </Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.secondaryBg }]}>
          <MaterialIcons name="payments" size={20} color={theme.secondary} />
          <Text style={[styles.summaryValue, { color: theme.secondary }]}>
            {APP_CONFIG.currencySymbol}{totalSpent}
          </Text>
          <Text style={styles.summaryLabel}>Spent</Text>
        </View>
      </Animated.View>

      {/* Filter Chips */}
      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {filters.map((f) => (
            <Pressable
              key={f.id}
              style={[
                styles.filterChip,
                activeFilter === f.id && { backgroundColor: f.color, borderColor: f.color },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveFilter(f.id);
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f.id && { color: '#FFF' },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Pickup List */}
      {filteredPickups.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={require('../../assets/images/empty-activity.png')}
            style={styles.emptyImage}
            contentFit="contain"
          />
          <Text style={styles.emptyTitle}>No pickups found</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter === 'all'
              ? 'Schedule your first waste pickup to get started'
              : `No ${activeFilter.replace('_', ' ')} pickups at the moment`}
          </Text>
          <Pressable
            style={styles.emptyCta}
            onPress={() => router.push('/(tabs)/schedule')}
          >
            <Text style={styles.emptyCtaText}>Schedule Pickup</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <FlashList
            data={filteredPickups}
            keyExtractor={(item) => item.id}
            estimatedItemSize={90}
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: pickup }) => {
              const cat = wasteCategories[pickup.wasteType as keyof typeof wasteCategories];
              return (
                <Pressable
                  style={styles.pickupCard}
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.push({ pathname: '/pickup-details', params: { id: pickup.id } });
                  }}
                >
                  <View style={[styles.pickupIcon, { backgroundColor: cat?.bgColor || '#F3F4F6' }]}>
                    <MaterialIcons name={cat?.icon || 'delete'} size={22} color={cat?.color || '#6B7280'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pickupTitle}>{cat?.label || 'General'} Waste</Text>
                    <Text style={styles.pickupLocation}>{pickup.address}</Text>
                    <Text style={styles.pickupDate}>
                      {pickup.scheduledDate} · {pickup.timeSlot}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={styles.pickupAmount}>
                      {APP_CONFIG.currencySymbol}{pickup.amount}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            pickup.status === 'completed'
                              ? theme.primaryBg
                              : pickup.status === 'cancelled'
                              ? theme.redBg
                              : pickup.status === 'in_progress'
                              ? theme.secondaryBg
                              : theme.orangeBg,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              pickup.status === 'completed'
                                ? theme.primary
                                : pickup.status === 'cancelled'
                                ? theme.red
                                : pickup.status === 'in_progress'
                                ? theme.secondary
                                : theme.orange,
                          },
                        ]}
                      >
                        {pickup.status.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: theme.radiusMedium,
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
    textTransform: 'uppercase',
  },
  filterWrap: {
    height: 44,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radiusFull,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  pickupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: theme.surface,
    borderRadius: theme.radiusMedium,
    marginBottom: 8,
    gap: 12,
    ...theme.shadow,
  },
  pickupIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  pickupLocation: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  pickupDate: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 2,
  },
  pickupAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radiusFull,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  emptyCta: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.primary,
    borderRadius: theme.radiusMedium,
  },
  emptyCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
});
