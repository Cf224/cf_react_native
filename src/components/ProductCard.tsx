import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define Product type (adjust according to your real data)
type Product = {
  id: number;
  name: string;
  price: number;
  image: ImageSourcePropType;
  category?: string;
};

// Navigation types
type RootStackParamList = {
  Subscribe: { product: Product };
  BuyNow: { product: Product }; // Added BuyNow route
  // Add other routes here if needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProductCardProps {
  item: Product;
  onPress: (item: Product) => void;
  onSubscribe: (item: Product) => void;
}

export default function ProductCard({ item, onPress, onSubscribe }: ProductCardProps) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.card}>
      <View style={styles.left}>
        <Image
          source={
            typeof item.image === 'string' ? { uri: item.image } : item.image
          } // Handle both local and remote images
          style={styles.image}
          resizeMode="cover"
          // defaultSource={require('../assets/image/cfmilk.png')} // Fallback image
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
      </View>
      <View style={styles.right}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>

        <View style={{ flexDirection: 'row', marginTop: 8, gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('BuyNow', { product: item })} // Navigate to BuyNow
            style={styles.subscribeBtn}
          >
            <Text style={{ color: '#fff' }}>Buy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onSubscribe(item); // Call onSubscribe prop
              navigation.navigate('Subscribepage', { product: item }); // Navigate to Subscribe
            }}
            style={styles.subscribeBtn}
          >
            <Text style={{ color: '#fff' }}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginVertical: 6,
    elevation: 1,
  },
  left: { width: 80, alignItems: 'center', justifyContent: 'center' },
  image: { width: 64, height: 64, borderRadius: 8 }, // Style for Image
  right: { flex: 1, paddingLeft: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  price: { marginTop: 6, color: colors.primary },
  subscribeBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
});