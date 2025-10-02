import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert, Image, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import axios from 'axios'; // Import axios for backend integration

type AuthStackParamList = {
  Login: undefined;
  OTP: { phone: string };
};

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const googleButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your Web Client ID
      iosClientId: 'YOUR_IOS_CLIENT_ID', // Optional, for iOS
      offlineAccess: true,
    });

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) return Alert.alert('Error', 'Please enter a valid phone number');
    navigation.navigate('OTP', { phone });
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn(); // Let TypeScript infer SignInResponse
      if ('user' in userInfo && userInfo.user.email) {
        const email = userInfo.user.email; // Fetch only the email ID
        Alert.alert('Success', `Google Sign-In Email: ${email}`);
        console.log('Google Sign-In Email:', email);

        // Send email to backend
        try {
          const response = await axios.post('https://cfmilk.onrender.com/auth/google-login', { email });
          Alert.alert('Backend Response', response.data.message || 'Email sent to backend successfully');
          // Optionally navigate or handle response
          // navigation.navigate('SomeScreen', { email });
        } catch (error: any) {
          Alert.alert('Backend Error', error.response?.data?.message || 'Failed to send email to backend');
          console.error('Backend Error:', error);
        }
      } else {
        Alert.alert('Error', 'Failed to retrieve email from Google Sign-In');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Google Sign-In was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Error', 'Sign-In is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play Services not available');
      } else {
        Alert.alert('Error', 'An error occurred during Google Sign-In');
        console.error(error);
      }
    }
  };

  const handleButtonPressIn = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = (scale: Animated.Value) => {
    Animated.spring(scale, {
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
        <Text style={styles.title}>FreshMilk Delivery</Text>
        <Text style={styles.subtitle}>Sign in with your mobile number or Google</Text>

        <View style={styles.inputContainer}>
          <TextInput
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholder="Mobile number"
            placeholderTextColor="#90A4AE"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          onPressIn={() => handleButtonPressIn(buttonScale)}
          onPressOut={() => handleButtonPressOut(buttonScale)}
          onPress={handleSendOtp}
          activeOpacity={0.9}
        >
          <Animated.View style={[styles.btn, { transform: [{ scale: buttonScale }] }]}>
            <LinearGradient
              colors={['#1976D2', '#2196F3']}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>Send OTP</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          onPressIn={() => handleButtonPressIn(googleButtonScale)}
          onPressOut={() => handleButtonPressOut(googleButtonScale)}
          onPress={handleGoogleSignIn}
          activeOpacity={0.9}
        >
          <Animated.View style={[styles.btn, { transform: [{ scale: googleButtonScale }] }]}>
            <LinearGradient
              colors={['#4285F4', '#4A90E2']}
              style={styles.btnGradient}
            >
              <View style={styles.googleButtonContent}>
                <Image
                  source={{
                    uri: 'https://developers.google.com/identity/images/g-logo.png',
                  }}
                  style={styles.googleIcon}
                />
                <Text style={styles.btnText}>Sign in with Google</Text>
              </View>
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
    fontSize: 30,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CFD8DC',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#546E7A',
    fontSize: 14,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
});