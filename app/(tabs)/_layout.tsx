import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import { theme } from '../../constants/theme';
import { AppProvider } from '../../contexts/AppContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <AppProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: Platform.select({
              ios: insets.bottom + 60,
              android: insets.bottom + 60,
              default: 70,
            }),
            paddingTop: 6,
            paddingBottom: Platform.select({
              ios: insets.bottom + 8,
              android: insets.bottom + 8,
              default: 8,
            }),
            backgroundColor: theme.surface,
            borderTopWidth: 1,
            borderTopColor: theme.border,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: 'Schedule',
            tabBarIcon: ({ color, size }) => (
              <View>
                <MaterialIcons name="add-circle" size={size + 4} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: 'Activity',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="history" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AppProvider>
  );
}
