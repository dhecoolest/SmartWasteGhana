import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme, wasteCategories } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const { addPickup } = useApp();

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string>(params.type || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (params.type) {
      setSelectedType(params.type);
    }
  }, [params.type]);

  const dates = getNext7Days();
  const price = selectedType ? APP_CONFIG.wastePricing[selectedType] || 25 : 0;

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedType;
      case 2:
        return !!selectedDate && !!selectedSlot;
      case 3:
        return address.trim().length > 3;
      case 4:
        return !!paymentMethod;
      default:
        return false;
    }
  };

  const handleSchedule = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addPickup({
      wasteType: selectedType,
      scheduledDate: selectedDate,
      timeSlot: APP_CONFIG.timeSlots.find((s) => s.id === selectedSlot)?.label || '',
      location: address.split(',')[0] || address,
      address,
      amount: price,
      paymentMethod: APP_CONFIG.paymentMethods.find((p) => p.id === paymentMethod)?.name || '',
      notes: notes.trim() || undefined,
    });
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.successWrap}>
          <Image
            source={require('../../assets/images/schedule-success.png')}
            style={styles.successImage}
            contentFit="contain"
          />
          <Text style={styles.successTitle}>Pickup Scheduled!</Text>
          <Text style={styles.successSubtitle}>
            Your {wasteCategories[selectedType as keyof typeof wasteCategories]?.label} waste pickup has been scheduled.
            We'll notify you when a driver is assigned.
          </Text>
          <Pressable
            style={styles.successBtn}
            onPress={() => {
              setShowSuccess(false);
              setStep(1);
              setSelectedType('');
              setSelectedDate('');
              setSelectedSlot('');
              setAddress('');
              setNotes('');
              setPaymentMethod('');
              router.push('/(tabs)/activity');
            }}
          >
            <Text style={styles.successBtnText}>View Activity</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setShowSuccess(false);
              setStep(1);
              setSelectedType('');
              setSelectedDate('');
              setSelectedSlot('');
              setAddress('');
              setNotes('');
              setPaymentMethod('');
            }}
          >
            <Text style={styles.newPickupLink}>Schedule Another</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          {step > 1 && (
            <Pressable onPress={() => setStep(step - 1)} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
            </Pressable>
          )}
          <Text style={styles.headerTitle}>Schedule Pickup</Text>
          <Text style={styles.stepIndicator}>Step {step} of 4</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step 1: Waste Type */}
          {step === 1 && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={styles.stepTitle}>What type of waste?</Text>
              <Text style={styles.stepSubtitle}>Choose the category that best describes your waste</Text>
              <View style={styles.typeGrid}>
                {Object.entries(wasteCategories).map(([key, cat]) => (
                  <Pressable
                    key={key}
                    style={[
                      styles.typeCard,
                      selectedType === key && {
                        borderColor: cat.color,
                        borderWidth: 2,
                        backgroundColor: cat.bgColor,
                      },
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedType(key);
                    }}
                  >
                    <View style={[styles.typeIconWrap, { backgroundColor: cat.bgColor }]}>
                      <MaterialIcons name={cat.icon} size={32} color={cat.color} />
                    </View>
                    <Text style={styles.typeLabel}>{cat.label}</Text>
                    <Text style={[styles.typePrice, { color: cat.color }]}>
                      {APP_CONFIG.currencySymbol}{APP_CONFIG.wastePricing[key]}
                    </Text>
                    {selectedType === key && (
                      <View style={[styles.typeCheck, { backgroundColor: cat.color }]}>
                        <MaterialIcons name="check" size={14} color="#FFF" />
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={styles.stepTitle}>When should we come?</Text>
              <Text style={styles.stepSubtitle}>Pick a date and time slot for collection</Text>

              <Text style={styles.fieldLabel}>SELECT DATE</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
              >
                {dates.map((d) => (
                  <Pressable
                    key={d.value}
                    style={[
                      styles.dateChip,
                      selectedDate === d.value && styles.dateChipActive,
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedDate(d.value);
                    }}
                  >
                    <Text
                      style={[
                        styles.dateDayName,
                        selectedDate === d.value && styles.dateTextActive,
                      ]}
                    >
                      {d.dayName}
                    </Text>
                    <Text
                      style={[
                        styles.dateDay,
                        selectedDate === d.value && styles.dateTextActive,
                      ]}
                    >
                      {d.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateMonth,
                        selectedDate === d.value && styles.dateTextActive,
                      ]}
                    >
                      {d.month}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={[styles.fieldLabel, { marginTop: 24 }]}>SELECT TIME SLOT</Text>
              <View style={styles.slotGrid}>
                {APP_CONFIG.timeSlots.map((slot) => (
                  <Pressable
                    key={slot.id}
                    style={[
                      styles.slotChip,
                      selectedSlot === slot.id && styles.slotChipActive,
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedSlot(slot.id);
                    }}
                  >
                    <MaterialIcons
                      name="schedule"
                      size={16}
                      color={selectedSlot === slot.id ? '#FFF' : theme.textSecondary}
                    />
                    <Text
                      style={[
                        styles.slotText,
                        selectedSlot === slot.id && styles.slotTextActive,
                      ]}
                    >
                      {slot.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={styles.stepTitle}>Where's the pickup?</Text>
              <Text style={styles.stepSubtitle}>Enter your address for waste collection</Text>

              <View style={styles.mapPlaceholder}>
                <Image
                  source={require('../../assets/images/tracking-map.png')}
                  style={styles.mapImage}
                  contentFit="cover"
                />
                <View style={styles.mapPin}>
                  <MaterialIcons name="location-on" size={36} color={theme.red} />
                </View>
              </View>

              <Text style={styles.fieldLabel}>PICKUP ADDRESS</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="location-on" size={20} color={theme.primary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full address"
                  placeholderTextColor={theme.textMuted}
                  value={address}
                  onChangeText={setAddress}
                  multiline
                />
              </View>

              <Text style={[styles.fieldLabel, { marginTop: 20 }]}>SPECIAL INSTRUCTIONS (OPTIONAL)</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="edit-note" size={20} color={theme.secondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Gate code, landmarks, etc."
                  placeholderTextColor={theme.textMuted}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                />
              </View>

              <Pressable style={styles.useCurrentBtn} onPress={() => setAddress('15 Independence Ave, East Legon, Accra')}>
                <MaterialIcons name="my-location" size={18} color={theme.primary} />
                <Text style={styles.useCurrentText}>Use current location</Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Step 4: Payment & Review */}
          {step === 4 && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={styles.stepTitle}>Review & Pay</Text>
              <Text style={styles.stepSubtitle}>Confirm your pickup details</Text>

              {/* Summary Card */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Waste Type</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MaterialIcons
                      name={wasteCategories[selectedType as keyof typeof wasteCategories]?.icon || 'delete'}
                      size={18}
                      color={wasteCategories[selectedType as keyof typeof wasteCategories]?.color || '#6B7280'}
                    />
                    <Text style={styles.summaryValue}>
                      {wasteCategories[selectedType as keyof typeof wasteCategories]?.label || 'General'}
                    </Text>
                  </View>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date & Time</Text>
                  <Text style={styles.summaryValue}>
                    {selectedDate} · {APP_CONFIG.timeSlots.find((s) => s.id === selectedSlot)?.label}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Address</Text>
                  <Text style={[styles.summaryValue, { maxWidth: 200, textAlign: 'right' }]}>{address}</Text>
                </View>
                {notes ? (
                  <>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Notes</Text>
                      <Text style={[styles.summaryValue, { maxWidth: 200, textAlign: 'right' }]}>{notes}</Text>
                    </View>
                  </>
                ) : null}
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { fontWeight: '700', fontSize: 16 }]}>Total</Text>
                  <Text style={styles.summaryTotal}>
                    {APP_CONFIG.currencySymbol}{price}.00
                  </Text>
                </View>
              </View>

              {/* Payment Methods */}
              <Text style={[styles.fieldLabel, { marginTop: 24 }]}>PAYMENT METHOD</Text>
              {APP_CONFIG.paymentMethods.map((pm) => (
                <Pressable
                  key={pm.id}
                  style={[
                    styles.paymentOption,
                    paymentMethod === pm.id && {
                      borderColor: theme.primary,
                      borderWidth: 2,
                      backgroundColor: theme.primaryBg,
                    },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setPaymentMethod(pm.id);
                  }}
                >
                  <View style={[styles.paymentIcon, { backgroundColor: pm.color + '20' }]}>
                    <MaterialIcons name="phone-android" size={22} color={pm.color} />
                  </View>
                  <Text style={styles.paymentName}>{pm.name}</Text>
                  {paymentMethod === pm.id && (
                    <MaterialIcons name="check-circle" size={22} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </Animated.View>
          )}
        </ScrollView>

        {/* Bottom CTA */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.priceTag}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.priceValue}>{APP_CONFIG.currencySymbol}{price}.00</Text>
          </View>
          <Pressable
            style={[styles.ctaBtn, !canProceed() && styles.ctaBtnDisabled]}
            onPress={() => {
              if (!canProceed()) return;
              Haptics.selectionAsync();
              if (step < 4) {
                setStep(step + 1);
              } else {
                handleSchedule();
              }
            }}
          >
            <Text style={styles.ctaBtnText}>
              {step < 4 ? 'Continue' : 'Confirm & Pay'}
            </Text>
            <MaterialIcons
              name={step < 4 ? 'arrow-forward' : 'check'}
              size={20}
              color="#FFF"
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getNext7Days() {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      value: d.toISOString().split('T')[0],
      dayName: dayNames[d.getDay()],
      day: d.getDate().toString(),
      month: monthNames[d.getMonth()],
    });
  }
  return days;
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
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  stepIndicator: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
    backgroundColor: theme.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radiusFull,
  },
  progressBar: {
    height: 3,
    backgroundColor: theme.border,
    marginHorizontal: 16,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 2,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.textPrimary,
    marginTop: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '47%',
    padding: 16,
    borderRadius: theme.radiusLarge,
    backgroundColor: theme.surface,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow,
  },
  typeIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  typePrice: {
    fontSize: 16,
    fontWeight: '800',
  },
  typeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  dateChip: {
    width: 70,
    paddingVertical: 12,
    borderRadius: theme.radiusMedium,
    backgroundColor: theme.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    gap: 2,
  },
  dateChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  dateDayName: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  dateDay: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.textPrimary,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  dateTextActive: {
    color: '#FFFFFF',
  },
  slotGrid: {
    gap: 10,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: theme.radiusMedium,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  slotChipActive: {
    backgroundColor: theme.secondary,
    borderColor: theme.secondary,
  },
  slotText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  slotTextActive: {
    color: '#FFFFFF',
  },
  mapPlaceholder: {
    height: 180,
    borderRadius: theme.radiusLarge,
    overflow: 'hidden',
    marginBottom: 20,
    ...theme.shadow,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -36,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: theme.surface,
    borderRadius: theme.radiusMedium,
    borderWidth: 1,
    borderColor: theme.border,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: theme.textPrimary,
    minHeight: 20,
  },
  useCurrentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  useCurrentText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
  },
  summaryCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radiusLarge,
    padding: 16,
    ...theme.shadowElevated,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  summaryTotal: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: theme.borderLight,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: theme.radiusMedium,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 10,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    gap: 16,
  },
  priceTag: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.primary,
  },
  ctaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: theme.radiusMedium,
    backgroundColor: theme.primary,
  },
  ctaBtnDisabled: {
    backgroundColor: theme.textMuted,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successWrap: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.primary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  successBtn: {
    marginTop: 32,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: theme.primary,
    borderRadius: theme.radiusMedium,
    width: '100%',
    alignItems: 'center',
  },
  successBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  newPickupLink: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '600',
    color: theme.secondary,
  },
});
