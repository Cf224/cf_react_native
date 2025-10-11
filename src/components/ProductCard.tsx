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
  type: string;
  rating?: number; // Added rating field
};

// Navigation types
type RootStackParamList = {
  Subscribe: { product: Product };
  BuyNow: { product: Product };
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
          }
          style={styles.image}
          resizeMode="cover"
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
      </View>
      <View style={styles.right}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating || 4.5}</Text>
          </View>
        </View>
        <Text style={styles.price}>₹{item.price}</Text>

        <View style={{ flexDirection: 'row', marginTop: 8, gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('BuyNow', { product: item })}
            style={styles.subscribeBtn}
          >
            <Text style={{ color: '#fff' }}>Buy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onSubscribe(item);
              navigation.navigate('Subscribe', { product: item });
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
  image: { width: 64, height: 64, borderRadius: 8 },
  right: { flex: 1, paddingLeft: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: '600' },
  price: { marginTop: 6, color: colors.primary },
  subscribeBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: colors.primary,
  },
});