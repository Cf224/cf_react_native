import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Animated,
  Platform,
  Linking,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../../navigation/types'; // Adjust path to your types file

// Define colors (create this file if it doesn't exist)
const colors = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  primaryLight: '#BBDEFB',
  text: '#263238',
  border: '#CFD8DC',
};

// Product Type
type Product = {
  id: number;
  name: string;
  price: number;
  image: any;
  category?: string;
  type: string;
};

type BuyNowScreenRouteProp = RouteProp<RootStackParamList, 'BuyNow'>;

interface BuyNowScreenProps {
  route: BuyNowScreenRouteProp;
}

type AnimationMap = Record<'card' | 'upi' | 'cod', Animated.Value>;

const upiApps = [
  { id: 'gpay', name: 'Google Pay', scheme: 'gpay://upi' },
  { id: 'phonepe', name: 'PhonePe', scheme: 'phonepe://upi' },
  { id: 'paytm', name: 'Paytm', scheme: 'paytmmp://pay' },
];

const volumeOptions: Record<string, string[]> = {
  milk: ['100ml', '250ml', '500ml', '1L'],
  eggs: ['10 pcs'],
  live_chicken: ['1kg', '2kg', '5kg'],
  cutted_chicken: ['1kg', '2kg', '5kg'],
  cheese: [],
  yogurt: [],
};

export default function BuyNowScreen({ route }: BuyNowScreenProps) {
  const { product, initialQuantity, subscriptionInfo } = route.params;
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedUpiApp, setSelectedUpiApp] = useState<any>(null);
  const [availableUpiApps, setAvailableUpiApps] = useState<any[]>([]);
  const [loadingUpiApps, setLoadingUpiApps] = useState(false);
  const [quantity, setQuantity] = useState<string>(initialQuantity ?? '');

  // Listen for UPI deep link callbacks
React.useEffect(() => {
  const subscription = Linking.addEventListener('url', ({ url }) => {
    console.log('UPI Response:', url); // Optional: log for debugging

    if (url.toLowerCase().includes('status=success')) {
      Alert.alert('✅ Payment Successful', 'Thank you for your payment!');
    } else if (url.toLowerCase().includes('status=failure')) {
      Alert.alert('❌ Payment Failed', 'Payment was not completed. Please try again.');
    } else if (url.toLowerCase().includes('status=submitted')) {
      Alert.alert('⏳ Payment Pending', 'Waiting for confirmation.');
    }
  });

  return () => subscription.remove();
}, []);

  const animatedValues: AnimationMap = {
    card: new Animated.Value(0),
    upi: new Animated.Value(0),
    cod: new Animated.Value(0),
  };

  const paymentOptions = [
    { id: 'upi', label: 'UPI Payment', icon: 'payment' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'money' },
  ];

  const options = product?.type ? volumeOptions[product.type.toLowerCase()] || [] : [];

  const fetchUpiApps = async () => {
    setLoadingUpiApps(true);
    try {
      const apps: any[] = [];
      for (const app of upiApps) {
        const canOpen = await Linking.canOpenURL(app.scheme);
        if (canOpen) apps.push(app);
      }
      setAvailableUpiApps(apps.length > 0 ? apps : upiApps);
    } catch {
      setAvailableUpiApps(upiApps);
    } finally {
      setLoadingUpiApps(false);
    }
  };

  const handlePaymentSelect = (id: 'upi' | 'cod') => {
    setSelectedPayment(id);
    setSelectedUpiApp(null);

    Animated.spring(animatedValues[id], {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    if (id === 'upi') fetchUpiApps();
  };

  const parseQuantity = (qty: string): number => {
    const numeric = parseFloat(qty);
    if (isNaN(numeric)) {
      if (qty.includes('pcs')) return parseInt(qty) || 1;
      return 1;
    }
    if (qty.includes('ml')) return numeric / 1000;
    if (qty.includes('L')) return numeric;
    if (qty.includes('kg')) return numeric;
    return numeric;
  };

  const launchUpiPayment = async (app: any) => {
    if (!app || !product.price || !quantity) {
      Alert.alert('Error', 'Please select quantity and UPI app.');
      return;
    }

    const totalAmount = product.price * parseQuantity(quantity);
    const AMOUNT = totalAmount.toFixed(2); 
    const VPA = 'arunganapathi20-3@okicici'; // Replace with your real UPI ID
    const NAME = 'CHINNA FARMING';
    const TXNID = `T${Date.now()}`;
    const TR = `TR${Date.now()}`;
    const NOTE = `Payment for ${product.name} (${quantity})`;

  const upiUrl = `upi://pay?pa=${VPA}&pn=${encodeURIComponent(NAME)}&tid=${TXNID}&tr=${TR}&tn=${encodeURIComponent(
  NOTE
)}&am=${AMOUNT}&cu=INR`;


    try {
      const supported = await Linking.canOpenURL(app.scheme);
      if (supported) {
        await Linking.openURL(upiUrl);
        Alert.alert(
          'Complete Payment',
          'After finishing payment in your UPI app, return here and tap OK.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', `${app.name} not available on this device.`);
      }
    } catch (error) {
      console.error('UPI Error:', error);
      Alert.alert('Error', 'Failed to open UPI app.');
    }
  };

  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('UPI Response:', url);
      if (url.toLowerCase().includes('status=success')) {
        Alert.alert('✅ Payment Successful', 'Thank you for your payment!');
      } else if (url.toLowerCase().includes('status=failure')) {
        Alert.alert('❌ Payment Failed', 'Please try again.');
      } else if (url.toLowerCase().includes('status=submitted')) {
        Alert.alert('⏳ Payment Pending', 'Waiting for confirmation.');
      }
    });
    return () => subscription.remove();
  }, []);

  const handleConfirmPayment = () => {
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method.');
      return;
    }
    if (!quantity) {
      Alert.alert('Error', 'Please select a quantity.');
      return;
    }

    if (selectedPayment === 'upi') {
      if (!selectedUpiApp) {
        Alert.alert('Error', 'Please select a UPI app.');
        return;
      }
      launchUpiPayment(selectedUpiApp);
    } else if (selectedPayment === 'cod') {
      Alert.alert('🛒 Order Placed', 'Cash on Delivery confirmed.');
    }
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB', '#90CAF9']} style={styles.container}>
      {subscriptionInfo && (
        <Text style={styles.subscriptionInfo}>
          Subscription: {subscriptionInfo.fromDate.toDateString()} -{' '}
          {subscriptionInfo.toDate.toDateString()} ({subscriptionInfo.deliveryTime})
        </Text>
      )}
      <Animated.View style={[styles.productContainer, { opacity: animatedValues.card }]}>
        <LinearGradient colors={['#fff', '#f5f5f5']} style={styles.productCard}>
          <Image
            source={typeof product.image === 'string' ? { uri: product.image } : product.image}
            style={styles.productImage}
            resizeMode="cover"
          />
          <Text style={styles.productName}>{product.name} {quantity ? `(${quantity})` : ''}</Text>
          <Text style={styles.productPrice}>
            ₹{product.price} {quantity ? `x ${quantity} = ₹${(product.price * parseQuantity(quantity)).toFixed(2)}` : ''}
          </Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.quantityContainer}>
        <Text style={styles.sectionTitle}>Select Quantity</Text>
        {options.length > 0 ? (
          <View style={styles.optionContainer}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setQuantity(opt)}
                style={[styles.optionBtn, quantity === opt && { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.optionText, quantity === opt && { color: '#fff' }]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
            placeholder="Enter quantity (e.g., 500g)"
            placeholderTextColor="#90A4AE"
          />
        )}
      </View>

      <View style={styles.paymentContainer}>
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        {paymentOptions.map((option) => (
          <Animated.View
            key={option.id}
            style={[
              styles.paymentOption,
              selectedPayment === option.id && styles.selectedPayment,
              {
                transform: [
                  {
                    scale: animatedValues[option.id as keyof AnimationMap].interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity onPress={() => handlePaymentSelect(option.id as 'upi' | 'cod')} style={styles.paymentButton}>
              <Icon
                name={option.icon}
                size={24}
                color={selectedPayment === option.id ? colors.primary : '#666'}
                style={styles.paymentIcon}
              />
              <Text style={styles.paymentText}>{option.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {selectedPayment === 'upi' && (
        <View style={styles.upiSubContainer}>
          <Text style={styles.subSectionTitle}>Select UPI App</Text>
          {loadingUpiApps ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            availableUpiApps.map((app) => (
              <TouchableOpacity
                key={app.id}
                style={[styles.upiAppOption, selectedUpiApp?.id === app.id && styles.selectedUpiApp]}
                onPress={() => setSelectedUpiApp(app)}
              >
                <Icon name="account-balance-wallet" size={20} color="#fff" />
                <Text style={styles.upiAppText}>{app.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      <TouchableOpacity onPress={handleConfirmPayment}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  subscriptionInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 16,
  },
  productContainer: { alignItems: 'center', marginBottom: 32 },
  productCard: { alignItems: 'center', borderRadius: 16, padding: 16, elevation: 6, width: '90%' },
  productImage: { width: 140, height: 140, borderRadius: 12, marginBottom: 16 },
  productName: { fontSize: 22, fontWeight: '700', color: colors.text },
  productPrice: { fontSize: 20, fontWeight: '600', color: colors.primary, marginTop: 8 },
  quantityContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  optionContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionBtn: { backgroundColor: '#F5F6F5', borderWidth: 1, borderColor: '#CFD8DC', padding: 10, borderRadius: 10 },
  optionText: { fontSize: 14, color: '#263238' },
  input: { backgroundColor: '#F5F6F5', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#CFD8DC' },
  paymentContainer: { marginBottom: 32 },
  paymentOption: { borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  selectedPayment: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  paymentButton: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  paymentIcon: { marginRight: 12 },
  paymentText: { fontSize: 18, fontWeight: '500', color: colors.text },
  upiSubContainer: { marginBottom: 16, padding: 16, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12 },
  subSectionTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  upiAppOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, padding: 12, borderRadius: 8, marginBottom: 8 },
  selectedUpiApp: { backgroundColor: colors.primaryDark },
  upiAppText: { color: '#fff', fontSize: 16, marginLeft: 8 },
  loader: { marginTop: 8 },
  confirmButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', elevation: 6 },
  confirmButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});