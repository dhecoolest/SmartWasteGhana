import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { theme } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, pickups, totalSpent } = useApp();

  const completedPickups = pickups.filter((p) => p.status === 'completed').length;

  const settingsSections = [
    {
      title: 'ACCOUNT',
      items: [
        { icon: 'person' as const, label: 'Personal Info', subtitle: 'Name, email, phone', color: theme.primary },
        { icon: 'location-on' as const, label: 'Saved Addresses', subtitle: '2 addresses saved', color: theme.secondary },
        { icon: 'payment' as const, label: 'Payment Methods', subtitle: 'MTN MoMo, Vodafone Cash', color: theme.orange },
      ],
    },
    {
      title: 'PREFERENCES',
      items: [
        { icon: 'notifications' as const, label: 'Notifications', subtitle: 'Push, SMS, Email', color: theme.purple },
        { icon: 'language' as const, label: 'Language', subtitle: 'English', color: theme.secondary },
        { icon: 'schedule' as const, label: 'Recurring Pickups', subtitle: 'Set up auto-scheduling', color: theme.primary },
      ],
    },
    {
      title: 'SUPPORT',
      items: [
        { icon: 'help-outline' as const, label: 'Help Center', subtitle: 'FAQs and guides', color: theme.textSecondary },
        { icon: 'chat' as const, label: 'Contact Support', subtitle: 'Chat or call us', color: theme.primary },
        { icon: 'star-rate' as const, label: 'Rate App', subtitle: 'Rate us on Play Store', color: theme.orange },
      ],
    },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <Image
              source={require('../../assets/images/profile-placeholder.png')}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.editBadge}>
              <MaterialIcons name="edit" size={14} color="#FFF" />
            </View>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userPhone}>{user.phone}</Text>
          <Text style={styles.userArea}>{user.area}</Text>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#059669' }]}>
            <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
            <Text style={styles.statNumber}>{completedPickups}</Text>
            <Text style={styles.statLabel}>Pickups</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.secondary }]}>
            <MaterialIcons name="eco" size={24} color="#FFFFFF" />
            <Text style={styles.statNumber}>{user.wasteRecycled}kg</Text>
            <Text style={styles.statLabel}>Recycled</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.orange }]}>
            <MaterialIcons name="stars" size={24} color="#FFFFFF" />
            <Text style={styles.statNumber}>{user.ecoPoints}</Text>
            <Text style={styles.statLabel}>Eco Pts</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.purple }]}>
            <MaterialIcons name="payments" size={24} color="#FFFFFF" />
            <Text style={styles.statNumber}>{APP_CONFIG.currencySymbol}{totalSpent}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
        </Animated.View>

        {/* Eco Impact Banner */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.ecoBanner}>
            <View style={styles.ecoIcon}>
              <MaterialIcons name="nature" size={32} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecoTitle}>Eco Champion 🌿</Text>
              <Text style={styles.ecoSubtitle}>
                You've helped divert {user.wasteRecycled}kg of waste from landfills!
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay(400 + sectionIndex * 100).duration(500)}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <Pressable
                  key={item.label}
                  style={[
                    styles.settingsItem,
                    idx < section.items.length - 1 && styles.settingsItemBorder,
                  ]}
                  onPress={() => Haptics.selectionAsync()}
                >
                  <View style={[styles.settingsIcon, { backgroundColor: item.color + '15' }]}>
                    <MaterialIcons name={item.icon} size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingsLabel}>{item.label}</Text>
                    <Text style={styles.settingsSub}>{item.subtitle}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color={theme.textMuted} />
                </Pressable>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(700).duration(500)}>
          <Pressable
            style={styles.logoutBtn}
            onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)}
          >
            <MaterialIcons name="logout" size={20} color={theme.red} />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </Animated.View>

        <Text style={styles.versionText}>{APP_CONFIG.name} v{APP_CONFIG.version}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
  },
  avatarWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.background,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.textPrimary,
  },
  userPhone: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  userArea: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: '47%',
    flexGrow: 1,
    padding: 14,
    borderRadius: theme.radiusMedium,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ecoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: theme.radiusLarge,
    backgroundColor: theme.primary,
    gap: 14,
    marginBottom: 24,
    ...theme.shadowElevated,
  },
  ecoIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ecoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ecoSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: theme.radiusLarge,
    marginBottom: 20,
    ...theme.shadow,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  settingsIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  settingsSub: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: theme.radiusMedium,
    backgroundColor: theme.redBg,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.red,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 16,
    marginBottom: 8,
  },
});
