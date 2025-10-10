import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux'; // Add useDispatch
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../store/slices/authSlice'; // Import your logout action

export default function ProfileScreen({ navigation }: any) {
  // Dummy user data
  const user = {
    name: 'John Doe',
    phone: '+91 9876543210',
    email: 'johndoe@example.com',
    address: '123, Green Farm Street, Tamil Nadu',
    subscription: 'Milk Monthly Package',
    joinDate: '2025-01-01',
    profilePic: 'https://via.placeholder.com/100',
  };

  const dispatch = useDispatch(); // Initialize dispatch

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear AsyncStorage data
      await AsyncStorage.removeItem('lastLogin');
      await AsyncStorage.removeItem('cachedAddress');
      console.log('Cleared AsyncStorage data on logout');

      // Dispatch logout action to clear token in Redux
      dispatch(logout());

      // Optionally reset navigation to ensure clean state
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={{ uri: user.profilePic }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.subscription}>{user.subscription}</Text>
      </View>

      {/* User Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Contact Info</Text>
        <View style={styles.row}>
          <Icon name="call-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>{user.phone}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="mail-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="location-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>{user.address}</Text>
        </View>
      </View>

      {/* Subscription Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Subscription Info</Text>
        <View style={styles.row}>
          <Icon name="calendar-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>Joined: {user.joinDate}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="gift-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>Package: {user.subscription}</Text>
        </View>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editBtn}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#E8F5E9',
    paddingVertical: 20,
    borderRadius: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  subscription: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  editBtn: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutBtn: {
    backgroundColor: '#D32F2F',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
});