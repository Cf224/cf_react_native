import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType, Alert, Animated, Platform, Linking, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../constants/colors';

// Define Product type
type Product = {
  id: number;
  name: string;
  price: number;
  image: ImageSourcePropType;
  category?: string;
};

// Navigation types
type RootStackParamList = {
  BuyNow: { product: Product };
};

// Props for BuyNowScreen
type BuyNowScreenRouteProp = RouteProp<RootStackParamList, 'BuyNow'>;

interface BuyNowScreenProps {
  route: BuyNowScreenRouteProp;
}

// Define type for animatedValues
type AnimationMap = Record<'card' | 'upi' | 'cod', Animated.Value>;

// Common UPI apps with their package names and schemes
const upiApps = [
  { id: 'gpay', name: 'Google Pay', packageName: 'com.google.android.apps.nbu.paisa.user', scheme: 'gpay://upi', fallbackScheme: 'upi://pay' },
  { id: 'phonepe', name: 'PhonePe', packageName: 'com.phonepe.app', scheme: 'phonepe://upi', fallbackScheme: 'upi://pay' },
  { id: 'paytm', name: 'Paytm', packageName: 'net.one97.paytm', scheme: 'paytm://upi', fallbackScheme: 'upi://pay' },
];

export default function BuyNowScreen({ route }: BuyNowScreenProps) {
  const { product } = route.params;
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedUpiApp, setSelectedUpiApp] = useState<any>(null);
  const [availableUpiApps, setAvailableUpiApps] = useState<any[]>([]);
  const [loadingUpiApps, setLoadingUpiApps] = useState(false);
  const animatedValues: AnimationMap = {
    card: new Animated.Value(0),
    upi: new Animated.Value(0),
    cod: new Animated.Value(0),
  };

  // Mock payment options with icons
  const paymentOptions = [
    { id: 'card', label: 'Credit/Debit Card', icon: 'credit-card' },
    { id: 'upi', label: 'UPI', icon: 'payment' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'money' },
  ];

  // Check for installed UPI apps
  const fetchUpiApps = async () => {
    if (Platform.OS !== 'android') {
      console.log('UPI app detection skipped on iOS; showing all apps as fallback');
      setAvailableUpiApps(upiApps); // Fallback for iOS
      return;
    }
    setLoadingUpiApps(true);
    try {
      const apps = [];
      for (const app of upiApps) {
        // Try app-specific scheme first, then fallback
        const canOpenPrimary = await Linking.canOpenURL(app.scheme);
        const canOpenFallback = await Linking.canOpenURL(app.fallbackScheme);
        console.log(`Checking ${app.name}: primary=${app.scheme} (${canOpenPrimary}), fallback=${app.fallbackScheme} (${canOpenFallback})`);
        if (canOpenPrimary || canOpenFallback) {
          apps.push(app);
        }
      }
      setAvailableUpiApps(apps);
      console.log('Detected UPI apps:', apps);
      if (apps.length === 0) {
        // Fallback: show all apps if detection fails to avoid empty list
        setAvailableUpiApps(upiApps);
        Alert.alert('Warning', 'No UPI apps detected. Showing available options; please ensure Google Pay, PhonePe, or Paytm is installed.');
      }
    } catch (error) {
      console.error('Error checking UPI apps:', error);
      setAvailableUpiApps(upiApps); // Fallback on error
      Alert.alert('Error', 'Failed to detect UPI apps. Showing available options.');
    } finally {
      setLoadingUpiApps(false);
    }
  };

  const handlePaymentSelect = (paymentId: 'card' | 'upi' | 'cod') => {
    setSelectedPayment(paymentId);
    setSelectedUpiApp(null);
    Animated.spring(animatedValues[paymentId], {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    (Object.keys(animatedValues) as (keyof AnimationMap)[]).forEach((key) => {
      if (key !== paymentId) {
        animatedValues[key].setValue(0);
      }
    });

    if (paymentId === 'upi') {
      fetchUpiApps();
    }
  };

  // Launch UPI app with payment details
  const launchUpiPayment = async (app: any) => {
    if (!app || !product.price) return;

    // Use a placeholder UPI ID; replace with your merchant UPI ID
    const upiUrl = `upi://pay?pa=${encodeURIComponent('default@upi')}&pn=${encodeURIComponent(product.name)}&am=${product.price}&cu=INR&tn=${encodeURIComponent('Payment for ' + product.name)}`;

    try {
      const schemeToUse = await Linking.canOpenURL(app.scheme) ? app.scheme : app.fallbackScheme;
      const appSpecificUrl = app.packageName ? `${upiUrl}&ap=${encodeURIComponent(app.packageName)}` : upiUrl;
      console.log(`Launching UPI app: ${app.name} with URL: ${appSpecificUrl}`);
      const supported = await Linking.canOpenURL(schemeToUse);
      if (supported) {
        await Linking.openURL(appSpecificUrl);
      } else {
        Alert.alert('Error', `Cannot open ${app.name}. Please ensure it is installed and try again.`);
      }
    } catch (error) {
      console.error('UPI launch error:', error);
      Alert.alert('Error', `Failed to launch ${app.name}.`);
    }
  };

  // Handle UPI response
  const handleUpiResponse = () => {
    const handleUrl = ({ url }: { url: string }) => {
      console.log('Received UPI callback:', url);
      if (url.includes('status=success')) {
        Alert.alert('Success', 'Payment completed successfully!');
      } else if (url.includes('status=failure')) {
        Alert.alert('Failed', 'Payment failed. Please try again.');
      }
    };
    const subscription = Linking.addEventListener('url', handleUrl);
    return () => subscription.remove();
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment option.');
      return;
    }

    if (selectedPayment === 'upi') {
      if (!selectedUpiApp) {
        Alert.alert('Error', 'Please select a UPI app.');
        return;
      }
      launchUpiPayment(selectedUpiApp);
    } else {
      Alert.alert(
        'Payment Success',
        `Payment for ${product.name} via ${selectedPayment.toUpperCase()} was successful!`,
        [{ text: 'OK', onPress: () => {} }]
      );
    }
  };

  // Fade-in animation for product card and initialize UPI listener
  useEffect(() => {
    Animated.timing(animatedValues.card, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    const cleanup = handleUpiResponse();
    return cleanup;
  }, [animatedValues.card]);

  return (
    <LinearGradient
      colors={['#E3F2FD', '#BBDEFB', '#90CAF9']}
      style={styles.container}
    >
      {/* Product Details */}
      <Animated.View style={[styles.productContainer, { opacity: animatedValues.card }]}>
        <LinearGradient
          colors={['#fff', '#f5f5f5']}
          style={styles.productCard}
        >
          <Image
            source={
              typeof product.image === 'string' ? { uri: product.image } : product.image
            }
            style={styles.productImage}
            resizeMode="cover"
            defaultSource={require('../../../src/assets/image/cfmilk.png')}
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>₹{product.price}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Payment Options */}
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
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={() => handlePaymentSelect(option.id as 'card' | 'upi' | 'cod')}
            >
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

      {/* Dynamic UPI Apps List */}
      {selectedPayment === 'upi' && (
        <View style={styles.upiSubContainer}>
          <Text style={styles.subSectionTitle}>Select UPI App</Text>
          {loadingUpiApps ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : availableUpiApps.length > 0 ? (
            availableUpiApps.map((app) => (
              <TouchableOpacity
                key={app.id}
                style={[
                  styles.upiAppOption,
                  selectedUpiApp?.id === app.id && styles.selectedUpiApp,
                ]}
                onPress={() => setSelectedUpiApp(app)}
              >
                <Icon name="account-balance-wallet" size={20} color="#fff" />
                <Text style={styles.upiAppText}>{app.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noAppsText}>No UPI apps detected. Please ensure Google Pay, PhonePe, or Paytm is installed.</Text>
          )}
        </View>
      )}

      {/* Confirm Payment Button */}
      <TouchableOpacity onPress={handleConfirmPayment}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  productContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  productCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    width: '90%',
  },
  productImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  paymentContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  paymentOption: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  selectedPayment: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  upiSubContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  upiAppOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedUpiApp: {
    backgroundColor: colors.primaryDark,
  },
  upiAppText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  loader: {
    marginTop: 8,
  },
  noAppsText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 16,
    marginTop: 8,
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});