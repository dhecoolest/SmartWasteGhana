import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { theme, wasteCategories } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, activePickup, pickups, totalSpent } = useApp();

  const completedCount = pickups.filter((p) => p.status === 'completed').length;
  const greeting = getGreeting();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{user.name} 👋</Text>
          </View>
          <Pressable
            style={styles.notifBtn}
            onPress={() => {
              Haptics.selectionAsync();
            }}
          >
            <MaterialIcons name="notifications-none" size={24} color={theme.textPrimary} />
            <View style={styles.notifDot} />
          </Pressable>
        </Animated.View>

        {/* Hero Banner */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Pressable style={styles.heroBanner}>
            <Image
              source={require('../../assets/images/hero-banner.png')}
              style={styles.heroImage}
              contentFit="cover"
            />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTag}>SMARTWASTE GHANA</Text>
              <Text style={styles.heroTitle}>Clean City,{'\n'}Green Future</Text>
              <View style={styles.heroCta}>
                <MaterialIcons name="schedule" size={16} color={theme.surface} />
                <Text style={styles.heroCtaText}>Schedule Pickup</Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.primaryBg }]}>
            <MaterialIcons name="check-circle" size={28} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.primary }]}>{completedCount}</Text>
            <Text style={styles.statLabel}>Pickups</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.secondaryBg }]}>
            <MaterialIcons name="eco" size={28} color={theme.secondary} />
            <Text style={[styles.statValue, { color: theme.secondary }]}>{user.wasteRecycled}kg</Text>
            <Text style={styles.statLabel}>Recycled</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.orangeBg }]}>
            <MaterialIcons name="stars" size={28} color={theme.orange} />
            <Text style={[styles.statValue, { color: theme.orange }]}>{user.ecoPoints}</Text>
            <Text style={styles.statLabel}>Eco Points</Text>
          </View>
        </Animated.View>

        {/* Active Pickup Card */}
        {activePickup && (
          <Animated.View entering={FadeInDown.delay(400).duration(500)}>
            <Pressable
              style={styles.activeCard}
              onPress={() => {
                Haptics.selectionAsync();
                router.push({ pathname: '/pickup-details', params: { id: activePickup.id } });
              }}
            >
              <View style={styles.activeHeader}>
                <View style={styles.activeStatusBadge}>
                  <View style={styles.activePulse} />
                  <Text style={styles.activeStatusText}>
                    {activePickup.status === 'in_progress' ? 'In Progress' : 'Confirmed'}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.textMuted} />
              </View>
              <View style={styles.activeBody}>
                <View
                  style={[
                    styles.activeIcon,
                    {
                      backgroundColor:
                        wasteCategories[activePickup.wasteType as keyof typeof wasteCategories]?.bgColor || '#F3F4F6',
                    },
                  ]}
                >
                  <MaterialIcons
                    name={
                      wasteCategories[activePickup.wasteType as keyof typeof wasteCategories]?.icon || 'delete'
                    }
                    size={24}
                    color={
                      wasteCategories[activePickup.wasteType as keyof typeof wasteCategories]?.color || '#6B7280'
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activeTitle}>
                    {wasteCategories[activePickup.wasteType as keyof typeof wasteCategories]?.label || 'General'} Waste Pickup
                  </Text>
                  <Text style={styles.activeSubtitle}>
                    {activePickup.scheduledDate} · {activePickup.timeSlot}
                  </Text>
                  {activePickup.driverName && (
                    <Text style={styles.activeDriver}>
                      🚛 {activePickup.driverName}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.activeProgress}>
                <View style={styles.activeProgressBar}>
                  <View
                    style={[
                      styles.activeProgressFill,
                      { width: activePickup.status === 'in_progress' ? '65%' : '35%' },
                    ]}
                  />
                </View>
                <Text style={styles.activeProgressText}>
                  {activePickup.status === 'in_progress' ? 'Driver is on the way' : 'Awaiting pickup'}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        )}

        {/* Waste Categories */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Waste Categories</Text>
            <Text style={styles.sectionSubtitle}>Select to schedule</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {Object.entries(wasteCategories).map(([key, cat], index) => (
              <Animated.View key={key} entering={FadeInRight.delay(100 * index).duration(400)}>
                <Pressable
                  style={[styles.categoryCard, { borderColor: cat.color + '30' }]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.push({ pathname: '/(tabs)/schedule', params: { type: key } });
                  }}
                >
                  <View style={[styles.categoryIconWrap, { backgroundColor: cat.bgColor }]}>
                    <MaterialIcons name={cat.icon} size={28} color={cat.color} />
                  </View>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                  <Text style={styles.categoryPrice}>
                    {APP_CONFIG.currencySymbol}{APP_CONFIG.wastePricing[key]}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Pressable onPress={() => router.push('/(tabs)/activity')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          {pickups.slice(0, 4).map((pickup, index) => {
            const cat = wasteCategories[pickup.wasteType as keyof typeof wasteCategories];
            return (
              <Pressable
                key={pickup.id}
                style={styles.activityItem}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push({ pathname: '/pickup-details', params: { id: pickup.id } });
                }}
              >
                <View style={[styles.activityIcon, { backgroundColor: cat?.bgColor || '#F3F4F6' }]}>
                  <MaterialIcons name={cat?.icon || 'delete'} size={20} color={cat?.color || '#6B7280'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>{cat?.label || 'General'} Waste</Text>
                  <Text style={styles.activitySub}>{pickup.location} · {pickup.scheduledDate}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.activityAmount}>
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
                      {pickup.status.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(700).duration(500)} style={styles.quickActions}>
          <Pressable
            style={[styles.quickActionBtn, { backgroundColor: theme.primary }]}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/(tabs)/schedule');
            }}
          >
            <MaterialIcons name="add-circle-outline" size={22} color="#FFF" />
            <Text style={styles.quickActionText}>New Pickup</Text>
          </Pressable>
          <Pressable
            style={[styles.quickActionBtn, { backgroundColor: theme.secondary }]}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/(tabs)/activity');
            }}
          >
            <MaterialIcons name="track-changes" size={22} color="#FFF" />
            <Text style={styles.quickActionText}>Track Driver</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
    marginTop: 2,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.red,
  },
  heroBanner: {
    marginHorizontal: 16,
    borderRadius: theme.radiusXL,
    overflow: 'hidden',
    height: 180,
    ...theme.shadowElevated,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'flex-end',
  },
  heroTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF90',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
    lineHeight: 34,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radiusFull,
    marginTop: 12,
  },
  heroCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: theme.radiusMedium,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: theme.surface,
    borderRadius: theme.radiusLarge,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
    ...theme.shadowElevated,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radiusFull,
  },
  activePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.primary,
  },
  activeStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.primary,
  },
  activeBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  activeSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  activeDriver: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
    marginTop: 4,
  },
  activeProgress: {
    marginTop: 12,
  },
  activeProgressBar: {
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  activeProgressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 2,
  },
  activeProgressText: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
  },
  categoryCard: {
    width: 110,
    padding: 14,
    borderRadius: theme.radiusMedium,
    backgroundColor: theme.surface,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    ...theme.shadow,
  },
  categoryIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
    textAlign: 'center',
  },
  categoryPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.primary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: theme.radiusMedium,
    marginBottom: 8,
    ...theme.shadow,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  activitySub: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radiusFull,
    marginTop: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 24,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.radiusMedium,
    ...theme.shadow,
  },
  quickActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
