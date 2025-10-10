import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Profile: undefined; // Add other routes and their params here
  // Example: Home: { id: string };
};

type Props = {
  title?: string;
  address?: string;
  onProfilePress?: () => void;
};

export default function Header({ title = "CF Farming", address = "Your Address", onProfilePress }: Props) {
   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      {/* Left side → Address */}
      <View style={styles.left}>
        <Icon name="location-outline" size={20} color="#fff" />
        <Text style={styles.address}>{address}</Text>
      </View>

      {/* Center → Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right side → Profile icon */}
       <TouchableOpacity style={styles.right} onPress={() => navigation.navigate('Profile')}>
        <Icon name="person-circle-outline" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:15,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  address: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
