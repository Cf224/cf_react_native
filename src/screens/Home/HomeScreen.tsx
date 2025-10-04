import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  PermissionsAndroid,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MilkCalendar from '../Subscription/SubscribeScreen';
import CategoryChips from '../../components/CategoryChips';
import ProductCard from '../../components/ProductCard';
import Header from '../../components/header';

const { width } = Dimensions.get('window');

const adImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1594470119273-0a6a6d57b2a0?auto=format&fit=crop&w=1350&q=80',
];

// Updated categories to include live_chicken and cutted_chicken
const categories = [
  { key: 'milk', label: 'Milk' },
  { key: 'eggs', label: 'Eggs' },
  { key: 'cheese', label: 'Cheese' },
  { key: 'yogurt', label: 'Yogurt' },
  { key: 'live_chicken', label: 'Live Chicken' },
  { key: 'cutted_chicken', label: 'Cutted Chicken' },
  { key: 'all', label: 'All' },
];

// Updated products array with live_chicken and cutted_chicken
const products: { id: string; name: string; price: number; category: string; image: ImageSourcePropType; type: string }[] = [
  { id: '1', name: 'Fresh Cow Milk', price: 60, category: 'milk', type: 'milk', image: require('../../../src/assets/image/cfmilk.png') },
  { id: '2', name: 'Organic Eggs', price: 80, category: 'eggs', type: 'eggs', image: require('../../../src/assets/image/cfegg.png') },
  { id: '3', name: 'Cheddar Cheese', price: 150, category: 'cheese', type: 'cheese', image: 'https://images.unsplash.com/photo-1486297678162-eb4334d94d3f?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Greek Yogurt', price: 50, category: 'yogurt', type: 'yogurt', image: 'https://images.unsplash.com/photo-1584270853332-1e7a4d6e4f2a?auto=format&fit=crop&w=300&q=80' },
  { id: '5', name: 'Buffalo Milk', price: 70, category: 'milk', type: 'milk', image: 'https://images.unsplash.com/photo-1550583724-3a43209a7c88?auto=format&fit=crop&w=300&q=80' },
  { id: '6', name: 'Mozzarella Cheese', price: 200, category: 'cheese', type: 'cheese', image: 'https://images.unsplash.com/photo-1486297678162-eb4334d94d3f?auto=format&fit=crop&w=300&q=80' },
  { id: '7', name: 'Live Chicken', price: 300, category: 'live_chicken', type: 'live_chicken', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80' },
  { id: '8', name: 'Cutted Chicken', price: 250, category: 'cutted_chicken', type: 'cutted_chicken', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80' },
];

export default function HomeScreen({ navigation }: any) {
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [address, setAddress] = useState('Fetching location...');
  const intervalTime = 3000;
  let currentIndex = 0;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    const scrollToNext = () => {
      if (scrollViewRef.current) {
        currentIndex = (currentIndex + 1) % adImages.length;
        scrollViewRef.current.scrollTo({
          x: currentIndex * (width - 32),
          animated: true,
        });
      }
    };

    const interval = setInterval(scrollToNext, intervalTime);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        const cachedAddress = await AsyncStorage.getItem('cachedAddress');
        if (cachedAddress) {
          console.log('Using cached address:', cachedAddress);
          setAddress(cachedAddress);
          return;
        }

        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location to show your address.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission denied');
            setAddress('Location permission denied');
            return;
          }
        }

        Geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            console.log('Geolocation coordinates:', { latitude, longitude });

            if (!latitude || !longitude) {
              console.log('Invalid coordinates');
              setAddress('Invalid location data');
              return;
            }

            const fetchAddress = async (retries = 3, delay = 1000) => {
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
                  {
                    headers: {
                      'User-Agent': 'CF_Farming_App/1.0 (your.email@example.com)',
                    },
                  }
                );

                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Nominatim response:', data);

                if (data && data.address) {
                  const street = data.address.road || 'Unknown Street';
                  const city = data.address.city || data.address.town || 'Unknown City';
                  const formattedAddress = `${street}, ${city}`;
                  setAddress(formattedAddress);
                  await AsyncStorage.setItem('cachedAddress', formattedAddress);
                  console.log('Address cached:', formattedAddress);
                } else {
                  setAddress('No address found');
                  console.log('No address data in response');
                }
              } catch (error) {
                console.error('Nominatim API error:', error);
                if (retries > 0) {
                  console.log(`Retrying... (${retries} attempts left)`);
                  await new Promise((resolve) => setTimeout(resolve, delay));
                  return fetchAddress(retries - 1, delay * 2);
                }
                setAddress('Unable to fetch address');
              }
            };

            await fetchAddress();
          },
          (error) => {
            console.error('Geolocation error:', error);
            setAddress(`Geolocation error: ${error.message}`);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (err) {
        console.error('Permission or setup error:', err);
        setAddress('Error fetching location');
      }
    };

    requestLocation();
  }, []);

  const handleSelectCategory = (key: string) => {
    setSelectedCategory(key);
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleProductPress = (item: { name: string }) => {
    console.log(`Pressed product: ${item.name}`);
  };

  const handleSubscribe = (item: { name: string }) => {
    console.log(`Subscribed to: ${item.name}`);
    navigation.navigate('Subscribe', { product: item }); // Ensure product is passed with type
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.container}>
      <Header
        title="CF Farming"
        address={address}
        onProfilePress={() => navigation.navigate('Profile', { address })}
      />

      <Animated.View style={{ opacity: fadeAnim }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100?text=Milk+Logo' }}
            style={styles.logo}
          />
          <Text style={styles.header}>FreshMilk Delivery</Text>

          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
          >
            {adImages.map((img, index) => (
              <TouchableOpacity key={index} style={styles.adCard}>
                <Image source={{ uri: img }} style={styles.adImage} resizeMode="cover" />
                <LinearGradient
                  colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.2)']}
                  style={styles.overlay}
                >
                  <Text style={styles.title}>Fresh Dairy Deals</Text>
                  <Text style={styles.subtitle}>Subscribe & Save 20%</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <MilkCalendar />

          <CategoryChips
            categories={categories}
            selected={selectedCategory}
            onSelect={handleSelectCategory}
          />

          <View style={styles.productList}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onPress={handleProductPress}
                  onSubscribe={handleSubscribe}
                />
              ))
            ) : (
              <Text style={styles.noProductsText}>No products available in this category.</Text>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 10, paddingBottom: 22 },
  logo: {
    width: 80,
    alignSelf: 'center',
    marginBottom: 12,
    borderRadius: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 0,
  },
  carousel: { marginBottom: 16 },
  adCard: {
    width: width - 32,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 6,
  },
  adImage: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 16, color: '#E3F2FD', marginTop: 8 },
  productList: { marginTop: 16 },
  noProductsText: { textAlign: 'center', color: '#546E7A', fontSize: 16, marginTop: 16 },
});