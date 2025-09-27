import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
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
        headerStyle: {
          backgroundColor: '#E3F2FD',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#0D47A1',
        },
        headerTitleAlign: 'center',
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string = 'help-outline'; // Default icon to avoid undefined

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Bookings') iconName = 'event';
          else if (route.name === 'Payments') iconName = 'account-balance-wallet';

          return (
            <View style={styles.iconContainer}>
              <Icon name={iconName} size={size} color={color} />
              {focused && (
                <View style={styles.activeIndicator} />
              )}
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
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          position: 'absolute',
          bottom: 16,
          marginHorizontal: 16,
          borderRadius: 16,
          height: 60,
        },
        tabBarBackground: () => (
          <Animated.View style={[styles.tabBarContainer, { transform: [{ scale: tabBarScale }] }]}>
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
        options={{ headerTitle: 'FreshMilk ' }}
        listeners={{
          tabPress: () => handleTabPress(false),
          focus: () => handleTabPress(true),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={CalendarBillScreen}
        options={{ headerTitle: 'Delivery Schedule' }}
        listeners={{
          tabPress: () => handleTabPress(false),
          focus: () => handleTabPress(true),
        }}
      />
      <Tab.Screen
        name="Payments"
        component={SubscribeScreen}
        options={{ headerTitle: 'Payments & Advances' }}
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