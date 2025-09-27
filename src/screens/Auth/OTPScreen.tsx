import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/slices/authSlice';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

type AuthStackParamList = {
  Login: undefined;
  OTP: { phone: string };
  bottom: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'OTP'>;

export default function OTPScreen({ route, navigation }: Props) {
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleVerify = () => {
    if (otp.length < 3) return Alert.alert('Error', 'Please enter a valid OTP');
    navigation.navigate('bottom');
    dispatch(setToken('dummy_token'));
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient
      colors={['#E3F2FD', '#BBDEFB']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100?text=Milk+Logo' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Enter OTP sent to {phone}</Text>
        <Text style={styles.subtitle}>Check your messages for the code</Text>

        <View style={styles.inputContainer}>
          <TextInput
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            placeholder="OTP"
            placeholderTextColor="#90A4AE"
            style={styles.input}
            maxLength={6}
          />
        </View>

        <TouchableOpacity
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          onPress={handleVerify}
          activeOpacity={0.9}
        >
          <Animated.View style={[styles.btn, { transform: [{ scale: buttonScale }] }]}>
            <LinearGradient
              colors={['#1976D2', '#2196F3']}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>Verify & Continue</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#546E7A',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: '#F5F6F5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  input: {
    fontSize: 16,
    color: '#263238',
    paddingVertical: 14,
    textAlign: 'center',
  },
  btn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  btnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});