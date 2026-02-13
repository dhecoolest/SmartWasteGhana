import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme, wasteCategories } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';
import { useApp } from '../contexts/AppContext';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function PickupDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pickups, cancelPickup } = useApp();

  const pickup = pickups.find((p) => p.id === id);
  if (!pickup) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: theme.textSecondary }}>Pickup not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: theme.primary, fontWeight: '600' }}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const cat = wasteCategories[pickup.wasteType as keyof typeof wasteCategories];
  const isActive = pickup.status === 'in_progress' || pickup.status === 'confirmed' || pickup.status === 'pending';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return theme.primary;
      case 'cancelled': return theme.red;
      case 'in_progress': return theme.secondary;
      case 'confirmed': return theme.secondary;
      default: return theme.orange;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed': return theme.primaryBg;
      case 'cancelled': return theme.redBg;
      case 'in_progress': return theme.secondaryBg;
      case 'confirmed': return theme.secondaryBg;
      default: return theme.orangeBg;
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Pickup',
      'Are you sure you want to cancel this pickup?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            cancelPickup(pickup.id);
            router.back();
          },
        },
      ]
    );
  };

  const progressSteps = [
    { label: 'Scheduled', icon: 'schedule' as const, done: true },
    { label: 'Confirmed', icon: 'check-circle' as const, done: ['confirmed', 'in_progress', 'completed'].includes(pickup.status) },
    { label: 'Driver En Route', icon: 'local-shipping' as const, done: ['in_progress', 'completed'].includes(pickup.status) },
    { label: 'Completed', icon: 'verified' as const, done: pickup.status === 'completed' },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Pickup Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Hero Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View style={[styles.heroCard, { borderLeftColor: cat?.color || '#6B7280' }]}>
            <View style={styles.heroTop}>
              <View style={[styles.heroIcon, { backgroundColor: cat?.bgColor || '#F3F4F6' }]}>
                <MaterialIcons name={cat?.icon || 'delete'} size={32} color={cat?.color || '#6B7280'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroTitle}>{cat?.label || 'General'} Waste</Text>
                <Text style={styles.heroAddress}>{pickup.address}</Text>
              </View>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroMeta}>
              <View style={styles.metaItem}>
                <MaterialIcons name="calendar-today" size={16} color={theme.textSecondary} />
                <Text style={styles.metaText}>{pickup.scheduledDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialIcons name="schedule" size={16} color={theme.textSecondary} />
                <Text style={styles.metaText}>{pickup.timeSlot}</Text>
              </View>
              <View
                style={[styles.statusBadgeLarge, { backgroundColor: getStatusBg(pickup.status) }]}
              >
                <Text style={[styles.statusTextLarge, { color: getStatusColor(pickup.status) }]}>
                  {pickup.status.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Progress Tracker */}
        {pickup.status !== 'cancelled' && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <Text style={styles.sectionTitle}>Pickup Progress</Text>
            <View style={styles.progressCard}>
              {progressSteps.map((step, index) => (
                <View key={step.label} style={styles.progressStep}>
                  <View style={styles.progressDotWrap}>
                    <View
                      style={[
                        styles.progressDot,
                        step.done && { backgroundColor: theme.primary },
                      ]}
                    >
                      <MaterialIcons
                        name={step.done ? 'check' : step.icon}
                        size={16}
                        color={step.done ? '#FFF' : theme.textMuted}
                      />
                    </View>
                    {index < progressSteps.length - 1 && (
                      <View
                        style={[
                          styles.progressLine,
                          step.done && { backgroundColor: theme.primary },
                        ]}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.progressLabel,
                      step.done && { color: theme.textPrimary, fontWeight: '600' },
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Driver Info */}
        {pickup.driverName && pickup.status !== 'cancelled' && (
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <Text style={styles.sectionTitle}>Driver</Text>
            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}>
                <MaterialIcons name="person" size={28} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>{pickup.driverName}</Text>
                {pickup.driverPhone && (
                  <Text style={styles.driverPhone}>{pickup.driverPhone}</Text>
                )}
                {pickup.driverRating && (
                  <View style={styles.ratingRow}>
                    <MaterialIcons name="star" size={14} color={theme.orange} />
                    <Text style={styles.ratingText}>{pickup.driverRating}</Text>
                  </View>
                )}
              </View>
              <Pressable
                style={[styles.actionBtn, { backgroundColor: theme.primaryBg }]}
                onPress={() => Haptics.selectionAsync()}
              >
                <MaterialIcons name="call" size={20} color={theme.primary} />
              </Pressable>
              <Pressable
                style={[styles.actionBtn, { backgroundColor: theme.secondaryBg }]}
                onPress={() => Haptics.selectionAsync()}
              >
                <MaterialIcons name="chat" size={20} color={theme.secondary} />
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* Live Tracking Map */}
        {(pickup.status === 'in_progress') && (
          <Animated.View entering={FadeInDown.delay(350).duration(500)}>
            <Text style={styles.sectionTitle}>Live Tracking</Text>
            <View style={styles.trackingCard}>
              <Image
                source={require('../assets/images/tracking-map.png')}
                style={styles.trackingMap}
                contentFit="cover"
              />
              <View style={styles.trackingOverlay}>
                <View style={styles.trackingBadge}>
                  <MaterialIcons name="local-shipping" size={16} color="#FFF" />
                  <Text style={styles.trackingText}>Driver is 8 min away</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Payment Info */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Method</Text>
              <Text style={styles.paymentValue}>{pickup.paymentMethod}</Text>
            </View>
            <View style={styles.paymentDivider} />
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Collection Fee</Text>
              <Text style={styles.paymentValue}>{APP_CONFIG.currencySymbol}{pickup.amount}.00</Text>
            </View>
            <View style={styles.paymentDivider} />
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { fontWeight: '700', fontSize: 16 }]}>Total</Text>
              <Text style={styles.paymentTotal}>{APP_CONFIG.currencySymbol}{pickup.amount}.00</Text>
            </View>
          </View>
        </Animated.View>

        {/* Notes */}
        {pickup.notes && (
          <Animated.View entering={FadeInDown.delay(450).duration(500)}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <View style={styles.notesCard}>
              <MaterialIcons name="edit-note" size={20} color={theme.textSecondary} />
              <Text style={styles.notesText}>{pickup.notes}</Text>
            </View>
          </Animated.View>
        )}

        {/* Cancel Button */}
        {isActive && (
          <Animated.View entering={FadeInDown.delay(500).duration(500)}>
            <Pressable style={styles.cancelBtn} onPress={handleCancel}>
              <MaterialIcons name="cancel" size={20} color={theme.red} />
              <Text style={styles.cancelText}>Cancel Pickup</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    textAlign: 'center',
  },
  heroCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radiusLarge,
    padding: 16,
    borderLeftWidth: 4,
    ...theme.shadowElevated,
    marginTop: 8,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.textPrimary,
  },
  heroAddress: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  heroDivider: {
    height: 1,
    backgroundColor: theme.borderLight,
    marginVertical: 14,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  statusBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radiusFull,
    marginLeft: 'auto',
  },
  statusTextLarge: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 10,
  },
  progressCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radiusLarge,
    padding: 16,
    ...theme.shadow,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    minHeight: 48,
  },
  progressDotWrap: {
    alignItems: 'center',
  },
  progressDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLine: {
    width: 2,
    height: 20,
    backgroundColor: theme.border,
    marginVertical: 2,
  },
  progressLabel: {
    fontSize: 14,
    color: theme.textMuted,
    paddingTop: 5,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: theme.radiusLarge,
    padding: 14,
    gap: 12,
    ...theme.shadow,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  driverPhone: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.orange,
  },
  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingCard: {
    borderRadius: theme.radiusLarge,
    overflow: 'hidden',
    height: 200,
    ...theme.shadow,
  },
  trackingMap: {
    width: '100%',
    height: '100%',
  },
  trackingOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  trackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radiusFull,
    alignSelf: 'flex-start',
  },
  trackingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  paymentCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radiusLarge,
    padding: 16,
    ...theme.shadow,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  paymentLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  paymentTotal: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.primary,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: theme.borderLight,
  },
  notesCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: theme.surface,
    borderRadius: theme.radiusMedium,
    padding: 14,
    ...theme.shadow,
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.radiusMedium,
    backgroundColor: theme.redBg,
    marginTop: 24,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.red,
  },
});
