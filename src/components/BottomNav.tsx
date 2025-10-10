import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/Home/HomeScreen';
import CalendarBillScreen from '../screens/Subscription/CalendarBillScreen';
import SubscribeScreen from '../screens/Subscription/SubscribeScreen';

const Tab = createBottomTabNavigator();

const StaffDashboardTabs: React.FC = () => {
  const tabBarScale = React.useRef(new Animated.Value(1)).current;

  const handleTabPress = (isFocused: boolean) => {
    if (!isFocused) {
      Animated.sequence([
        Animated.spring(tabBarScale, {
          toValue: 0.95,
          useNativeDriver: true,
        }),
        Animated.spring(tabBarScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string = '';

          // 🏠 Choose icons for each tab
          if (route.name === 'Home') iconName = focused ? 'home-filled' : 'home';
          else if (route.name === 'Bookings') iconName = focused ? 'event-available' : 'event-note';
          else if (route.name === 'Payments') iconName = focused ? 'account-balance-wallet' : 'account-balance';

          return (
            <View style={styles.iconContainer}>
              <Icon name={iconName} size={size + 4} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          );
        },
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: '#546E7A',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 10,
          position: 'absolute',
          bottom: 16,
          marginHorizontal: 16,
          borderRadius: 16,
          height: 60,
        },
        tabBarBackground: () => (
          <Animated.View
            style={[styles.tabBarContainer, { transform: [{ scale: tabBarScale }] }]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.97)', 'rgba(227, 242, 253, 0.97)']}
              style={styles.tabBarGradient}
            />
          </Animated.View>
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: 'FreshMilk' }}
        listeners={{
          tabPress: () => handleTabPress(false),
          focus: () => handleTabPress(true),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={SubscribeScreen}
        options={{ headerTitle: 'Payments & Advances' }}
        listeners={{
          tabPress: () => handleTabPress(false),
          focus: () => handleTabPress(true),
        }}
      />
      <Tab.Screen
        name="Payments"
        component={CalendarBillScreen}
        options={{ headerTitle: 'Delivery Schedule' }}
        listeners={{
          tabPress: () => handleTabPress(false),
          focus: () => handleTabPress(true),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tabBarGradient: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 24,
    height: 3,
    backgroundColor: '#1976D2',
    borderRadius: 2,
  },
});

export default StaffDashboardTabs;
