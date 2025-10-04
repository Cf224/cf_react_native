import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Subscribe: { product: { id: string; name: string; price: number; type: string } };
};

type Props = {
  route: RouteProp<RootStackParamList, 'Subscribe'>;
  navigation: StackNavigationProp<RootStackParamList, 'Subscribe'>;
};

// Updated volumeOptions with specified quantities
const volumeOptions: Record<string, string[]> = {
  milk: ['100ml', '250ml', '500ml', '1L'],
  eggs: ['10 pcs'],
  live_chicken: ['1kg', '2kg', '5kg'],
  cutted_chicken: ['1kg', '2kg', '5kg'],
  cheese: [], // No specific quantities for cheese
  yogurt: [], // No specific quantities for yogurt
};

export default function Subscribe({ route, navigation }: Props) {
  const { product } = route.params;
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [volume, setVolume] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSubscribe = () => {
    if (!volume) {
      alert('Please select or enter a volume/quantity');
      return;
    }
    console.log('Subscribed:', { product, fromDate, toDate, volume });
    navigation.goBack();
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

  const options = product?.type
    ? volumeOptions[product.type.toLowerCase()] || []
    : [];

  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100?text=Milk+Logo' }}
          style={styles.logo}
        />
        {/* Display product name and selected quantity in title */}
        <Text style={styles.title}>
          Subscribe to {product.name} {volume ? `(${volume})` : ''}
        </Text>
        <Text style={styles.subtitle}>Set your delivery schedule</Text>

        <View style={styles.section}>
          <Text style={styles.label}>From Date</Text>
          <TouchableOpacity onPress={() => setShowFrom(true)} style={styles.dateBtn}>
            <Text style={styles.dateText}>{fromDate.toDateString()}</Text>
          </TouchableOpacity>
          {showFrom && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              onChange={(e, d) => {
                setShowFrom(false);
                if (d) setFromDate(d);
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>To Date</Text>
          <TouchableOpacity onPress={() => setShowTo(true)} style={styles.dateBtn}>
            <Text style={styles.dateText}>{toDate.toDateString()}</Text>
          </TouchableOpacity>
          {showTo && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              onChange={(e, d) => {
                setShowTo(false);
                if (d) setToDate(d);
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Select Volume/Quantity</Text>
          {options.length > 0 ? (
            <View style={styles.optionContainer}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setVolume(opt)}
                  style={[
                    styles.optionBtn,
                    volume === opt && { backgroundColor: '#1976D2', borderColor: '#1976D2' },
                  ]}
                >
                  <Text style={[styles.optionText, volume === opt && { color: '#fff' }]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TextInput
              value={volume}
              onChangeText={setVolume}
              keyboardType="numeric"
              style={styles.input}
              placeholder="Enter quantity/volume"
              placeholderTextColor="#90A4AE"
            />
          )}
        </View>

        {/* Dedicated section for displaying selected quantity */}
        {volume && (
          <View style={styles.section}>
            <Text style={styles.label}>Selected Quantity</Text>
            <Text style={styles.selectedQuantity}>{volume}</Text>
          </View>
        )}

        <TouchableOpacity
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          onPress={handleSubscribe}
          activeOpacity={0.9}
        >
          <Animated.View style={[styles.subscribeBtn, { transform: [{ scale: buttonScale }] }]}>
            <LinearGradient
              colors={['#1976D2', '#2196F3']}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>Confirm Subscription</Text>
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
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 40,
  },
  title: {
    fontSize: 28,
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
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D47A1',
    marginBottom: 8,
  },
  dateBtn: {
    backgroundColor: '#F5F6F5',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  dateText: {
    fontSize: 16,
    color: '#263238',
  },
  input: {
    backgroundColor: '#F5F6F5',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#263238',
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionBtn: {
    backgroundColor: '#F5F6F5',
    borderWidth: 1,
    borderColor: '#CFD8DC',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#263238',
  },
  subscribeBtn: {
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
  selectedQuantity: {
    fontSize: 16,
    color: '#263238',
    backgroundColor: '#F5F6F5',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
});

function alert(arg0: string) {
  throw new Error('Function not implemented.');
}