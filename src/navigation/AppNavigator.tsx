import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ProductDetail from '../screens/Product/ProductDetail';
import CalendarBillScreen from '../screens/Subscription/CalendarBillScreen';
import SubscribeScreen from '../screens/Subscription/SubscribeScreen';
import StaffDashboardTabs from '../components/BottomNav';
import Subscribe from '../screens/Subscription/subscribe';
import ProfileScreen from '../screens/profile/ProfileScreen';
import BuyNowScreen from '../screens/Buy/BuyNowscreen';



// Define Product type (consistent with ProductCard.tsx)
type Product = {
  id: number;
  name: string;
  price: number;
  image: string | { uri: string }; // Adjust based on ImageSourcePropType
  category?: string;
};

// Define RootStackParamList
export type RootStackParamList = {
  bottom: undefined;
  Home: undefined;
  ProductDetail: undefined;
  Subscribe: { product: Product };
  CalendarBill: undefined;
  Profile: undefined;
  BuyNow: { product: Product };
};

// Create typed Stack navigator
const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="bottom"
        component={StaffDashboardTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home', headerShown: true }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ title: 'Product' }}
      />
      <Stack.Screen
        name="Subscribe"
        component={SubscribeScreen}
        options={{ title: 'Subscribe' }}
      />
        <Stack.Screen
        name="Subscribepage"
        component={Subscribe}
        options={{ title: 'Subscribepage' }}
      />
      <Stack.Screen
        name="CalendarBill"
        component={CalendarBillScreen}
        options={{ title: 'Calendar & Bill' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="BuyNow"
        component={BuyNowScreen}
        options={{ title: 'Buy Now' }}
      />
    </Stack.Navigator>
  );
}