import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function ProductDetail({ route, navigation }) {
  const { item } = route.params || {};
  if (!item) return <View><Text>No product</Text></View>;

  return (
    <ScrollView style={{ padding: 16 }}>
      <View style={{ height: 200, backgroundColor: '#eee', borderRadius: 10, marginBottom: 12 }} />
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{item.name}</Text>
      <Text style={{ marginTop: 8 }}>₹{item.price}</Text>
      <Text style={{ marginTop: 12, color: '#666' }}>
        Fresh farm product. Replace this with real description from backend.
      </Text>

      <TouchableOpacity style={{ backgroundColor: '#2E7D32', padding: 14, borderRadius: 8, marginTop: 16 }} onPress={() => navigation.navigate('Subscribe', { item })}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Subscribe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
